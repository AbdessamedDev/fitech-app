export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead className={className} style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid', borderBottomColor: 'var(--border)' }}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '', isHeader = false, onClick = null }) {
  return (
    <tr
      className={`transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        borderBottom: '1px solid',
        borderBottomColor: 'var(--border)'
      }}
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className = '' }) {
  return (
    <th className={`px-6 py-4 text-left text-sm font-semibold ${className}`} style={{ color: 'var(--foreground-secondary)' }}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-sm ${className}`} style={{ color: 'var(--foreground-secondary)' }}>
      {children}
    </td>
  )
}
