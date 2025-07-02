import { z } from "zod";

export const FormSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().optional(),
  level1: z.string().optional().nullable(),
  level2: z.string().optional().nullable(),
  level3: z.string().optional().nullable(),
});

export type System = z.infer<typeof FormSchema>;

const convertData = (row: any) => {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    level1: row.level1User?.id || null,
    level2: row.level2User?.id || null, 
    level3: row.level3User?.id || null, 
  };
};


