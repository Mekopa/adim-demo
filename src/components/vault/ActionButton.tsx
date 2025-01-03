// ActionButton.tsx
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  icon: JSX.Element;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, ariaLabel, icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`p-2 rounded-xl transition-colors ${
      disabled
        ? 'text-deactivate cursor-default'
        : 'text-primary hover:bg-[#2c2c2e] cursor-pointer'
    }`}
  >
    {icon}
  </button>
);

export default React.memo(ActionButton);