import { randomUUID } from "crypto";
import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { type Font, type InsertFont, fontSlugAliases, fontsTable } from "@shared/schema";
import { generateSlug } from "../client/src/lib/slugify";
import { db } from "./db";

export interface IStorage {
  getAllFonts(): Promise<Font[]>;
  getFontById(id: string): Promise<Font | undefined>;
  getFontsByCategory(category: string): Promise<Font[]>;
  getFontsByCategories(categories: string[]): Promise<Font[]>;
  getFontBySlug(slug: string): Promise<Font | undefined>;
  addSlugAlias(oldSlug: string, fontId: string): Promise<void>;
  addSlugAliases(aliases: Array<{ oldSlug: string; fontId: string }>): Promise<void>;
  getFontsCount(category?: string, q?: string): Promise<number>;
  getFontsPaginated(page: number, limit: number, category?: string, q?: string): Promise<Font[]>;
  createFont(font: InsertFont): Promise<Font>;
  createFonts(fonts: InsertFont[]): Promise<Font[]>;
  deleteFont(id: string): Promise<boolean>;
}

function buildWhere(category?: string, q?: string) {
  const conditions = [];
  if (category) conditions.push(eq(fontsTable.category, category));
  if (q?.trim()) {
    const escapedQuery = q.trim().replace(/[\\%_]/g, "\\$&");
    const pattern = `%${escapedQuery}%`;
    conditions.push(or(
      ilike(fontsTable.name, pattern),
      ilike(fontsTable.nameArabic, pattern),
      ilike(fontsTable.designer, pattern),
      ilike(fontsTable.description, pattern),
    )!);
  }
  return conditions.length ? and(...conditions) : undefined;
}

async function uniqueSlug(baseSlug: string, category: string, fileName: string): Promise<string> {
  let candidate = baseSlug;
  let suffix = 2;
  while (true) {
    const [collision] = await db
      .select({ id: fontsTable.id, category: fontsTable.category, fileName: fontsTable.fileName })
      .from(fontsTable)
      .where(eq(fontsTable.slug, candidate))
      .limit(1);
    if (!collision || (collision.category === category && collision.fileName === fileName)) {
      return candidate;
    }
    candidate = `${baseSlug}-${suffix++}`;
  }
}

class DatabaseStorage implements IStorage {
  async getAllFonts(): Promise<Font[]> {
    return db.select().from(fontsTable).orderBy(desc(fontsTable.addedAt), fontsTable.name);
  }

  async getFontById(id: string): Promise<Font | undefined> {
    const [font] = await db.select().from(fontsTable).where(eq(fontsTable.id, id)).limit(1);
    return font;
  }

  async getFontsByCategory(category: string): Promise<Font[]> {
    return db.select().from(fontsTable).where(eq(fontsTable.category, category)).orderBy(fontsTable.name);
  }

  async getFontsByCategories(categories: string[]): Promise<Font[]> {
    if (categories.length === 0) return [];
    return db.select().from(fontsTable).where(inArray(fontsTable.category, categories)).orderBy(fontsTable.name);
  }

  async getFontBySlug(slug: string): Promise<Font | undefined> {
    const [canonical] = await db.select().from(fontsTable).where(eq(fontsTable.slug, slug)).limit(1);
    if (canonical) return canonical;

    const [aliased] = await db
      .select({ font: fontsTable })
      .from(fontSlugAliases)
      .innerJoin(fontsTable, eq(fontSlugAliases.fontId, fontsTable.id))
      .where(eq(fontSlugAliases.oldSlug, slug))
      .limit(1);
    return aliased?.font;
  }

  async addSlugAlias(oldSlug: string, fontId: string): Promise<void> {
    await this.addSlugAliases([{ oldSlug, fontId }]);
  }

  async addSlugAliases(aliases: Array<{ oldSlug: string; fontId: string }>): Promise<void> {
    const uniqueAliases = new Map(aliases.filter((alias) => alias.oldSlug).map((alias) => [alias.oldSlug, alias]));
    if (uniqueAliases.size === 0) return;
    await db.insert(fontSlugAliases)
      .values(Array.from(uniqueAliases.values()))
      .onConflictDoNothing();
  }

  async getFontsCount(category?: string, q?: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(fontsTable)
      .where(buildWhere(category, q));
    return Number(result?.count || 0);
  }

  async getFontsPaginated(page: number, limit: number, category?: string, q?: string): Promise<Font[]> {
    const start = Math.max(0, page - 1) * limit;
    return db.select()
      .from(fontsTable)
      .where(buildWhere(category, q))
      .orderBy(desc(fontsTable.addedAt), fontsTable.name)
      .limit(limit)
      .offset(start);
  }

