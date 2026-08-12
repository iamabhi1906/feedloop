import styles from "./page.module.css";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <div className={styles.page}>
      <Typography variant="h1">Welcome to Feedloop</Typography>
    </div>
  );
}
