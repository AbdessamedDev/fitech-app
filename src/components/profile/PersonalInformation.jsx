import { ProfileField } from './ProfileField'

export function PersonalInformation({ profile }) {
  return (
    <section>
      <h3 className="mb-6 text-lg font-black text-secondary-800">Personal Information</h3>

      <div className="grid grid-cols-1 gap-x-14 gap-y-7 sm:grid-cols-2">
        <ProfileField label="Full Name" value={profile.name} />
        <ProfileField label="Official Title" value={profile.officialTitle} />
        <ProfileField label="Email Address" value={profile.email} />
        <ProfileField label="Phone Number" value={profile.phone} />
      </div>
    </section>
  )
}
