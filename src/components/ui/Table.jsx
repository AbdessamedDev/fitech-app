export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto bg-secondary-50 rounded-lg border border-secondary-200 shadow-sm ${className}`}>
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead className={`border-b border-secondary-200 ${className}`}>
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

export function TableRow({ children, className = '', isHeader = false, onClick = null, selected = false }) {
  return (
    <tr
      className={`transition-colors border-b border-secondary-100 last:border-b-0 ${onClick ? 'cursor-pointer' : ''} ${selected ? 'bg-primary-50 hover:bg-primary-50' : (isHeader ? 'bg-secondary-50' : 'bg-secondary-50 hover:bg-secondary-100')} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className = '' }) {
  return (
    <th className={`px-4 py-2 text-left text-base font-semibold text-secondary-500 whitespace-nowrap ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-4 py-2 text-sm text-secondary-500 whitespace-nowrap ${className}`}>
      {children}
    </td>
  )
}
