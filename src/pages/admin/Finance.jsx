import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import { api } from '../../services/api'
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
  PlusCircle,
  X,
} from '../../icons/index'
import { Button } from '../../components/ui/Button'

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

function mapPaymentRow(payment) {
  const date = payment.dateAndTime ? new Date(payment.dateAndTime) : null
  return {
    id: payment.paymentId,
    name: payment.memberFullName || '-',
    email: payment.email || '-',
    amount: Number(payment.amount || 0),
    subscription: payment.subscription || payment.paymentType || '-',
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
    time: date && !Number.isNaN(date.getTime()) ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '-',
    paymentType: payment.paymentType || '-',
  }
}

function normalizeFinanceRow(row) {
  return {
    ...row,
    amount: Number(String(row.amount || 0).replace(/[^\d.-]/g, '')),
  }
}

const sortOptions = [
  { label: 'Sort by',            value: 'All'         },
  { label: 'Newest first',       value: 'newest'      },
  { label: 'Amount high to low', value: 'amount-desc' },
  { label: 'Amount low to high', value: 'amount-asc'  },
]

const SEARCH_W = 48 + 170 + 190   // 408
const SORT_W   = 126 + 178        // 304
const FILTER_W = 200
const ACTION_W = 160

function AddPaymentModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    userId: '',
    amount: '',
    paymentMethod: 'Cash',
    paymentType: 'Subscription',
    referenceId: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    setSuccess(false)
    const amount = Number(form.amount)
    if (!form.userId.trim() || !form.referenceId.trim()) {
      setError('User ID and reference ID are required.')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Please enter a valid payment amount.')
      return
    }

    setLoading(true)
    try {
      await api.createPayment({
        userId: form.userId.trim(),
        amount,
        paymentMethod: form.paymentMethod,
        paymentType: form.paymentType,
        referenceId: form.referenceId.trim(),
        notes: form.notes.trim(),
      })
      setSuccess(true)
      await onCreated?.()
      setTimeout(onClose, 700)
    } catch (err) {
      console.error('Failed to create payment:', err)
      setError(err.message || 'Failed to create payment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 p-4">
      <div className="flex h-[calc(100vh-32px)] w-[480px] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ReceiptText size={20} className="text-secondary-600" />
            <h2 className="text-lg font-semibold text-secondary-700">Add Payment</h2>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-md p-1.5 text-secondary-400 transition-colors hover:bg-secondary-100 hover:text-secondary-700">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            {[
              { name: 'userId', label: 'Member User ID', placeholder: '550e8400-e29b-41d4-a716-446655440000' },
              { name: 'referenceId', label: 'Reference ID', placeholder: 'Subscription or invoice UUID' },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-xs font-normal text-secondary-500">{field.label}</label>
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="h-10 w-full rounded-lg border border-secondary-200 px-3 text-sm text-secondary-700 outline-none transition-all placeholder:text-secondary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-50"
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-xs font-normal text-secondary-500">Amount</label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="5000"
                className="h-10 w-full rounded-lg border border-secondary-200 px-3 text-sm text-secondary-700 outline-none transition-all placeholder:text-secondary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-normal text-secondary-500">Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="h-10 w-full rounded-lg border border-secondary-200 px-3 text-sm text-secondary-700 outline-none focus:border-primary-600">
                  <option value="Cash">Cash</option>
                  <option value="CreditCard">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-normal text-secondary-500">Payment Type</label>
                <select name="paymentType" value={form.paymentType} onChange={handleChange} className="h-10 w-full rounded-lg border border-secondary-200 px-3 text-sm text-secondary-700 outline-none focus:border-primary-600">
                  <option value="Subscription">Subscription</option>
                  <option value="Product">Product</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-normal text-secondary-500">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Payment notes"
                rows={3}
                className="w-full resize-none rounded-lg border border-secondary-200 px-3 py-2.5 text-sm text-secondary-700 outline-none transition-all placeholder:text-secondary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-50"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-secondary-200 px-6 py-4">
          {error && <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-600">{error}</p>}
          {success && <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-600">Payment created successfully.</p>}
          <div className="flex justify-end gap-3">
            <Button onClick={onClose} disabled={loading} className="rounded-xl border border-secondary-300 px-6 py-2.5 text-sm text-secondary-600 transition-all hover:bg-secondary-100">Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading || success} className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Saving...' : success ? 'Saved' : 'Add Payment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ stat }) {
  const { t } = useTranslation()
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
        <p className="text-[15px] font-medium leading-none text-secondary-600">{t(stat.label)}</p>
        <p className="mt-3 text-[39px] font-black leading-[0.95] tracking-normal text-secondary-900">{stat.value}</p>
        <p className="mt-4 text-[12px] font-medium leading-none text-secondary-500">{t('vs last month')}</p>
      </div>
    </section>
  )
}

