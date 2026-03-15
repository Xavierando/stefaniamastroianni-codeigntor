import React from "react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

interface ConfirmDeleteButtonProps extends ButtonProps {
  confirmMessage?: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteButton({ 
  confirmMessage = "Sei sicuro di voler eliminare questo elemento? L'operazione è irreversibile.", 
  children, 
  title,
  isDeleting = false,
  onClick,
  ...props
}: ConfirmDeleteButtonProps) {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.confirm(confirmMessage)) {
      if (onClick) onClick(e);
    } else {
      e.preventDefault();
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
