import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import styles from "./page.module.css";
import SignUpForm from "./_signup-form/signup-form";

export default function SignupPage() {
  return (
    <Box className={styles.mainBox}>
      <Card className={styles.cardBox}>
        <CardContent>
          <Stack direction={"column"} className={styles.upperStack}>
            <Typography className={styles.heading} color="primary">
              Feedloop
            </Typography>
            <Typography variant="body2">
              Welcome! Please create to your account
            </Typography>
          </Stack>

          <SignUpForm />
        </CardContent>
      </Card>
    </Box>
  );
}
