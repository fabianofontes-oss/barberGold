'use client';

import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
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
           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                 onClick={triggerFileSelect}
                 className="bg-white text-zinc-900 text-xs font-bold px-3 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                 Change
              </button>
              <button 
                 onClick={() => onChange('')}
                 className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                 Remove
              </button>
           </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-dashed border-zinc-700 hover:border-amber-500 rounded-xl transition-all group">
           <div className="p-4 flex flex-col items-center justify-center text-center min-h-[120px]">
              
              {inputType === 'UPLOAD' ? (
                 <div onClick={triggerFileSelect} className="cursor-pointer w-full flex flex-col items-center">
                    <div className="bg-zinc-800 p-3 rounded-full mb-3 group-hover:bg-zinc-700 transition-colors text-zinc-400 group-hover:text-amber-500">
                       <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">Click to Upload Image</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG or GIF</p>
                 </div>
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

              <div className="mt-3 pt-3 border-t border-zinc-800/50 w-full flex justify-center">
                 <button 
                    onClick={() => setInputType(prev => prev === 'UPLOAD' ? 'URL' : 'UPLOAD')}
                    className="text-[10px] text-zinc-500 hover:text-amber-500 font-bold uppercase tracking-wider"
                 >
                    {inputType === 'UPLOAD' ? 'Or use URL' : 'Or Upload File'}
                 </button>
              </div>
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
