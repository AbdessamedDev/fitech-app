import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import { TableOperationsDropdown } from '../../components/shared/TableOperationsDropdown'
import { ArrowClockwise } from '@phosphor-icons/react'
import {
  CalendarIcon,
  EnvelopeSimple,
  Funnel,
  GearSixIcon,
  MoreVertical,
  Phone,
  SlidersHorizontal,
  User,
  ClipboardText,
  Eye,
  ChatCircleText,
} from '../../icons/index'
import { api } from '../../services/api'
import { getCurrentUserId } from '../../utilities/backendData'

const ROWS_PER_PAGE = 15

const clientSeeds = [
  { memberId: 'c1-seed', fullName: 'ishaq Boukaddah', email: 'i.boukadeh@esi.dz', phoneNumber: '+2136171813', registrationDate: '2026-11-12T00:00:00Z', assignedCourses: [{ programName: 'Elite HIIT 30' }] },
  { memberId: 'c2-seed', fullName: 'Amina Benali', email: 'a.benali@esi.dz', phoneNumber: '+2135548721', registrationDate: '2026-11-10T00:00:00Z', assignedCourses: [{ programName: 'Power Lifting' }] },
  { memberId: 'c3-seed', fullName: 'Samir Elhammi', email: 's.elhammi@esi.dz', phoneNumber: '+2136681904', registrationDate: '2026-10-28T00:00:00Z', assignedCourses: [{ programName: 'Zen Flow Yoga' }] },
  { memberId: 'c4-seed', fullName: 'Leila Kachouri', email: 'l.kachouri@esi.dz', phoneNumber: '+2137715208', registrationDate: '2026-10-18T00:00:00Z', assignedCourses: [{ programName: 'Cardio Blast' }] },
  { memberId: 'c5-seed', fullName: 'Youssef Amari', email: 'y.amari@esi.dz', phoneNumber: '+2135563420', registrationDate: '2026-09-30T00:00:00Z', assignedCourses: [{ programName: 'CrossFit X' }] }
]

const sortOptions = [
  { label: 'Sort by', value: 'All' },
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
]

function HeaderCell({ icon: Icon, title, className = '', showDivider = true }) {
  const { t } = useTranslation()

  return (
    <TableHead className={`h-[40px] p-0 align-middle ${className}`}>
      <div className="flex h-full items-center justify-between">
        <div className="flex flex-1 items-center justify-center gap-2 px-3 text-[13px] font-bold leading-none text-secondary-500">
          {Icon && <Icon size={16} weight="bold" />}
          <span>{t(title)}</span>
        </div>
        {showDivider && <span className="h-[24px] w-px bg-secondary-200" />}
      </div>
    </TableHead>
  )
}

function ClientCell({ children, className = '' }) {
  return (
    <TableCell className={`h-[42px] px-3 py-0 text-center text-[13px] font-medium leading-none text-secondary-500 ${className}`}>
      {children}
    </TableCell>
  )
}

