import { Upload } from "lucide-react";
import { cn } from "../../lib/utils";

export default function DragAndDropFile({
  fileInputRef,
  handleDragLeave,
  handleDragOver,
  isDragging,
  uploading,
  handleDrop,
  disbabled,
  handleFileChange,
}: {
  isDragging: boolean;
  uploading: boolean;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  fileInputRef: any;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disbabled: boolean;
}) {
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        uploading || disbabled ? "pointer-events-none opacity-60" : ""
      )}
      data-testid="drag-drop-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple={false}
        accept={".txt"}
        disabled={uploading || disbabled}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload
          className="h-10 w-10 text-muted-foreground"
          data-testid="upload-icon"
        />
        <h3 className="text-lg font-semibold">
          Puxe e solte seu arquivo .txt aqui
        </h3>
        <p className="text-sm text-muted-foreground">
          ou{" "}
          <span className="text-primary font-medium">faça o upload aqui</span>
        </p>
      </div>
    </div>
  );
}
