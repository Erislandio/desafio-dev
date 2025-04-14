import { File, X } from "lucide-react";
import { Button } from "../ui/button";

export default function FileList({
  files,
  onRemove,
  uploading,
}: {
  files: File[];
  onRemove: (index: number) => void;
  uploading: boolean;
}) {
  if (!files.length) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium mt-4">
        Arquivo selecionado ({files.length})
      </h4>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-muted/40 p-2 rounded-md mb-4"
          >
            <div className="flex items-center space-x-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remover arquivo</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
