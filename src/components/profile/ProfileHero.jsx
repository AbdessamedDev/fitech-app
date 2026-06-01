import { EnvelopeSimple, MapPin, Phone, LockKey, PencilSimple } from '@phosphor-icons/react'
import Logo from '../../assets/Logo.png'
import { ProfileActionButton } from './ProfileActionButton'

function ContactLine({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-secondary-500">
      <Icon size={17} weight="bold" className="text-secondary-500" />
      <span>{children}</span>
    </div>
  )
}

export function ProfileHero({ profile }) {
  return (
    <section className="group rounded-lg border border-secondary-300 bg-secondary-50 p-6 shadow-[0_2px_8px_rgba(18,18,25,0.03)] transition-all duration-300 hover:border-primary-200 hover:shadow-[0_8px_22px_rgba(105,66,255,0.10)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-primary-600 p-3 shadow-[0_8px_18px_rgba(105,66,255,0.20)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <img src={Logo} alt="FitTech profile" className="h-full w-full rounded-md object-cover" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black leading-tight text-secondary-900">{profile.name}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-primary-600">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                {profile.roleLabel}
              </span>
            </div>

            <div className="mt-2 flex flex-col gap-1.5">
              <ContactLine icon={EnvelopeSimple}>{profile.email}</ContactLine>
              <ContactLine icon={Phone}>{profile.phone}</ContactLine>
              <ContactLine icon={MapPin}>{profile.location}</ContactLine>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          <ProfileActionButton variant="secondary" icon={LockKey}>
            Change Password
          </ProfileActionButton>
          <ProfileActionButton icon={PencilSimple}>Edit Profile</ProfileActionButton>
        </div>
      </div>
    </section>
  )
}
