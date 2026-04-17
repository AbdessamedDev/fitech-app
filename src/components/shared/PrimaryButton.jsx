export function PrimaryButton({ children, onClick, icon: Icon, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-900 active:scale-95 transition-all shadow-[0_4px_16px_rgba(105,66,255,0.3)] text-[14px] whitespace-nowrap group shrink-0 ${className}`}
      {...props}
    >
      {Icon && <Icon size={20} weight="bold" className="group-hover:rotate-90 transition-transform duration-300" />}
      {children}
    </button>
  )
}
