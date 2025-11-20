import type { MedicalExam, ExamStatus } from "@/app/types/exam";

import { Box, Paper, Typography, Chip } from "@mui/material";

import { formatDate } from "@/lib/utils/date.utils";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";
import ArticleIcon from "@mui/icons-material/Article";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import styles from "./exam-card.module.css";

type Props = {
  exam: MedicalExam;
  index: number;
};

const statusConfig: Record<
  ExamStatus,
  {
    label: string;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning";
    icon: React.ReactElement;
  }
> = {
  PENDING: {
    label: "Pendente",
    color: "default",
    icon: <PendingIcon sx={{ fontSize: 16 }} />,
  },
  PROCESSING: {
    label: "Processando",
    color: "info",
    icon: <AutorenewIcon sx={{ fontSize: 16 }} />,
  },
  DONE: {
    label: "Concluído",
    color: "success",
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
  },
  ERROR: {
    label: "Erro",
    color: "error",
    icon: <ErrorIcon sx={{ fontSize: 16 }} />,
  },
  REPORTED: {
    label: "Laudado",
    color: "primary",
    icon: <DescriptionIcon sx={{ fontSize: 16 }} />,
  },
};

const getStatusBorderColor = (status: ExamStatus) => {
  switch (status) {
    case "PENDING":
      return "grey.400";
    case "PROCESSING":
      return "info.main";
    case "DONE":
      return "success.main";
    case "ERROR":
      return "error.main";
    case "REPORTED":
      return "primary.main";
    default:
      return "grey.400";
  }
};

export function ExamCard({ exam, index }: Props) {
  const status = statusConfig[exam.status];

  return (
    <Paper
      elevation={0}
      className={styles.card}
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderRadius: 3,
        borderColor: "divider",
        "&:hover": {
          boxShadow: 4,
        },
        "&::before": {
          backgroundColor: getStatusBorderColor(exam.status),
        },
      }}
    >
      <Box className={styles.header}>
        <Box className={styles.examInfo}>
          <Typography
            variant="subtitle1"
            className={styles.examTitle}
            sx={{
              color: "text.primary",
            }}
          >
            Exame #{index + 1}
            <span className={styles.examId}>{exam.id}</span>
          </Typography>
        </Box>

        <Chip
          icon={status.icon}
          label={status.label}
          color={status.color}
          size="small"
          className={styles.statusChip}
          variant={exam.status === "PENDING" ? "outlined" : "filled"}
        />
      </Box>

      <Box className={styles.metaItem}>
        <Box
          className={styles.metaLabel}
          sx={{
            color: "text.secondary",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 15 }} />
          <Typography
            component="span"
            sx={{
              color: "text.secondary",
            }}
          >
            Criado em {formatDate(exam.createdAt)}
          </Typography>
        </Box>
      </Box>

      {exam.processingResult && (
        <Box className={styles.section}>
          <Typography
            className={styles.sectionTitle}
            sx={{
              color: "text.secondary",
            }}
          >
            Resultado do Processamento
          </Typography>
          <Box
            className={styles.resultBox}
            sx={{
              backgroundColor:
                exam.status === "ERROR" ? "error.light" : "background.default",
              border: "1px solid",
              borderColor: exam.status === "ERROR" ? "error.main" : "divider",
              color: exam.status === "ERROR" ? "error.dark" : "text.primary",
            }}
          >
            {exam.processingResult}
          </Box>
        </Box>
      )}

      {exam.report && (
        <Box className={styles.section}>
          <Typography
            className={styles.sectionTitle}
            sx={{
              color: "text.secondary",
            }}
          >
            <ArticleIcon sx={{ fontSize: 18 }} />
            Laudo Médico
          </Typography>
          <Box
            className={styles.reportBox}
            sx={{
              mt: 1,
              backgroundColor: "primary.light",
              border: "1px solid",
              borderColor: "primary.main",
              color: "white",
            }}
          >
            {exam.report}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
