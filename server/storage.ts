import { type Font, type InsertFont } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllFonts(): Promise<Font[]>;
  getFontById(id: string): Promise<Font | undefined>;
  createFont(font: InsertFont): Promise<Font>;
  deleteFont(id: string): Promise<boolean>;
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

  async createFont(insertFont: InsertFont): Promise<Font> {
    const id = randomUUID();
    const font: Font = { 
      ...insertFont, 
      id,
      description: insertFont.description ?? null,
      designer: insertFont.designer ?? null,
      featured: insertFont.featured ?? false
    };
    this.fonts.set(id, font);
    return font;
  }

  async deleteFont(id: string): Promise<boolean> {
    return this.fonts.delete(id);
  }
}

export const storage = new MemStorage();
