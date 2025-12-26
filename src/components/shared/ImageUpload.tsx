'use client';

import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Upload image or paste URL",
  className 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputType, setInputType] = useState<'UPLOAD' | 'URL'>('UPLOAD');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">{label}</label>}
      
      {value ? (
        <div className="relative group w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
           <img src={value} alt="Preview" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                 type="button"
                 onClick={triggerFileSelect}
                 className="bg-white text-zinc-900 text-xs font-bold px-3 py-2 rounded-lg hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              >
                 Change
              </button>
              <button 
                 type="button"
                 onClick={() => onChange('')}
                 className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              >
                 Remove
              </button>
           </div>
        </div>
      ) : (
        <div
          className={`bg-zinc-900 border border-dashed rounded-xl transition-all group ${isDragging ? 'border-amber-500 bg-zinc-800' : 'border-zinc-700 hover:border-amber-500'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
           <div className="p-4 flex flex-col items-center justify-center text-center min-h-[120px]">
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin mb-2 text-amber-500" />
                  <p className="text-sm font-medium">Processing...</p>
                </div>
              ) : inputType === 'UPLOAD' ? (
                 <button
                   type="button"
                   onClick={triggerFileSelect}
                   className="cursor-pointer w-full flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-2"
                 >
                    <div className={`bg-zinc-800 p-3 rounded-full mb-3 group-hover:bg-zinc-700 transition-colors ${isDragging ? 'text-amber-500' : 'text-zinc-400 group-hover:text-amber-500'}`}>
                       <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">Click to Upload Image</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG or GIF</p>
                 </button>
              ) : (
                 <div className="w-full">
                    <div className="flex items-center gap-2 mb-2 justify-center text-zinc-400">
                       <LinkIcon className="w-4 h-4" />
                       <span className="text-xs font-bold">External URL</span>
                    </div>
                    <input 
                       type="text" 
                       autoFocus
                       placeholder="https://example.com/image.jpg"
                       className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 outline-none"
                       onChange={(e) => onChange(e.target.value)}
                    />
                 </div>
              )}

              {!isLoading && (
                <div className="mt-3 pt-3 border-t border-zinc-800/50 w-full flex justify-center">
                   <button
                      type="button"
                      onClick={() => setInputType(prev => prev === 'UPLOAD' ? 'URL' : 'UPLOAD')}
                      className="text-[10px] text-zinc-500 hover:text-amber-500 focus:text-amber-500 focus:outline-none font-bold uppercase tracking-wider"
                   >
                      {inputType === 'UPLOAD' ? 'Or use URL' : 'Or Upload File'}
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
