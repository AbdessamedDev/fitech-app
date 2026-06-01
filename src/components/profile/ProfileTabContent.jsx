import { CheckCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import { AccountSummary } from './AccountSummary'
import { PersonalInformation } from './PersonalInformation'

function EmptyPanel({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-secondary-300 bg-secondary-100 px-6 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Icon size={24} weight="bold" />
      </div>
      <h3 className="text-base font-black text-secondary-800">{title}</h3>
      <p className="mt-1 max-w-md text-sm font-medium text-secondary-500">{description}</p>
    </div>
  )
}

export function ProfileTabContent({ activeTab, profile }) {
  if (activeTab === 'Activity') {
    return (
      <div className="p-6">
        <EmptyPanel
          icon={ClockCounterClockwise}
          title="Recent Activity"
          description="Activity history will appear here once profile changes, sessions, and account actions are recorded."
        />
      </div>
    )
  }

  if (activeTab === 'Permissions') {
    return (
      <div className="p-6">
        <EmptyPanel
          icon={CheckCircle}
          title="Permissions"
          description="This account currently uses the permission set shown in the account summary."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <PersonalInformation profile={profile} />
      <AccountSummary profile={profile} />
    </div>
  )
}
