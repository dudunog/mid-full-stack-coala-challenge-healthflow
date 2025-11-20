"use client";

import type { MedicalExam } from "@/app/types/exam";

import { useState } from "react";
import { Box, Collapse, IconButton, Typography } from "@mui/material";

import { ExamCard } from "@/components/exam-card/exam-card";
import { ReportForm } from "@/modules/exam/components/report-form/report-form";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AssignmentIcon from "@mui/icons-material/Assignment";

import styles from "./exam-card-with-report.module.css";

type Props = {
  exam: MedicalExam;
  index: number;
  onReportSuccess?: () => void;
};

export function ExamCardWithReport({ exam, index, onReportSuccess }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleReportSuccess = () => {
    setIsExpanded(false);
    onReportSuccess?.();
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.cardWrapper}>
        <Box className={styles.cardContainer}>
          <ExamCard exam={exam} index={index} />
        </Box>
        <Box className={styles.actions}>
          <IconButton
            onClick={handleToggle}
            size="small"
            sx={{
              color: "primary.main",
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                boxShadow: 2,
              },
            }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Box className={styles.reportHeader}>
            <AssignmentIcon
              sx={{
                fontSize: 20,
                color: "primary.main",
                mr: 1,
              }}
            />
            <Typography
              component="h3"
              sx={{
                fontWeight: 500,
                color: "text.secondary",
                margin: 0,
              }}
            >
              Adicionar Laudo
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              backgroundColor: "background.paper",
            }}
          >
            <ReportForm examId={exam.id} onSuccess={handleReportSuccess} />
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
