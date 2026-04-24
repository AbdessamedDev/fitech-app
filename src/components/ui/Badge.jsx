import { Check, X, Clock } from 'lucide-react'

export function Badge({ status, variant, className = '' }) {
  const currentStatus = status || variant || 'default'
  
  const getVariantStyles = (v) => {
    switch(v?.toLowerCase()) {
      case 'active':
        return {
          classes: 'bg-success-bg text-success border-success/40',
          Icon: Check
        }
      case 'pending':
        return {
          classes: 'bg-secondary-200 text-secondary-600 border-secondary-300',
          Icon: Clock
        }
      case 'suspended':
        return {
          classes: 'bg-error-bg text-error border-error/40',
          Icon: X
        }
      default:
        return {
          classes: 'bg-secondary-100 text-secondary-600 border-secondary-200',
          Icon: Clock
        }
    }
  }

  const { classes, Icon } = getVariantStyles(currentStatus)

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${classes} ${className}`}>
      <Icon size={12} strokeWidth={3} />
      {currentStatus}
    </span>
  )
}