  async createFont(insertFont: InsertFont): Promise<Font> {
    const baseSlug = insertFont.slug || generateSlug(insertFont.name, insertFont.fileName, insertFont.category);
    const slug = await uniqueSlug(baseSlug, insertFont.category, insertFont.fileName);
    const [existing] = await db.select().from(fontsTable).where(and(
      eq(fontsTable.category, insertFont.category),
      eq(fontsTable.fileName, insertFont.fileName),
    )).limit(1);

    const id = existing?.id || randomUUID();
    const [font] = await db.insert(fontsTable).values({
      ...insertFont,
      id,
      slug,
      description: insertFont.description ?? null,
      designer: insertFont.designer ?? null,
      sourceUrl: insertFont.sourceUrl ?? null,
      license: insertFont.license ?? null,
      licenseNotice: insertFont.licenseNotice ?? null,
      copyright: insertFont.copyright ?? null,
      featured: insertFont.featured ?? false,
      addedAt: insertFont.addedAt ?? new Date(),
    }).onConflictDoUpdate({
      target: [fontsTable.category, fontsTable.fileName],
      set: {
        slug,
        name: insertFont.name,
        nameArabic: insertFont.nameArabic,
        description: insertFont.description ?? null,
        designer: insertFont.designer ?? null,
        sourceUrl: insertFont.sourceUrl ?? null,
        license: insertFont.license ?? null,
        licenseNotice: insertFont.licenseNotice ?? null,
        copyright: insertFont.copyright ?? null,
        style: insertFont.style,
        fileUrl: insertFont.fileUrl,
        fileFormat: insertFont.fileFormat,
        featured: insertFont.featured ?? false,
        addedAt: insertFont.addedAt ?? new Date(),
      },
    }).returning();

    if (existing && existing.slug !== font.slug) {
      await this.addSlugAlias(existing.slug, font.id);
    }
    return font;
  }

  async createFonts(insertFonts: InsertFont[]): Promise<Font[]> {
    if (insertFonts.length === 0) return [];
    const existingFonts = await this.getAllFonts();
    const existingByIdentity = new Map(
      existingFonts.map((font) => [`${font.category}/${font.fileName}`, font]),
    );
    const rows = insertFonts.map((insertFont) => {
      const identity = `${insertFont.category}/${insertFont.fileName}`;
      const existing = existingByIdentity.get(identity);
      return {
        ...insertFont,
        id: existing?.id || randomUUID(),
        slug: insertFont.slug || generateSlug(insertFont.name, insertFont.fileName, insertFont.category),
        description: insertFont.description ?? null,
        designer: insertFont.designer ?? null,
        sourceUrl: insertFont.sourceUrl ?? null,
        license: insertFont.license ?? null,
        licenseNotice: insertFont.licenseNotice ?? null,
        copyright: insertFont.copyright ?? null,
        featured: insertFont.featured ?? false,
        addedAt: insertFont.addedAt ?? new Date(),
      };
    });

    const savedFonts: Font[] = [];
    for (let start = 0; start < rows.length; start += 100) {
      const chunk = rows.slice(start, start + 100);
      const saved = await db.insert(fontsTable).values(chunk).onConflictDoUpdate({
        target: [fontsTable.category, fontsTable.fileName],
        set: {
          slug: sql`excluded.slug`,
          name: sql`excluded.name`,
          nameArabic: sql`excluded.name_arabic`,
          description: sql`excluded.description`,
          designer: sql`excluded.designer`,
          sourceUrl: sql`excluded.source_url`,
          license: sql`excluded.license`,
          licenseNotice: sql`excluded.license_notice`,
          copyright: sql`excluded.copyright`,
          style: sql`excluded.style`,
          fileUrl: sql`excluded.file_url`,
          fileFormat: sql`excluded.file_format`,
          featured: sql`excluded.featured`,
          addedAt: sql`excluded.added_at`,
        },
      }).returning();
      savedFonts.push(...saved);
    }

    const oldSlugAliases = insertFonts.flatMap((insertFont) => {
      const existing = existingByIdentity.get(`${insertFont.category}/${insertFont.fileName}`);
      const newSlug = insertFont.slug || generateSlug(insertFont.name, insertFont.fileName, insertFont.category);
      return existing && existing.slug !== newSlug
        ? [{ oldSlug: existing.slug, fontId: existing.id }]
        : [];
    });
    if (oldSlugAliases.length) {
      await db.insert(fontSlugAliases).values(oldSlugAliases).onConflictDoNothing();
    }
    return savedFonts;
  }

  async deleteFont(id: string): Promise<boolean> {
    const deleted = await db.delete(fontsTable).where(eq(fontsTable.id, id)).returning({ id: fontsTable.id });
    return deleted.length > 0;
  }
}

export const storage: IStorage = new DatabaseStorage();