export default function Clients() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const coachId = getCurrentUserId()

  // Dynamic backend clients state
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [activeProgramsClientId, setActiveProgramsClientId] = useState(null)

  const loadClients = async () => {
    if (!coachId) {
      setError('Coach identity session identifier not found.')
      setClients(mapSeeds(clientSeeds))
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await api.getCoachClients(coachId)
      if (Array.isArray(data) && data.length > 0) {
        setClients(mapSeeds(data))
      } else {
        setClients(mapSeeds(clientSeeds))
      }
    } catch (err) {
      console.error('Failed to load coach clients:', err)
      setError(err.message || 'Connecting to backend microservice failed.')
      setClients(mapSeeds(clientSeeds))
    } finally {
      setLoading(false)
    }
  }

  const mapSeeds = (list) => {
    return list.map((c, index) => ({
      id: c.memberId || index,
      name: c.fullName || 'Member',
      email: c.email || 'no-email@gym.com',
      phone: c.phoneNumber || '-',
      date: c.registrationDate ? new Date(c.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
      joinedAt: c.registrationDate || new Date().toISOString(),
      programs: c.assignedCourses ? c.assignedCourses.map(a => a.programName) : []
    }))
  }

  useEffect(() => {
    loadClients()
  }, [coachId])

  useEffect(() => {
    function handleGlobalClick() {
      setActiveProgramsClientId(null)
    }
    if (activeProgramsClientId !== null) {
      document.addEventListener('click', handleGlobalClick)
    }
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [activeProgramsClientId])

  // Handles Send Message Action
  const handleSendMessage = async (client) => {
    if (String(client.id).endsWith('-seed')) {
      alert("This is a simulated demo client. Message routing is only functional with live members in the database.")
      return
    }

    try {
      // 1. Get the member details to retrieve their Identity UserId
      const memberDetail = await api.getMember(client.id)
      const otherUserId = memberDetail?.userId || memberDetail?.UserId
      
      if (!otherUserId) {
        alert("This member does not have a registered Identity Account.")
        return
      }

      // 2. Establish / Get the Chat Conversation
      const conversation = await api.getOrCreateConversation(otherUserId)
      
      // 3. Redirect to coach messaging with conversation preloaded
      navigate('/coach/messaging', { state: { selectConversationId: conversation.id } })
    } catch (err) {
      console.error("Failed to route Send Message call:", err)
      alert("Could not start message thread: " + err.message)
    }
  }

  const visibleClients = useMemo(() => {
    const query = search.trim().toLowerCase()

    // 1. Filter: keep only rows that match the query
    const filtered = clients.filter((client) => {
      if (!query) return true
      return [client.name, client.email, client.phone, client.date]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })

    // 2. Prioritize starts-with matches
    const prioritized = query
      ? [...filtered].sort((a, b) => {
          const aNameStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1
          const bNameStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1
          if (aNameStarts !== bNameStarts) return aNameStarts - bNameStarts

          const aEmailStarts = a.email.toLowerCase().startsWith(query) ? 0 : 1
          const bEmailStarts = b.email.toLowerCase().startsWith(query) ? 0 : 1
          return aEmailStarts - bEmailStarts
        })
      : filtered

    // 3. Apply sort-by
    if (sortBy === 'name-asc') {
      return [...prioritized].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === 'name-desc') {
      return [...prioritized].sort((a, b) => b.name.localeCompare(a.name))
    }
    if (sortBy === 'newest') {
      return [...prioritized].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
    }
    if (sortBy === 'oldest') {
      return [...prioritized].sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt))
    }

    return prioritized
  }, [clients, search, sortBy])

  const totalPages = Math.ceil(visibleClients.length / ROWS_PER_PAGE)
  const safePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const paginatedClients = visibleClients.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE)

  const allSelected =
    paginatedClients.length > 0 && paginatedClients.every((client) => selectedIds.includes(client.id))
  const someSelected = paginatedClients.some((client) => selectedIds.includes(client.id)) && !allSelected

  const handleSearch = (value) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    )
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !paginatedClients.some((client) => client.id === id)),
      )
      return
    }
    setSelectedIds((current) =>
      Array.from(new Set([...current, ...paginatedClients.map((client) => client.id)])),
    )
  }

  const focusSearch = () => {
    document.getElementById('global-search-input')?.focus()
  }

  return (
    <div className="min-h-full w-full bg-secondary-100 px-4 py-[36px] text-sm text-secondary-700 sm:px-8">
      <div className="mx-auto flex w-full max-w-380 flex-col">
        
        {/* Error notification banner */}
        {error && (
          <div className="mb-4 rounded-xl border border-error/20 bg-error-bg p-4 flex items-center justify-between shadow-sm animate-fade-up">
            <p className="text-sm font-semibold text-error">
              {t("Failed to sync live coach clients. Showing offline demo clients.")}
            </p>
            <button onClick={loadClients} className="px-3 py-1.5 bg-error text-white text-xs font-bold rounded-lg hover:bg-error/90 cursor-pointer">
              {t("Retry Sync")}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search"
            className="w-full lg:w-[408px]"
          />

          <FilterDropdown
            label="Sort by"
            icon={SlidersHorizontal}
            options={sortOptions}
            value={sortBy}
            onChange={(value) => {
              setSortBy(value)
              setCurrentPage(1)
            }}
            className="w-full sm:w-[304px]"
          />

          <button
            type="button"
            onClick={focusSearch}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-[13px] font-bold text-primary-600 transition-colors hover:bg-primary-50 active:bg-primary-100 sm:w-fit"
          >
            <Funnel size={18} weight="bold" />
            {t('Filter')}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="animate-pulse text-base font-semibold text-secondary-500">{t('Syncing clients with C# microservices backend...')}</p>
          </div>
        ) : (
          <Table className="mt-8 w-full overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50 shadow-none">
            <colgroup>
              <col className="w-[48px]" />
              <col className="w-[170px]" />
              <col className="w-[200px]" />
              <col className="w-[140px]" />
              <col className="w-[160px]" />
              <col className="w-[180px]" />
              <col className="w-[110px]" />
            </colgroup>

            <TableHeader className="border-b border-secondary-200 bg-secondary-100">
              <TableRow isHeader={true} className="border-b-0 bg-secondary-100 hover:bg-secondary-100">
                <TableHead className="h-[40px] p-0 align-middle">
                  <div className="flex h-full items-center justify-between">
                    <div className="flex flex-1 justify-center">
                      <input
                        type="checkbox"
                        aria-label="Select all clients on this page"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected
                        }}
                        onChange={handleSelectAll}
                        className="h-[16px] w-[16px] cursor-pointer rounded border-secondary-300"
                        style={{ accentColor: 'var(--color-primary-600)' }}
                      />
                    </div>
                    <span className="h-[24px] w-px bg-secondary-200" />
                  </div>
                </TableHead>
                <HeaderCell icon={User} title="Full Name" />
                <HeaderCell icon={EnvelopeSimple} title="Email" />
                <HeaderCell icon={Phone} title="Phone" />
                <HeaderCell icon={CalendarIcon} title="Registration Date" />
                <HeaderCell icon={ClipboardText} title="Programs" />
                <HeaderCell icon={GearSixIcon} title="Operations" showDivider={false} />
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-b border-secondary-200 bg-secondary-50 last:border-b-0 hover:bg-secondary-100"
                >
                  <ClientCell className="w-[48px] px-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(client.id)}
                      onChange={() => handleSelect(client.id)}
                      aria-label={`Select ${client.name}`}
                      className="h-[16px] w-[16px] cursor-pointer rounded border-secondary-300"
                      style={{ accentColor: 'var(--color-primary-600)' }}
                    />
                  </ClientCell>
                  <ClientCell>{client.name}</ClientCell>
                  <ClientCell>{client.email}</ClientCell>
                  <ClientCell>{client.phone}</ClientCell>
                  <ClientCell>{client.date}</ClientCell>
                  <ClientCell className="relative flex justify-center items-center gap-1 flex-wrap overflow-visible py-1 h-auto min-h-[42px]">
                    {client.programs && client.programs.length > 0 ? (
                      <>
                        {client.programs.length <= 2 ? (
                          client.programs.map((prog, index) => (
                            <span key={index} className="inline-block bg-primary-50 text-primary-700 border border-primary-100/50 rounded-lg px-2 py-0.5 text-xs font-semibold select-none leading-none truncate max-w-[120px]">
                              {prog}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="inline-block bg-primary-50 text-primary-700 border border-primary-100/50 rounded-lg px-2 py-0.5 text-xs font-semibold select-none leading-none truncate max-w-[100px]">
                              {client.programs[0]}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveProgramsClientId(
                                  activeProgramsClientId === client.id ? null : client.id
                                );
                              }}
                              className="inline-flex h-5 px-1.5 items-center justify-center rounded-lg bg-secondary-200 border border-secondary-300 text-secondary-700 text-xs font-bold transition-all hover:bg-secondary-300 active:bg-secondary-400 cursor-pointer select-none"
                            >
                              +{client.programs.length - 1}
                            </button>
                            {activeProgramsClientId === client.id && (
                              <div 
                                className="absolute z-[999] right-2 mt-1 top-full w-52 bg-secondary-50 border border-secondary-200 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-3 text-left animate-in fade-in slide-in-from-top-1 duration-150"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <p className="text-[10px] font-extrabold tracking-widest uppercase text-secondary-400 mb-2">{t('ALL PROGRAMS')}</p>
                                <div className="max-h-36 overflow-y-auto mini-scrollbar flex flex-col gap-1.5 pr-1">
                                  {client.programs.map((prog, idx) => (
                                    <div key={idx} className="bg-primary-50/50 text-primary-700 border border-primary-100/50 rounded-lg px-2.5 py-1.5 text-xs font-semibold truncate hover:bg-primary-50 transition-colors leading-none">
                                      {prog}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <span className="text-secondary-400 font-bold">-</span>
                    )}
                  </ClientCell>
                  <ClientCell className="px-0 overflow-visible">
                    <TableOperationsDropdown
                      align="right"
                      items={[
                        {
                          label: t('Send Message'),
                          icon: <ChatCircleText size={16} weight="bold" />,
                          onClick: () => handleSendMessage(client),
                        },
                        {
                          label: t('View Details'),
                          icon: <Eye size={16} weight="bold" />,
                          onClick: () => alert(`${t('Viewing details for')} ${client.name}`),
                        },
                        {
                          label: t('Edit Registration'),
                          icon: <ArrowClockwise size={16} weight="bold" />,
                          onClick: () => alert(`${t('Editing registration for')} ${client.name}`),
                        },
                      ]}
                    />
                  </ClientCell>
                </TableRow>
              ))}

              {paginatedClients.length === 0 && (
                <TableRow className="bg-secondary-50 hover:bg-secondary-50">
                  <TableCell
                    colSpan={7}
                    className="h-[120px] text-center text-[14px] font-semibold text-secondary-400"
                  >
                    {t('No clients found')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <div className="mt-[34px]">
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}