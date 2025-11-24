import React from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { FieldError } from 'react-hook-form';

/**
 * Props for the ImagePreviewFileUpload component
 */
interface ImagePreviewFileUploadProps {
    /** 
     * Array of uploaded File objects to display
     * @example uploadedFiles={watchPhoto ? [watchPhoto] : []}
     */
    uploadedFiles: File[];

    /** 
     * Callback fired when files are added or removed
     * @param files - Array of File objects (empty array if all removed)
     * @example onFilesChange={(files) => setValue('photo', files[0])}
     */
    onFilesChange: (files: File[]) => void;

    /** 
     * MIME types accepted by the file input
     * @default "image/*,.pdf"
     * @example accept="image/jpeg,image/png,image/jpg"
     */
    accept?: string;

    /** 
     * Whether to allow multiple file uploads
     * @default true
     * @remarks Set to false for single file uploads (photo, signature)
     */
    multiple?: boolean;

    /** 
     * Label displayed above the upload area
     * @example label="Profile Photo"
     */
    label: string;

    /** 
     * Text shown inside the upload area
     * @example uploadText="Upload your passport size photograph"
     */
    uploadText: string;

    /** 
     * Supported file formats description (display only)
     * @example supportedFormats="JPEG, PNG"
     */
    supportedFormats: string;

    /** 
     * Maximum file size description (display only, validation done in schema)
     * @default "10MB"
     * @example maxSize="2MB"
     */
    maxSize?: string;

    /** 
     * Additional CSS classes for the container
     * @default ""
     */
    className?: string;

    /** 
     * Color theme for the upload button text
     * @default "red"
     */
    uploadButtonColor?: 'red' | 'green' | 'blue';

    /** 
     * Unique ID for the file input element
     * @default "file-upload"
     * @remarks IMPORTANT: Provide unique IDs when using multiple instances on the same page
     * @example id="photo-upload" for first instance, id="signature-upload" for second
     */
    id?: string;

    /** 
     * React Hook Form error object for validation display
     * @default null
     * @example error={errors.photo}
     */
    error?: FieldError | null;
}

/**
 * ImagePreviewFileUpload Component
 * 
 * A customizable file upload component with image preview functionality,
 * designed for React Hook Form integration.
 * 
 * @component
 * 
 * @example
 * // Basic usage with React Hook Form
 * ```tsx
 * const { setValue, watch, formState: { errors } } = useForm();
 * const watchPhoto = watch("photo");
 * 
 * <ImagePreviewFileUpload
 *   id="photo-upload"
 *   label="Photo"
 *   uploadText="Upload your photo"
 *   supportedFormats="JPEG, PNG"
 *   maxSize="2MB"
 *   multiple={false}
 *   accept="image/jpeg,image/png,image/jpg"
 *   uploadedFiles={watchPhoto ? [watchPhoto] : []}
 *   onFilesChange={(files) => {
 *     if (files.length > 0) {
 *       setValue('photo', files[0]);
 *     } else {
 *       setValue('photo', undefined);
 *     }
 *   }}
 *   error={errors.photo}
 * />
 * ```
 * 
 * @features
 * - Live image preview inside dashed border
 * - Single or multiple file uploads
 * - File removal with X button
 * - React Hook Form validation integration
 * - Responsive design
 * 
 * @remarks
 * When using multiple instances on the same page, ALWAYS provide unique `id` props
 * to avoid conflicts between file inputs.
 * 
 * @see {@link /docs/components/ImagePreviewFileUpload.md} for full documentation
 */
const ImagePreviewFileUpload: React.FC<ImagePreviewFileUploadProps> = React.forwardRef<HTMLInputElement, ImagePreviewFileUploadProps>(({
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
    id = 'file-upload',
    error = null

}, ref) => {
    const colorClasses = {
        red: 'text-red-500 hover:text-red-600',
        green: 'text-green-500 hover:text-green-600',
        blue: 'text-blue-500 hover:text-blue-600'
    };

    /**
     * Handles file input change event
     * - If multiple is false, only takes the first file
     * - Calls onFilesChange with the file array
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // If multiple is false, only take the first file
            const files = multiple ? Array.from(e.target.files) : [e.target.files[0]];
            onFilesChange(files);
        }
    };

    /**
     * Removes a file from the uploaded files array
     * @param index - Index of the file to remove
     */
    const removeFile = (index: number) => {
        onFilesChange(uploadedFiles.filter((_, i) => i !== index));
    };

    // For single file mode, get the first file or null
    const uploadedFile = uploadedFiles.length > 0 ? uploadedFiles[0] : null;

    return (
        <div className={`space-y-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-900">
                {label}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input
                    ref={ref}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    id={id}
                />

                {/* Show preview inside dashed border if file uploaded */}
                {uploadedFile ? (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => removeFile(0)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1.5 shadow-md border border-gray-200 z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {uploadedFile.type.startsWith('image/') ? (
                            <div className="space-y-3">
                                <img
                                    src={URL.createObjectURL(uploadedFile)}
                                    alt={uploadedFile.name}
                                    className="w-full max-h-64 object-contain rounded-lg mx-auto"
                                />
                                <div className="flex items-center justify-center text-green-600">
                                    <Image className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">
                                        {uploadedFile.name}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                                    <FileText className="w-12 h-12 text-gray-500" />
                                </div>
                                <div className="flex items-center justify-center text-blue-600">
                                    <FileText className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Show upload prompt if no file */
                    <label htmlFor={id} className="cursor-pointer block">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className={`font-medium ${colorClasses[uploadButtonColor]}`}>
                            {uploadText}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {supportedFormats} up to {maxSize}
                        </p>
                    </label>
                )}
            </div>

            {error && (
                <div className="mt-2 text-sm bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    );
});

ImagePreviewFileUpload.displayName = 'ImagePreviewFileUpload';

export default ImagePreviewFileUpload;
