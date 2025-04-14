import { Progress } from "@radix-ui/react-progress";

export default function UploadProgress({
  progress,
  uploading,
}: {
  progress: number;
  uploading: boolean;
}) {
  if (!uploading) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>Em progresso...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
