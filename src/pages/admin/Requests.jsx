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
  BarbellIcon,
  CreditCard,
  MoneyIcon
} from '../../icons/index'
import { SearchInput } from '../../components/shared/SearchInput'
import { api } from '../../services/api'
import { formatDate } from '../../utilities/backendData'

export default function Requests() {
  const { t } = useTranslation()
  
  // Tab states: 'renewals', 'programs', 'purchases'
  const [activeTab, setActiveTab] = useState('renewals')
  
  // Backend request list states
  const [renewals, setRenewals] = useState([])
  const [programs, setPrograms] = useState([])
  const [purchases, setPurchases] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [actioningId, setActioningId] = useState(null)
  
  // Notes dialog states
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [notesType, setNotesType] = useState('accept') // 'accept' or 'reject'

  const loadRequests = async () => {
    setLoading(true)
    setError('')
    try {
      if (activeTab === 'renewals') {
        const data = await api.listPendingRenewals()
        setRenewals(Array.isArray(data) ? data : [])
      } else if (activeTab === 'programs') {
        const data = await api.listProgramRequests()
        setPrograms(Array.isArray(data) ? data : [])
      } else if (activeTab === 'purchases') {
        const data = await api.listPurchaseRequests()
        setPurchases(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to load pending requests:', err)
      setError(err.message || 'Connecting to backend microservice failed.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [activeTab])

  // Resolve actions
  const handleResolve = async (request, type) => {
    // Open notes modal for renewals / purchases reject, else execute immediately
    if (activeTab === 'renewals' || activeTab === 'purchases') {
      setSelectedRequest(request)
      setNotesType(type)
      setNoteText(type === 'accept' ? 'Approved' : 'Rejected')
      setShowNotesModal(true)
    } else {
      // Program requests can be approved/rejected directly
      setActioningId(request.programId)
      try {
        if (type === 'accept') {
          await api.acceptProgramRequest(request.programId)
        } else {
          await api.rejectProgramRequest(request.programId)
        }
        await loadRequests()
      } catch (err) {
        alert(err.message || 'Failed to update program request status.')
      } finally {
        setActioningId(null)
      }
    }
  }

  const submitResolveWithNotes = async () => {
    if (!selectedRequest) return
    const reqId = selectedRequest.requestId || selectedRequest.id
    setActioningId(reqId)
    setShowNotesModal(false)
    try {
      if (activeTab === 'renewals') {
        if (notesType === 'accept') {
          await api.acceptRenewal(reqId, noteText)
        } else {
          await api.rejectRenewal(reqId, noteText)
        }
      } else if (activeTab === 'purchases') {
        if (notesType === 'accept') {
          await api.acceptCoursePurchase(reqId)
        } else {
          await api.rejectCoursePurchase(reqId, noteText)
        }
      }
      await loadRequests()
    } catch (err) {
      alert(err.message || 'Failed to update request status.')
    } finally {
      setActioningId(null)
      setSelectedRequest(null)
    }
  }

  // Filter lists based on search term
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (activeTab === 'renewals') {
      return renewals.filter(r => 
        !query || 
        r.memberName.toLowerCase().includes(query) || 
        r.planName.toLowerCase().includes(query)
      )
    } else if (activeTab === 'programs') {
      return programs.filter(r => 
        !query || 
        r.programName.toLowerCase().includes(query) || 
        r.coachName.toLowerCase().includes(query) ||
        (r.description && r.description.toLowerCase().includes(query))
      )
    } else {
      return purchases.filter(r => 
        !query || 
        r.programName.toLowerCase().includes(query) || 
        r.coachName.toLowerCase().includes(query) ||
        (r.notes && r.notes.toLowerCase().includes(query))
      )
    }
  }, [activeTab, renewals, programs, purchases, search])

  return (
    <div className="bg-secondary-100 min-h-screen py-8 px-4 sm:px-8 w-full flex justify-center text-sm transition-all duration-300">
      <div className="w-full max-w-380 flex flex-col gap-6 animate-in fade-in duration-300">
        
        {/* Title & Tabs Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary-50 p-6 rounded-xl border border-secondary-200 shadow-sm w-full">
          <div>
            <h1 className="text-2xl font-black text-secondary-900 leading-none">{t('Admin Requests Queue')}</h1>
            <p className="text-xs font-semibold text-secondary-500 mt-2">{t('Review and approve cash renewals, coach applications, or course transactions.')}</p>
          </div>
          
          <div className="flex bg-secondary-200 p-1.25 rounded-lg border border-secondary-300 shrink-0">
            {[
              { id: 'renewals', label: 'Cash Renewals', icon: CreditCard },
              { id: 'programs', label: 'Coach Programs', icon: BarbellIcon },
              { id: 'purchases', label: 'Course Purchases', icon: MoneyIcon }
            ].map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSearch('')
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${active ? 'bg-secondary-50 text-primary-600 shadow-sm' : 'text-secondary-600 hover:text-secondary-800'}`}
                >
                  <Icon size={14} weight="bold" />
                  {t(tab.label)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 bg-secondary-50 p-4 rounded-xl border border-secondary-200 shadow-sm w-full">
          <SearchInput
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder={t("Filter list by keyword...")}
            className="w-full md:w-96 shrink-0"
          />
          
          {search && (
            <button
              onClick={() => setSearch('')}
              className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap"
            >
              <Funnel size={18} />
              {t('Clear Filter')}
            </button>
          )}
        </div>

        {/* Dynamic Display Panel */}
        {error && (
          <div className="rounded-xl border border-error/20 bg-error-bg p-4 flex items-center justify-between shadow-sm animate-in fade-in">
            <p className="text-sm font-semibold text-error">{error}</p>
            <button onClick={loadRequests} className="px-3 py-1.5 bg-error text-white text-xs font-bold rounded-lg hover:bg-error/90 cursor-pointer">
              {t("Retry Queue")}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-secondary-500 font-semibold text-base animate-pulse">{t('Fetching pending C# microservices queue...')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {filteredItems.length > 0 ? (
              filteredItems.map((req) => {
                const reqId = req.requestId || req.programId || req.id
                const isActioning = actioningId === reqId
                
                // Map properties uniformly
                let title = ''
                let subTitle = ''
                let description = ''
                let amountStr = ''
                let dateStr = formatDate(req.createdAt || new Date())
                let avatarName = ''
                
                if (activeTab === 'renewals') {
                  title = req.memberName
                  subTitle = req.notes || 'No notes provided'
                  description = `Submitted cash renewal request for subscription plan: ${req.planName}.`
                  amountStr = `$${Number(req.amount).toFixed(2)}`
                  avatarName = req.memberName
                } else if (activeTab === 'programs') {
                  title = req.coachName
                  subTitle = 'Coach Program Proposal'
                  description = `Wants to publish a new gym training program: "${req.programName}". Description: ${req.description || 'No details provided.'}`
                  avatarName = req.coachName
                } else {
                  title = `Member ID: ${req.memberId.toString().substring(0, 8)}`
                  subTitle = req.notes || 'Course enrollment payment'
                  description = `Wants to purchase course "${req.programName}" by coach ${req.coachName}. Payment: ${req.paymentMethod || 'Cash'}`
                  amountStr = `$${Number(req.amount).toFixed(2)}`
                  avatarName = req.coachName
                }

                return (
                  <div
                    key={reqId}
                    className="relative bg-secondary-50 border border-secondary-200 rounded-xl p-5 w-full flex flex-col gap-4 shadow-sm hover:border-primary-600 hover:shadow-[0_0_12px_rgba(105,66,255,0.12)] hover:-translate-y-[1px] transition-all duration-300 ease-in-out overflow-hidden animate-in fade-in"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center font-bold text-primary-600 text-lg shrink-0">
                          {avatarName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <h2 className="font-bold text-secondary-800 text-base leading-tight hover:text-primary-600 transition-colors">
                            {title}
                          </h2>
                          <p className="text-secondary-500 text-xs mt-1 font-semibold">
                            {subTitle}
                          </p>
                        </div>
                      </div>

                      {/* Submitted Date & Amount */}
                      <div className="flex flex-col sm:items-end text-xs font-semibold text-secondary-400 gap-1">
                        <div>{t('Submitted')}: {dateStr}</div>
                        {amountStr && <div className="text-success font-extrabold text-sm mt-0.5">{amountStr}</div>}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-secondary-200/60 pt-4">
                      <p className="text-secondary-600 text-sm leading-relaxed whitespace-pre-line">
                        {description}
                      </p>
                    </div>

                    {/* Actions bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 pt-4 border-t border-secondary-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary-400 font-bold uppercase tracking-wider">{t('Status')}:</span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border bg-secondary-200 text-secondary-600 border-secondary-300">
                          <Clock size={12} className="animate-pulse" />
                          {req.status || t('Pending Review')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          onClick={() => handleResolve(req, 'reject')}
                          disabled={isActioning}
                          className="flex-1 sm:flex-none h-9 flex items-center justify-center gap-1.5 px-4 rounded-lg transition-all duration-300 font-bold cursor-pointer text-sm text-error bg-error-bg hover:bg-error hover:text-white border border-error/15 shadow-sm disabled:opacity-50"
                        >
                          <X size={15} />
                          {isActioning ? t('Processing...') : t('Reject')}
                        </button>
                        
                        <button
                          onClick={() => handleResolve(req, 'accept')}
                          disabled={isActioning}
                          className="flex-1 sm:flex-none h-9 flex items-center justify-center gap-1.5 px-4 rounded-lg transition-all duration-300 font-bold cursor-pointer text-sm text-success bg-success-bg hover:bg-success hover:text-white border border-success/15 shadow-sm disabled:opacity-50"
                        >
                          <Check size={15} />
                          {isActioning ? t('Processing...') : t('Approve')}
                        </button>
                      </div>
                    </div>

                  </div>
                )
              })
            ) : (
              /* Empty State */
              <div className="bg-secondary-50 border border-secondary-200 rounded-xl py-20 px-6 text-center shadow-sm w-full flex flex-col items-center justify-center gap-4 animate-in fade-in">
                <ClipboardText size={48} className="text-secondary-300" />
                <h3 className="text-lg font-bold text-secondary-800">{t('No pending requests found')}</h3>
                <p className="text-secondary-500 max-w-md">{t("The pending request queue is currently empty for this category.")}</p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
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

      {/* Notes / Comments Dialogue Overlay */}
      {showNotesModal && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-secondary-50 border border-secondary-300 rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 bg-secondary-100 shrink-0">
              <h3 className="font-bold text-secondary-800 text-base flex items-center gap-2">
                <CheckCircle size={20} className={notesType === 'accept' ? 'text-success' : 'text-error'} />
                {notesType === 'accept' ? t('Approve Request Comments') : t('Reject Request Comments')}
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-1.5 rounded-lg hover:bg-secondary-200 text-secondary-500 hover:text-secondary-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <p className="text-secondary-500 text-xs font-semibold">
                {t('Add notes or feedback regarding this decision (will be sent or saved alongside the request details).')}
              </p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter feedback or transaction notes ..."
                rows={4}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all"
              />
            </div>
            
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-100 shrink-0">
              <button
                onClick={() => setShowNotesModal(false)}
                className="h-10 px-4 rounded-xl bg-secondary-200 hover:bg-secondary-300 text-secondary-700 hover:text-secondary-900 transition-all font-bold text-xs cursor-pointer border border-secondary-300"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={submitResolveWithNotes}
                className={`h-10 px-5 rounded-xl text-white font-bold text-xs cursor-pointer transition-all shadow-sm ${notesType === 'accept' ? 'bg-success hover:bg-success/90' : 'bg-error hover:bg-error/90'}`}
              >
                {t('Confirm Decision')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
