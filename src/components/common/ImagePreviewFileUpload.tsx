import React from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';

interface ImagePreviewFileUploadProps {
    uploadedFiles: File[];
    onFilesChange: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    label: string;
    uploadText: string;
    supportedFormats: string;
    maxSize?: string;
    className?: string;
    uploadButtonColor?: 'red' | 'green' | 'blue';
    id?: string;
}

const ImagePreviewFileUpload: React.FC<ImagePreviewFileUploadProps> = ({
    uploadedFiles,
    onFilesChange,
    accept = "image/*,.pdf",
    multiple = true,
    label,
    uploadText,
    supportedFormats,
    maxSize = "10MB",
    className = "",
    uploadButtonColor = 'red',
    id = 'file-upload'
}) => {
    const colorClasses = {
        red: 'text-red-500 hover:text-red-600',
        green: 'text-green-500 hover:text-green-600',
        blue: 'text-blue-500 hover:text-blue-600'
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFilesChange(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        onFilesChange(uploadedFiles.filter((_, i) => i !== index));
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-900">
                {label}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    id={id}
                />
                <label htmlFor={id} className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className={`font-medium ${colorClasses[uploadButtonColor]}`}>
                        {uploadText}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {supportedFormats} up to {maxSize}
                    </p>
                </label>
            </div>

            {/* File Preview */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">
                        Uploaded Files ({uploadedFiles.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 relative border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {file.type.startsWith('image/') ? (
                                    <div className="space-y-2">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex items-center text-green-600">
                                            <Image className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-medium">
                                                {accept.includes('.pdf') ? 'Image' : 'Photo'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                                        <div className="text-center">
                                            <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                            <div className="flex items-center text-blue-600">
                                                <FileText className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">PDF</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-gray-600 mt-2 truncate" title={file.name}>
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagePreviewFileUpload;
