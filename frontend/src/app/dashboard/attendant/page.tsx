"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";
import { ExamList } from "@/components/exam-list/exam-list";
import { AppHeader } from "@/components/app-header/app-header";
import { ExamUploadZone } from "@/components/exam-upload-zone";
import { useExams } from "@/modules/exam/hooks/use-exams.hook";
import { StatsCards } from "@/modules/exam/components/stats-cards/stats-cards";

export default function AttendantDashboard() {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { exams, loading, error, refetch } = useExams({
    pollingInterval: 5000,
    enabled: true,
  });

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    refetch();
  };

  const handleCloseSnackbar = () => {
    setUploadSuccess(false);
  };

  const pendingCount = exams.filter((e) => e.status === "PENDING").length;
  const processingCount = exams.filter((e) => e.status === "PROCESSING").length;
  const doneCount = exams.filter((e) => e.status === "DONE").length;
  const errorCount = exams.filter((e) => e.status === "ERROR").length;
  const reportedCount = exams.filter((e) => e.status === "REPORTED").length;

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
            Dashboard
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Gerencie e acompanhe o progresso dos exames cadastrados
          </Typography>
        </Box>

        <StatsCards
          pendingCount={pendingCount}
          processingCount={processingCount}
          doneCount={doneCount}
          errorCount={errorCount}
          reportedCount={reportedCount}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Upload de Exame
          </Typography>
        </Box>
        <ExamUploadZone
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(error) => console.error("Upload error:", error)}
        />

        <Paper
          elevation={2}
          sx={{
            mt: 4,
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
                <strong>{exams.length}</strong>{" "}
                {exams.length === 1 ? "exame" : "exames"}
              </Typography>
            </Box>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <ExamList exams={exams} loading={loading} />
        </Paper>

        <Snackbar
          open={uploadSuccess}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          message="Exame cadastrado com sucesso!"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
      </Container>
    </Box>
  );
}
