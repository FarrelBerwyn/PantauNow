import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', disabled, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50';

    const variantClasses = {
      primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-600/25 border border-primary-500/30',
      secondary: 'bg-surface-800 hover:bg-surface-700 text-surface-100 border border-white/10 shadow-sm',
      outline: 'bg-transparent hover:bg-surface-800/80 text-surface-200 hover:text-white border border-white/15',
      ghost: 'bg-transparent hover:bg-surface-800/60 text-surface-300 hover:text-white',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 border border-rose-500/30',
    }[variant];

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5 min-h-[36px]',
      md: 'h-10 px-4 text-xs gap-2 min-h-[44px]',
      lg: 'h-12 px-5 text-sm gap-2.5 min-h-[48px]',
      icon: 'h-10 w-10 p-0 text-sm min-h-[44px] min-w-[44px]',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
