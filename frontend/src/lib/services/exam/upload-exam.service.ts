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
