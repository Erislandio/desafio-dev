"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn, fileToTransactions } from "@/lib/utils";
import DragAndDropFile from "./file-drag-drop";
import FileList from "./files-list";
import TransactionTable from "./result-table";
import UploadProgress from "./upload-progress";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onUpload?: (files: File[]) => Promise<void>;
  maxSize?: number;
}

export interface Transation {
  name: string;
  cardNumber: string;
  document: string;
  value: number;
  date: string;
  hour: string;
  type: string;
  owner: string;
  debits: number;
  credits: number;
  transactions: Transation[];
}

export function FileUploader({
  onUpload,
  className,
  maxSize = 1024,
  ...props
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [transactions, setTransaction] = useState<Transation[]>([]);

  useEffect(() => {
    if (files.length === 0) return;

    const readAllFiles = async () => {
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e?.target?.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });
      });

      try {
        const results = (await Promise.all(promises)) as string[];
        const transactions = fileToTransactions(results[0]) as Transation[];

        setTransaction((prev) => [...prev, ...transactions]);
      } catch {
        setError(`Erro ao ler arquivos: ${files.pop()?.name}`);
      }
    };

    readAllFiles();
  }, [files]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFiles = (fileList: FileList | null): File[] => {
    if (!fileList) return [];

    setError(null);
    const validFiles: File[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.size > maxSize) {
        setError(
          `o arquivo "${file.name}" exedeu o tamanho máximo de ${
            maxSize / (1024 * 1024)
          }MB`
        );
        return;
      }

      if (!file.name.endsWith(".txt") || !file.name.includes(".txt")) {
        return setError(`o Arquivo ${file.name} não é válido!`);
      }

      validFiles.push(file);
    });

    return validFiles;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const validFiles = validateFiles(e.dataTransfer.files);
    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = validateFiles(e.target.files);

    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    if (onUpload) {
      await onUpload(files);
    }

    setProgress(100);

    setTimeout(() => {
      setFiles([]);
      setUploading(false);
      setProgress(0);
    }, 1000);
  };

  const removeFile = (index: number) => {
    setTransaction([]);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <DragAndDropFile
        fileInputRef={fileInputRef}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        isDragging={isDragging}
        uploading={uploading}
        handleFileChange={handleFileChange}
        disbabled={files.length > 0}
      />

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <FileList files={files} onRemove={removeFile} uploading={uploading} />
      <TransactionTable transactions={transactions} />

      <UploadProgress progress={progress} uploading={uploading} />

      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
        >
          {uploading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
