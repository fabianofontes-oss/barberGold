import React, { useState } from 'react';

interface SecureSecretInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SecureSecretInput = ({
  value,
  onChange,
  placeholder = 'Enter secret key',
  className
}: SecureSecretInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // If value exists in parent props, we treat it as configured.
  // We do NOT display it in the 'value' attribute to prevent exposure in DOM/Inspect Element.
  const hasValue = !!value && value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsDirty(true);
    onChange(e.target.value);
  };

  return (
    <input
      type="password"
      // If user has interacted, show their input. Otherwise show nothing (preventing read-back of secret)
      value={isDirty ? inputValue : ''}
      onChange={handleChange}
      placeholder={hasValue && !isDirty ? '•••••••• (Configured)' : placeholder}
      className={className}
      autoComplete="new-password" // prevent browser autocomplete for secrets
      data-lpignore="true" // ignore LastPass
    />
  );
};
