import api from "@/utils/api/api";
import z from "zod";

const checkUsernameAvailability = async (
  username: string,
): Promise<boolean> => {
  if (username.length < 3) return true;
  try {
    const { data } = await api.get(
      `/users/check-username?username=${username}`,
    );
    return data.isAvailable;
  } catch {
    return false;
  }
};

const signUpSchema = z
  .object({
    name: z
      .string("Must provide a valid name")
      .min(3, "Must be at least 3 letters long")
      .max(100, "Must not exceed 100 letters"),

    email: z
      .string()
      .email("Need a valid email")
      .max(255, "Must not exceed 255 characters"),

    username: z
      .string("Username is required")
      .min(3, "Must be at least 3 letters")
      .trim()
      .refine(async (val) => await checkUsernameAvailability(val), {
        message: "Username is already taken",
      }),

    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters"),

    conformPassword: z.string("Please confirm your password"),
  })
  .refine((data) => data.password === data.conformPassword, {
    message: "Passwords do not match",
    path: ["conformPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
export default signUpSchema;