function FinanceHeaderCell({ icon: Icon, title, className = '', showDivider = true }) {
  const { t } = useTranslation()

  return (
    <TableHead className={`h-[40px] p-0 align-middle ${className}`}>
      <div className="flex h-full items-center justify-between">
        <div className="flex flex-1 items-center justify-center gap-2 px-3 text-[13px] font-extrabold leading-none text-secondary-700">
          {Icon && <Icon size={16} strokeWidth={2.2} />}
          <span>{t(title)}</span>
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
  const { t } = useTranslation()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [search,      setSearch]      = useState('')
  const [sortBy,      setSortBy]      = useState('All')
  const [filterBy,    setFilterBy]    = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

  // Dynamic backend stats state
  const [financeStats, setFinanceStats] = useState(null)

  const loadPayments = async () => {
    setLoading(true)
    try {
      const [paymentsData, statsData] = await Promise.all([
        api.listPayments().catch(() => []),
        api.getFinanceDashboard().catch(() => null)
      ])
      
      setPayments(Array.isArray(paymentsData) && paymentsData.length > 0 ? paymentsData.map(mapPaymentRow) : financeRows.map(normalizeFinanceRow))
      setFinanceStats(statsData)
    } catch (err) {
      console.error('Failed to load payments:', err)
      setPayments(financeRows.map(normalizeFinanceRow))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const subscriptionOptions = useMemo(() => ([
    { label: 'All', value: 'All' },
    ...Array.from(new Set(payments.map((r) => r.subscription))).map((s) => ({
      label: s,
      value: s,
    })),
  ]), [payments])

  const dynamicStats = useMemo(() => {
    const totalRevenue = payments.reduce((sum, row) => sum + Number(row.amount || 0), 0)
    
    const revenueVal = financeStats?.lifetimeRevenue !== undefined 
      ? `$${Number(financeStats.lifetimeRevenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
      : `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    
    const paymentsCountVal = financeStats?.totalPayments !== undefined 
      ? String(financeStats.totalPayments) 
      : String(payments.length)

    const commissionVal = financeStats?.platformCommission !== undefined 
      ? `$${Number(financeStats.platformCommission).toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
      : "$18,940"

    const profitVal = financeStats?.netProfits !== undefined 
      ? `$${Number(financeStats.netProfits).toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
      : "$97,290"

    return [
      { label: 'Total Revenue', value: revenueVal, delta: '+12.5%', trend: 'up', icon: WalletIcon },
      { label: 'Total Payments', value: paymentsCountVal, delta: '-3.2%', trend: 'down', icon: MoneyIcon },
      { label: 'Platform Commission', value: commissionVal, delta: '+8.1%', trend: 'up', icon: PercentIcon },
      { label: 'Net Profit', value: profitVal, delta: '+10.4%', trend: 'up', icon: CurrencyDollarIcon },
    ]
  }, [payments, financeStats])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return payments.filter((row) => {
      const matchesSearch =
        !query ||
        [row.name, row.email, row.amount, row.subscription, row.date, row.time, row.paymentType]
          .join(' ').toLowerCase().includes(query)
      const matchesFilter = filterBy === 'All' || row.subscription === filterBy
      return matchesSearch && matchesFilter
    })
  }, [payments, search, filterBy])

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
          {dynamicStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
        </div>

        {/* Toolbar */}
        <div
          className="mt-7"
          style={{
            display: 'grid',
            gridTemplateColumns: `${SEARCH_W}px ${SORT_W}px ${FILTER_W}px ${ACTION_W}px`,
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
            options={subscriptionOptions}
            value={filterBy}
            onChange={handleFilter}
            style={{ height: 44 }}
            className="w-full"
          />
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-primary-600 px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(105,66,255,0.26)] transition-all duration-200 ease-out hover:bg-primary-700 active:scale-[0.98]"
          >
            <PlusCircle size={20} weight="bold" />
            {t('Add Payment')}
          </button>
        </div>

        {/* Table */}
        {loading && payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="animate-pulse text-base font-semibold text-secondary-500">{t('Loading payments...')}</p>
          </div>
        ) : (
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
                <FinanceCell className="text-[14px] font-extrabold text-success">${Number(row.amount || 0).toLocaleString()}</FinanceCell>
                <FinanceCell>{t(row.subscription)}</FinanceCell>
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
        )}

        <div className="mt-[42px]">
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
      {showPaymentModal && (
        <AddPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onCreated={loadPayments}
        />
      )}
    </div>
  )
}
