
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Plus, AlertCircle } from "lucide-react";

type Props = {
  uploading: boolean;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDrag: (e: React.DragEvent) => void;
  dragActive: boolean;
  isOwner: boolean;
  projectSettings: any;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export default function ProjectFileDropzone({
  uploading,
  handleFileInputChange,
  onDrop,
  onDrag,
  dragActive,
  isOwner,
  projectSettings,
  fileInputRef,
}: Props) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        dragActive ? "border-purple-400 bg-purple-50" : "border-gray-300"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Button
            disabled={uploading}
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Choose Files"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            accept="audio/*,video/*,image/*,.pdf,.txt,.doc,.docx"
            className="hidden"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Upload audio, video, images, documents, and more
        </p>
        <p className="text-xs text-gray-400">
          Drag and drop files here or click to browse
        </p>
        {projectSettings?.version_approval_enabled && !isOwner && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Files with the same name will replace existing files after confirmation.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
