import { useMemo, useState } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import {
  WalletIcon,
  CurrencyDollarIcon,
  PercentIcon,
  MoneyIcon,
  User,
  EnvelopeSimple,
  CreditCard,
  GearSixIcon,
  ClockIcon,
  CalendarIcon,
  SlidersHorizontal,
  Funnel,
  ReceiptText,
  MoreVertical,
} from '../../icons/index'

const ROWS_PER_PAGE = 12

const stats = [
  { label: 'Total Revenue',       value: '$128,430', delta: '+12.5%', trend: 'up',   icon: WalletIcon         },
  { label: 'Total Payments',      value: '1220',     delta: '-3.2%',  trend: 'down', icon: MoneyIcon          },
  { label: 'Platform Commission', value: '$18,940',  delta: '+8.1%',  trend: 'up',   icon: PercentIcon        },
  { label: 'Net Profit',          value: '$97,290',  delta: '+10.4%', trend: 'up',   icon: CurrencyDollarIcon },
]

const financeRows = [
  { id: 1,  name: 'ishaq Boukaddah', email: 'i.boukadeh@esi-sb...',  amount: '200$', subscription: 'Premium Monthly',  date: 'Nov 12, 2026', time: '12:45 PM' },
  { id: 2,  name: 'Amina Benali',    email: 'a.benali@esi-sb...',    amount: '150$', subscription: 'Standard Monthly', date: 'Oct 5, 2026',  time: '10:30 AM' },
  { id: 3,  name: 'Samir Elhammi',   email: 's.elhammi@esi-sb...',   amount: '250$', subscription: 'Premium Yearly',   date: 'Dec 1, 2026',  time: '9:15 AM'  },
  { id: 4,  name: 'Leila Kachouri',  email: 'l.kachouri@esi-sb...',  amount: '100$', subscription: 'Basic Monthly',    date: 'Jan 20, 2027', time: '2:00 PM'  },
  { id: 5,  name: 'Youssef Amari',   email: 'y.amari@esi-sb...',     amount: '175$', subscription: 'Standard Yearly',  date: 'Mar 15, 2026', time: '1:00 PM'  },
  { id: 6,  name: 'Rania Zahir',     email: 'r.zahir@esi-sb...',     amount: '125$', subscription: 'Basic Monthly',    date: 'Feb 10, 2027', time: '3:30 PM'  },
  { id: 7,  name: 'Liam Chen',       email: 'l.chen@esi-sb...',      amount: '200$', subscription: 'Premium Monthly',  date: 'Mar 15, 2027', time: '1:00 PM'  },
  { id: 8,  name: 'Sofia Patel',     email: 's.patel@esi-sb...',     amount: '150$', subscription: 'Standard Monthly', date: 'Apr 22, 2027', time: '10:15 AM' },
  { id: 9,  name: 'Ethan Martinez',  email: 'e.martinez@esi-sb...',  amount: '300$', subscription: 'Ultimate Monthly', date: 'May 30, 2027', time: '4:45 PM'  },
  { id: 10, name: 'Zara Khan',       email: 'z.khan@esi-sb...',      amount: '175$', subscription: 'Standard Monthly', date: 'Jun 12, 2027', time: '2:30 PM'  },
  { id: 11, name: 'Aiden Brooks',    email: 'a.brooks@esi-sb...',    amount: '250$', subscription: 'Premium Monthly',  date: 'Jul 19, 2027', time: '5:00 PM'  },
  { id: 12, name: 'Maya Singh',      email: 'm.singh@esi-sb...',     amount: '320$', subscription: 'Ultimate Monthly', date: 'Aug 3, 2027',  time: '11:00 AM' },
]

const sortOptions = [
  { label: 'Sort by',            value: 'All'         },
  { label: 'Newest first',       value: 'newest'      },
  { label: 'Amount high to low', value: 'amount-desc' },
  { label: 'Amount low to high', value: 'amount-asc'  },
]

