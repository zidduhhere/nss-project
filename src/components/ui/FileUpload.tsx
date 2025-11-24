import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Camera, AlertCircle } from 'lucide-react';

interface FileUploadProps {
    onFilesChange: (files: File[]) => void;
    acceptedTypes?: string;
    maxFileSize?: number; // in MB
    maxFiles?: number;
    multiple?: boolean;
    label?: string;
    error?: string;
    requirements?: string[];
    className?: string;
}

interface PreviewFile {
    file: File;
    preview: string;
    type: 'image' | 'document';
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFilesChange,
    acceptedTypes = "image/*,.pdf",
    maxFileSize = 5,
    maxFiles = 10,
    multiple = true,
    label,
    error,
    requirements = [],
    className = ""
}) => {
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        // Check file type
        const isImage = file.type.startsWith('image/');
        const isPDF = file.type === 'application/pdf';

        if (!isImage && !isPDF) {
            return 'Only images (PNG, JPG, JPEG) and PDF files are allowed';
        }

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
            return `File size should be less than ${maxFileSize}MB`;
        }

        return null;
    };

    const processFiles = (fileList: FileList) => {
        const newFiles: PreviewFile[] = [];
        const errors: string[] = [];

        Array.from(fileList).forEach(file => {
            const validation = validateFile(file);
            if (validation) {
                errors.push(`${file.name}: ${validation}`);
                return;
            }

            if (!multiple && files.length + newFiles.length >= 1) {
                errors.push('Only one file is allowed');
                return;
            }

            if (files.length + newFiles.length >= maxFiles) {
                errors.push(`Maximum ${maxFiles} files allowed`);
                return;
            }

            const isImage = file.type.startsWith('image/');

            const reader = new FileReader();
            reader.onload = (e) => {
                const previewFile: PreviewFile = {
                    file,
                    preview: e.target?.result as string,
                    type: isImage ? 'image' : 'document'
                };

                setFiles(prev => {
                    const updated = [...prev, previewFile];
                    onFilesChange(updated.map(f => f.file));
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        });

        if (errors.length > 0) {
            setUploadError(errors.join(', '));
        } else {
            setUploadError('');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
        // Reset input value to allow re-selecting the same file
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            onFilesChange(updated.map(f => f.file));
            return updated;
        });
    };

    const triggerFileInput = () => {
        inputRef.current?.click();
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium font-isans text-black mb-2">
                    {label}
                </label>
            )}

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                    ${dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${error ? 'border-red-300' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to {maxFileSize}MB
                </p>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Requirements:</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                        {requirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Error Messages */}
            {(error || uploadError) && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">
                            {error || uploadError}
                        </span>
                    </div>
                </div>
            )}

            {/* Uploaded Files */}
            {files.length > 0 && (
                <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">
                        Uploaded Files ({files.length})
                    </h4>
                    <div className="space-y-2">
                        {files.map((fileUpload, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    {fileUpload.type === 'image' ? (
                                        <div className="flex items-center">
                                            <Camera className="w-4 h-4 text-blue-500 mr-2" />
                                            <img
                                                src={fileUpload.preview}
                                                alt={fileUpload.file.name}
                                                className="w-8 h-8 object-cover rounded mr-2"
                                            />
                                        </div>
                                    ) : (
                                        <FileText className="w-4 h-4 text-red-500 mr-2" />
                                    )}
                                    <div>
                                        <span className="text-sm text-gray-700 truncate max-w-40 block">
                                            {fileUpload.file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
