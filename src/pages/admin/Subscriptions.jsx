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
  X,
  PencilSimple as Edit2,
  Trash as Trash2
} from '../../icons/index'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import { api } from '../../services/api'
import AddPlanModal from '../../components/ui/AddPlanModal' // ← adjust path if needed

const sortOptions = [
  { label: 'Sort by', value: 'All' },
  { label: 'Price low to high', value: 'price-asc' },
  { label: 'Price high to low', value: 'price-desc' },
]

const statusOptions = [
  { label: 'Status', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Archived', value: 'Archived' },
]

const statusStyles = {
  Active: 'bg-success-bg text-success border border-success/15',
  Draft: 'bg-bg-suspended text-suspended border border-suspended/15',
  Archived: 'bg-error-bg text-error border border-error/15',
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

function RevenueCard({ totalRevenue = "$42,850" }) {
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
        <p className="mt-4 text-[43px] font-black leading-none tracking-normal text-white">{totalRevenue}</p>
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
  const displayStatus = status === "ACTIVE" || status === "Active" ? "Active" : status === "DRAFT" || status === "Draft" ? "Draft" : "Archived";
  return (
    <span className={`inline-flex h-[24px] min-w-[68px] items-center justify-center rounded-full px-3 text-[11px] font-extrabold leading-none ${statusStyles[displayStatus] || statusStyles.Draft}`}>
      {t(displayStatus)}
    </span>
  )
}

// Offline fallback mock data
const mockPlans = [
  { id: 'p1', name: 'Gold Membership', price: 99.99, status: 'Active', sessionCount: 50, duration: '1 Month', createdAt: 'Nov 12, 2026' },
  { id: 'p2', name: 'Silver Membership', price: 59.99, status: 'Active', sessionCount: 20, duration: '1 Month', createdAt: 'Nov 12, 2026' },
  { id: 'p3', name: 'Basic Monthly', price: 29.99, status: 'Active', sessionCount: 12, duration: '1 Month', createdAt: 'Mar 08, 2025' },
  { id: 'p4', name: 'Premium Monthly', price: 49.99, status: 'Active', sessionCount: 30, duration: '1 Month', createdAt: 'Mai 02, 2026' },
  { id: 'p5', name: 'Annual Pro', price: 499.99, status: 'Active', sessionCount: 360, duration: '1 Year', createdAt: 'Dec 10, 2023' },
  { id: 'p6', name: 'Weekend Warrior', price: 19.99, status: 'Draft', sessionCount: 8, duration: '1 Month', createdAt: 'Jun 06, 2026' }
];

export default function Subscriptions() {
  const { t } = useTranslation()
  const [plans, setPlans] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('All')
  const [status, setStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // Modal state — only showPlanModal is needed now (AddPlanModal owns its own form)
  const [showPlanModal, setShowPlanModal] = useState(false)

  // Operations dropdown
  const [activeMenuId, setActiveMenuId] = useState(null)

  const itemsPerPage = 12

  const loadPlans = async () => {
    setLoading(true)
    try {
      const data = await api.listPlans();
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans(mockPlans);
      }
    } catch (err) {
      console.error("Failed to load plans:", err);
      setPlans(mockPlans);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const visiblePlans = useMemo(() => {
    const query = search.trim().toLowerCase()
    let nextPlans = plans.filter((plan) => {
      const pName = plan.name || '';
      const pPrice = String(plan.price || '');
      const pStatus = plan.status || '';
      const pDuration = plan.duration || '';

      const matchesSearch = !query || [pName, pPrice, pStatus, pDuration].join(' ').toLowerCase().includes(query)
      const matchesStatus = status === 'All' || pStatus.toLowerCase() === status.toLowerCase()
      return matchesSearch && matchesStatus
    })

    if (sortBy === 'price-asc') {
      nextPlans = [...nextPlans].sort((a, b) => Number(a.price) - Number(b.price))
    }
    if (sortBy === 'price-desc') {
      nextPlans = [...nextPlans].sort((a, b) => Number(b.price) - Number(a.price))
    }

    return nextPlans
  }, [plans, search, sortBy, status])

  const totalPages = Math.ceil(visiblePlans.length / itemsPerPage)
  const paginatedPlans = visiblePlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const stats = useMemo(() => {
    const totalCount = plans.length;
    const activeCount = plans.filter(p => p.status === 'Active' || p.status === 'ACTIVE').length;
    const draftedCount = plans.filter(p => p.status === 'Draft' || p.status === 'DRAFT').length;

    return [
      {
        label: 'Total Plans',
        value: String(totalCount),
        note: `+${draftedCount} drafts`,
        icon: Stack,
        tone: 'purple',
      },
      {
        label: 'Active Plans',
        value: String(activeCount),
        note: 'All live and running',
        icon: CheckCircle,
        tone: 'blue',
      },
      {
        label: 'Most Popular',
        value: plans[0]?.name || 'N/A',
        note: 'High demand',
        icon: Star,
        tone: 'neutral',
      },
    ]
  }, [plans]);

  const focusSearch = () => {
    document.getElementById('global-search-input')?.focus()
  }

  const handleDeletePlan = async (plan) => {
    setActiveMenuId(null);
    if (!confirm(`Are you sure you want to soft-delete the "${plan.name}" plan?`)) return;
    try {
      await api.deletePlan(plan.id || plan.planId);
      loadPlans();
    } catch (err) {
      alert(`Error deleting plan: ${err.message}`);
    }
  };

  return (
    <div className="min-h-full w-full bg-secondary-100 px-4 py-[36px] text-sm text-secondary-700 sm:px-8 overflow-visible">
      <style>
        {`
          .dark .subscription-stat-card {
            background: #101014;
            border-color: #34343d;
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.02);
          }
          .dark .subscription-stat-card:hover {
            border-color: #454552;
            box-shadow: 0 22px 46px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03);
          }
          .dark .subscription-stat-card--purple .subscription-stat-glow {
            background: radial-gradient(circle at 100% 100%, rgba(105, 66, 255, 0.48) 0%, rgba(105, 66, 255, 0.22) 25%, rgba(16, 16, 20, 0) 60%);
            opacity: 0.74;
          }
          .dark .subscription-stat-card--blue .subscription-stat-glow,
          .dark .subscription-stat-card--neutral .subscription-stat-glow {
            opacity: 0;
          }
          .dark .subscription-stat-card--purple:hover .subscription-stat-glow {
            opacity: 0.95;
            transform: scale(1.12) translate(8px, 8px);
          }
          .dark .subscription-stat-icon {
            background: #1e1f29;
            color: #6942ff;
          }
          .dark .subscription-stat-badge {
            background: rgba(51, 109, 59, 0.42);
            color: #7dde85;
          }
          .dark .subscription-stat-label {
            color: #8368ff;
          }
          .dark .subscription-stat-value {
            color: #f4f4fb;
          }
          .dark .subscription-revenue-card {
            background: linear-gradient(135deg, #281673 0%, #2e1a77 52%, #3a2182 100%);
            box-shadow: 0 18px 38px rgba(27, 12, 77, 0.36);
          }
          .dark .subscription-revenue-card:hover {
            box-shadow: 0 26px 58px rgba(27, 12, 77, 0.52);
          }
        `}
      </style>

      <div className="mx-auto flex w-full max-w-380 flex-col overflow-visible">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_1fr_1fr_1fr]">
          {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
          <RevenueCard />
        </div>

        {/* Filters & Actions Bar */}
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

          {/* ✅ "Add Plan" button — opens AddPlanModal */}
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-primary-600 px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(105,66,255,0.26)] transition-all duration-200 ease-out hover:bg-primary-700 active:scale-[0.98]"
          >
            <PlusCircle size={20} weight="bold" />
            {t('Add Plan')}
          </button>
        </div>

        {/* Table */}
        {loading && plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-secondary-500 font-semibold text-base animate-pulse">{t('Loading plans...')}</p>
          </div>
        ) : (
          <Table className="mt-8 w-full overflow-visible rounded-lg border border-secondary-200 bg-secondary-50 shadow-none">
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
                <HeaderCell icon={Clock} title="Created At" showDivider={false} />
                <HeaderCell icon={GearSixIcon} title="Operations" showDivider={false} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlans.map((plan) => {
                const planId = plan.id || plan.planId;
                const formattedPrice = typeof plan.price === 'number' ? `$${plan.price.toFixed(2)}` : plan.price;
                const sessions = plan.sessionCount || plan.sessions || "Unlimited";
                const creationDate = plan.createdAt
                  ? (plan.createdAt.includes('PM') || plan.createdAt.includes('AM')
                    ? plan.createdAt
                    : new Date(plan.createdAt).toLocaleDateString())
                  : "Counter Registration";

                return (
                  <TableRow key={planId} className="border-b border-secondary-200 bg-secondary-50 last:border-b-0 hover:bg-secondary-100 overflow-visible">
                    <PlanCell>{t(plan.name)}</PlanCell>
                    <PlanCell>{formattedPrice}</PlanCell>
                    <PlanCell>
                      <StatusBadge status={plan.status || 'Active'} />
                    </PlanCell>
                    <PlanCell>{sessions}</PlanCell>
                    <PlanCell>{t(plan.duration || '1 Month')}</PlanCell>
                    <PlanCell>{creationDate}</PlanCell>
                    <PlanCell className="px-0 relative overflow-visible">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === planId ? null : planId)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-secondary-700 transition-colors hover:bg-secondary-200 cursor-pointer"
                      >
                        <DotsThreeVertical size={19} weight="bold" />
                      </button>

                      {activeMenuId === planId && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-8 top-0 mt-1 w-32 bg-white rounded-lg border border-secondary-200 shadow-lg z-20 py-1 text-left">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                // If you later add edit support to AddPlanModal,
                                // you can pass the plan as a prop here.
                                setShowPlanModal(true);
                              }}
                              className="w-full px-4 py-2 text-xs font-semibold text-secondary-600 hover:bg-secondary-100 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 size={12} />
                              {t('Edit Plan')}
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan)}
                              className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              {t('Delete Plan')}
                            </button>
                          </div>
                        </>
                      )}
                    </PlanCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <div className="mt-[34px]">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* ✅ AddPlanModal — renders when showPlanModal is true */}
      {showPlanModal && (
        <AddPlanModal
          onClose={() => setShowPlanModal(false)}
          onCreated={loadPlans}
        />
      )}
    </div>
  )
}
