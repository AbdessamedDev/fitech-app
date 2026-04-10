import { useState, useMemo } from 'react'
import { Search, Filter, MoreVertical, User, Mail, Phone, AlertCircle, CreditCard, Calendar, Settings, Download, ChevronDown } from 'lucide-react'
import {SlidersHorizontal, UserPlus, FileCloud, Funnel, MagnifyingGlass} from "../../icons/index"
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import AddMemberModal from '../../components/ui/AddMemberModal'

const mockMembers = [
  { id: 1, name: 'Isabella Baker', email: 'i.bookader@gmail.c', phone: '+1876284232', status: 'Active', subscription: 'Basic Monthly', date: 'Nov 12, 2024' },
  { id: 2, name: 'Emma Wilson', email: 'i.bookader@gmail.c', phone: '+1876284232', status: 'Suspended', subscription: 'Basic Monthly', date: 'Nov 12, 2024' },
  { id: 3, name: 'Sarah Johnson', email: 'sarah.johnson@gmail.c', phone: '+1234567890', status: 'Pending', subscription: 'Basic Monthly', date: 'Mar 08, 2025' },
  { id: 4, name: 'Amara Hassan', email: 'a.hassan@gmail.c', phone: '+4723847242', status: 'Active', subscription: 'Annual Pro', date: 'Dec 11, 2023' },
  { id: 5, name: 'David Martinez', email: 'david.M@yahoo.c', phone: '+2517536134', status: 'Active', subscription: 'Premium Monthly', date: 'Nov 12, 2024' },
  { id: 6, name: 'Abu Alagoa', email: 'ali@gca@gmail.c', phone: '+4423822263', status: 'Suspended', subscription: 'Annual Pro', date: 'Feb 23, 2024' },
  { id: 7, name: 'Lucas Garcia', email: 'lucas.garcia@yahoo.c', phone: '+9130847134', status: 'Active', subscription: 'Basic Monthly', date: 'Jun 08, 2026' },
  { id: 8, name: 'Noah Buckwalter', email: 'noah.b@gmail.c', phone: '+5130847134', status: 'Active', subscription: 'Premium Monthly', date: 'Nov 12, 2025' },
  { id: 9, name: 'Emma Wilson', email: 'i.bookader@gmail.c', phone: '+1876284232', status: 'Suspended', subscription: 'Basic Monthly', date: 'Nov 12, 2024' },
  { id: 10, name: 'Sarah Johnson', email: 'sarah.johnson@gmail.c', phone: '+1234567890', status: 'Pending', subscription: 'Basic Monthly', date: 'Mar 08, 2025' },
]

function getStatusVariant(status) {
  switch (status) {
    case 'Active': return 'active'
    case 'Suspended': return 'suspended'
    case 'Pending': return 'pending'
    default: return 'default'
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'Active': return '✓'
    case 'Suspended': return '✕'
    case 'Pending': return '⊙'
    default: return '•'
  }
}

