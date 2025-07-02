import { z } from "zod";

export const FormSchema = z.object({
  id: z.string(),
  severity: z.string().optional(),
  occurredAtFrom: z.string().optional(), // ISO string
  occurredAtTo: z.string().optional(), // ISO string
  alarmDate: z.string().optional(), // ISO string
  ancestry: z.string().optional().nullable(),
  systemName: z.string().optional().nullable(),
  hostName: z.string().optional().nullable(),
  hostIp: z.string().optional().nullable(),
  resourceName: z.string().optional().nullable(),
  target: z.string().optional().nullable(),
  resourceType: z.string().optional().nullable(),
  alarmName: z.string().optional().nullable(),
  conditionLog: z.string().optional().nullable(),
  eventType: z.string().optional().nullable(),
  eventSource: z.string().optional().nullable(),
  eventDetail: z.string().optional().nullable(),
  errorType: z.string().optional().nullable(),
  translatedDetail: z.string().optional().nullable(),
  analyzedBy: z.string().optional().nullable(),
  createdAt: z.string().optional(), // ISO string
  updatedAt: z.string().optional(), // ISO string
});

export type LogEntryForm = z.infer<typeof FormSchema>;
