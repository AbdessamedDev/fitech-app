export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-300 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}