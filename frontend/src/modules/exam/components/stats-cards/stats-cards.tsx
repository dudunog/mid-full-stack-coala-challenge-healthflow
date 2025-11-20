import { Typography, Box, Paper } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DescriptionIcon from "@mui/icons-material/Description";

import styles from "./stats-cards.module.css";

type Props = {
  pendingCount: number;
  processingCount: number;
  doneCount: number;
  errorCount: number;
  reportedCount: number;
};

export function StatsCards({
  pendingCount,
  processingCount,
  doneCount,
  errorCount,
  reportedCount,
}: Props) {
  return (
    <Box className={styles.container}>
      <Paper
        elevation={2}
        className={styles.card}
        sx={{
          backgroundColor: "background.paper",
          borderColor: "grey.400",
          borderRadius: 3,
        }}
      >
        <Box className={styles.cardContent}>
          <PendingIcon
            className={styles.icon}
            sx={{
              fontSize: 42,
              color: "grey.400",
            }}
          />
          <Box className={styles.cardTextColumn}>
            <Typography
              variant="h4"
              className={styles.countText}
              sx={{
                color: "text.primary",
              }}
            >
              {pendingCount}
            </Typography>
            <Typography
              variant="caption"
              className={styles.labelText}
              sx={{
                color: "text.secondary",
              }}
            >
              Pendentes
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        className={styles.card}
        sx={{
          backgroundColor: "background.paper",
          borderColor: "info.main",
          borderRadius: 3,
        }}
      >
        <Box className={styles.cardContent}>
          <AutorenewIcon
            className={styles.icon}
            sx={{
              fontSize: 42,
              color: "info.main",
            }}
          />
          <Box className={styles.cardTextColumn}>
            <Typography
              variant="h4"
              className={styles.countText}
              sx={{
                color: "text.primary",
              }}
            >
              {processingCount}
            </Typography>
            <Typography
              variant="caption"
              className={styles.labelText}
              sx={{
                color: "text.secondary",
              }}
            >
              Processando
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        className={styles.card}
        sx={{
          backgroundColor: "background.paper",
          borderColor: "success.main",
          borderRadius: 3,
        }}
      >
        <Box className={styles.cardContent}>
          <CheckCircleIcon
            className={styles.icon}
            sx={{
              fontSize: 42,
              color: "success.main",
            }}
          />
          <Box className={styles.cardTextColumn}>
            <Typography
              variant="h4"
              className={styles.countText}
              sx={{
                color: "text.primary",
              }}
            >
              {doneCount}
            </Typography>
            <Typography
              variant="caption"
              className={styles.labelText}
              sx={{
                color: "text.secondary",
              }}
            >
              Concluídos
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        className={styles.card}
        sx={{
          backgroundColor: "background.paper",
          borderColor: "error.main",
          borderRadius: 3,
        }}
      >
        <Box className={styles.cardContent}>
          <ErrorIcon
            className={styles.icon}
            sx={{
              fontSize: 42,
              color: "error.main",
            }}
          />
          <Box className={styles.cardTextColumn}>
            <Typography
              variant="h4"
              className={styles.countText}
              sx={{
                color: "text.primary",
              }}
            >
              {errorCount}
            </Typography>
            <Typography
              variant="caption"
              className={styles.labelText}
              sx={{
                color: "text.secondary",
              }}
            >
              Erros
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        className={styles.card}
        sx={{
          backgroundColor: "background.paper",
          borderColor: "primary.main",
          borderRadius: 3,
        }}
      >
        <Box className={styles.cardContent}>
          <DescriptionIcon
            className={styles.icon}
            sx={{
              fontSize: 42,
              color: "primary.main",
            }}
          />
          <Box className={styles.cardTextColumn}>
            <Typography
              variant="h4"
              className={styles.countText}
              sx={{
                color: "text.primary",
              }}
            >
              {reportedCount}
            </Typography>
            <Typography
              variant="caption"
              className={styles.labelText}
              sx={{
                color: "text.secondary",
              }}
            >
              Laudados
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
