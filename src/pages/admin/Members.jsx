import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MoreVertical, User, Mail, Phone,
  CreditCard, Calendar, Settings, Download, BadgeCheck, X, ShieldAlert, Activity, Eye, Trash2, Shield
} from 'lucide-react'
import { SlidersHorizontal, Funnel, UserPlus } from "../../icons/index"
import { Badge } from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import AddMemberModal from '../../components/ui/AddMemberModal'
import { api } from '../../services/api'

import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { SearchInput } from '../../components/shared/SearchInput'
import { PrimaryButton } from '../../components/shared/PrimaryButton'

// Offline fallback mock data
const namesAndEmails = [
  { name: 'Ishaq Boukaddah', email: 'i.boukadeh@esi-sba.dz', phone: '+2136171813', subscription: 'Premium Monthly', date: 'Nov 12, 2026', status: 'Active' },
  { name: 'Emma Wilson', email: 'emma.w@gmail.com', phone: '+1839298232', subscription: 'Basic Monthly', date: 'Nov 12, 2026', status: 'Suspended' },
  { name: 'Sarah Johnson', email: 'sarah.j@yahoo.com', phone: '+2133487349', subscription: '-', date: 'Mar 08, 2025', status: 'Pending' },
  { name: 'Michael Chen', email: 'michel.c@gmail.com', phone: '+2392382323', subscription: 'Basic Monthly', date: 'Mai 02, 2026', status: 'Pending' },
  { name: 'Amina Hassan', email: 'a.hassan@gmail.com', phone: '+3472347342', subscription: 'Annual Pro', date: 'Dec 10, 2023', status: 'Active' },
  { name: 'David Martinez', email: 'david.m@yahoo.com', phone: '+2317936134', subscription: 'Premium Monthly', date: 'Nov 12, 2026', status: 'Active' },
  { name: 'Olivia Brown', email: 'olivia.b@gmail.com', phone: '+3413432842', subscription: 'Annual Pro', date: 'Jan 22, 2026', status: 'Pending' },
  { name: 'Ahmed El-Sayed', email: 'ahmed.es@gmail.com', phone: '+3423423463', subscription: 'Annual Pro', date: 'Fev 23, 2024', status: 'Suspended' },
  { name: 'Lucas Garcia', email: 'lucas.garcia@yahoo.com', phone: '+9138347134', subscription: 'Basic Monthly', date: 'Jun 06, 2026', status: 'Active' }
]

