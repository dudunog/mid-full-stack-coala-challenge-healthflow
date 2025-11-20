import type { MedicalExam } from "@/app/types/exam";

import { httpClient } from "@/lib/http-client";

/**
 * List all exams
 * @returns Array of exams
 */
export async function listExams(): Promise<MedicalExam[]> {
  return httpClient<MedicalExam[]>("/exams", {
    method: "GET",
  });
}
