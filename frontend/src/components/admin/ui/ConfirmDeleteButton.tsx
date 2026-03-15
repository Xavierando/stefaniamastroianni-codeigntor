import React from "react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

interface ConfirmDeleteButtonProps extends ButtonProps {
  confirmMessage?: string;
  isDeleting?: boolean;
  onConfirm?: () => void;
}

export function ConfirmDeleteButton({ 
  confirmMessage = "Sei sicuro di voler eliminare questo elemento? L'operazione è irreversibile.", 
  children, 
  title,
  isDeleting = false,
  onClick,
  onConfirm,
  ...props
}: ConfirmDeleteButtonProps) {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm(confirmMessage)) {
      if (onConfirm) onConfirm();
      if (onClick) onClick(e);
    }
  };

  return (
    <Button
      variant="danger"
      disabled={isDeleting || props.disabled}
      title={title}
      onClick={handleClick}
      {...props}
    >
      {isDeleting ? <span className="opacity-50 inline-block animate-pulse">{children}</span> : children}
    </Button>
  );
}
