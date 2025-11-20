"use client";

import { useState, useCallback, useRef, DragEvent } from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Fade,
  alpha,
} from "@mui/material";

import type { ApiError } from "@/lib/http-client";
import { uploadExam } from "@/lib/services/exam/upload-exam.service";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Props = {
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
};

export function ExamUploadZone({ onUploadSuccess, onUploadError }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      await uploadExam();
      setUploadSuccess(true);
      onUploadSuccess?.();

      setTimeout(() => {
        setUploadSuccess(false);
        setFileName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (err) {
      const errorMessage =
        (err as ApiError).message || "Erro ao fazer upload do exame";
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess, onUploadError]);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);
        handleUpload();
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFileName(file.name);
        handleUpload();
      }
    },
    [handleUpload]
  );

  return (
    <Box>
      <Paper
        elevation={isDragging ? 4 : 1}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        sx={(theme) => ({
          border: uploadSuccess ? "none" : "3px dashed",
          borderColor: "primary.main",
          borderRadius: 4,
          p: 6,
          textAlign: "center",
          cursor: isUploading ? "wait" : "pointer",
          transition: "all 0.2s ease",
          backgroundColor: isDragging
            ? alpha(theme.palette.primary.main, 0.04)
            : uploadSuccess
            ? alpha(theme.palette.success.main, 0.04)
            : alpha(theme.palette.primary.main, 0.02),
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: isUploading
              ? alpha(theme.palette.primary.main, 0.02)
              : alpha(theme.palette.primary.main, 0.06),
            boxShadow: isUploading ? 1 : 2,
          },
        })}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.dcm"
          onChange={handleFileInputChange}
          disabled={isUploading}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        />

        <Fade in={!isUploading && !uploadSuccess}>
          <Box
            sx={{
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                mb: 3,
              }}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 80,
                  color: isDragging ? "primary.dark" : "primary.main",
                  transition: "all 0.3s ease",
                  transform: isDragging ? "scale(1.1)" : "scale(1)",
                }}
              />
              {isDragging && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    opacity: 0.1,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": {
                        transform: "translate(-50%, -50%) scale(1)",
                        opacity: 0.1,
                      },
                      "50%": {
                        transform: "translate(-50%, -50%) scale(1.2)",
                        opacity: 0.05,
                      },
                      "100%": {
                        transform: "translate(-50%, -50%) scale(1)",
                        opacity: 0.1,
                      },
                    },
                  }}
                />
              )}
            </Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {isDragging
                ? "Solte o arquivo aqui"
                : "Arraste e solte o arquivo aqui"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ou clique para selecionar um arquivo
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Formatos suportados:
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: "tertiary.light",
                }}
              >
                <Typography
                  variant="caption"
                  color="tertiary.contrastText"
                  fontWeight={600}
                >
                  Imagens
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: "tertiary.light",
                }}
              >
                <Typography
                  variant="caption"
                  color="tertiary.contrastText"
                  fontWeight={600}
                >
                  PDF
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: "tertiary.light",
                }}
              >
                <Typography
                  variant="caption"
                  color="tertiary.contrastText"
                  fontWeight={600}
                >
                  DICOM
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        <Fade in={isUploading}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.paper",
              pointerEvents: "none",
            }}
          >
            <CircularProgress size={64} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Enviando exame...
            </Typography>
            {fileName && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {fileName}
              </Typography>
            )}
          </Box>
        </Fade>

        <Fade in={uploadSuccess}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "success.light",
              pointerEvents: "none",
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: "success.contrastText",
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: "success.contrastText", fontWeight: 600 }}
            >
              Upload realizado com sucesso!
            </Typography>
            {fileName && (
              <Typography
                variant="body2"
                sx={{ color: "success.contrastText", mt: 1 }}
              >
                {fileName}
              </Typography>
            )}
          </Box>
        </Fade>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
