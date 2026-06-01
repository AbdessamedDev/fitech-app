import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarBlank,
  CheckCircle,
  Clock,
  DotsThreeVertical,
  Funnel,
  GearSixIcon,
  PlusCircle,
  Pulse,
  SlidersHorizontal,
  Stack,
  Star,
  Tag,
  TrendUp,
  Wallet,
  ChartLineUp,
} from '../../icons/index'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import AddPlanModal from '../../components/ui/AddPlanModal'

const stats = [
  { label: 'Total Plans', value: '12', note: '+2 this month', icon: Stack, tone: 'purple' },
  { label: 'Active Plans', value: '8', note: 'All live', icon: CheckCircle, tone: 'blue' },
  { label: 'Most Popular', value: 'Performance', note: '45% Share', icon: Star, tone: 'neutral' },
]

const plans = [
  { id: 1, name: 'Plan name', price: '12$', status: 'ACTIVE', sessions: '20', duration: '1 Month', createdAt: '12:45 PM' },
  { id: 2, name: 'Plan name', price: '12$', status: 'ACTIVE', sessions: '20', duration: '1 Month', createdAt: '12:45 PM' },
  { id: 3, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
  { id: 4, name: 'Plan name', price: '50$', status: 'ARCHIVED', sessions: '30', duration: '1 Month', createdAt: '11:00 AM' },
  { id: 5, name: 'Plan name', price: '50$', status: 'ARCHIVED', sessions: '30', duration: '1 Month', createdAt: '11:00 AM' },
  { id: 6, name: 'Plan name', price: '15$', status: 'ACTIVE', sessions: '25', duration: '1 Month', createdAt: '11:30 AM' },
  { id: 7, name: 'Plan name', price: '18$', status: 'ACTIVE', sessions: '15', duration: '2 Months', createdAt: '10:15 AM' },
  { id: 8, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
  { id: 10, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
  { id: 11, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
  { id: 12, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
  { id: 13, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
  { id: 14, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
  { id: 9, name: 'Plan name', price: '25$', status: 'DRAFT', sessions: '12', duration: '1 Month', createdAt: '2:00 PM' },
]

const sortOptions = [
  { label: 'Sort by', value: 'All' },
  { label: 'Price low to high', value: 'price-asc' },
  { label: 'Price high to low', value: 'price-desc' },
]

const statusOptions = [
  { label: 'Status', value: 'All' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const statusStyles = {
  ACTIVE: 'bg-success-bg text-success',
  DRAFT: 'bg-bg-suspended text-suspended',
  ARCHIVED: 'bg-error-bg text-error',
}

const statToneStyles = {
  purple: {
    iconWrap: 'bg-[#ECE7FF] text-primary-600',
    glow: 'from-transparent via-transparent to-primary-50',
    glowHover: 'group-hover:opacity-100 group-hover:scale-115 group-hover:translate-x-2 group-hover:translate-y-2',
  },
  blue: {
    iconWrap: 'bg-[#EEE9FF] text-primary-600',
    glow: 'from-transparent via-transparent to-[#F6F8FF]',
    glowHover: 'group-hover:opacity-100 group-hover:scale-110 group-hover:translate-x-1.5 group-hover:translate-y-1.5',
  },
  neutral: {
    iconWrap: 'bg-[#EEF0F4] text-primary-600',
    glow: 'from-transparent via-transparent to-secondary-100',
    glowHover: 'group-hover:opacity-100 group-hover:scale-110 group-hover:translate-x-1 group-hover:translate-y-1',
  },
}

function StatCard({ stat }) {
  const { t } = useTranslation()
  const Icon = stat.icon
  const tone = statToneStyles[stat.tone]
  return (
    <section className={`subscription-stat-card subscription-stat-card--${stat.tone} group relative h-[206px] overflow-hidden rounded-[14px] border border-secondary-300 bg-secondary-50 px-8 py-8 shadow-[0_8px_26px_rgba(105,66,255,0.05)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-[0_18px_42px_rgba(105,66,255,0.16)]`}>
      <div className={`subscription-stat-glow absolute inset-0 origin-bottom-right bg-linear-to-br opacity-90 transition-all duration-500 ease-out ${tone.glow} ${tone.glowHover}`} />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className={`subscription-stat-icon flex h-[52px] w-[52px] items-center justify-center rounded-[12px] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 ${tone.iconWrap}`}>
            <Icon size={26} weight="bold" />
          </div>
          <span className="subscription-stat-badge rounded-[18px] bg-success-bg px-3 py-1.5 text-[13px] font-extrabold leading-none text-success">
            {t(stat.note)}
          </span>
        </div>
        <div>
          <p className="subscription-stat-label text-[16px] font-medium leading-none text-primary-600">{t(stat.label)}</p>
          <p className="subscription-stat-value mt-4 text-[39px] font-black leading-none tracking-normal text-secondary-900">{t(stat.value)}</p>
        </div>
      </div>
    </section>
  )
}

function RevenueCard() {
  const { t } = useTranslation()
  return (
    <section className="subscription-revenue-card group h-[206px] overflow-hidden rounded-[14px] bg-linear-to-br from-[#251467] via-[#2B176D] to-[#372170] px-8 py-8 text-white shadow-[0_14px_34px_rgba(38,20,103,0.32)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_54px_rgba(38,20,103,0.46)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-[48px] w-[58px] items-center justify-center rounded-[12px] bg-white/8 text-[#B9A7FF] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3">
          <Wallet size={28} weight="bold" />
        </div>
        <span className="rounded-[17px] bg-white/10 px-3 py-1.5 text-[13px] font-bold leading-none text-[#E7E0FF]">
          ↑ 12.4%
        </span>
      </div>
      <div className="mt-[34px]">
        <p className="text-[17px] font-medium leading-none text-[#AFA3E2]">{t('Monthly Revenue')}</p>
        <p className="mt-4 text-[43px] font-black leading-none tracking-normal text-white">$42,850</p>
      </div>
    </section>
  )
}

function HeaderCell({ icon: Icon, title, className = '', showDivider = true }) {
  const { t } = useTranslation()
  return (
    <TableHead className={`h-[48px] p-0 align-middle ${className}`}>
      <div className="flex h-full items-center justify-between">
        <div className="flex flex-1 items-center justify-center gap-2 px-3 text-[15px] font-semibold leading-none text-secondary-500">
          {Icon && <Icon size={17} weight="bold" />}
          <span>{t(title)}</span>
        </div>
        {showDivider && <span className="h-[28px] w-px bg-secondary-300" />}
      </div>
    </TableHead>
  )
}

function PlanCell({ children, className = '' }) {
  return (
    <TableCell className={`h-[48px] px-3 py-0 text-center text-[13px] font-medium leading-none text-secondary-500 ${className}`}>
      {children}
    </TableCell>
  )
}

function StatusBadge({ status }) {
  const { t } = useTranslation()
  return (
    <span className={`inline-flex h-[24px] min-w-[68px] items-center justify-center rounded-full px-3 text-[11px] font-extrabold leading-none ${statusStyles[status]}`}>
      {t(status)}
    </span>
  )
}

export default function Subscriptions() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('All')
  const [status, setStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const itemsPerPage = 12

  const visiblePlans = useMemo(() => {
    const query = search.trim().toLowerCase()
    let nextPlans = plans.filter((plan) => {
      const matchesSearch = !query || [plan.name, plan.price, plan.status, plan.duration, plan.createdAt].join(' ').toLowerCase().includes(query)
      const matchesStatus = status === 'All' || plan.status === status
      return matchesSearch && matchesStatus
    })
    if (sortBy === 'price-asc') nextPlans = [...nextPlans].sort((a, b) => Number.parseInt(a.price) - Number.parseInt(b.price))
    if (sortBy === 'price-desc') nextPlans = [...nextPlans].sort((a, b) => Number.parseInt(b.price) - Number.parseInt(a.price))
    return nextPlans
  }, [search, sortBy, status])

  const totalPages = Math.ceil(visiblePlans.length / itemsPerPage)
  const paginatedPlans = visiblePlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const focusSearch = () => {
    document.getElementById('global-search-input')?.focus()
  }

  return (
    <div className="min-h-full w-full bg-secondary-100 px-4 py-[36px] text-sm text-secondary-700 sm:px-8">

      {/* Modal */}
      {showModal && <AddPlanModal onClose={() => setShowModal(false)} />}

      <style>{`
        .dark .subscription-stat-card { background: #101014; border-color: #34343d; box-shadow: 0 16px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.02); }
        .dark .subscription-stat-card:hover { border-color: #454552; box-shadow: 0 22px 46px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03); }
        .dark .subscription-stat-card--purple .subscription-stat-glow { background: radial-gradient(circle at 100% 100%, rgba(105,66,255,0.48) 0%, rgba(105,66,255,0.22) 25%, rgba(16,16,20,0) 60%); opacity: 0.74; }
        .dark .subscription-stat-card--blue .subscription-stat-glow, .dark .subscription-stat-card--neutral .subscription-stat-glow { opacity: 0; }
        .dark .subscription-stat-card--purple:hover .subscription-stat-glow { opacity: 0.95; transform: scale(1.12) translate(8px, 8px); }
        .dark .subscription-stat-icon { background: #1e1f29; color: #6942ff; }
        .dark .subscription-stat-badge { background: rgba(51,109,59,0.42); color: #7dde85; }
        .dark .subscription-stat-label { color: #8368ff; }
        .dark .subscription-stat-value { color: #f4f4fb; }
        .dark .subscription-revenue-card { background: linear-gradient(135deg, #281673 0%, #2e1a77 52%, #3a2182 100%); box-shadow: 0 18px 38px rgba(27,12,77,0.36); }
        .dark .subscription-revenue-card:hover { box-shadow: 0 26px 58px rgba(27,12,77,0.52); }
      `}</style>

      <div className="mx-auto flex w-full max-w-380 flex-col">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_1fr_1fr_1fr]">
          {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
          <RevenueCard />
        </div>

        <div className="mt-[38px] flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center xl:w-auto">
            <SearchInput
              value={search}
              onChange={(value) => { setSearch(value); setCurrentPage(1) }}
              placeholder="Search"
              className="w-full lg:w-62.5 xl:w-120"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto">
              <FilterDropdown
                label="Sort by" icon={SlidersHorizontal} options={sortOptions} value={sortBy}
                onChange={(value) => { setSortBy(value); setCurrentPage(1) }}
                className="w-full lg:w-[196px]"
              />
              <FilterDropdown
                label="Status" icon={TrendUp} options={statusOptions} value={status}
                onChange={(value) => { setStatus(value); setCurrentPage(1) }}
                className="w-full lg:w-[196px]"
              />
            </div>
            <button
              onClick={focusSearch}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-[13px] font-bold text-primary-600 transition-colors hover:bg-primary-50 lg:justify-start"
            >
              <Funnel size={18} weight="bold" />
              Filter
            </button>
          </div>

          {/* Add Plan Button — opens modal */}
          <button
            onClick={() => setShowModal(true)}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-primary-600 px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(105,66,255,0.26)] transition-all duration-200 ease-out hover:bg-primary-700 active:scale-[0.98]"
          >
            <PlusCircle size={20} weight="bold" />
            {t('Add Plan')}
          </button>
        </div>

        <Table className="mt-8 w-full overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50 shadow-none">
          <colgroup>
            <col className="w-[186px]" />
            <col className="w-[152px]" />
            <col className="w-[168px]" />
            <col className="w-[176px]" />
            <col className="w-[160px]" />
            <col className="w-[158px]" />
            <col className="w-[146px]" />
          </colgroup>
          <TableHeader className="border-b border-secondary-200 bg-secondary-50">
            <TableRow isHeader={true} className="border-b-0 bg-secondary-50 hover:bg-secondary-50">
              <HeaderCell icon={Pulse} title="Plan Name" />
              <HeaderCell icon={Tag} title="Price" />
              <HeaderCell icon={ChartLineUp} title="Status" />
              <HeaderCell icon={CalendarBlank} title="Sessions Number" />
              <HeaderCell icon={CalendarBlank} title="Duration" />
              <HeaderCell icon={Clock} title="Created At" />
              <HeaderCell icon={GearSixIcon} title="Operations" showDivider={false} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlans.map((plan) => (
              <TableRow key={plan.id} className="border-b border-secondary-200 bg-secondary-50 last:border-b-0 hover:bg-secondary-100">
                <PlanCell>{t(plan.name)}</PlanCell>
                <PlanCell>{plan.price}</PlanCell>
                <PlanCell><StatusBadge status={plan.status} /></PlanCell>
                <PlanCell>{plan.sessions}</PlanCell>
                <PlanCell>{t(plan.duration)}</PlanCell>
                <PlanCell>{plan.createdAt}</PlanCell>
                <PlanCell className="px-0">
                  <button className="inline-flex h-7 w-7 items-center justify-center rounded-full text-secondary-700 transition-colors hover:bg-secondary-200">
                    <DotsThreeVertical size={19} weight="bold" />
                  </button>
                </PlanCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-[34px]">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}