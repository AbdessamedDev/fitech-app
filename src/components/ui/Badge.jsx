export function Badge({ children, variant = 'default', className = '' }) {
  const getVariantStyle = (variant) => {
    switch(variant) {
      case 'active':
        return {
          backgroundColor: '#D1FAE5',
          color: '#065F46'
        }
      case 'pending':
        return {
          backgroundColor: '#FEF3C7',
          color: '#92400E'
        }
      case 'suspended':
        return {
          backgroundColor: '#FEE2E2',
          color: '#991B1B'
        }
      default:
        return {
          backgroundColor: 'var(--surface)',
          color: 'var(--foreground-secondary)'
        }
    }
  }

  const style = getVariantStyle(variant)

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${className}`} style={style}>
      {children}
    </span>
  )
}
