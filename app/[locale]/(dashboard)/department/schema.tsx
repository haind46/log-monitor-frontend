import { z } from "zod";

export const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  deptCode: z.string().optional(),
  desc: z.string().optional().nullable()
});

export type System = z.infer<typeof FormSchema>;



