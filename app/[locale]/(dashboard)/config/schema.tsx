import { z } from "zod";

export const FormSchema = z.object({
  id: z.string(),
  keyName: z.string(),
  value: z.string().optional(),
  description: z.string().optional().nullable()
});

export type System = z.infer<typeof FormSchema>;



