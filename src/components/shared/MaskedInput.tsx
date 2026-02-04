import React, { useState, useEffect } from 'react';
import { phoneMask, cepMask, instagramMask, whatsappMask, fetchAddressByCep, ViaCepResponse } from '@/lib/masks';

interface MaskedInputProps {
  type: 'phone' | 'cep' | 'instagram' | 'whatsapp';
  value: string;
  onChange: (value: string) => void;
  onAddressFetched?: (address: ViaCepResponse) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  id?: string;
}

export const MaskedInput: React.FC<MaskedInputProps> = ({
  type,
  value,
  onChange,
  onAddressFetched,
  placeholder,
  className = '',
  icon,
  disabled = false,
  id
}) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  const applyMask = (inputValue: string): string => {
    switch (type) {
      case 'phone':
        return phoneMask(inputValue);
      case 'cep':
        return cepMask(inputValue);
      case 'instagram':
        return instagramMask(inputValue);
      case 'whatsapp':
        return whatsappMask(inputValue);
      default:
        return inputValue;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyMask(e.target.value);
    onChange(maskedValue);
  };

  // Auto-fetch address when CEP is complete
  useEffect(() => {
    if (type === 'cep' && value.replace(/\D/g, '').length === 8 && onAddressFetched) {
      setIsLoadingCep(true);
      setCepError('');
      
      fetchAddressByCep(value)
        .then((address) => {
          if (address) {
            onAddressFetched(address);
            setCepError('');
          } else {
            setCepError('CEP não encontrado');
          }
        })
        .catch(() => {
          setCepError('Erro ao buscar CEP');
        })
        .finally(() => {
          setIsLoadingCep(false);
        });
    }
  }, [value, type, onAddressFetched]);

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        {icon && <div className="text-zinc-500">{icon}</div>}
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent text-white outline-none disabled:cursor-not-allowed"
        />
        {type === 'cep' && isLoadingCep && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent"></div>
        )}
      </div>
      {type === 'cep' && cepError && (
        <p className="text-red-400 text-xs mt-1">{cepError}</p>
      )}
    </div>
  );
};
