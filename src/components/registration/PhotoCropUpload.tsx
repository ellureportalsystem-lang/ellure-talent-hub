import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

interface PhotoCropUploadProps {
  currentUrl?: string | null;
  initials: string;
  onCropped: (file: File) => void;
}

export function PhotoCropUpload({ currentUrl, initials, onCropped }: PhotoCropUploadProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Max 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getCroppedFile = useCallback(async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const px = (crop.unit === "%" ? (crop.width / 100) * image.width : crop.width) * scaleX;
    const py = (crop.unit === "%" ? (crop.height / 100) * image.height : crop.height) * scaleY;
    const px0 = (crop.unit === "%" ? (crop.x / 100) * image.width : crop.x) * scaleX;
    const py0 = (crop.unit === "%" ? (crop.y / 100) * image.height : crop.y) * scaleY;
    canvas.width = px;
    canvas.height = py;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(image, px0, py0, px, py, 0, 0, px, py);
    return new Promise<File | undefined>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(undefined);
        resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.92);
    });
  }, [crop]);

  const applyCrop = async () => {
    setProcessing(true);
    const file = await getCroppedFile();
    if (file) onCropped(file);
    setSrc(null);
    setProcessing(false);
  };

  return (
    <div className="space-y-3">
      <Label>Profile Photo</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentUrl || undefined} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <Label className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted text-sm">
            <Upload className="h-4 w-4" /> Upload photo
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={onSelect} />
        </Label>
      </div>
      {src && (
        <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
          <ReactCrop crop={crop} onChange={setCrop} aspect={1}>
            <img ref={imgRef} src={src} alt="Crop" onLoad={(e) => {
              const { width, height } = e.currentTarget;
              setCrop(centerAspectCrop(width, height));
            }} className="max-h-64 mx-auto" />
          </ReactCrop>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={applyCrop} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Use this photo"}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setSrc(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
