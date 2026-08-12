import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import styles from "./page.module.css";
import SignInForm from "./_signin-form/signin.form";

export interface ActiveSessionItem {
  id: string;
  userAgent: string;
  loginAt: string;
  lastActive: string;
}

export default function SigninPage() {
  return (
    <Box className={styles.mainBox}>
      <Card className={styles.cardBox}>
        <CardContent>
          <Stack direction={"column"} className={styles.upperStack}>
            <Typography className={styles.heading} color="primary">
              Feedloop
            </Typography>
            <Typography variant="body2">
              Welcome back! Please login to your account
            </Typography>
          </Stack>
          <SignInForm />
        </CardContent>
      </Card>
    </Box>
  );
}
