export function ProfileActionButton({ children, icon: Icon, variant = 'primary', className = '', ...props }) {
  const styles =
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-[0_8px_18px_rgba(105,66,255,0.18)]'
      : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300 hover:shadow-[0_8px_18px_rgba(105,66,255,0.10)]'

  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${styles} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} weight="bold" />}
      <span>{children}</span>
    </button>
  )
}
