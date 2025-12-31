import axios from "axios";
import { AnalysisRequest, AnalysisResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function validateResult(result: AnalysisResponse) {
  if (
    typeof result.score !== "number" ||
    !Array.isArray(result.pros) ||
    !Array.isArray(result.cons) ||
    !Array.isArray(result.tips)
  ) {
    throw new ApiError("Invalid response format from server");
  }

  // Validate weights if present (optional field)
  if (result.weights !== undefined) {
    const { skills, experience, education } = result.weights;
    if (
      typeof skills !== "number" ||
      typeof experience !== "number" ||
      typeof education !== "number"
    ) {
      throw new ApiError("Invalid weights format in response");
    }
  }
}

export async function analyzeResume(
  data: AnalysisRequest
): Promise<AnalysisResponse> {
  const { resumeFile, jobText } = data;

  try {
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("jobText", jobText);

    const response = await axios.post<AnalysisResponse>(
      `${API_BASE_URL}/api/analyze/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    validateResult(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data as unknown;
      const message =
        (typeof errorData === "object" &&
          errorData !== null &&
          "error" in errorData &&
          typeof (errorData as { error: unknown }).error === "string" &&
          (errorData as { error: string }).error) ||
        (typeof errorData === "object" &&
          errorData !== null &&
          "message" in errorData &&
          typeof (errorData as { message: unknown }).message === "string" &&
          (errorData as { message: string }).message) ||
        error.message ||
        "Failed to analyze resume";
      throw new ApiError(message, status, errorData);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again."
    );
  }
}
