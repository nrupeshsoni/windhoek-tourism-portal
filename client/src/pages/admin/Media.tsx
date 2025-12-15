import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function AdminMedia() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    mediaType: "photo" as "photo" | "video" | "vr",
    file: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: media, isLoading } = trpc.admin.media.list.useQuery();

  const uploadMutation = trpc.admin.media.upload.useMutation({
    onSuccess: () => {
      toast.success("Media uploaded successfully");
      utils.admin.media.list.invalidate();
      closeUploadDialog();
    },
    onError: (error) => {
      toast.error(`Failed to upload media: ${error.message}`);
    },
  });

  const deleteMutation = trpc.admin.media.delete.useMutation({
    onSuccess: () => {
      toast.success("Media deleted successfully");
      utils.admin.media.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete media: ${error.message}`);
    },
  });

  const closeUploadDialog = () => {
    setIsUploadDialogOpen(false);
    setUploadData({
      title: "",
      description: "",
      mediaType: "photo",
      file: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadData.file) {
      toast.error("Please select a file");
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(",")[1]; // Remove data:image/jpeg;base64, prefix

      uploadMutation.mutate({
        title: uploadData.title,
        description: uploadData.description,
        mediaType: uploadData.mediaType,
        fileData: base64Data,
        fileName: uploadData.file!.name,
        mimeType: uploadData.file!.type,
      });
    };
    reader.readAsDataURL(uploadData.file);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this media?")) {
      deleteMutation.mutate({ id });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Media Library</h1>
            <p className="text-muted-foreground mt-2">
              Manage photos, videos, and VR content
            </p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media?.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden group">
                <div className="aspect-video bg-muted relative">
                  {item.mediaType === "photo" && item.fileUrl && (
                    <img
                      src={item.fileUrl}
                      alt={item.altText || item.title || "Media"}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {item.mediaType === "video" && (
                    <div className="w-full h-full flex items-center justify-center bg-black/10">
                      <span className="text-4xl">🎥</span>
                    </div>
                  )}
                  {item.mediaType === "vr" && (
                    <div className="w-full h-full flex items-center justify-center bg-black/10">
                      <span className="text-4xl">🥽</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium truncate">{item.title || "Untitled"}</h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {item.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span className="capitalize">{item.mediaType}</span>
                    <span>{formatFileSize(item.fileSize || 0)}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!media || media.length === 0) && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No media uploaded yet. Upload your first media file to get started.
              </div>
            )}
          </div>
        )}

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleUpload}>
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
                <DialogDescription>
                  Upload photos, videos, or VR content
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="mediaType">Media Type</Label>
                  <Select
                    value={uploadData.mediaType}
                    onValueChange={(value: any) =>
                      setUploadData({ ...uploadData, mediaType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="vr">VR Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={
                      uploadData.mediaType === "photo"
                        ? "image/*"
                        : uploadData.mediaType === "video"
                        ? "video/*"
                        : "*"
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeUploadDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
