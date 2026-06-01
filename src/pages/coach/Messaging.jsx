import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Archive,
  ArrowLeft,
  BellSlash,
  Check,
  Checks,
  DotsThreeVertical,
  MagnifyingGlass,
  PaperPlaneTilt,
  Plus,
  ShieldSlash,
  Smiley,
  Trash,
  UserPlus,
  UsersThree,
  X,
} from '@phosphor-icons/react'

const avatarFor = (seed, text = '') =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=6942ff,8d70ff,d6fbc7,e8e8ee&fontWeight=700&chars=2&radius=50${text ? `&text=${encodeURIComponent(text)}` : ''}`

const burgerImage =
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=900'

const subscribers = [
  { id: 'u1', name: 'Chawcha3', role: 'Nutrition client', online: true, avatar: avatarFor('Chawcha3') },
  { id: 'u2', name: 'David Miller', role: 'Strength client', online: false, avatar: avatarFor('David Miller') },
  { id: 'u3', name: 'Sarah Benali', role: 'Weight loss client', online: true, avatar: avatarFor('Sarah Benali') },
  { id: 'u4', name: 'Nadia Khelifi', role: 'Yoga client', online: false, avatar: avatarFor('Nadia Khelifi') },
  { id: 'u5', name: 'Omar Haddad', role: 'Performance client', online: true, avatar: avatarFor('Omar Haddad') },
  { id: 'u6', name: 'Rania Zahir', role: 'HIIT client', online: false, avatar: avatarFor('Rania Zahir') },
]

const initialConversations = [
  {
    id: 'c1',
    type: 'private',
    name: 'Chawcha3',
    subtitle: 'The new meal plan ...',
    time: '12:45 PM',
    unread: 2,
    online: true,
    avatar: avatarFor('Chawcha3'),
    members: ['u1'],
    messages: [
      {
        id: 'm1',
        author: 'client',
        type: 'text',
        text: "Hey coach! I'm really loving the new meal plan. It feels much more sustainable than the last one. Just a quick question: Can I swap the almond butter for peanut butter in the morning smoothie?",
        time: '12:42 PM',
      },
      {
        id: 'm2',
        author: 'coach',
        type: 'text',
        text: "That's great to hear, Sarah! Consistency is key. Yes, absolutely, peanut butter is a perfect substitute. Just keep an eye on the portion size as it's slightly more calorie-dense.",
        time: '12:45 PM',
        read: true,
      },
      {
        id: 'm3',
        author: 'client',
        type: 'image',
        image: burgerImage,
        text: 'Shared meal photo',
        time: '12:49 PM',
      },
    ],
  },
  {
    id: 'c2',
    type: 'private',
    name: 'David Miller',
    subtitle: 'Sent a photo',
    time: 'Yesterday',
    unread: 0,
    online: false,
    avatar: avatarFor('David Miller'),
    members: ['u2'],
    messages: [
      {
        id: 'm4',
        author: 'client',
        type: 'text',
        text: 'Coach, can you check my deadlift form from today?',
        time: 'Yesterday',
      },
      {
        id: 'm5',
        author: 'coach',
        type: 'text',
        text: 'Send it here and I will mark the two things to fix before the next heavy set.',
        time: 'Yesterday',
        read: true,
      },
    ],
  },
  {
    id: 'c3',
    type: 'group',
    name: 'Morning HIIT Squad',
    subtitle: 'Coach: See you all at 6 AM!',
    time: 'Tue',
    unread: 0,
    online: true,
    owner: 'coach',
    avatar: avatarFor('Morning HIIT Squad', 'HI'),
    members: ['u3', 'u5', 'u6'],
    messages: [
      {
        id: 'm6',
        author: 'coach',
        type: 'text',
        text: 'See you all at 6 AM. Bring water and keep the first round controlled.',
        time: 'Tue',
        read: true,
      },
      {
        id: 'm7',
        author: 'client',
        senderName: 'Omar',
        type: 'text',
        text: 'Ready coach.',
        time: 'Tue',
      },
    ],
  },
]

const quickEmojis = ['😀', '🔥', '💪', '👏', '✅', '🥗', '🏋️', '❤️']

function Avatar({ conversation, size = 'md' }) {
  const dimension = size === 'lg' ? 'h-13 w-13' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'

  return (
    <div className={`relative shrink-0 ${dimension}`}>
      <img src={conversation.avatar} alt={conversation.name} className="h-full w-full rounded-full object-cover shadow-sm" />
      {conversation.type === 'group' ? (
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-secondary-50 bg-primary-100 text-primary-600">
          <UsersThree size={12} weight="bold" />
        </span>
      ) : (
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-secondary-50 ${
            conversation.online ? 'bg-success' : 'bg-secondary-400'
          }`}
        />
      )}
    </div>
  )
}

