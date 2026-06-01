import { getUserDisplayName } from '../../features/auth/utils/authHelpers'

function firstValue(user, keys) {
  for (const key of keys) {
    const value = user?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value
    }
  }

  return null
}

export function buildProfileData(user, role) {
  const isCoach = role === 'coach'
  const firstName = firstValue(user, ['firstName', 'FirstName', 'first_name'])
  const lastName = firstValue(user, ['lastName', 'LastName', 'last_name'])
  const email = firstValue(user, ['email', 'Email', 'emailAddress', 'EmailAddress'])
  const phone = firstValue(user, ['phone', 'Phone', 'phoneNumber', 'PhoneNumber'])
  const city = firstValue(user, ['city', 'City'])
  const country = firstValue(user, ['country', 'Country'])
  const location = firstValue(user, ['location', 'Location', 'address', 'Address'])

  return {
    name: getUserDisplayName(user),
    role,
    roleLabel: isCoach ? 'Coach' : 'Administrator',
    officialTitle:
      firstValue(user, ['title', 'Title', 'officialTitle', 'OfficialTitle']) ||
      (isCoach ? 'Head of Coaching' : 'Platform Administrator'),
    email: email || (isCoach ? 'coach@fittech.com' : 'admin@fittech.com'),
    phone: phone || '+1 (555) 012-4488',
    location: location || [city, country].filter(Boolean).join(', ') || 'San Francisco, CA',
    firstName: firstName || getUserDisplayName(user).split(' ')[0],
    lastName: lastName || getUserDisplayName(user).split(' ').slice(1).join(' '),
    status: firstValue(user, ['status', 'Status']) || 'Active',
    lastActive: firstValue(user, ['lastActive', 'LastActive']) || 'Today, 10:42 AM',
    createdAt: firstValue(user, ['createdAt', 'CreatedAt', 'createdDate', 'CreatedDate']) || 'Oct 12, 2022',
    permissions: isCoach
      ? ['Client Access', 'Program Builder', 'Messaging']
      : ['Full Access', 'Billing Admin', 'User Management'],
  }
}
