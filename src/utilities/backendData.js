import { decodeJwt, getStoredUser, getToken } from '../features/auth/utils/authHelpers'

const idClaimKeys = [
  'coachId',
  'CoachId',
  'userId',
  'UserId',
  'id',
  'Id',
  'sub',
  'nameid',
  'nameidentifier',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
]

export function pickValue(source, keys, fallback = undefined) {
  if (!source) return fallback

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
      return source[key]
    }
  }

  return fallback
}

export function getCurrentUserId() {
  const storedUser = getStoredUser()
  const directId = pickValue(storedUser, idClaimKeys)

  if (directId) return directId

  const token = getToken()
  const claims = decodeJwt(token)

  return pickValue(claims, idClaimKeys, null)
}

export function getInitials(name = '') {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'FT'
}

export function avatarFor(seed, text = '') {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=6942ff,8d70ff,d6fbc7,e8e8ee&fontWeight=700&chars=2&radius=50${text ? `&text=${encodeURIComponent(text)}` : ''}`
}

export function formatDate(value, fallback = '-') {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(value, fallback = '-') {
  if (!value) return fallback

  if (/^\d{2}:\d{2}/.test(String(value))) {
    return String(value).slice(0, 5)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}
