import { z } from "zod";

export const FormSchema = z.object({
  id: z.string(),
  startTime: z.string().nullable(),
  endTime: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  impactedSystem: z.string(),
  implementUnit: z.string().optional().nullable(),
  implementer: z.string().optional().nullable(),
  approver: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  procedureFile: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  sourceSystem: z.string().optional().nullable(),
  relatedSystems: z.array(z.string()).optional().nullable(),
});

export type System = z.infer<typeof FormSchema>;
