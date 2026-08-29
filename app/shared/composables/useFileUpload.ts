import { ref, computed } from "vue";

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
  onUpload?: (file: File) => void;
  onError?: (error: string) => void;
  onRemove?: (file: File) => void;
}

export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  uploadedAt: Date;
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/*"],
    multiple = false,
    onUpload,
    onError,
    onRemove,
  } = options;

  // State
  const files = ref<UploadedFile[]>([]);
  const isUploading = ref(false);
  const uploadProgress = ref(0);
  const error = ref<string | null>(null);

  // Computed
  const hasFiles = computed(() => files.value.length > 0);
  const totalSize = computed(() =>
    files.value.reduce((total, file) => total + file.size, 0)
  );
  const canUploadMore = computed(() => multiple || files.value.length === 0);

  // File validation
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }

    // Check file type
    if (allowedTypes.length > 0) {
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type must be one of: ${allowedTypes.join(", ")}`;
      }
    }

    return null;
  };

  // File processing
  const processFile = (file: File): UploadedFile => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      file,
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    };
  };

  // Create preview URL for images
  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = e => {
          resolve(e.target?.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        reject(new Error("File is not an image"));
      }
    });
  };

  // Upload file
  const uploadFile = async (file: File): Promise<UploadedFile> => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      error.value = validationError;
      if (onError) {
        onError(validationError);
      }
      throw new Error(validationError);
    }

    // Check if we can upload more files
    if (!canUploadMore.value) {
      const errorMsg = "Cannot upload more files";
      error.value = errorMsg;
      if (onError) {
        onError(errorMsg);
      }
      throw new Error(errorMsg);
    }

    // Clear previous error
    error.value = null;

    // Process file
    const uploadedFile = processFile(file);

    // Create preview if it's an image
    try {
      uploadedFile.preview = await createPreview(file);
    } catch {
      // Not an image or error creating preview, continue without preview
    }

    // Add to files list
    if (multiple) {
      files.value.push(uploadedFile);
    } else {
      files.value = [uploadedFile];
    }

    // Call upload callback
    if (onUpload) {
      onUpload(file);
    }

    return uploadedFile;
  };

  // Upload multiple files
  const uploadFiles = async (fileList: FileList): Promise<UploadedFile[]> => {
    isUploading.value = true;
    uploadProgress.value = 0;

    try {
      const results: UploadedFile[] = [];
      const filesArray = Array.from(fileList);

      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        if (file) {
          const result = await uploadFile(file);
          results.push(result);
        }

        // Update progress
        uploadProgress.value = ((i + 1) / filesArray.length) * 100;
      }

      return results;
    } finally {
      isUploading.value = false;
      uploadProgress.value = 0;
    }
  };

  // Remove file
  const removeFile = (fileId: string): boolean => {
    const index = files.value.findIndex(f => f.id === fileId);
    if (index !== -1) {
      const file = files.value[index];
      if (file) {
        files.value.splice(index, 1);

        if (onRemove) {
          onRemove(file.file);
        }
      }

      return true;
    }
    return false;
  };

  // Clear all files
  const clearFiles = (): void => {
    files.value.forEach(file => {
      if (file && onRemove) {
        onRemove(file.file);
      }
    });
    files.value = [];
  };

  // Get file by ID
  const getFile = (fileId: string): UploadedFile | undefined => {
    return files.value.find(f => f.id === fileId);
  };

  // Check if file exists
  const hasFile = (fileId: string): boolean => {
    return files.value.some(f => f.id === fileId);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file size formatted
  const getFormattedFileSize = (file: UploadedFile): string => {
    return formatFileSize(file.size);
  };

  // Check if file is image
  const isImage = (file: UploadedFile): boolean => {
    return file.type.startsWith("image/");
  };

  // Get file extension
  const getFileExtension = (file: UploadedFile): string => {
    return file.name.split(".").pop()?.toLowerCase() || "";
  };

  return {
    // State
    files: readonly(files),
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    error: readonly(error),

    // Computed
    hasFiles,
    totalSize,
    canUploadMore,

    // Actions
    uploadFile,
    uploadFiles,
    removeFile,
    clearFiles,

    // Utilities
    getFile,
    hasFile,
    validateFile,
    formatFileSize,
    getFormattedFileSize,
    isImage,
    getFileExtension,
  };
}
