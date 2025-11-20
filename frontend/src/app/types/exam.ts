export type ExamStatus =
  | "PENDING"
  | "PROCESSING"
  | "DONE"
  | "ERROR"
  | "REPORTED";

export type MedicalExam = {
  id: string;
  status: ExamStatus;
  processingResult: string | null;
  report: string | null;
  attendantId: string;
  createdAt: string;
  updatedAt: string;
};
