"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  InputAdornment,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import signUpSchema, { SignUpFormData } from "../schema/signup-form.schema";
import styles from "./signup-form.module.css";
import useDebounce from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api/api";
import axios from "axios";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const usernameValue = useWatch({
    control,
    name: "username",
    defaultValue: "",
  });
  const debouncedUsername = useDebounce(usernameValue, 500);
  useEffect(() => {
    if (debouncedUsername) {
      trigger("username");
    }
  }, [debouncedUsername, trigger]);
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await api.post("/auth/signup", data);
      console.log(response.data);

      if (response.data.status === "success") {
        setSuccess(true);
        router.replace("/login");
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
            Account created successfully! Redirecting to sign in...
          </Alert>
        )}
      </Box>

      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />

        <TextField
          fullWidth
          type="email"
          label="Email Address"
          variant="outlined"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register("username")}
          slotProps={{
            input: {
              endAdornment:
                isValidating && usernameValue === debouncedUsername ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} color="inherit" />
                  </InputAdornment>
                ) : null,
            },
          }}
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

        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          variant="outlined"
          error={!!errors.conformPassword}
          helperText={errors.conformPassword?.message}
          {...register("conformPassword")}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
      </Stack>

      <Typography>
        Already have an account?{" "}
        <Link href={"/login"} className={styles.link}>
          Signin
        </Link>
      </Typography>
    </Box>
  );
}
