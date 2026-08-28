import { type Font, type InsertFont } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllFonts(): Promise<Font[]>;
  getFontById(id: string): Promise<Font | undefined>;
  getFontsByCategory(category: string): Promise<Font[]>;
  getFontsByCategories(categories: string[]): Promise<Font[]>;
  getFontBySlug(slug: string, generateSlugFn: (name: string, fileName: string, category: string) => string): Promise<Font | undefined>;
  getFontsCount(category?: string, q?: string): Promise<number>;
  getFontsPaginated(page: number, limit: number, category?: string, q?: string): Promise<Font[]>;
  createFont(font: InsertFont): Promise<Font>;
  deleteFont(id: string): Promise<boolean>;
}

function matchesSearch(font: Font, q: string): boolean {
  const lq = q.toLowerCase();
  return (
    font.nameArabic.includes(q) ||
    font.name.toLowerCase().includes(lq) ||
    (!!font.designer && font.designer.includes(q)) ||
    (!!font.description && font.description.toLowerCase().includes(lq))
  );
}

export class MemStorage implements IStorage {
  private fonts: Map<string, Font>;

  constructor() {
    this.fonts = new Map();
  }

  async getAllFonts(): Promise<Font[]> {
    return Array.from(this.fonts.values());
  }

  async getFontById(id: string): Promise<Font | undefined> {
    return this.fonts.get(id);
  }

  async getFontsByCategory(category: string): Promise<Font[]> {
    return Array.from(this.fonts.values()).filter(f => f.category === category);
  }

  async getFontsByCategories(categories: string[]): Promise<Font[]> {
    const catSet = new Set(categories);
    return Array.from(this.fonts.values()).filter(f => catSet.has(f.category));
  }

  async getFontBySlug(slug: string, generateSlugFn: (name: string, fileName: string, category: string) => string): Promise<Font | undefined> {
    return Array.from(this.fonts.values()).find(f => generateSlugFn(f.name, f.fileName, f.category) === slug);
  }

  async getFontsCount(category?: string, q?: string): Promise<number> {
    let fonts = Array.from(this.fonts.values());
    if (category) fonts = fonts.filter(f => f.category === category);
    if (q) fonts = fonts.filter(f => matchesSearch(f, q));
    return fonts.length;
  }

  async getFontsPaginated(page: number, limit: number, category?: string, q?: string): Promise<Font[]> {
    let fonts = Array.from(this.fonts.values());
    if (category) fonts = fonts.filter(f => f.category === category);
    if (q) fonts = fonts.filter(f => matchesSearch(f, q));
    fonts.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    const start = (page - 1) * limit;
    return fonts.slice(start, start + limit);
  }

  async createFont(insertFont: InsertFont): Promise<Font> {
    const id = randomUUID();
    const font: Font = { 
      ...insertFont, 
      id,
      description: insertFont.description ?? null,
      designer: insertFont.designer ?? null,
      featured: insertFont.featured ?? false,
      addedAt: insertFont.addedAt ?? new Date()
    };
    this.fonts.set(id, font);
    return font;
  }

  async deleteFont(id: string): Promise<boolean> {
    return this.fonts.delete(id);
  }
}

export const storage = new MemStorage();
