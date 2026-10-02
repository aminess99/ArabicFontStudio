import { z } from "zod";

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
  featured: z.boolean().default(false),
  addedAt: z.date().optional(),
});

export type InsertFont = z.infer<typeof insertFontSchema>;

export type Font = {
  id: string;
  name: string;
  nameArabic: string;
  description: string | null;
  designer: string | null;
  sourceUrl: string | null;
  license: string | null;
  licenseNotice: string | null;
  copyright: string | null;
  category: string;
  style: string;
  fileUrl: string;
  fileName: string;
  fileFormat: string;
  featured: boolean;
  addedAt: Date;
};
