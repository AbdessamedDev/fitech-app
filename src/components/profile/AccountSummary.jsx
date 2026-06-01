function SummaryRow({ label, value, children }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 rounded-md bg-secondary-50 px-3">
      <span className="text-xs font-medium text-secondary-500">{label}</span>
      {children || <span className="text-xs font-bold text-secondary-700">{value}</span>}
    </div>
  )
}

export function AccountSummary({ profile }) {
  return (
    <aside className="rounded-lg border border-secondary-200 bg-secondary-100 p-6 transition-all duration-300 hover:border-primary-200 hover:shadow-[0_8px_22px_rgba(105,66,255,0.08)]">
      <h3 className="mb-7 text-sm font-black uppercase tracking-[0.18em] text-secondary-500">Account Summary</h3>

      <div className="space-y-3">
        <SummaryRow label="Account Status">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-black uppercase text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {profile.status}
          </span>
        </SummaryRow>
        <SummaryRow label="Last Active" value={profile.lastActive} />
        <SummaryRow label="Created Date" value={profile.createdAt} />
      </div>

      <div className="my-7 h-px bg-secondary-200" />

      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-secondary-400">Permissions Preview</p>
      <div className="flex flex-wrap gap-2">
        {profile.permissions.map((permission) => (
          <span key={permission} className="rounded-md bg-secondary-200 px-2.5 py-1 text-[11px] font-bold text-secondary-600">
            {permission}
          </span>
        ))}
      </div>
    </aside>
  )
}
