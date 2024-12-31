import React, { useState, useEffect, useRef } from 'react';

interface RenameInputProps {
  initialName: string;
  onRename: (newName: string) => void;
  onCancel: () => void;
  validate?: (name: string) => string | undefined;
}

export default function RenameInput({ 
  initialName, 
  onRename, 
  onCancel,
  validate 
}: RenameInputProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Name cannot be empty');
      return;
    }

    const validationError = validate?.(trimmedName);
    if (validationError) {
      setError(validationError);
      return;
    }

    onRename(trimmedName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onCancel}
        className={`w-full px-2 py-1 bg-gray-800 border rounded focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-blue-500 focus:ring-blue-500'
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </form>
  );
}