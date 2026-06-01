import { useState } from 'react'
import { FloppyDisk } from '@phosphor-icons/react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { buildProfileData } from './profileHelpers'
import { ProfileActionButton } from './ProfileActionButton'
import { ProfileHero } from './ProfileHero'
import { ProfileTabContent } from './ProfileTabContent'
import { ProfileTabs } from './ProfileTabs'

export function ProfilePage({ role }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const profile = buildProfileData(user, role)

  return (
    <div className="min-h-full bg-secondary-100 p-4 font-sans transition-all duration-300 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-380 flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProfileHero profile={profile} />

        <section className="overflow-hidden rounded-lg border border-secondary-300 bg-secondary-50 shadow-[0_2px_8px_rgba(18,18,25,0.03)] transition-all duration-300 hover:border-primary-200 hover:shadow-[0_8px_22px_rgba(105,66,255,0.08)]">
          <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
          <ProfileTabContent activeTab={activeTab} profile={profile} />

          <div className="flex flex-col justify-end gap-3 border-t border-secondary-200 px-6 py-5 sm:flex-row">
            <ProfileActionButton variant="secondary" className="sm:min-w-28">
              Cancel
            </ProfileActionButton>
            <ProfileActionButton icon={FloppyDisk} className="sm:min-w-40">
              Save Changes
            </ProfileActionButton>
          </div>
        </section>
      </div>
    </div>
  )
}
