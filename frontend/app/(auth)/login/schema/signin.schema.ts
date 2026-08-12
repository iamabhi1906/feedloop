import z from "zod";

const signInSchema = z.object({
  emailOrUsername: z.string().max(255, "Must not exceed 255 characters"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export default signInSchema;
