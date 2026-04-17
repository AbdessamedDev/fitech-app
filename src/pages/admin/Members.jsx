import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MoreVertical, User, Mail, Phone,
  CreditCard, Calendar, Settings, Download, BadgeCheck
} from 'lucide-react'
import { SlidersHorizontal, Funnel, UserPlus } from "../../icons/index"
import { Badge } from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import AddMemberModal from '../../components/ui/AddMemberModal'

import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import { PrimaryButton } from '../../components/shared/PrimaryButton'

const namesAndEmails = [
  { name: 'ishaq Boukaddah', email: 'i.boukadeh@esi-sb...', phone: '+2136171813', subscription: 'Premium Monthly', date: 'Nov 12, 2026', status: 'Active' },
  { name: 'Emma Wilson', email: 'i.boukadeh@esi-sb...', phone: '+1839298232', subscription: 'Basic Monthly', date: 'Nov 12, 2026', status: 'Suspended' },
  { name: 'Sarah Johnson', email: 'sarah.johnson@e...', phone: '+2133487349', subscription: '-', date: 'Mar 08, 2025', status: 'Pending' },
  { name: 'Michael Chen', email: 'michel@gmail.com', phone: '+2392382323', subscription: 'Basic Monthly', date: 'Mai 02, 2026', status: 'Pending' },
  { name: 'Amina Hassan', email: 'a.hassan@gmail.c...', phone: '+3472347342', subscription: 'Annual Pro', date: 'Dec 10, 2023', status: 'Active' },
  { name: 'David Martinez', email: 'david.M@yahoo...', phone: '+2317936134', subscription: 'Premium Monthly', date: 'Nov 12, 2026', status: 'Active' },
  { name: 'Olivia Brown', email: 'olivaib@gmail.com', phone: '+3413432842', subscription: 'Annual Pro', date: 'Jan 22, 2026', status: 'Pending' },
  { name: 'Ahmed El-Sayed', email: 'ahem.es@esi-sba...', phone: '+3423423463', subscription: 'Annual Pro', date: 'Fev 23, 2024', status: 'Suspended' },
  { name: 'Lucas Garcia', email: 'lucas.garcia@yah...', phone: '+9138347134', subscription: 'Basic Monthly', date: 'Jun 06, 2026', status: 'Active' }
]

const mockMembers = Array.from({ length: 260 }).map((_, i) => ({
  id: i + 1,
  ...namesAndEmails[i % namesAndEmails.length]
}));

const TableHeaderCell = ({ icon: Icon, title, showPipe = true }) => (
  <TableHead className="p-0 align-middle">
    <div className="flex items-center justify-between h-10">
      <div className="flex flex-1 items-center justify-center gap-2 px-3 lg:px-4 text-secondary-500 font-semibold text-[13px]">
        {Icon && <Icon size={16} strokeWidth={2}/>}
        {title && <span>{title}</span>}
      </div>
      {showPipe && <div className="w-px h-[18px] bg-secondary-200"></div>}
    </div>
  </TableHead>
)

export default function Members() {
  const { t } = useTranslation()
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
    { label: 'Name (Z-A)', value: 'name-desc' }
  ];

  return (
    <div className='bg-secondary-50 min-h-screen py-8 px-4 sm:px-8 w-full flex justify-center text-sm'>
      <div className="w-full max-w-420">
        {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 w-full">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1); }}
              placeholder="Search members..."
              className="w-full md:w-80 lg:w-96"
            />

            <FilterDropdown
              label="Sort by"
              icon={SlidersHorizontal}
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />

            <button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap">
              <Funnel size={18} />
              {t('Filter')}
            </button>

            <span className="hidden sm:inline-block text-secondary-300 font-extrabold opacity-50">|</span>

            <button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap">
              <Download size={18} />
              {t('Import')}
            </button>
          </div>

          <PrimaryButton icon={UserPlus} onClick={() => setShowModal(true)}>
            {t('Add Member')}
          </PrimaryButton>
        </div>

        <Table className="rounded-xl border border-secondary-200 overflow-hidden shadow-sm w-full bg-secondary-50 text-[14px]">
          <TableHeader className="bg-secondary-100">
            <TableRow isHeader={true}>
              <TableHead className="p-0 align-middle w-[60px]">
                <div className="flex items-center justify-between h-full h-[44px]">
                  <div className="flex-1 flex justify-center">
                    <input type="checkbox" className="w-[16px] h-[16px] rounded border-secondary-300 cursor-pointer" style={{ accentColor: 'var(--color-primary-600)' }} />
                  </div>
                  <div className="w-px h-[18px] bg-secondary-200"></div>
                </div>
              </TableHead>
              <TableHeaderCell icon={User} title={t('Full Name')} />
              <TableHeaderCell icon={Mail} title={t('Email')} />
              <TableHeaderCell icon={Phone} title={t('Phone')} />
              <TableHeaderCell icon={BadgeCheck} title={t('Status')} />
              <TableHeaderCell icon={CreditCard} title={t('Subscription')} />
              <TableHeaderCell icon={Calendar} title={t('Expiry Date')} />
              <TableHeaderCell icon={Settings} title={t('Operations')} showPipe={false} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow key={member.id} className="hover:bg-secondary-100 transition-colors">
                <TableCell className="p-0 text-center w-[60px]">
                  <div className="flex items-center justify-center h-full">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={() => handleSelect(member.id)}
                      className="w-[16px] h-[16px] rounded border-secondary-300 cursor-pointer"
                      style={{ accentColor: 'var(--color-primary-600)' }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium text-secondary-600 px-2 lg:px-4">{member.name}</TableCell>
                <TableCell className="text-center text-secondary-500 font-medium px-2 lg:px-4">{member.email}</TableCell>
                <TableCell className="text-center text-secondary-500 font-medium px-2 lg:px-4">{member.phone}</TableCell>
                <TableCell className="text-center px-2 lg:px-4">
                  <div className="flex justify-center">
                    <Badge status={member.status} />
                  </div>
                </TableCell>
                <TableCell className="text-center text-secondary-500 font-bold px-2 lg:px-4">{member.subscription}</TableCell>
                <TableCell className="text-center text-secondary-500 font-medium px-2 lg:px-4 whitespace-nowrap">{member.date}</TableCell>
                <TableCell className="text-center px-2 lg:px-4">
                  <div className="flex justify-center">
                    <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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