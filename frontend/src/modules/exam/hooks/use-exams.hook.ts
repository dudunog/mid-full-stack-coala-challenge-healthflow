"use client";

import type { MedicalExam } from "@/app/types/exam";

import { useState, useEffect, useCallback } from "react";
import { listExams } from "@/lib/services/exam/exam.service";

type UseExamsOptions = {
  pollingInterval?: number;
  enabled?: boolean;
};

type UseExamsReturn = {
  exams: MedicalExam[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useExams(options: UseExamsOptions = {}): UseExamsReturn {
  const { pollingInterval = 5000, enabled = true } = options;
  const [exams, setExams] = useState<MedicalExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    try {
      setError(null);
      const data = await listExams();
      setExams(data);
    } catch (err) {
      const errorMessage = (err as Error).message || "Erro ao carregar exames";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      fetchExams();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, fetchExams]);

  return {
    exams,
    loading,
    error,
    refetch: fetchExams,
  };
}
