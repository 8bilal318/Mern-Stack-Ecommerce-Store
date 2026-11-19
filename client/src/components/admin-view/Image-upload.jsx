import { FileIcon, UploadCloudIcon, XIcon, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/products/upload-image`,
        data,
        { withCredentials: true },
      );

      if (response?.data?.success) {
        setUploadedImageUrl(
          response.data.result.secure_url || response.data.result.url,
        );
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Image upload request failed",
      );
      setUploadedImageUrl(null);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`mt-4 w-full ${isCustomStyling ? "" : "mx-auto max-w-md"}`}>
      <Label className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-orange-500/80">
        Product Media
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="rounded-[28px] border border-zinc-800 bg-zinc-950 p-3 shadow-2xl transition-all"
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="group flex h-40 cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-zinc-800 bg-zinc-900/50 px-6 text-center transition-all hover:border-orange-600/50 hover:bg-zinc-900"
          >
            <div className="mb-3 rounded-full bg-orange-600/10 p-3 text-orange-500 transition-transform group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white">
              <UploadCloudIcon className="h-8 w-8" />
            </div>
            <span className="text-sm font-black uppercase italic tracking-tighter text-white">
              {isEditMode ? "Replace Product Image" : "Upload Product Image"}
            </span>
            <span className="mt-2 text-[10px] font-medium text-zinc-500 uppercase tracking-tight">
              Drag & Drop or click to browse
            </span>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-[22px] border border-orange-600/20 bg-zinc-900 text-sm font-bold text-orange-500">
            <Loader2 className="mb-2 h-8 w-8 animate-spin" />
            <span className="uppercase tracking-widest text-[10px]">Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-[22px] border border-zinc-800 bg-zinc-900 p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-600/20 p-2">
                <FileIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <p className="max-w-[150px] truncate text-sm font-black text-white uppercase italic tracking-tighter">
                  {imageFile.name}
                </p>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Ready to save</span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-zinc-950 text-zinc-500 hover:bg-red-600 hover:text-white transition-all shadow-lg"
              onClick={handleRemoveImage}
            >
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;