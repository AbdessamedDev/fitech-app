const DEFAULTS = {
  admin: {
    language: 'English (United States)',
    languageCode: 'en',
    theme: 'light',
    unit: 'metric',
    timeZone: 'GMT -08:00 Pacific Time',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    sessionDuration: 60,
    twoFactor: true,
    notifications: {
      new_messages: true,
      session_reminders: true,
      client_updates: false,
      push_notifs: true,
    },
  },
  coach: {
    language: 'English (United States)',
    languageCode: 'en',
    theme: 'light',
    unit: 'metric',
    timeZone: 'GMT +01:00 Central European Time',
    startTime: '07:00 AM',
    endTime: '05:00 PM',
    sessionDuration: 45,
    twoFactor: false,
    notifications: {
      new_messages: true,
      session_reminders: true,
      client_updates: true,
      push_notifs: true,
    },
  },
}

const languageMap = {
  'English (United States)': 'en',
  'French (France)': 'fr',
  'Spanish (Spain)': 'es',
  Arabic: 'ar',
}

const getStorageKey = (scope) => `fitech:${scope}:settings`

export function getSettingsDefaults(scope = 'admin') {
  return DEFAULTS[scope] || DEFAULTS.admin
}

export function getLanguageCode(language) {
  return languageMap[language] || 'en'
}

export function getLanguageName(languageCode = 'en') {
  return Object.entries(languageMap).find(([, code]) => code === languageCode)?.[0] || 'English (United States)'
}

export function loadScopedSettings(scope = 'admin') {
  const defaults = getSettingsDefaults(scope)

  try {
    const saved = JSON.parse(localStorage.getItem(getStorageKey(scope)) || '{}')
    return {
      ...defaults,
      ...saved,
      notifications: {
        ...defaults.notifications,
        ...(saved.notifications || {}),
      },
    }
  } catch {
    return defaults
  }
}

export function saveScopedSettings(scope = 'admin', nextSettings) {
  const current = loadScopedSettings(scope)
  const merged = {
    ...current,
    ...nextSettings,
    notifications: {
      ...current.notifications,
      ...(nextSettings.notifications || {}),
    },
  }

  localStorage.setItem(getStorageKey(scope), JSON.stringify(merged))
  return merged
}

export function applyScopedLanguage(i18n, scope = 'admin') {
  const settings = loadScopedSettings(scope)
  const languageCode = settings.languageCode || getLanguageCode(settings.language)

  i18n.changeLanguage(languageCode)
  document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr'
}

export function applyScopedTheme(scope = 'admin') {
  const settings = loadScopedSettings(scope)

  if (settings.theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