const mockMembers = Array.from({ length: 120 }).map((_, i) => ({
  memberId: `mock-uuid-${i + 1}`,
  firstName: namesAndEmails[i % namesAndEmails.length].name.split(' ')[0],
  lastName: namesAndEmails[i % namesAndEmails.length].name.split(' ')[1] || '',
  email: namesAndEmails[i % namesAndEmails.length].email,
  phoneNumber: namesAndEmails[i % namesAndEmails.length].phone,
  status: namesAndEmails[i % namesAndEmails.length].status,
  activePlanName: namesAndEmails[i % namesAndEmails.length].subscription,
  joinDate: new Date(Date.now() - i * 86400000 * 5).toISOString(),
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
  const [sortBy, setSortBy] = useState('All') // Status Filter: 'All', 'Active', 'Suspended', 'Pending'
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [members, setMembers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  // Operation dropdown state
  const [activeMenuId, setActiveMenuId] = useState(null)

  // Details Modal state
  const [detailedMember, setDetailedMember] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const itemsPerPage = 15

  const fetchMembers = async () => {
    setLoading(true)
    setErrorText("")
    try {
      const data = await api.listMembers({
        page: currentPage,
        pageSize: itemsPerPage,
        search: search,
        status: sortBy !== 'All' ? sortBy : '',
      });

      if (data) {
        setMembers(data.items || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      // Offline mock data fallback so everything runs gracefully
      const filtered = mockMembers.filter(m => {
        const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = sortBy === 'All' || m.status.toLowerCase() === sortBy.toLowerCase();
        return matchesSearch && matchesStatus;
      });

      setMembers(filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      setTotalCount(filtered.length);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage) || 1);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, search, sortBy]);

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const allSelected =
    members.length > 0 && members.every((member) => selectedIds.includes(member.memberId))
  const someSelected = members.some((member) => selectedIds.includes(member.memberId)) && !allSelected

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !members.some((member) => member.memberId === id))
      )
    } else {
      setSelectedIds((current) =>
        Array.from(new Set([...current, ...members.map((member) => member.memberId)]))
      )
    }
  }

  // Row operations
  const handleSuspend = async (memberId) => {
    setActiveMenuId(null);
    try {
      await api.suspendMember(memberId);
      fetchMembers();
    } catch (err) {
      alert(`Failed to suspend member: ${err.message}`);
    }
  };

  const handleActivate = async (memberId) => {
    setActiveMenuId(null);
    try {
      await api.activateMember(memberId);
      fetchMembers();
    } catch (err) {
      alert(`Failed to activate member: ${err.message}`);
    }
  };

  const handleDelete = async (memberId) => {
    if (!confirm("Are you sure you want to soft-delete this member account?")) return;
    setActiveMenuId(null);
    try {
      await api.deleteMember(memberId);
      fetchMembers();
    } catch (err) {
      alert(`Failed to delete member: ${err.message}`);
    }
  };

  const handleViewDetails = async (member) => {
    setActiveMenuId(null);
    setLoadingDetails(true);
    try {
      const details = await api.getMember(member.memberId);
      // Ensure fallbacks are correct
      setDetailedMember({
        ...details,
        email: details.email || `${member.firstName.toLowerCase()}.${member.lastName.toLowerCase()}@example.com`,
        phoneNumber: details.phoneNumber || "+213-555-0199"
      });
    } catch (err) {
      console.warn("Failed to get backend details, loading mock details.");
      // Fallback detailed view
      setDetailedMember({
        memberId: member.memberId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email || `${member.firstName.toLowerCase()}.${member.lastName.toLowerCase()}@example.com`,
        phoneNumber: member.phoneNumber || "+213-555-0199",
        status: member.status,
        joinDate: member.joinDate,
        activeCardUid: "NF-83492711",
        noShowWarningCount: 1,
        activeSubscription: {
          planName: member.activePlanName || "Basic Monthly",
          startOnUTC: new Date(Date.now() - 15 * 86400000).toISOString(),
          endOnUTC: new Date(Date.now() + 15 * 86400000).toISOString(),
          remainingSessions: 12,
          status: "Active"
        },
        healthProfile: {
          objectives: "Cardio conditioning, muscle recovery",
          medicalRestrictions: "Back pain history"
        }
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Suspended', value: 'Suspended' },
    { label: 'Pending', value: 'Pending' }
  ];

  return (
    <div className='bg-secondary-100 min-h-screen py-8 px-4 sm:px-8 w-full flex justify-center text-sm'>
      <div className="w-full max-w-380 flex flex-col">
        {showModal && <AddMemberModal onClose={() => { setShowModal(false); fetchMembers(); }} />}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 w-full">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1); }}
              placeholder="Search members..."
              className="w-full md:w-80 lg:w-96"
            />

            <FilterDropdown
              label="Status Filter"
              icon={SlidersHorizontal}
              options={statusOptions}
              value={sortBy}
              onChange={(val) => { setSortBy(val); setCurrentPage(1); }}
            />

            <button onClick={() => document.getElementById('global-search-input')?.focus()} className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap">
              <Funnel size={18} />
              {t('Filter')}
            </button>
          </div>

          <PrimaryButton icon={UserPlus} onClick={() => setShowModal(true)}>
            {t('Add Member')}
          </PrimaryButton>
        </div>

        {loading && members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-secondary-500 font-semibold text-base animate-pulse">{t('Loading members from backend...')}</p>
          </div>
        ) : (
          <Table className="rounded-xl border border-secondary-200 overflow-visible shadow-sm w-full bg-secondary-50 text-[14px]">
            <TableHeader className="bg-secondary-100">
              <TableRow isHeader={true}>
                <TableHead className="p-0 align-middle w-[60px]">
                  <div className="flex items-center justify-between h-full h-[44px]">
                    <div className="flex-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected
                        }}
                        onChange={handleSelectAll}
                        className="w-[16px] h-[16px] rounded border-secondary-300 cursor-pointer"
                        style={{ accentColor: 'var(--color-primary-600)' }}
                      />
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
              {members.map((member) => {
                const fullName = `${member.firstName} ${member.lastName}`;
                const email = member.email || `${member.firstName.toLowerCase()}.${member.lastName.toLowerCase()}@example.com`;
                const phone = member.phoneNumber || member.phone || "+2135550199";
                const activePlan = member.activePlanName || "-";
                const formattedDate = member.joinDate ? new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-";

                return (
                  <TableRow key={member.memberId} className="hover:bg-secondary-100 transition-colors overflow-visible">
                    <TableCell className="p-0 text-center w-[60px]">
                      <div className="flex items-center justify-center h-full">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(member.memberId)}
                          onChange={() => handleSelect(member.memberId)}
                          className="w-[16px] h-[16px] rounded border-secondary-300 cursor-pointer"
                          style={{ accentColor: 'var(--color-primary-600)' }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-secondary-600 px-2 lg:px-4">{fullName}</TableCell>
                    <TableCell className="text-center text-secondary-500 font-medium px-2 lg:px-4">{email}</TableCell>
                    <TableCell className="text-center text-secondary-500 font-medium px-2 lg:px-4">{phone}</TableCell>
                    <TableCell className="text-center px-2 lg:px-4">
                      <div className="flex justify-center">
                        <Badge status={member.status} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-secondary-500 font-bold px-2 lg:px-4">{activePlan}</TableCell>
                    <TableCell className="text-center text-secondary-500 font-medium px-2 lg:px-4 whitespace-nowrap">{formattedDate}</TableCell>
                    <TableCell className="text-center px-2 lg:px-4 relative overflow-visible">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === member.memberId ? null : member.memberId)}
                          className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors cursor-pointer"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === member.memberId && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-12 top-0 mt-1 w-44 bg-white rounded-lg border border-secondary-200 shadow-lg z-20 py-1 text-left">
                              <button
                                onClick={() => handleViewDetails(member)}
                                className="w-full px-4 py-2 text-xs font-semibold text-secondary-600 hover:bg-secondary-100 flex items-center gap-2 cursor-pointer"
                              >
                                <Eye size={14} />
                                {t('View Details')}
                              </button>
                              {member.status !== "Active" ? (
                                <button
                                  onClick={() => handleActivate(member.memberId)}
                                  className="w-full px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Shield size={14} />
                                  {t('Activate Account')}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSuspend(member.memberId)}
                                  className="w-full px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <ShieldAlert size={14} />
                                  {t('Suspend Account')}
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(member.memberId)}
                                className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-t border-secondary-100 flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 size={14} />
                                {t('Delete Account')}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Details View Modal */}
      {detailedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs transition-all duration-300">
          <div className="bg-white border border-secondary-300 rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 bg-secondary-100">
              <h3 className="font-bold text-secondary-800 text-base flex items-center gap-2">
                <User size={20} className="text-primary-600" />
                {t('Member Profile Details')}
              </h3>
              <button
                onClick={() => setDetailedMember(null)}
                className="p-1.5 rounded-lg hover:bg-secondary-200 text-secondary-500 hover:text-secondary-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto text-secondary-600 text-sm leading-relaxed flex flex-col gap-6">
              {/* Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 font-bold text-xl">
                  {detailedMember.firstName[0]}{detailedMember.lastName[0]}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-lg text-secondary-800 leading-tight">
                    {detailedMember.firstName} {detailedMember.lastName}
                  </h4>
                  <p className="text-secondary-400 text-xs flex items-center gap-1">
                    <Mail size={12} /> {detailedMember.email}
                  </p>
                  <p className="text-secondary-400 text-xs flex items-center gap-1">
                    <Phone size={12} /> {detailedMember.phoneNumber}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge status={detailedMember.status} />
                </div>
              </div>

              {/* NFC Access Card */}
              <div className="border border-secondary-200 rounded-xl p-4 bg-secondary-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-400 font-bold uppercase tracking-wider">{t('Access Card UID')}</p>
                    <p className="text-sm font-semibold text-secondary-800 font-mono mt-0.5">{detailedMember.activeCardUid || "No Card Assigned"}</p>
                  </div>
                </div>
                {detailedMember.noShowWarningCount > 0 && (
                  <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-md border border-amber-200/50 flex items-center gap-1 font-bold">
                    <ShieldAlert size={12} /> {detailedMember.noShowWarningCount} No-show Warning(s)
                  </span>
                )}
              </div>

              {/* Active Subscription Details */}
              <div className="border border-secondary-200 rounded-xl p-4">
                <h5 className="font-bold text-secondary-800 text-sm mb-3 flex items-center gap-1.5 border-b border-secondary-100 pb-2">
                  <CreditCard size={16} className="text-primary-600" />
                  {t('Active Subscription')}
                </h5>
                {detailedMember.activeSubscription ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-secondary-400">{t('Plan Name')}</p>
                      <p className="text-sm font-bold text-primary-600 mt-0.5">{detailedMember.activeSubscription.planName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-400">{t('Status')}</p>
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200/50 font-bold mt-0.5">
                        {detailedMember.activeSubscription.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-400">{t('Validity')}</p>
                      <p className="text-xs font-semibold text-secondary-600 mt-0.5">
                        {new Date(detailedMember.activeSubscription.startOnUTC).toLocaleDateString()} - {new Date(detailedMember.activeSubscription.endOnUTC).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-400">{t('Remaining Sessions')}</p>
                      <p className="text-sm font-bold text-secondary-800 mt-0.5">
                        {detailedMember.activeSubscription.remainingSessions !== null ? detailedMember.activeSubscription.remainingSessions : t('Unlimited')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-secondary-400 italic py-2">{t('No active subscription found.')}</p>
                )}
              </div>

              {/* Health Profile & Objectives */}
              <div className="border border-secondary-200 rounded-xl p-4">
                <h5 className="font-bold text-secondary-800 text-sm mb-3 flex items-center gap-1.5 border-b border-secondary-100 pb-2">
                  <Activity size={16} className="text-primary-600" />
                  {t('Health Profile')}
                </h5>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs text-secondary-400 font-bold uppercase tracking-wider">{t('Objectives')}</p>
                    <p className="text-sm text-secondary-700 mt-1 bg-secondary-50 p-2.5 rounded-lg border border-secondary-150">
                      {detailedMember.healthProfile?.objectives || t('No objectives documented.')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-400 font-bold uppercase tracking-wider">{t('Medical Restrictions')}</p>
                    <p className="text-sm text-rose-600 mt-1 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                      {detailedMember.healthProfile?.medicalRestrictions || t('None')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-100 shrink-0">
              <button
                onClick={() => setDetailedMember(null)}
                className="h-9 px-5 rounded-md bg-secondary-200 hover:bg-secondary-300 text-secondary-700 hover:text-secondary-900 transition-all font-bold text-sm cursor-pointer border border-secondary-300"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}