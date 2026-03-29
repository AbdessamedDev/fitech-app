export function Input({ className = '', ...props }) {
  return (
    <input
      className={`border transition-all duration-200 
      border-secondary-300
      focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-50
      ${className}`}
      {...props}
    />
  )
}