"use client";

import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { ResumeInputProps } from "@/types";

export default function ResumeInput({
  onNext,
  initialFile = null,
}: ResumeInputProps) {
  const { t } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(initialFile);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ["application/pdf", "text/plain"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type) && !file.name.endsWith(".txt")) {
      setError("Please upload a PDF or TXT file");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 2MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setUploadedFile(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = () => {
    if (uploadedFile) {
      onNext(uploadedFile);
    } else {
      setError(t("fileRequired"));
    }
  };

  return (
    <div className="container-narrow animate-in">
      <div className="card card-lg">
        <h2 className="text-title mb-2">{t("resumeTitle")}</h2>
        <p className="text-subtitle mb-8">{t("resumeSubtitle")}</p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`upload-zone ${isDragging ? "drag-over" : ""} ${
            uploadedFile ? "has-file" : ""
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={handleInputChange}
            className="hidden"
          />

          {uploadedFile ? (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-body font-semibold text-green-700 mb-1">
                {t("fileUploaded")}
              </p>
              <p className="text-caption mb-4">{uploadedFile.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-caption text-red-600 hover:text-red-700 font-medium"
              >
                {t("removeFile")}
              </button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="2"
                >
                  <path
                    d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-body font-semibold mb-2">
                {t("uploadZoneTitle")}
              </p>
              <p className="text-caption mb-3">{t("uploadZoneSubtitle")}</p>
              <p className="text-small">{t("supportedFormats")}</p>
            </div>
          )}
        </div>

        {error && <p className="text-small text-red-600 mt-4">{error}</p>}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!uploadedFile}
            className="btn btn-primary btn-lg"
          >
            {t("next")}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
