import { FeedbackVisibility } from "@/features/feedback/feedback.types";
import { z } from "zod";

export const feedbackFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  visibility: z.enum(FeedbackVisibility),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
