import { Container, Paper } from "@mui/material";

import { LoginForm } from "@/components/login-form";
import styles from "./signin.module.css";

export default function SignInPage() {
  return (
    <Container maxWidth={false} className={styles.container}>
      <Paper elevation={8} className={styles.paper}>
        <LoginForm />
      </Paper>
    </Container>
  );
}
