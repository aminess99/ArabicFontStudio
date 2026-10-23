import { z } from "zod";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const fontsTable = pgTable("fonts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  description: text("description"),
  designer: text("designer"),
  sourceUrl: text("source_url"),
  license: text("license"),
  licenseNotice: text("license_notice"),
  copyright: text("copyright"),
  category: text("category").notNull(),
  style: text("style").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileFormat: text("file_format").notNull(),
  featured: boolean("featured").notNull().default(false),
  addedAt: timestamp("added_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => [
  uniqueIndex("fonts_category_file_name_unique").on(table.category, table.fileName),
  index("fonts_category_idx").on(table.category),
]);

export const fontSlugAliases = pgTable("font_slug_aliases", {
  oldSlug: text("old_slug").primaryKey(),
  fontId: text("font_id").notNull().references(() => fontsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
}, (table) => [
  index("font_slug_aliases_font_id_idx").on(table.fontId),
]);

export const insertFontSchema = z.object({
  name: z.string(),
  nameArabic: z.string(),
  description: z.string().optional().nullable(),
  designer: z.string().optional().nullable(),
  sourceUrl: z.string().url().optional().nullable(),
  license: z.string().optional().nullable(),
  licenseNotice: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  category: z.string(),
  style: z.string(),
  fileUrl: z.string(),
  fileName: z.string(),
  fileFormat: z.string(),
  slug: z.string().optional(),
  featured: z.boolean().default(false),
  addedAt: z.date().optional(),
});

export type InsertFont = z.infer<typeof insertFontSchema>;

export type Font = typeof fontsTable.$inferSelect;
