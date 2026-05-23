import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import {
  CalendarIcon,
  EnvelopeSimple,
  Funnel,
  GearSixIcon,
  MoreVertical,
  Phone,
  SlidersHorizontal,
  User,
} from '../../icons/index'

const ROWS_PER_PAGE = 15

const clientSeeds = [
  { name: 'ishaq Boukaddah', email: 'i.boukadeh@gmail...', phone: '+2136171813', date: 'Nov 12, 2026', joinedAt: '2026-11-12' },
  { name: 'Amina Benali', email: 'a.benali@gmail...', phone: '+2135548721', date: 'Nov 10, 2026', joinedAt: '2026-11-10' },
  { name: 'Samir Elhammi', email: 's.elhammi@gmail...', phone: '+2136681904', date: 'Oct 28, 2026', joinedAt: '2026-10-28' },
  { name: 'Leila Kachouri', email: 'l.kachouri@gmail...', phone: '+2137715208', date: 'Oct 18, 2026', joinedAt: '2026-10-18' },
  { name: 'Youssef Amari', email: 'y.amari@gmail...', phone: '+2135563420', date: 'Sep 30, 2026', joinedAt: '2026-09-30' },
  { name: 'Rania Zahir', email: 'r.zahir@gmail...', phone: '+2136619825', date: 'Sep 14, 2026', joinedAt: '2026-09-14' },
  { name: 'Liam Chen', email: 'l.chen@gmail...', phone: '+2137773419', date: 'Aug 26, 2026', joinedAt: '2026-08-26' },
  { name: 'Sofia Patel', email: 's.patel@gmail...', phone: '+2135590284', date: 'Aug 08, 2026', joinedAt: '2026-08-08' },
  { name: 'Ethan Martinez', email: 'e.martinez@gmail...', phone: '+2136657413', date: 'Jul 19, 2026', joinedAt: '2026-07-19' },
  { name: 'Zara Khan', email: 'z.khan@gmail...', phone: '+2137748120', date: 'Jul 01, 2026', joinedAt: '2026-07-01' },
]

const clients = Array.from({ length: 390 }, (_, index) => {
  const seed = clientSeeds[index % clientSeeds.length]
  return {
    id: index + 1,
    ...seed,
    name: index < ROWS_PER_PAGE ? 'ishaq Boukaddah' : seed.name,
    email: index < ROWS_PER_PAGE ? 'i.boukadeh@gmail...' : seed.email,
    phone: index < ROWS_PER_PAGE ? '+2136171813' : seed.phone,
    date: index < ROWS_PER_PAGE ? 'Nov 12, 2026' : seed.date,
    joinedAt: index < ROWS_PER_PAGE ? '2026-11-12' : seed.joinedAt,
  }
})

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
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

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

    // 2. When there's a query, sort so name-starts-with matches appear first,
    //    then email-starts-with, then the rest (contains anywhere).
    //    This fixes the bug where typing a single letter didn't surface
    //    "starts with" rows before "contains" rows.
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

    // 3. Apply sort-by on top of the prioritized list
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
  }, [search, sortBy])

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

        <Table className="mt-8 w-full overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50 shadow-none">
          <colgroup>
            <col className="w-[48px]" />
            <col className="w-[190px]" />
            <col className="w-[210px]" />
            <col className="w-[170px]" />
            <col className="w-[190px]" />
            <col className="w-[150px]" />
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
                <ClientCell className="px-0">
                  <button
                    type="button"
                    aria-label={`Open actions for ${client.name}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-secondary-700 transition-colors hover:bg-secondary-200"
                  >
                    <MoreVertical size={20} weight="bold" />
                  </button>
                </ClientCell>
              </TableRow>
            ))}

            {paginatedClients.length === 0 && (
              <TableRow className="bg-secondary-50 hover:bg-secondary-50">
                <TableCell
                  colSpan={6}
                  className="h-[120px] text-center text-[14px] font-semibold text-secondary-400"
                >
                  {t('No clients found')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-[34px]">
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}