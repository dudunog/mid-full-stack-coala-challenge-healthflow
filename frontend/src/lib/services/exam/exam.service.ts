import type { MedicalExam } from "@/app/types/exam";

import { httpClient } from "@/lib/http-client";

/**
 * Upload a new exam
 * @returns Created exam
 */
export async function uploadExam(): Promise<MedicalExam> {
  return httpClient<MedicalExam>("/exams/upload", {
    method: "POST",
  });
}

/**
 * List all exams (for ATTENDANT) or only DONE exams (for DOCTOR)
 * @returns Array of exams
 */
export async function listExams(): Promise<MedicalExam[]> {
  return httpClient<MedicalExam[]>("/exams", {
    method: "GET",
  });
}
