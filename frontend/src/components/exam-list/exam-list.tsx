"use client";

import type { MedicalExam } from "@/app/types/exam";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { ExamCard } from "../exam-card/exam-card";

import styles from "./exam-list.module.css";

type Props = {
  exams: MedicalExam[];
  loading?: boolean;
};

export function ExamList({ exams, loading }: Props) {
  if (loading && exams.length === 0) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (exams.length === 0) {
    return (
      <Paper
        className={styles.emptyState}
        sx={{
          backgroundColor: "action.hover",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Nenhum exame cadastrado ainda.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.emptyStateMessage}
        >
          Faça upload de um exame para começar.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box className={styles.container}>
      {exams.map((exam, index) => (
        <ExamCard key={exam.id} exam={exam} index={index} />
      ))}
    </Box>
  );
}
