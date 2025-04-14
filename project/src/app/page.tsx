import { FileUploader } from "@/components/layouts/file-uploader";

export default function Home() {
  return (
    <main className="container max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">CNAB file uploader</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FileUploader maxSize={5 * 1024 * 1024} />
      </div>
    </main>
  );
}
