import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const fonts = pgTable("fonts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull(),
  description: text("description"),
  designer: text("designer"),
  category: text("category").notNull(),
  style: text("style").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileFormat: text("file_format").notNull(),
  featured: boolean("featured").default(false).notNull(),
});

export const insertFontSchema = createInsertSchema(fonts).omit({
  id: true,
});

export type InsertFont = z.infer<typeof insertFontSchema>;
export type Font = typeof fonts.$inferSelect;
