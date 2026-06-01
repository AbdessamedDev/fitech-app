const tabs = ['Overview', 'Activity', 'Permissions']

export function ProfileTabs({ activeTab, onChange }) {
  return (
    <div className="flex h-14 items-end gap-7 border-b border-secondary-300 px-6">
      {tabs.map((tab) => {
        const active = activeTab === tab

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`relative h-full px-1 text-sm font-bold transition-colors duration-200 ${
              active ? 'text-secondary-800' : 'text-secondary-400 hover:text-primary-600'
            }`}
          >
            {tab}
            <span
              className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-secondary-700 transition-all duration-300 ${
                active ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
