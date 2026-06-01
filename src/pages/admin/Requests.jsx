import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SlidersHorizontal,
  Trash,
  Check,
  X,
  ClipboardText,
  EnvelopeSimple,
  User,
  Clock,
  CheckCircle,
  WarningCircle,
  Funnel,
} from '../../icons/index'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { SearchInput } from '../../components/shared/SearchInput'

const initialMockRequests = [
  {
    id: 1,
    authorName: 'John Doe',
    authorEmail: 'john.doe@gmail.com',
    authorImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    authorType: 'coach',
    status: 'pending',
    description: 'Hello FitTech Admin! I am a certified senior coach with over 8 years of professional experience in CrossFit, weightlifting, and athletic performance. I am applying to join the FitTech coaching panel to run high-intensity evening classes. I hold NASM-CPT, CrossFit Level 2, and Precision Nutrition certifications. In my past role at Peak Fitness, I successfully trained and managed over 150 personal training clients. I am extremely eager to bring my expertise to FitTech to elevate members experiences. I would appreciate the opportunity to discuss my application further in an interview!',
    dateRequested: 'May 24, 2026',
    dateResolved: null
  },
  {
    id: 2,
    authorName: 'Jane Smith',
    authorEmail: 'jane.smith@yahoo.com',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorType: 'member',
    status: 'pending',
    description: 'I have been a standard monthly member for 3 months and would like to request an upgrade to Premium Annual membership, including full locker room access, sauna access, and a personalized monthly nutritionist session. Please process my upgrade as soon as possible. Thank you so much for maintaining such an outstanding facility!',
    dateRequested: 'May 23, 2026',
    dateResolved: null
  },
  {
    id: 3,
    authorName: 'Michael Chang',
    authorEmail: 'm.chang@kinesiology.edu',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorType: 'coach',
    status: 'approved',
    description: 'Dear Admin, I am writing to apply for the position of Strength & Conditioning Coach. I specialize in injury prevention, biomechanics, and rehabilitation. I hold a Master\'s degree in Kinesiology from Stanford University and have worked with elite collegiate athletes for the past 5 years. I believe my structured, science-based approach will be a perfect addition to FitTech\'s premium standard. I look forward to your review of my resume and qualifications.',
    dateRequested: 'May 18, 2026',
    dateResolved: 'May 19, 2026'
  },
  {
    id: 4,
    authorName: 'Amina Mansour',
    authorEmail: 'amina.m@gmail.com',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    authorType: 'member',
    status: 'pending',
    description: 'Requesting a temporary suspension of my membership for 2 months (from June 1st to August 1st) due to unexpected corporate travel out of the country. I would highly appreciate it if the billing cycles are paused during this timeframe and resumed automatically when I return. I can provide the official company travel letter if requested. Thank you for your cooperation and understanding.',
    dateRequested: 'May 22, 2026',
    dateResolved: null
  },
  {
    id: 5,
    authorName: 'Arnold Schwarzenegger',
    authorEmail: 'arnold@goldshouse.com',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorType: 'coach',
    status: 'rejected',
    description: 'Applying as a Heavy Weightlifting Coach. I want to launch an intensive "Pump Iron" bootcamp at your facility focusing strictly on traditional barbell exercises and compound movement optimizations. My goal is to build an elite squad of powerlifters representing FitTech in upcoming championships. Let\'s make bodybuilding history together!',
    dateRequested: 'May 10, 2026',
    dateResolved: 'May 12, 2026'
  },
  {
    id: 6,
    authorName: 'Sarah Miller',
    authorEmail: 's.miller@university.org',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    authorType: 'member',
    status: 'approved',
    description: 'Hello, I am a full-time university student requesting a 20% student discount for my pending subscription renewal. I have already scanned and attached my official student ID card showing enrollment valid until late 2027. I really hope you can approve this so I can continue training regularly at your gym on a student budget. Thank you!',
    dateRequested: 'May 14, 2026',
    dateResolved: 'May 15, 2026'
  }
];

