"use client";

import { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { AppHeader } from "@/components/app-header/app-header";
import { useExams } from "@/modules/exam/hooks/use-exams.hook";
import { ExamCardWithReport } from "@/modules/exam/components/exam-card-with-report/exam-card-with-report";

import styles from "./doctor-dashboard.module.css";

export default function DoctorDashboard() {
  const [reportSuccess, setReportSuccess] = useState(false);
  const { exams, loading, error, refetch } = useExams({
    pollingInterval: 5000,
    enabled: true,
  });

  const doneExams = useMemo(
    () => exams.filter((exam) => exam.status === "DONE"),
    [exams]
  );

  const handleReportSuccess = () => {
    setReportSuccess(true);
    refetch();
  };

  const handleCloseSnackbar = () => {
    setReportSuccess(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="primary"
            fontWeight={700}
          >
            Fila de Trabalho
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Exames processados aguardando laudo médico
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 2,
            backgroundColor: "background.paper",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Exames
            </Typography>
            <Box
              sx={{
                ml: "auto",
                px: 2,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="text">
                <strong>{doneExams.length}</strong>{" "}
                {doneExams.length === 1 ? "exame" : "exames"}
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && doneExams.length === 0 ? (
            <Box className={styles.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : doneExams.length === 0 ? (
            <Paper
              className={styles.emptyState}
              sx={{
                backgroundColor: "action.hover",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Nenhum exame aguardando laudo no momento
              </Typography>
            </Paper>
          ) : (
            <Box className={styles.examsContainer}>
              {doneExams.map((exam, index) => (
                <ExamCardWithReport
                  key={exam.id}
                  exam={exam}
                  index={index}
                  onReportSuccess={handleReportSuccess}
                />
              ))}
            </Box>
          )}
        </Paper>

        <Snackbar
          open={reportSuccess}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          message="Laudo submetido com sucesso!"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
      </Container>
    </Box>
  );
}
