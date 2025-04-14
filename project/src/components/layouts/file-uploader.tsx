"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";

import { fileToTransactions } from "../../lib/utils";
import { Button } from "../ui/button";
import DragAndDropFile from "./file-drag-drop";
import FileList from "./files-list";
import TransactionTable from "./result-table";

import { toast } from "sonner";

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

const maxSize = 5 * 1024 * 1024;

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
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

    await fetch(`/api/transactions`, {
      method: "POST",
      body: JSON.stringify({
        transactions: transactions.map((item) => ({
          name: item.name,
          cardNumber: item.cardNumber,
          document: item.document,
          value: item.value,
          date: item.date,
          hour: item.hour,
          type: item.type,
          owner: item.owner,
        })),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTimeout(() => {
      setFiles([]);
      setUploading(false);
      setTransaction([]);
      toast("Sucesso!", {
        description: "Os dados foram enviados com sucesso!",
        duration: 3000,
      });
    }, 1000);
  };

  const removeFile = (index: number) => {
    setTransaction([]);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
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

      <div className="flex justify-end mt-4">
        <Button
          className="cursor-pointer"
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
        >
          {uploading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
