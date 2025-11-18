
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, CheckCircleIcon } from './icons';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onUpload(file);
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
      />
      {preview ? (
        <div className="text-center p-4 border-2 border-dashed border-slate-300 rounded-lg">
          <img src={preview} alt="Logo Preview" className="mx-auto h-24 w-auto object-contain mb-4"/>
          <div className="flex items-center justify-center text-green-600 font-medium">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            <span>{fileName}</span>
          </div>
          <button onClick={handleClick} className="mt-2 text-sm text-sky-600 hover:text-sky-800 font-semibold">
            Change logo
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-sky-500 hover:bg-slate-50 transition-colors"
        >
          <UploadIcon className="w-12 h-12 text-slate-400 mb-3" />
          <p className="text-slate-600 font-semibold">
            <span className="text-sky-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-slate-500 mt-1">PNG, JPG, SVG, or WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
