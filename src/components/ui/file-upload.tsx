import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, File, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onUpload: (url: string) => void;
    value?: string;
    accept?: Record<string, string[]>;
    maxSize?: number; // in bytes
    className?: string;
    folder?: string;
}

export default function FileUpload({
    onUpload,
    value,
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize = 5 * 1024 * 1024, // 5MB
    className,
    folder = "uploads"
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const { toast } = useToast();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            const response = await api.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percentCompleted);
                },
            });

            const { url } = response.data.data;
            onUpload(url);
            toast({ title: "Success", description: "File uploaded successfully." });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "Could not upload file. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    }, [onUpload, folder, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpload("");
    };

    return (
        <div className={cn("w-full", className)}>
            {value ? (
                <div className="relative group rounded-lg border overflow-hidden bg-muted/50 aspect-video flex items-center justify-center">
                    {/* Simple preview logic: Check extension or assume image if accept is image */}
                    <img
                        src={value}
                        alt="Uploaded file"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            // Fallback for non-images
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('flex-col', 'gap-2');
                        }}
                    />
                    <div className="hidden group-hover:flex absolute inset-0 bg-black/50 items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={handleRemove}>
                            <X className="mr-2 h-4 w-4" /> Remove
                        </Button>
                    </div>

                    {/* Fallback Icon if Image Fails (handled via error class manipulation or separate check) */}
                    {/* For simplicity we assume image usually works or user sees broken image icon */}
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors h-48",
                        isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
                    )}
                >
                    <input {...getInputProps()} />

                    {isUploading ? (
                        <div className="w-full max-w-xs space-y-4 text-center">
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-3 bg-muted rounded-full mb-3">
                                <CloudUpload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">
                                {isDragActive ? "Drop the file here" : "Click or drag to upload"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Max size: {Math.round(maxSize / 1024 / 1024)}MB
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
