import { z } from "zod";

export const FormSchema = z.object({
  id: z.string(),
  username: z.string(),
  fullname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  mobilePhone: z.string().optional().nullable(),
  department: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional()
    .nullable(),
  userNote: z.string().optional().nullable(),
  status: z.number(),
  password: z.string().min(8, "Mật khẩu của bạn quá yếu"),
  // confirmPassword: z.string().min(8, "Mật khẩu của bạn quá yếu"),
});

export type User = z.infer<typeof FormSchema>;
