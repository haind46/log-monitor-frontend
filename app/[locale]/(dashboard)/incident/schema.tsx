import { z } from "zod";

// Map fields to match IncidentRequest DTO
export const FormSchema = z.object({
  id: z.string(),
  incidentCode: z.string().max(50).optional().nullable(),
  title: z.string().max(255),
  description: z.string().optional().nullable(),
  incidentTime: z.string(), // ISO string, required
  resolvedTime: z.string().optional().nullable(),
  status: z.string().max(30).optional().nullable(),
  severity: z.string().max(20).optional().nullable(),
  sourceSystem: z.string().max(100).optional().nullable(),
  detectedBy: z.string().max(100).optional().nullable(),
  assignedTo: z.string().max(100).optional().nullable(),
  solution: z.string().optional().nullable(),
  relatedProcedure: z.string().max(255).optional().nullable(),
  suggestion: z.string().optional().nullable(),
});

export type IncidentForm = z.infer<typeof FormSchema>;
