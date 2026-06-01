export function ProfileField({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-secondary-400">{label}</p>
      <p className="break-words text-sm font-medium text-secondary-800">{value}</p>
    </div>
  )
}
