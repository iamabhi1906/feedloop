"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextField,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import styles from "./signin-form.module.css";
import Link from "next/link";
import signInSchema, { SignInFormData } from "../schema/signin.schema";
import { useState } from "react";
import api from "@/utils/api/api";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignInForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await api.post("/auth/signin", {
        username: data.emailOrUsername,
        email: data.emailOrUsername,
        password: data.password,
      });

      if (response.data.status === "success") {
        setSuccess(true);
        router.replace("/");
        router.refresh();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.formContainer}
    >
      <Box className={styles.alertBox}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && (
          <Alert severity="success">
            Login successfully! Redirecting to home...
          </Alert>
        )}
      </Box>

      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Email Address or username"
          variant="outlined"
          error={!!errors.emailOrUsername}
          helperText={errors.emailOrUsername?.message}
          {...register("emailOrUsername")}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </Stack>

      <Typography>
        Don&apos;t have an account?{" "}
        <Link href={"/register"} className={styles.link}>
          Signin
        </Link>
      </Typography>
    </Box>
  );
}