export default function Requests() {
  const { t } = useTranslation()
  
  // Simulated backend requests state
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Search and filter states
  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Description modal state
  const [activeDescription, setActiveDescription] = useState(null)

  // Simulate loading requests from backend on mount
  useEffect(() => {
    // Load from localStorage if present to maintain persistence, else use initialMockRequests
    const saved = localStorage.getItem('fitech_requests')
    const initialData = saved ? JSON.parse(saved) : initialMockRequests
    
    const timer = setTimeout(() => {
      setRequests(initialData)
      setLoading(false)
    }, 800) // 800ms simulated backend delay

    return () => clearTimeout(timer)
  }, [])

  // Sync to localstorage when requests list changes
  const saveToBackend = (updatedList) => {
    setRequests(updatedList)
    localStorage.setItem('fitech_requests', JSON.stringify(updatedList))
  }

  // Handle Accept
  const handleAccept = (id) => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    
    const updated = requests.map(req => {
      if (req.id === id) {
        return { ...req, status: 'approved', dateResolved: todayStr }
      }
      return req
    })
    saveToBackend(updated)
  }

  // Handle Reject
  const handleReject = (id) => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    
    const updated = requests.map(req => {
      if (req.id === id) {
        return { ...req, status: 'rejected', dateResolved: todayStr }
      }
      return req
    })
    saveToBackend(updated)
  }

  // Handle Delete
  const handleDelete = (id) => {
    const updated = requests.filter(req => req.id !== id)
    saveToBackend(updated)
  }

  // Filter options
  const authorOptions = [
    { label: 'Author Type', value: 'All' },
    { label: 'Coach', value: 'coach' },
    { label: 'Member', value: 'member' }
  ]

  const statusOptions = [
    { label: 'Request Status', value: 'All' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ]

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.authorName.toLowerCase().includes(search.toLowerCase())
      const matchesAuthor = authorFilter === 'All' || req.authorType.toLowerCase() === authorFilter.toLowerCase()
      const matchesStatus = statusFilter === 'All' || req.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesAuthor && matchesStatus
    })
  }, [requests, search, authorFilter, statusFilter])

  // Clear all filters helper
  const handleClearFilters = () => {
    setSearch('')
    setAuthorFilter('All')
    setStatusFilter('All')
  }

  return (
    <div className="bg-secondary-100 min-h-screen py-8 px-4 sm:px-8 w-full flex justify-center text-sm transition-all duration-300">
      <div className="w-full max-w-380 flex flex-col gap-6 animate-in fade-in duration-300">
        
        {/* Filter / Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-secondary-50 p-4 rounded-xl border border-secondary-200 shadow-sm w-full">
          <div className="flex flex-wrap items-center gap-4 flex-1 w-full">
            <SearchInput
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder={t("Search by author name...")}
              className="w-full md:w-80 lg:w-96 shrink-0"
            />

            <FilterDropdown
              label="Author Type"
              icon={User}
              options={authorOptions}
              value={authorFilter}
              onChange={setAuthorFilter}
            />

            <FilterDropdown
              label="Request Status"
              icon={SlidersHorizontal}
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            {(search || authorFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap"
              >
                <Funnel size={18} />
                {t('Clear Filters')}
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-secondary-500 font-semibold text-base animate-pulse">{t('Fetching requests from backend...')}</p>
          </div>
        ) : (
          /* Requests Listing */
          <div className="flex flex-col gap-4 w-full">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const isPending = req.status === 'pending'
                const isApproved = req.status === 'approved'
                const isRejected = req.status === 'rejected'
                
                const isLongDesc = req.description.length > 180
                const truncatedDesc = isLongDesc ? req.description.slice(0, 180) + '...' : req.description

                return (
                  <div
                    key={req.id}
                    className="relative bg-secondary-50 border border-secondary-200 rounded-xl p-5 w-full flex flex-col gap-4 shadow-sm hover:border-primary-600 hover:shadow-[0_0_12px_rgba(105,66,255,0.12)] hover:-translate-y-[1px] transition-all duration-300 ease-in-out overflow-hidden"
                  >
                    {/* Delete Request Button */}
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="absolute top-4 right-4 ltr:right-4 rtl:left-4 p-2 rounded-lg text-error bg-error-bg hover:bg-error hover:text-white border border-error/15 cursor-pointer shadow-sm transition-all duration-350"
                      title={t('Delete Request')}
                    >
                      <Trash size={16} />
                    </button>

                    {/* Author Details Block */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full pr-10 rtl:pl-10">
                      <div className="flex items-center gap-4">
                        <img
                          src={req.authorImage}
                          alt={req.authorName}
                          className="w-12 h-12 rounded-full object-cover border border-secondary-200 shadow-sm shrink-0"
                        />
                        <div className="flex flex-col">
                          <h2 className="font-bold text-secondary-800 text-base leading-tight hover:text-primary-600 transition-colors">
                            {req.authorName}
                          </h2>
                          <a
                            href={`mailto:${req.authorEmail}`}
                            className="text-secondary-500 text-xs flex items-center gap-1.5 mt-1 hover:text-primary-600 transition-colors"
                          >
                            <EnvelopeSimple size={14} className="text-secondary-400" />
                            {req.authorEmail}
                          </a>
                        </div>
                        
                        {/* Author Role Badge (member/coach) */}
                        <div className="ml-2 sm:ml-4">
                          <span className="inline-block uppercase font-bold text-xs tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200/50">
                            {t(req.authorType)}
                          </span>
                        </div>
                      </div>

                      {/* Request Date (Submitted) */}
                      <div className="text-xs text-secondary-400 font-medium self-start sm:self-center">
                        {t('Submitted')}: {req.dateRequested}
                      </div>
                    </div>

                    {/* Description Block */}
                    <div className="border-t border-secondary-200/60 pt-4">
                      <p className="text-secondary-600 text-sm leading-relaxed whitespace-pre-line">
                        {truncatedDesc}
                        {isLongDesc && (
                          <button
                            onClick={() => setActiveDescription(req.description)}
                            className="text-primary-600 font-bold ml-1.5 hover:underline focus:outline-none cursor-pointer inline-flex items-center"
                            title={t('Read full description')}
                          >
                            ...
                          </button>
                        )}
                      </p>
                    </div>

                    {/* Actions and Status Block */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 pt-4 border-t border-secondary-100">
                      {/* Status Tag */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary-400 font-bold uppercase tracking-wider">{t('Status')}:</span>
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-secondary-200 text-secondary-600 border-secondary-300">
                            <Clock size={12} className="animate-pulse" />
                            {t('Pending')}
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-success-bg text-success border-success/30">
                            <CheckCircle size={12} />
                            {t('Approved')}
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-error-bg text-error border-error/30">
                            <WarningCircle size={12} />
                            {t('Rejected')}
                          </span>
                        )}

                        {/* Resolved date info */}
                        {!isPending && req.dateResolved && (
                          <span className="text-xs text-secondary-400 font-medium italic">
                            ({t('Resolved on')}: {req.dateResolved})
                          </span>
                        )}
                      </div>

                      {/* Action buttons (Only if pending) */}
                      {isPending && (
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <button
                            onClick={() => handleReject(req.id)}
                            className="flex-1 sm:flex-none h-9 flex items-center justify-center gap-1.5 px-4 rounded-md transition-all duration-300 font-bold cursor-pointer text-sm text-error bg-error-bg hover:bg-error hover:text-white border border-error/15 shadow-sm hover:shadow-error/10"
                          >
                            <X size={15} />
                            {t('Reject')}
                          </button>
                          
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="flex-1 sm:flex-none h-9 flex items-center justify-center gap-1.5 px-4 rounded-md transition-all duration-300 font-bold cursor-pointer text-sm text-success bg-success-bg hover:bg-success hover:text-white border border-success/15 shadow-sm hover:shadow-success/10"
                          >
                            <Check size={15} />
                            {t('Accept')}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )
              })
            ) : (
              /* Empty State */
              <div className="bg-secondary-50 border border-secondary-200 rounded-xl py-20 px-6 text-center shadow-sm w-full flex flex-col items-center justify-center gap-4">
                <ClipboardText size={48} className="text-secondary-300" />
                <h3 className="text-lg font-bold text-secondary-800">{t('No requests found')}</h3>
                <p className="text-secondary-500 max-w-md">{t("We couldn't find any requests matching your filters.")}</p>
                {(search || authorFilter !== 'All' || statusFilter !== 'All') && (
                  <button
                    onClick={handleClearFilters}
                    className="h-10 flex items-center gap-2 px-5 py-2 rounded-md transition-all bg-primary-600 text-white hover:bg-primary-700 cursor-pointer text-sm font-bold shadow-sm"
                  >
                    {t('Clear Filters')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Description Expanded Modal Popup */}
      {activeDescription && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
          <div className="bg-secondary-50 border border-secondary-300 rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden max-h-[80vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 bg-secondary-100 shrink-0">
              <h3 className="font-bold text-secondary-800 text-base flex items-center gap-2">
                <ClipboardText size={20} className="text-primary-600" />
                {t('Full Description')}
              </h3>
              <button
                onClick={() => setActiveDescription(null)}
                className="p-1.5 rounded-lg hover:bg-secondary-200 text-secondary-500 hover:text-secondary-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto text-secondary-600 text-sm leading-relaxed whitespace-pre-line mini-scrollbar flex-1">
              {activeDescription}
            </div>
            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-100 shrink-0">
              <button
                onClick={() => setActiveDescription(null)}
                className="h-9 px-4 rounded-md bg-secondary-200 hover:bg-secondary-300 text-secondary-700 hover:text-secondary-900 transition-all font-bold text-sm cursor-pointer border border-secondary-300"
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
