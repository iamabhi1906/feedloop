"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import styles from "./feedback-form.module.css";
import { createFeedback } from "@/features/feedback/feedback.service";
import {
  feedbackFormSchema,
  FeedbackFormValues,
} from "../../schema/feedback-form.schema";
import { FeedbackVisibility } from "@/features/feedback/feedback.types";
import FeedbackEditor from "../feedback-editor/feedback-editor";
import TagSelector from "../tag-selector/tag-selector";

const defaultValues: FeedbackFormValues = {
  title: "",
  description: "",
  tags: [],
  visibility: FeedbackVisibility.PUBLIC,
};

export default function FeedbackForm() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      console.log(values);
      await createFeedback(values);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <Box className={styles.field}>
        <Typography className={styles.label}>Title</Typography>

        <input
          {...register("title")}
          className={styles.input}
          placeholder="Short feedback title"
        />

        {errors.title && (
          <Typography className={styles.error}>
            {errors.title.message}
          </Typography>
        )}
      </Box>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <FeedbackEditor
            value={field.value}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagSelector
            value={field.value}
            onChange={field.onChange}
            error={errors.tags?.message}
          />
        )}
      />

      <Controller
        name="visibility"
        control={control}
        render={({ field }) => (
          <FormControl>
            <Typography className={styles.label}>Visibility</Typography>

            <RadioGroup value={field.value} onChange={field.onChange} row>
              <FormControlLabel
                value="PUBLIC"
                control={<Radio />}
                label="Public"
              />

              <FormControlLabel
                value="PRIVATE"
                control={<Radio />}
                label="Private"
              />
            </RadioGroup>
          </FormControl>
        )}
      />

      <Box className={styles.actions}>
        <Button type="button" variant="outlined" onClick={() => router.back()}>
          Cancel
        </Button>

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Feedback"}
        </Button>
      </Box>
    </Box>
  );
}
