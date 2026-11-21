import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-accent text-[#0A0D14] hover:bg-accent-light font-semibold shadow-card',
    accent: 'bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25',
    secondary: 'bg-panel-subtle text-text border border-border hover:border-border-active hover:bg-panel',
    ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-panel-subtle',
    danger: 'bg-topic-calamity/15 text-topic-calamity border border-topic-calamity/30 hover:bg-topic-calamity/25',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg min-h-[32px]',
    md: 'text-sm px-3.5 py-2 rounded-xl min-h-[38px]',
    lg: 'text-base px-5 py-2.5 rounded-xl min-h-[44px]',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};