function ConversationRow({ conversation, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary-100 ${
        active ? 'bg-secondary-200/70 shadow-sm' : 'bg-transparent'
      }`}
    >
      <Avatar conversation={conversation} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[15px] font-extrabold leading-none text-secondary-800">{conversation.name}</h3>
          <span className="shrink-0 text-[10px] font-semibold text-secondary-500">{conversation.time}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="truncate text-[12px] font-medium leading-none text-secondary-500">{conversation.subtitle}</p>
          {conversation.unread > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-black text-white">
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function ChatBubble({ message }) {
  const mine = message.author === 'coach'

  if (message.type === 'date') {
    return (
      <div className="my-3 flex justify-center">
        <span className="rounded-full bg-secondary-200 px-4 py-1 text-[10px] font-black uppercase tracking-wide text-secondary-400">
          {message.text}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex animate-[messageIn_260ms_ease-out] gap-3 ${mine ? 'justify-end' : 'justify-start'}`}>
      {!mine && message.avatar && <img src={message.avatar} alt="" className="mt-1 h-8 w-8 rounded-full object-cover" />}
      <div className={`max-w-[82%] sm:max-w-[68%] xl:max-w-[56%] 2xl:max-w-[48%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
        {message.senderName && !mine && (
          <span className="mb-1 px-1 text-[11px] font-bold text-primary-600">{message.senderName}</span>
        )}

        {message.type === 'image' ? (
          <div className={`overflow-hidden rounded-2xl border bg-secondary-50 p-2 shadow-sm ${mine ? 'border-primary-200' : 'border-secondary-200'}`}>
            <img src={message.image} alt={message.text || 'Shared attachment'} className="max-h-[260px] w-full rounded-xl object-cover" />
            {message.text && <p className="px-1 pt-2 text-[12px] font-medium text-secondary-500">{message.text}</p>}
          </div>
        ) : (
          <div
            className={`rounded-2xl px-4 py-3 text-[14px] font-medium leading-relaxed shadow-sm ${
              mine
                ? 'rounded-br-md bg-primary-600 text-white shadow-[0_12px_28px_rgba(105,66,255,0.22)]'
                : 'rounded-bl-md border border-secondary-200 bg-secondary-50 text-secondary-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <span className={`mt-1 flex items-center gap-1 text-[10px] font-semibold ${mine ? 'text-primary-300' : 'text-secondary-400'}`}>
          {message.time}
          {mine && <Checks size={13} weight="bold" className={message.read ? 'text-primary-600' : 'text-secondary-400'} />}
        </span>
      </div>
    </div>
  )
}

function NewConversationModal({
  mode,
  subscribersList,
  conversations,
  onClose,
  onSelectConversation,
  onCreatePrivate,
  onCreateGroup,
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [groupName, setGroupName] = useState('')

  const isGroupMode = mode === 'group'
  const title = isGroupMode ? 'Create Group' : 'New Message'
  const subtitle = isGroupMode
    ? 'Select members and name your group conversation.'
    : 'Search existing chats or subscribing users to start messaging.'

  const filteredSubscribers = subscribersList.filter((user) =>
    [user.name, user.role].join(' ').toLowerCase().includes(query.trim().toLowerCase()),
  )
  const filteredExistingConversations = conversations.filter((conversation) =>
    [conversation.name, conversation.subtitle].join(' ').toLowerCase().includes(query.trim().toLowerCase()),
  )

  const toggleMember = (id) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const createGroup = () => {
    if (selectedIds.length < 2) return
    onCreateGroup({
      name: groupName.trim() || `${selectedIds.length} Member Group`,
      memberIds: selectedIds,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/45 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="w-full max-w-[560px] animate-[modalIn_220ms_ease-out] overflow-hidden rounded-2xl border border-secondary-200 bg-secondary-50 shadow-[0_24px_70px_rgba(18,18,25,0.20)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-secondary-900">{t(title)}</h2>
            <p className="mt-1 text-[13px] font-medium text-secondary-500">{t(subtitle)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-500 transition-colors hover:bg-secondary-100"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-6 py-5">
          {isGroupMode && (
            <input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder={t('Group name')}
              className="h-11 w-full rounded-lg border border-secondary-200 bg-secondary-50 px-4 text-sm font-medium text-secondary-800 outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-50"
            />
          )}

          <div className={isGroupMode ? 'relative mt-4' : 'relative'}>
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t(isGroupMode ? 'Search subscribing users' : 'Search chats or subscribing users')}
              className="h-11 w-full rounded-lg border border-secondary-200 bg-secondary-50 pl-11 pr-4 text-sm font-medium text-secondary-800 outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-50"
            />
          </div>

          <div className="mt-4 max-h-[310px] overflow-y-auto pr-1 mini-scrollbar">
            {!isGroupMode && filteredExistingConversations.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-wide text-secondary-400">{t('Existing chats')}</p>
                <div className="flex flex-col gap-1">
                  {filteredExistingConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => onSelectConversation(conversation.id)}
                      className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-secondary-100"
                    >
                      <Avatar conversation={conversation} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-extrabold text-secondary-800">{conversation.name}</p>
                        <p className="truncate text-[12px] font-medium text-secondary-500">{conversation.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-wide text-secondary-400">
              {t(isGroupMode ? 'Subscribing users' : 'Start with subscriber')}
            </p>
            <div className="flex flex-col gap-1">
              {filteredSubscribers.map((user) => {
                const selected = selectedIds.includes(user.id)
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => (isGroupMode ? toggleMember(user.id) : onCreatePrivate(user))}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-secondary-100"
                  >
                    <div className="relative h-11 w-11 shrink-0">
                      <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-secondary-50 ${user.online ? 'bg-success' : 'bg-secondary-400'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-extrabold text-secondary-800">{user.name}</p>
                      <p className="truncate text-[12px] font-medium text-secondary-500">{user.role}</p>
                    </div>
                    {isGroupMode && (
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                          selected ? 'border-primary-600 bg-primary-600 text-white' : 'border-secondary-300 text-transparent'
                        }`}
                      >
                        <Check size={14} weight="bold" />
                      </span>
                    )}
                  </button>
                )
              })}
              {filteredSubscribers.length === 0 && (!isGroupMode || filteredExistingConversations.length === 0) && (
                <div className="rounded-xl border border-secondary-200 bg-secondary-100 px-4 py-6 text-center text-[13px] font-semibold text-secondary-500">
                  {t('No matching users found')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-secondary-200 bg-secondary-100 px-6 py-4">
          <p className="text-[12px] font-semibold text-secondary-500">
            {isGroupMode ? t('{{count}} selected', { count: selectedIds.length }) : t('Private conversations start instantly')}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl px-5 text-[13px] font-bold text-secondary-600 transition-colors hover:bg-secondary-200"
            >
              {t('Cancel')}
            </button>
            {isGroupMode && (
              <button
                type="button"
                onClick={createGroup}
                disabled={selectedIds.length < 2}
                className="h-10 rounded-xl bg-primary-600 px-5 text-[13px] font-bold text-white transition-all hover:bg-primary-900 hover:shadow-[0_8px_18px_rgba(105,66,255,0.18)] disabled:cursor-not-allowed disabled:bg-secondary-300 disabled:shadow-none"
              >
                {t('Create Group')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ConversationActions({ open, onToggle, blocked, onToggleBlock, muted, onToggleMute, onDeleteChat }) {
  const { t } = useTranslation()

  const items = [
    { label: 'Search in chat', icon: MagnifyingGlass, onClick: onToggle },
    { label: muted ? 'Unmute notifications' : 'Mute notifications', icon: BellSlash, onClick: onToggleMute },
    { label: blocked ? 'Unblock user' : 'Block user', icon: ShieldSlash, onClick: onToggleBlock },
    { label: 'Archive chat', icon: Archive, onClick: onToggle },
    { label: 'Delete chat', icon: Trash, danger: true, onClick: onDeleteChat },
  ]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-500 transition-colors hover:bg-secondary-100"
      >
        <DotsThreeVertical size={22} weight="bold" />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-30 w-[232px] overflow-hidden rounded-xl border border-secondary-200 bg-secondary-50 py-2 shadow-[0_18px_45px_rgba(18,18,25,0.12)] animate-[menuIn_180ms_ease-out]">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] font-bold transition-colors hover:bg-secondary-100 ${
                  item.danger ? 'text-error' : 'text-secondary-700'
                }`}
              >
                <Icon size={17} weight="bold" />
                {t(item.label)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DeleteChatDialog({ conversation, onClose, onDeleteForMe, onDeleteForEveryone, onQuitGroup }) {
  const { t } = useTranslation()
  const isGroup = conversation.type === 'group'
  const isOwner = conversation.owner === 'coach'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/45 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="w-full max-w-[430px] animate-[modalIn_200ms_ease-out] rounded-2xl border border-secondary-200 bg-secondary-50 p-6 shadow-[0_24px_70px_rgba(18,18,25,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-error-bg text-error">
            <Trash size={24} weight="bold" />
          </div>
          <div>
            <h2 className="text-lg font-black text-secondary-900">
              {t(isGroup ? (isOwner ? 'Delete group chat?' : 'Quit group chat?') : 'Delete chat?')}
            </h2>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-secondary-500">
              {t(
                isGroup
                  ? isOwner
                    ? 'You own this group, so you can delete it for everyone or only remove it from your list.'
                    : 'You are not the owner of this group, so you can only quit it from your side.'
                  : 'Choose whether this fake deletion removes the chat only for you or for both sides.',
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {isGroup && !isOwner ? (
            <button
              type="button"
              onClick={onQuitGroup}
              className="h-11 rounded-xl bg-error px-4 text-[13px] font-bold text-white transition-all hover:bg-error/90 hover:shadow-[0_8px_18px_rgba(191,56,70,0.18)]"
            >
              {t('Quit group')}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onDeleteForMe}
                className="h-11 rounded-xl bg-secondary-200 px-4 text-[13px] font-bold text-secondary-700 transition-all hover:bg-secondary-300 hover:shadow-[0_8px_18px_rgba(18,18,25,0.08)]"
              >
                {t('Delete for me')}
              </button>
              <button
                type="button"
                onClick={onDeleteForEveryone}
                className="h-11 rounded-xl bg-error px-4 text-[13px] font-bold text-white transition-all hover:bg-error/90 hover:shadow-[0_8px_18px_rgba(191,56,70,0.18)]"
              >
                {t(isGroup ? 'Delete group for everyone' : 'Delete for both sides')}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-[13px] font-bold text-secondary-500 transition-colors hover:bg-secondary-100"
          >
            {t('Cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Messaging() {
  const { t } = useTranslation()
  const [conversations, setConversations] = useState(initialConversations)
  const [activeId, setActiveId] = useState(initialConversations[0]?.id)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [modalMode, setModalMode] = useState('private')
  const [showEmoji, setShowEmoji] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [mutedIds, setMutedIds] = useState([])
  const [blockedIds, setBlockedIds] = useState([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)
  const emojiRef = useRef(null)
  const actionsRef = useRef(null)
  const fileInputRef = useRef(null)
  // pending image: { objectUrl, fileName }
  const [pendingImage, setPendingImage] = useState(null)

  const activeConversation = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0]
  const blocked = activeConversation ? blockedIds.includes(activeConversation.id) : false
  const muted = activeConversation ? mutedIds.includes(activeConversation.id) : false
  const filterIndex = ['all', 'private', 'group'].indexOf(filter)

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase()
    return conversations.filter((conversation) => {
      const matchesType = filter === 'all' || conversation.type === filter
      const matchesSearch = !query || [conversation.name, conversation.subtitle].join(' ').toLowerCase().includes(query)
      return matchesType && matchesSearch
    })
  }, [conversations, filter, search])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showEmoji && emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false)
      }
      if (showActions && actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [showActions, showEmoji])

  const selectConversation = (id) => {
    setActiveId(id)
    setShowActions(false)
    setShowConversationList(false)
    setPendingImage(null)
    setDraft('')
    setConversations((current) =>
      current.map((conversation) => (conversation.id === id ? { ...conversation, unread: 0 } : conversation)),
    )
  }

  const updateActiveConversation = (updater) => {
    setConversations((current) =>
      current.map((conversation) => (conversation.id === activeConversation.id ? updater(conversation) : conversation)),
    )
  }

  const sendMessage = () => {
    if (!activeConversation || blocked) return
    const text = draft.trim()
    if (!pendingImage && !text) return

    const newMessages = []

    if (pendingImage) {
      newMessages.push({
        id: `m-${Date.now()}-img`,
        author: 'coach',
        type: 'image',
        image: pendingImage.objectUrl,
        text: text || '',
        time: 'Now',
        read: true,
      })
    } else {
      newMessages.push({
        id: `m-${Date.now()}`,
        author: 'coach',
        type: 'text',
        text,
        time: 'Now',
        read: true,
      })
    }

    updateActiveConversation((conversation) => ({
      ...conversation,
      subtitle: pendingImage ? 'Sent a photo' : text,
      time: 'Now',
      messages: [...conversation.messages, ...newMessages],
    }))

    setDraft('')
    setPendingImage(null)
    setShowEmoji(false)
  }

  // Stage the image as a preview — don't send yet
  const handleImageUpload = (event) => {
    if (!activeConversation || blocked) return
    const file = event.target.files?.[0]
    if (!file) return
    setPendingImage({ objectUrl: URL.createObjectURL(file), fileName: file.name })
    event.target.value = ''
  }

  const createPrivateConversation = (user) => {
    const existing = conversations.find((conversation) => conversation.type === 'private' && conversation.members.includes(user.id))
    if (existing) {
      selectConversation(existing.id)
      setShowNewModal(false)
      return
    }

    const conversation = {
      id: `c-${Date.now()}`,
      type: 'private',
      name: user.name,
      subtitle: 'New conversation',
      time: 'Now',
      unread: 0,
      online: user.online,
      avatar: user.avatar,
      members: [user.id],
      messages: [],
    }

    setConversations((current) => [conversation, ...current])
    setActiveId(conversation.id)
    setShowNewModal(false)
    setShowConversationList(false)
  }

  const createGroupConversation = ({ name, memberIds }) => {
    const conversation = {
      id: `g-${Date.now()}`,
      type: 'group',
      name,
      subtitle: `${memberIds.length} members`,
      time: 'Now',
      unread: 0,
      online: true,
      owner: 'coach',
      avatar: avatarFor(name, name.slice(0, 2).toUpperCase()),
      members: memberIds,
      messages: [
        {
          id: `m-${Date.now()}-welcome`,
          author: 'coach',
          type: 'text',
          text: `Welcome to ${name}. I will keep the plan updates and notes here.`,
          time: 'Now',
          read: true,
        },
      ],
    }

    setConversations((current) => [conversation, ...current])
    setActiveId(conversation.id)
    setShowNewModal(false)
    setShowConversationList(false)
  }

  const toggleOnline = () => {
    if (!activeConversation) return
    updateActiveConversation((conversation) => ({ ...conversation, online: !conversation.online }))
  }

  const removeActiveConversation = () => {
    if (!activeConversation) return
    const nextConversations = conversations.filter((conversation) => conversation.id !== activeConversation.id)
    setConversations(nextConversations)
    setActiveId(nextConversations[0]?.id)
    setShowConversationList(nextConversations.length > 0 ? showConversationList : true)
    setShowDeleteDialog(false)
    setShowActions(false)
  }

  return (
    <div className="messaging-page h-full min-h-0 bg-secondary-100 text-secondary-700">
      <style>
        {`
          .messaging-page button:not(:disabled) {
            cursor: pointer;
          }
          @keyframes messageIn {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(18px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes menuIn {
            from { opacity: 0; transform: translateY(-6px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>

      {showNewModal && (
        <NewConversationModal
          mode={modalMode}
          subscribersList={subscribers}
          conversations={conversations}
          onClose={() => setShowNewModal(false)}
          onSelectConversation={(conversationId) => {
            selectConversation(conversationId)
            setShowNewModal(false)
          }}
          onCreatePrivate={createPrivateConversation}
          onCreateGroup={createGroupConversation}
        />
      )}

      {showDeleteDialog && activeConversation && (
        <DeleteChatDialog
          conversation={activeConversation}
          onClose={() => setShowDeleteDialog(false)}
          onDeleteForMe={removeActiveConversation}
          onDeleteForEveryone={removeActiveConversation}
          onQuitGroup={removeActiveConversation}
        />
      )}

      <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside
          className={`${
            showConversationList ? 'flex' : 'hidden'
          } min-h-0 flex-col border-r border-secondary-300 bg-secondary-50 px-6 py-6 lg:flex`}
        >
          <h1 className="text-[24px] font-black text-secondary-900">{t('Messages')}</h1>

          <div className="relative mt-5">
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('Search clients')}
              className="h-11 w-full rounded-lg border border-secondary-300 bg-secondary-50 pl-11 pr-4 text-[13px] font-medium text-secondary-800 outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-50"
            />
          </div>

          <div className="relative mt-5 grid grid-cols-3 rounded-lg bg-secondary-200 p-1">
            <span
              className="absolute bottom-1 left-1 top-1 rounded-md bg-secondary-50 shadow-sm transition-transform duration-300 ease-out"
              style={{ width: 'calc((100% - 8px) / 3)', transform: `translateX(${filterIndex * 100}%)` }}
            />
            {[
              { value: 'all', label: 'All' },
              { value: 'private', label: 'Private' },
              { value: 'group', label: 'Groups' },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`relative z-10 h-9 rounded-md text-[12px] font-extrabold transition-colors duration-200 ${
                  filter === item.value ? 'text-primary-600' : 'text-secondary-500 hover:text-secondary-800'
                }`}
              >
                {t(item.label)}
              </button>
            ))}
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 mini-scrollbar">
            <div className="flex flex-col gap-1">
              {filteredConversations.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id === activeConversation?.id}
                  onClick={() => selectConversation(conversation.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {/* ── CHANGE: reduced hover shadow from 0_8px_18px to 0_4px_10px ── */}
            <button
              type="button"
              onClick={() => {
                setModalMode('private')
                setShowNewModal(true)
              }}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 text-[14px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-900 hover:shadow-[0_4px_10px_rgba(105,66,255,0.12)] active:scale-[0.98]"
            >
              <UserPlus size={18} weight="bold" />
              {t('New Message')}
            </button>
            <button
              type="button"
              onClick={() => {
                setModalMode('group')
                setShowNewModal(true)
              }}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary-200 text-[14px] font-bold text-secondary-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-300 hover:shadow-[0_8px_18px_rgba(18,18,25,0.08)]"
            >
              <UsersThree size={18} weight="bold" />
              {t('Create Group')}
            </button>
          </div>
        </aside>

        <section className={`${showConversationList ? 'hidden' : 'flex'} min-h-0 flex-col bg-secondary-100 lg:flex`}>
          {activeConversation ? (
            <>
              <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-secondary-200 bg-secondary-50 px-4 sm:px-8">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowConversationList(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-600 transition-colors hover:bg-secondary-100 lg:hidden"
                  >
                    <ArrowLeft size={20} weight="bold" />
                  </button>
                  <Avatar conversation={activeConversation} size="lg" />
                  <div>
                    <h2 className="text-[18px] font-black leading-tight text-secondary-900">{activeConversation.name}</h2>
                    <button
                      type="button"
                      onClick={toggleOnline}
                      className={`mt-1 inline-flex items-center gap-1.5 text-[12px] font-bold ${
                        activeConversation.online ? 'text-success' : 'text-secondary-400'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${activeConversation.online ? 'bg-success' : 'bg-secondary-400'}`} />
                      {activeConversation.online ? t('Online') : t('Offline')}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2" ref={actionsRef}>
                  <ConversationActions
                    open={showActions}
                    onToggle={() => setShowActions((value) => !value)}
                    blocked={blocked}
                    muted={muted}
                    onToggleBlock={() => {
                      setBlockedIds((current) =>
                        current.includes(activeConversation.id)
                          ? current.filter((id) => id !== activeConversation.id)
                          : [...current, activeConversation.id],
                      )
                      setShowActions(false)
                    }}
                    onToggleMute={() => {
                      setMutedIds((current) =>
                        current.includes(activeConversation.id)
                          ? current.filter((id) => id !== activeConversation.id)
                          : [...current, activeConversation.id],
                      )
                      setShowActions(false)
                    }}
                    onDeleteChat={() => {
                      setShowDeleteDialog(true)
                      setShowActions(false)
                    }}
                  />
                </div>
              </header>

              {(muted || blocked) && (
                <div className="flex shrink-0 items-center justify-center gap-3 bg-primary-50 px-4 py-2 text-[12px] font-bold text-primary-600">
                  {muted && <span>{t('Notifications muted')}</span>}
                  {blocked && <span>{t('User blocked. Sending is disabled.')}</span>}
                </div>
              )}

              <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
                <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 2xl:max-w-[1320px]">
                  <ChatBubble message={{ id: 'today', author: 'date', type: 'date', text: 'Today' }} />
                  {activeConversation.messages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={{
                        ...message,
                        avatar: message.avatar || activeConversation.avatar,
                      }}
                    />
                  ))}
                </div>
              </main>

              <footer className="shrink-0 border-t border-secondary-200 bg-secondary-100 px-4 py-4 sm:px-8">
                <div className="mx-auto flex max-w-[920px] flex-col gap-2">

                  {/* ── Image preview strip (Telegram-style) ── */}
                  {pendingImage && (
                    <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 animate-[menuIn_160ms_ease-out]">
                      <img
                        src={pendingImage.objectUrl}
                        alt="preview"
                        className="h-14 w-14 rounded-lg object-cover border border-primary-100 shadow-sm shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-bold text-primary-700">{pendingImage.fileName}</p>
                        <p className="text-[11px] font-medium text-primary-400">Image · will be sent with your message</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPendingImage(null)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500 transition-colors hover:bg-primary-200 hover:text-primary-700"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-end gap-3">
                    {/* Hidden file input + plus button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={blocked}
                    />
                    <button
                      type="button"
                      onClick={() => !blocked && fileInputRef.current?.click()}
                      disabled={blocked}
                      title={t('Upload image')}
                      className="mb-0.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-secondary-300 bg-secondary-50 text-secondary-500 transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 hover:shadow-[0_4px_10px_rgba(105,66,255,0.10)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={24} weight="bold" />
                    </button>

                    <div className="relative flex min-h-[56px] flex-1 flex-col rounded-2xl border border-secondary-300 bg-secondary-50 px-4 py-2 shadow-sm transition-all focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50">
                      <div className="flex items-center gap-2">
                        <input
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                              event.preventDefault()
                              sendMessage()
                            }
                          }}
                          disabled={blocked}
                          placeholder={
                            blocked
                              ? t('Unblock this user to send messages')
                              : pendingImage
                              ? t('Add a caption...')
                              : t('Type a message...')
                          }
                          className="h-9 flex-1 bg-transparent text-sm font-medium text-secondary-800 outline-none placeholder:text-secondary-400 disabled:cursor-not-allowed"
                        />

                        <button
                          type="button"
                          ref={emojiRef}
                          onClick={() => setShowEmoji((value) => !value)}
                          className="text-secondary-500 transition-colors hover:text-primary-600"
                        >
                          <Smiley size={20} weight="bold" />
                        </button>
                      </div>

                      {showEmoji && (
                        <div
                          ref={emojiRef}
                          className="absolute bottom-[62px] right-4 z-20 grid grid-cols-4 gap-1 rounded-xl border border-secondary-200 bg-secondary-50 p-2 shadow-[0_16px_40px_rgba(18,18,25,0.12)] animate-[menuIn_160ms_ease-out]"
                        >
                          {quickEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setDraft((current) => `${current}${emoji}`)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-secondary-100"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={blocked || (!draft.trim() && !pendingImage)}
                      className="mb-0.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-all hover:-translate-y-0.5 hover:bg-primary-900 hover:shadow-[0_8px_18px_rgba(105,66,255,0.18)] active:scale-95 disabled:cursor-not-allowed disabled:bg-secondary-300 disabled:shadow-none"
                    >
                      <PaperPlaneTilt size={27} weight="fill" />
                    </button>
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <UsersThree size={32} weight="bold" />
                </div>
                <h2 className="mt-4 text-xl font-black text-secondary-900">{t('No conversation selected')}</h2>
                <p className="mt-1 text-sm font-medium text-secondary-500">{t('Start a new message or pick an existing conversation.')}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}