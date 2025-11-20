import type { MedicalExam } from "@/app/types/exam";

import { httpClient } from "@/lib/http-client";

/**
 * Create a report for an exam
 * @param examId - The ID of the exam
 * @param report - The report text
 * @returns Updated exam
 */
export async function createReport(
  examId: string,
  report: string
): Promise<MedicalExam> {
  return httpClient<MedicalExam>(`/exams/${examId}/report`, {
    method: "POST",
    body: JSON.stringify({ report }),
  });
}
