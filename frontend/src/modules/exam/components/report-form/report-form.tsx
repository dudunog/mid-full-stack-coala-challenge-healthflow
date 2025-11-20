"use client";

import { useState } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";

import type { ApiError } from "@/lib/http-client";
import { createReport } from "@/lib/services/exam/create-report.service";

import SendIcon from "@mui/icons-material/Send";

import styles from "./report-form.module.css";

type Props = {
  examId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export function ReportForm({ examId, onSuccess, onError }: Props) {
  const [report, setReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!report.trim()) {
      setError("O laudo não pode estar vazio");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createReport(examId, report.trim());
      setReport("");
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        (err as ApiError).message || "Erro ao submeter o laudo";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          multiline
          rows={6}
          fullWidth
          label="Laudo Médico"
          placeholder="Digite o laudo do exame..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          disabled={isSubmitting}
          error={!!error}
          helperText={error}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "background.paper",
            },
          }}
        />
        <Box className={styles.actions}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !report.trim()}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            sx={{
              minWidth: 150,
              borderRadius: 6,
            }}
          >
            {isSubmitting ? "Enviando..." : "Submeter Laudo"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