const subscriptionFilterOptions = [
  { label: 'All', value: 'All' },
  ...Array.from(new Set(financeRows.map((r) => r.subscription))).map((s) => ({
    label: s,
    value: s,
  })),
]

const SEARCH_W = 48 + 170 + 190   // 408
const SORT_W   = 126 + 178        // 304
const FILTER_W = 200

function StatCard({ stat }) {
  const Icon = stat.icon
  const isPositive = stat.trend === 'up'
  return (
    <section
      className="group h-[236px] rounded-[18px] border border-secondary-300 bg-secondary-50 px-8 py-[30px] shadow-[0_2px_6px_rgba(18,18,25,0.02)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-[0_18px_42px_rgba(105,66,255,0.14)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex h-[48px] w-[48px] items-center justify-center rounded-full transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
          style={{
            backgroundColor: 'var(--color-icon-bubble-bg)',
            color: 'var(--color-icon-bubble-fg)',
          }}
        >
          <Icon size={24} />
        </div>
        <span className={`rounded-[9px] px-3 py-1.5 text-[12px] font-extrabold leading-none ${isPositive ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
          {stat.delta}
        </span>
      </div>
      <div className="mt-[34px]">
        <p className="text-[15px] font-medium leading-none text-secondary-600">{stat.label}</p>
        <p className="mt-3 text-[39px] font-black leading-[0.95] tracking-normal text-secondary-900">{stat.value}</p>
        <p className="mt-4 text-[12px] font-medium leading-none text-secondary-500">vs last month</p>
      </div>
    </section>
  )
}

function FinanceHeaderCell({ icon: Icon, title, className = '', showDivider = true }) {
  return (
    <TableHead className={`h-[40px] p-0 align-middle ${className}`}>
      <div className="flex h-full items-center justify-between">
        <div className="flex flex-1 items-center justify-center gap-2 px-3 text-[13px] font-extrabold leading-none text-secondary-700">
          {Icon && <Icon size={16} strokeWidth={2.2} />}
          <span>{title}</span>
        </div>
        {showDivider && <span className="h-[24px] w-px bg-secondary-300" />}
      </div>
    </TableHead>
  )
}

function FinanceCell({ children, className = '' }) {
  return (
    <TableCell className={`h-[52px] px-3 py-0 text-center text-[13.5px] font-medium leading-none text-secondary-600 ${className}`}>
      {children}
    </TableCell>
  )
}

export default function Finance() {
  const [search,      setSearch]      = useState('')
  const [sortBy,      setSortBy]      = useState('All')
  const [filterBy,    setFilterBy]    = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return financeRows.filter((row) => {
      const matchesSearch =
        !query ||
        [row.name, row.email, row.amount, row.subscription, row.date, row.time]
          .join(' ').toLowerCase().includes(query)
      const matchesFilter = filterBy === 'All' || row.subscription === filterBy
      return matchesSearch && matchesFilter
    })
  }, [search, filterBy])

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows]
    if (sortBy === 'amount-desc') sorted.sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
    if (sortBy === 'amount-asc')  sorted.sort((a, b) => parseInt(a.amount) - parseInt(b.amount))
    return sorted
  }, [filteredRows, sortBy])

  const totalPages  = Math.max(1, Math.ceil(sortedRows.length / ROWS_PER_PAGE))
  const safePage    = Math.min(currentPage, totalPages)
  const visibleRows = sortedRows.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE)

  const allSelected  = visibleRows.length > 0 && visibleRows.every((r) => selectedIds.includes(r.id))
  const someSelected = visibleRows.some((r) => selectedIds.includes(r.id)) && !allSelected

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((cur) => cur.filter((id) => !visibleRows.some((r) => r.id === id)))
    } else {
      setSelectedIds((cur) => Array.from(new Set([...cur, ...visibleRows.map((r) => r.id)])))
    }
  }

  const handleSelect = (id) =>
    setSelectedIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])

  const handleSearch = (v) => { setSearch(v);   setCurrentPage(1) }
  const handleFilter = (v) => { setFilterBy(v); setCurrentPage(1) }

  return (
    <div className="min-h-full w-full bg-secondary-100 px-4 py-8.5 text-sm text-secondary-700 sm:px-8">
      <div className="mx-auto flex w-full max-w-380 flex-col">

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
        </div>

        {/* Toolbar */}
        <div
          className="mt-7"
          style={{
            display: 'grid',
            gridTemplateColumns: `${SEARCH_W}px ${SORT_W}px ${FILTER_W}px`,
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search"
            style={{ height: 44 }}
          />
          <FilterDropdown
            label="Sort by"
            icon={SlidersHorizontal}
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            style={{ height: 44 }}
            className="w-full"
          />
          <FilterDropdown
            label="Filter"
            icon={Funnel}
            options={subscriptionFilterOptions}
            value={filterBy}
            onChange={handleFilter}
            style={{ height: 44 }}
            className="w-full"
          />
        </div>

        {/* Table */}
        <Table className="mt-8 rounded-lg w-full overflow-hidden border border-secondary-300 bg-secondary-50 shadow-none">
          <colgroup>
            <col style={{ width: 48  }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 190 }} />
            <col style={{ width: 126 }} />
            <col style={{ width: 178 }} />
            <col style={{ width: 158 }} />
            <col style={{ width: 142 }} />
            <col style={{ width: 122 }} />
          </colgroup>

          <TableHeader className="border-b border-secondary-300 bg-secondary-100">
            <TableRow isHeader={true} className="border-b-0 bg-secondary-100 hover:bg-secondary-50">
              <TableHead className="h-[40px] p-0 align-middle">
                <div className="flex h-full items-center justify-between">
                  <div className="flex flex-1 justify-center">
                    <input
                      type="checkbox"
                      aria-label="Select all payments"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected }}
                      onChange={handleSelectAll}
                      className="h-[16px] w-[16px] cursor-pointer rounded border-secondary-400"
                      style={{ accentColor: 'var(--color-primary-600)' }}
                    />
                  </div>
                  <span className="h-[24px] w-px bg-secondary-300" />
                </div>
              </TableHead>
              <FinanceHeaderCell icon={User}           title="Full Name"    />
              <FinanceHeaderCell icon={EnvelopeSimple} title="Email"        />
              <FinanceHeaderCell icon={ReceiptText}    title="Amount"       />
              <FinanceHeaderCell icon={CreditCard}     title="Subscription" />
              <FinanceHeaderCell icon={CalendarIcon}   title="Date"         />
              <FinanceHeaderCell icon={ClockIcon}      title="Time"         />
              <FinanceHeaderCell icon={GearSixIcon}    title="Operations"   showDivider={false} />
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-secondary-300 bg-secondary-50 last:border-b-0 hover:bg-secondary-100"
              >
                <FinanceCell className="w-[48px] px-0">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                    aria-label={`Select ${row.name}`}
                    className="h-[16px] w-[16px] cursor-pointer rounded border-secondary-400"
                    style={{ accentColor: 'var(--color-primary-600)' }}
                  />
                </FinanceCell>
                <FinanceCell>{row.name}</FinanceCell>
                <FinanceCell>{row.email}</FinanceCell>
                <FinanceCell className="text-[14px] font-extrabold text-success">{row.amount}</FinanceCell>
                <FinanceCell>{row.subscription}</FinanceCell>
                <FinanceCell>{row.date}</FinanceCell>
                <FinanceCell>{row.time}</FinanceCell>
                <FinanceCell className="px-0">
                  <button className="inline-flex h-7 w-7 items-center justify-center rounded-full text-secondary-700 transition-colors hover:bg-secondary-200">
                    <MoreVertical size={20} weight="bold" />
                  </button>
                </FinanceCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-[42px]">
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}
