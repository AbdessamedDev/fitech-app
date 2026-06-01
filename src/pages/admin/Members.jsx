import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MoreVertical, User, Mail, Phone, CreditCard, Calendar, Settings, Download, BadgeCheck } from 'lucide-react'
import { SlidersHorizontal, Funnel, UserPlus } from "../../icons/index"
import { Badge } from '../../components/ui/Badge'
import AddMemberModal from '../../components/ui/AddMemberModal'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import { PrimaryButton } from '../../components/shared/PrimaryButton'

const namesAndEmails = [
  { name: 'Ishaq Boukaddah', email: 'i.boukadeh@esi-sb...', phone: '+2136171813', subscription: 'Premium Monthly', date: 'Nov 12, 2026', status: 'Active' },
  { name: 'Emma Wilson', email: 'i.boukadeh@esi-sb...', phone: '+1839298232', subscription: 'Basic Monthly', date: 'Nov 12, 2026', status: 'Suspended' },
  { name: 'Sarah Johnson', email: 'sarah.johnson@e...', phone: '+2133487349', subscription: '-', date: 'Mar 08, 2025', status: 'Pending' },
  { name: 'Michael Chen', email: 'michel@gmail.com', phone: '+2392382323', subscription: 'Basic Monthly', date: 'Mai 02, 2026', status: 'Pending' },
  { name: 'Amina Hassan', email: 'a.hassan@gmail.c...', phone: '+3472347342', subscription: 'Annual Pro', date: 'Dec 10, 2023', status: 'Active' },
  { name: 'David Martinez', email: 'david.M@yahoo...', phone: '+2317936134', subscription: 'Premium Monthly', date: 'Nov 12, 2026', status: 'Active' },
  { name: 'Olivia Brown', email: 'olivaib@gmail.com', phone: '+3413432842', subscription: 'Annual Pro', date: 'Jan 22, 2026', status: 'Pending' },
  { name: 'Ahmed El-Sayed', email: 'ahem.es@esi-sba...', phone: '+3423423463', subscription: 'Annual Pro', date: 'Fev 23, 2024', status: 'Suspended' },
  { name: 'Lucas Garcia', email: 'lucas.garcia@yah...', phone: '+9138347134', subscription: 'Basic Monthly', date: 'Jun 06, 2026', status: 'Active' },
]

const mockMembers = Array.from({ length: 260 }).map((_, i) => ({
  id: i + 1,
  ...namesAndEmails[i % namesAndEmails.length],
}))

export default function Members() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState([6])
  const itemsPerPage = 15

  const filteredMembers = useMemo(() => {
    return mockMembers.filter(member =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search)
    )
  }, [search])

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const sortOptions = [
    { label: 'Sort by', value: 'All' },
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
  ]

  const headerCols = [
    { icon: User,       title: t('Full Name')    },
    { icon: Mail,       title: t('Email')        },
    { icon: Phone,      title: t('Phone')        },
    { icon: BadgeCheck, title: t('Status')       },
    { icon: CreditCard, title: t('Subscription') },
    { icon: Calendar,   title: t('Expiry Date')  },
    { icon: Settings,   title: t('Operations')   },
  ]

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-8 w-full flex justify-center text-sm transition-colors"
      style={{ backgroundColor: 'var(--color-bg-page, #f3f4f6)' }}
    >
      <div className="w-full max-w-[1400px]">
        {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}

        {/* ── TOP BAR ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 w-full">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1) }}
              placeholder={t('Search members...')}
              className="w-full md:w-80 lg:w-96"
            />

            <FilterDropdown
              label={t('Sort by')}
              icon={SlidersHorizontal}
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />

            <button className="h-10 flex items-center gap-2 px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors font-semibold text-sm">
              <Funnel size={17} />
              {t('Filter')}
            </button>

            <span
              className="hidden sm:inline h-5 w-px"
              style={{ backgroundColor: 'var(--color-secondary-300, #d1d5db)' }}
            />

            <button className="h-10 flex items-center gap-2 px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors font-semibold text-sm">
              <Download size={17} />
              {t('Import')}
            </button>
          </div>

          <PrimaryButton icon={UserPlus} onClick={() => setShowModal(true)}>
            {t('Add Member')}
          </PrimaryButton>
        </div>

        {/* ── TABLE ── */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            backgroundColor: 'var(--color-background-primary, #ffffff)',
            borderColor: 'var(--color-secondary-200, #e5e7eb)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <table className="w-full text-sm border-collapse">

            {/* ── HEAD ── */}
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-secondary-100, #f3f4f6)',
                  borderBottom: '1px solid var(--color-secondary-200, #e5e7eb)',
                }}
              >
                {/* Checkbox col */}
                <th className="w-14 py-4 px-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer rounded"
                      style={{ accentColor: 'var(--color-primary-600, #7c3aed)' }}
                    />
                  </div>
                </th>

                {headerCols.map(({ icon: Icon, title }, i) => (
                  <th
                    key={title}
                    className="py-4 px-4 font-semibold text-center"
                    style={{
                      color: 'var(--color-secondary-400, #9ca3af)',
                      fontSize: 14,
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon size={22} strokeWidth={1.8} />
                      <span>{title}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── BODY ── */}
            <tbody>
              {paginatedMembers.map((member, rowIdx) => (
                <tr
                  key={member.id}
                  onClick={() => navigate('/admin/member-profile', { state: { member } })}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: rowIdx < paginatedMembers.length - 1
                      ? '1px solid var(--color-secondary-100, #f3f4f6)'
                      : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-secondary-50, #f9fafb)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Checkbox */}
                  <td className="w-14 py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={(e) => { e.stopPropagation(); handleSelect(member.id) }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer rounded"
                      style={{ accentColor: 'var(--color-primary-600, #7c3aed)' }}
                    />
                  </td>

                  {/* Full Name */}
                  <td
                    className="py-4 px-4 text-center font-medium"
                    style={{ color: 'var(--color-secondary-700, #374151)', fontSize: 14 }}
                  >
                    {member.name}
                  </td>

                  {/* Email */}
                  <td
                    className="py-4 px-4 text-center"
                    style={{ color: 'var(--color-secondary-500, #6b7280)', fontSize: 14 }}
                  >
                    {member.email}
                  </td>

                  {/* Phone */}
                  <td
                    className="py-4 px-4 text-center"
                    style={{ color: 'var(--color-secondary-500, #6b7280)', fontSize: 14 }}
                  >
                    {member.phone}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center">
                      <Badge status={member.status} />
                    </div>
                  </td>

                  {/* Subscription */}
                  <td
                    className="py-4 px-4 text-center font-semibold"
                    style={{ color: 'var(--color-secondary-600, #4b5563)', fontSize: 14 }}
                  >
                    {member.subscription}
                  </td>

                  {/* Expiry Date */}
                  <td
                    className="py-4 px-4 text-center whitespace-nowrap"
                    style={{ color: 'var(--color-secondary-500, #6b7280)', fontSize: 14 }}
                  >
                    {member.date}
                  </td>

                  {/* Operations */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full transition-colors"
                      style={{ color: 'var(--color-secondary-400, #9ca3af)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-secondary-100, #f3f4f6)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}