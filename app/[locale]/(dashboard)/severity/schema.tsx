import { z } from "zod";

export const FormSchema = z.object({
  id: z.string().optional(),
  severityLevel: z.string().min(1),
  description: z.string().optional().nullable(),
  notifyToLevel: z.number(),
  autoCall: z.boolean(),
  ttsTemplate: z.string().optional().nullable(),
});

export type Severity = z.infer<typeof FormSchema>;



