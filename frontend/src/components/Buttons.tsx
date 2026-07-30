import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  loading,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`h-12 px-6 rounded-[16px] bg-gold hover:bg-gold-light text-[#0F172A] font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm hover:shadow shadow-gold/10 ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  loading,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`h-12 px-6 rounded-[16px] bg-white border border-[#E5E7EB] hover:border-gold text-[#0F172A] hover:bg-slate-50 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export const SuccessButton: React.FC<ButtonProps> = ({
  children,
  loading,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`h-12 px-6 rounded-[16px] bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export const DangerButton: React.FC<ButtonProps> = ({
  children,
  loading,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`h-12 px-6 rounded-[16px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