export default function Members() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const itemsPerPage = 10

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

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className='bg-secondary-100 min-h-dvh p-10'>

      {/* Add Member Modal */}
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-6 mb-6">
        <div className="flex items-center" style={{ gap: '16px', flex: 1 }}>
          {/* Search */}
          <div className="relative" style={{ width: '335px' }}>
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"/>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 pl-10 w-full px-4 py-2 rounded-md bg-secondary-50"
            />
          </div>

          {/* Sort By */}
          <button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-secondary-50 text-secondary-400 border border-secondary-300 hover:bg-secondary-100 cursor-pointer">
            <SlidersHorizontal size={20}/>
            <span style={{ fontSize: '14px' }}>Sort by</span>
            <ChevronDown size={16} />
          </button>

          {/* Filter */}
          <Button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition bg-secondary-100 text-primary-600 hover:bg-primary-50 cursor-pointer transform active:scale-95">
            <Funnel size={18} />
            Filter
          </Button>

          <div className='text-2xl -mx-4 text-secondary-300'>|</div>

          {/* Import */}
          <Button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md bg-secondary-100 text-primary-600 hover:bg-primary-50 cursor-pointer transform active:scale-95">
            <FileCloud size={18} />
            Import
          </Button>
        </div>

        {/* Add Member Button */}
        <Button
          onClick={() => setShowModal(true)}
          className="h-10 flex items-center gap-2 px-4 py-2 rounded-xl font-normal bg-primary-600 text-secondary-50 hover:shadow-[0_4px_16px_rgba(141,112,255,0.3)] active:scale-98 transition-all"
        >
          <UserPlus size={20} weight="bold" />
          Add Member
        </Button>
      </div>

      {/* Table Container */}
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottom: '1px solid', borderBottomColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <TableHead className="w-12" style={{ padding: '16px' }}>
                <input type="checkbox" className="w-4 h-4 rounded" style={{ borderColor: 'var(--border)', cursor: 'pointer' }} />
              </TableHead>
              <TableHead style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-secondary)' }}>
                <User size={16} />Full Name<span style={{ color: 'var(--border)' }}>|</span>
              </TableHead>
              <TableHead style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-secondary)' }}>
                <Mail size={16} />Email<span style={{ color: 'var(--border)' }}>|</span>
              </TableHead>
              <TableHead style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-secondary)' }}>
                <Phone size={16} />Phone<span style={{ color: 'var(--border)' }}>|</span>
              </TableHead>
              <TableHead style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-secondary)' }}>
                <AlertCircle size={16} />Status<span style={{ color: 'var(--border)' }}>|</span>
              </TableHead>
              <TableHead style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-secondary)' }}>
                <CreditCard size={16} />Subscription<span style={{ color: 'var(--border)' }}>|</span>
              </TableHead>
              <TableHead style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-secondary)' }}>
                <Calendar size={16} />Expiry Date<span style={{ color: 'var(--border)' }}>|</span>
              </TableHead>
              <TableHead style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--foreground-secondary)', width: '60px' }}>
                <Settings size={16} />Operations
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow key={member.id} style={{ borderBottom: '1px solid', borderBottomColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <TableCell style={{ padding: '16px' }}>
                  <input type="checkbox" className="w-4 h-4 rounded" style={{ borderColor: 'var(--border)', cursor: 'pointer' }} />
                </TableCell>
                <TableCell style={{ padding: '16px', color: 'var(--foreground)' }}>{member.name}</TableCell>
                <TableCell style={{ padding: '16px', color: 'var(--foreground-secondary)' }}>{member.email}</TableCell>
                <TableCell style={{ padding: '16px', color: 'var(--foreground-secondary)' }}>{member.phone}</TableCell>
                <TableCell style={{ padding: '16px' }}>
                  <Badge variant={getStatusVariant(member.status)}>
                    {getStatusIcon(member.status)} {member.status}
                  </Badge>
                </TableCell>
                <TableCell style={{ padding: '16px', color: 'var(--foreground-secondary)' }}>{member.subscription}</TableCell>
                <TableCell style={{ padding: '16px', color: 'var(--foreground-secondary)' }}>{member.date}</TableCell>
                <TableCell style={{ padding: '16px', textAlign: 'center' }}>
                  <button style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground-secondary)', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                    <MoreVertical size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2" style={{ marginTop: '32px' }}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderColor: 'var(--border)', border: '1px solid', color: currentPage === 1 ? 'var(--foreground-tertiary)' : 'var(--foreground-secondary)', backgroundColor: 'var(--surface)' }}
        >
          ◄
        </button>

        {generatePageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2" style={{ color: 'var(--foreground-tertiary)' }}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className="w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors"
              style={currentPage === page ? { backgroundColor: 'var(--primary)', color: 'white' } : { borderColor: 'var(--border)', border: '1px solid', color: 'var(--foreground-secondary)', backgroundColor: 'var(--surface)' }}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderColor: 'var(--border)', border: '1px solid', color: currentPage === totalPages ? 'var(--foreground-tertiary)' : 'var(--foreground-secondary)', backgroundColor: 'var(--surface)' }}
        >
          ►
        </button>
      </div>
    </div>
  )
}