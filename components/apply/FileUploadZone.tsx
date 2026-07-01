"use client";

import { useCallback, useState } from "react";
import type { UploadedFileMeta } from "@/lib/apply/types";
import { validateApplicationFile } from "@/lib/apply/validation";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type FileUploadZoneProps = {
  id: string;
  label: string;
  description: string;
  accept?: string;
  required?: boolean;
  imagesOnly?: boolean;
  value: UploadedFileMeta | null;
  onChange: (file: UploadedFileMeta | null) => void;
};

export function FileUploadZone({
  id,
  label,
  description,
  accept = ".pdf,.png,.jpg,.jpeg,.webp",
  required = false,
  imagesOnly = false,
  value,
  onChange,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      const error = validateApplicationFile(file, imagesOnly);
      if (error) {
        onChange({
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: "error",
          error,
        });
        return;
      }

      onChange({
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 100,
        status: "complete",
        file,
      });
    },
    [imagesOnly, onChange],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void processFile(file);
  }

  const hasFile = value?.status === "complete";
  const hasError = value?.status === "error";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2">
        <p className="text-sm font-light text-pure-white">
          {label}
          {required ? <span className="text-pure-white/90"> *</span> : null}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-pure-white/58">{description}</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-1 flex-col rounded-[1.1rem] border-2 border-dashed px-4 py-5 transition-all ${
          isDragging
            ? "border-pure-white/45 bg-pure-white/14 shadow-inner"
            : hasFile
              ? "border-pure-white/35 bg-pure-white/10"
              : hasError
                ? "border-coral-blush/70 bg-coral-blush/20"
                : "border-pure-white/20 bg-pure-white/6 hover:border-pure-white/35 hover:bg-pure-white/10"
        }`}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void processFile(file);
          }}
        />

        {hasFile && value ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-pure-white/15 text-pure-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mt-4 max-w-[16rem] truncate text-sm font-light text-pure-white">
              {value.name}
            </p>
            <p className="mt-1 text-xs text-pure-white/58">{formatFileSize(value.size)}</p>
            <p className="mt-3 text-xs font-light text-pure-white/75">Ready to upload on submit</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <label
                htmlFor={id}
                className="cursor-pointer text-xs font-light text-pure-white/85 hover:underline"
              >
                Replace file
              </label>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="text-xs font-light text-pure-white/55 hover:text-pure-white"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label htmlFor={id} className="flex flex-1 cursor-pointer flex-col items-center justify-center text-center">
            <div
              className={`flex size-14 items-center justify-center rounded-2xl transition-colors ${
                isDragging ? "bg-pure-white/20 text-pure-white" : "bg-pure-white/10 text-pure-white/85"
              }`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 16V8m0 0-3 3m3-3 3 3M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="mt-4 text-sm font-light text-pure-white">
              Drag and drop or <span className="text-pure-white/90 underline-offset-2 hover:underline">browse files</span>
            </span>
            <span className="mt-2 text-xs text-pure-white/55">
              {imagesOnly ? "PNG, JPEG, WebP" : "PDF, PNG, JPEG"} — max 10 MB
            </span>
          </label>
        )}
      </div>

      {hasError && value?.error ? (
        <p className="mt-2 text-xs text-pure-white/85">{value.error}</p>
      ) : null}
    </div>
  );
}
