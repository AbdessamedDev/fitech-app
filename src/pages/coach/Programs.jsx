import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { SearchInput } from '../../components/shared/SearchInput'
import AddProgramModal from '../../components/ui/AddProgramModal'
import { api } from '../../services/api'
import { formatDate, formatTime, getCurrentUserId, toNumber } from '../../utilities/backendData'
import {
  BarbellIcon,
  ClockIcon,
  Funnel,
  MoreVertical,
  Plus,
  PulseIcon,
  SlidersHorizontal,
  Star,
} from '../../icons/index'

const PROGRAMS_PER_PAGE = 8

const programImage = '/gym-bg.png'

const equipmentOptions = [
  { label: 'Type', value: 'All' },
  { label: 'Strength', value: 'Strength' },
  { label: 'Cardio', value: 'Cardio' },
  { label: 'Flexibility', value: 'Flexibility' },
  { label: 'HIIT', value: 'HIIT' },
]

const levelOptions = [
  { label: 'Intermediate', value: 'All' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
]

const statusOptions = [
  { label: 'Status', value: 'All' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Rejected', value: 'Rejected' },
]

function mapProgram(program) {
  const start = program.startDate ? new Date(program.startDate) : null
  const end = program.endDate ? new Date(program.endDate) : null
  const durationMs = start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
    ? end - start
    : 0
  const durationWeeks = durationMs > 0 ? Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24 * 7))) : 1

  return {
    id: program.programId || program.id,
    title: program.name || program.programName || 'Untitled program',
    description: program.description || '',
    equipment: program.exerciseType || 'General',
    level: program.level || 'General',
    status: program.status || 'Pending',
    startDate: program.startDate,
    endDate: program.endDate,
    durationWeeks,
    exercises: toNumber(program.enrolledCount, 0),
    price: toNumber(program.totalPrice ?? program.price, 0),
    rating: 5,
    reviews: toNumber(program.enrolledCount, 0),
  }
}

function ProgramCard({ program, onClick }) {
  const { t } = useTranslation()

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-secondary-300 bg-secondary-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_16px_36px_rgba(18,18,25,0.10)] focus:outline-none focus:ring-2 focus:ring-primary-100"
      aria-label={`${t('Open program')} ${program.title}`}
    >
      <div className="relative h-[170px] w-full overflow-hidden bg-secondary-800">
        <img
          src={programImage}
          alt={program.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/18" />
        <span className="absolute left-4 top-4 rounded-full bg-primary-100 px-3 py-1 text-[10px] font-extrabold uppercase leading-none tracking-wide text-primary-600 shadow-sm">
          {t(program.level)}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
          }}
          aria-label={t('Program options')}
          className="absolute right-4 top-3 flex h-8 w-6 items-center justify-center rounded-full bg-secondary-50 text-primary-600 shadow-sm transition-colors hover:bg-primary-50"
        >
          <MoreVertical size={20} weight="bold" />
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="px-5 pb-4 pt-4">
          <h2 className="min-h-[52px] text-[18px] font-semibold leading-[1.45] text-secondary-700">
            {program.title}
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-secondary-500">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon size={15} weight="bold" />
              {program.durationWeeks} {t(program.durationWeeks === 1 ? 'Week' : 'Weeks')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BarbellIcon size={15} weight="bold" />
              {program.exercises} {t('Enrolled')}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-secondary-600">
              {t(program.equipment)}
            </span>
            <span className="rounded-md bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-secondary-600">
              {t(program.status)}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-secondary-200 px-5 py-4">
          <p className="text-[20px] font-medium leading-none text-secondary-900">
            ${program.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-[13px] font-bold text-secondary-700">
            <Star size={17} weight="fill" className="text-[#F6B800]" />
            <span>{program.rating.toFixed(1)}</span>
            <span className="font-medium text-secondary-400">({program.reviews})</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProgramDetails() {
  const { t } = useTranslation()
  const { programId } = useParams()
  const [program, setProgram] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProgram() {
      setLoading(true)
      setError('')
      try {
        const [detail, enrolledMembers] = await Promise.all([
          api.getProgramDetail(programId),
          api.getProgramMembers(programId).catch(() => []),
        ])
        if (!ignore) {
          setProgram(detail)
          setMembers(Array.isArray(enrolledMembers) ? enrolledMembers : [])
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load program details.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProgram()
    return () => {
      ignore = true
    }
  }, [programId])

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-secondary-100 p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-full bg-secondary-100 p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-error/20 bg-error-bg p-5 text-center text-sm font-semibold text-error">
          {t(error)}
        </div>
      </div>
    )
  }

  if (!program) return <div className="min-h-full bg-secondary-100" />

  return (
    <div className="min-h-full bg-secondary-100 px-4 py-8 text-secondary-700 sm:px-8">
      <div className="mx-auto flex w-full max-w-350 flex-col gap-6">
        <section className="overflow-hidden rounded-xl border border-secondary-200 bg-secondary-50 shadow-sm">
          <div className="relative h-58 bg-secondary-800">
            <img src={program.pictureUrl || programImage} alt={program.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-extrabold uppercase tracking-wide text-white/75">{program.level || t('Program')}</p>
              <h1 className="mt-2 text-3xl font-black leading-tight">{program.name}</h1>
              <p className="mt-2 max-w-3xl text-sm font-medium text-white/80">{program.description || t('No description provided')}</p>
            </div>
          </div>
          <div className="grid gap-4 border-t border-secondary-200 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Coach', program.coachName || '-'],
              ['Price', `$${toNumber(program.price).toFixed(2)}`],
              ['Capacity', `${toNumber(program.spotsLeft)} / ${toNumber(program.capacity)} spots left`],
              ['Duration', `${toNumber(program.durationMinutes)} min`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-secondary-100 px-4 py-3">
                <p className="text-[11px] font-black uppercase text-secondary-400">{t(label)}</p>
                <p className="mt-1 text-sm font-bold text-secondary-800">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border border-secondary-200 bg-secondary-50 p-5">
            <h2 className="text-lg font-black text-secondary-900">{t('Time Slots')}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {(program.timeSlots || []).map((slot) => (
                <div key={slot.id || `${slot.day}-${slot.startTime}`} className="flex items-center justify-between rounded-lg border border-secondary-200 bg-secondary-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-extrabold text-secondary-800">{t(slot.day)}</p>
                    <p className="text-xs font-medium text-secondary-500">{slot.description || t('Training session')}</p>
                  </div>
                  <p className="text-sm font-bold text-primary-600">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                </div>
              ))}
              {(program.timeSlots || []).length === 0 && (
                <p className="rounded-lg bg-secondary-100 px-4 py-8 text-center text-sm font-semibold text-secondary-400">{t('No time slots available')}</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-secondary-200 bg-secondary-50 p-5">
            <h2 className="text-lg font-black text-secondary-900">{t('Enrolled Members')}</h2>
            <div className="mt-4 flex max-h-90 flex-col gap-2 overflow-y-auto pr-1 mini-scrollbar">
              {members.map((member) => (
                <div key={member.memberId} className="rounded-lg border border-secondary-200 bg-secondary-100 px-4 py-3">
                  <p className="truncate text-sm font-extrabold text-secondary-800">{member.fullName}</p>
                  <p className="truncate text-xs font-medium text-secondary-500">{member.email}</p>
                  <p className="mt-1 text-[11px] font-bold text-secondary-400">{t('Enrolled')} {formatDate(member.enrolledAt)}</p>
                </div>
              ))}
              {members.length === 0 && (
                <p className="rounded-lg bg-secondary-100 px-4 py-8 text-center text-sm font-semibold text-secondary-400">{t('No enrolled members yet')}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function Programs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const coachId = getCurrentUserId()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [equipmentFilter, setEquipmentFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddProgramModal, setShowAddProgramModal] = useState(false)

  const loadPrograms = async () => {
    if (!coachId) {
      setError('Coach identity was not found in the current session.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await api.getCoachPrograms(coachId)
      setPrograms(Array.isArray(data) ? data.map(mapProgram) : [])
    } catch (err) {
      setError(err.message || 'Failed to load programs.')
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrograms()
  }, [coachId])

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase()

    return programs.filter((program) => {
      const matchesSearch =
        !query ||
        [program.title, program.equipment, program.level, program.status]
          .join(' ')
          .toLowerCase()
          .includes(query)
      const matchesEquipment = equipmentFilter === 'All' || program.equipment === equipmentFilter
      const matchesLevel = levelFilter === 'All' || program.level === levelFilter
      const matchesStatus = statusFilter === 'All' || program.status === statusFilter

      return matchesSearch && matchesEquipment && matchesLevel && matchesStatus
    })
  }, [equipmentFilter, levelFilter, search, statusFilter])

  const totalPages = Math.ceil(filteredPrograms.length / PROGRAMS_PER_PAGE)
  const safePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const paginatedPrograms = filteredPrograms.slice(
    (safePage - 1) * PROGRAMS_PER_PAGE,
    safePage * PROGRAMS_PER_PAGE,
  )

  const resetPage = (setter) => (value) => {
    setter(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-full w-full bg-secondary-100 px-4 py-6 text-sm text-secondary-700 sm:px-6 lg:px-8">
      {showAddProgramModal && <AddProgramModal onClose={() => setShowAddProgramModal(false)} />}

      <div className="mx-auto flex w-full max-w-380 flex-col">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.2fr)_minmax(180px,0.75fr)_minmax(180px,0.75fr)_minmax(180px,0.75fr)_auto] xl:max-w-[980px]">
            <SearchInput
              value={search}
              onChange={resetPage(setSearch)}
              placeholder="Search"
              className="w-full sm:col-span-2 lg:col-span-1"
            />

            <FilterDropdown
              label="Equipments"
              icon={SlidersHorizontal}
              options={equipmentOptions}
              value={equipmentFilter}
              onChange={resetPage(setEquipmentFilter)}
              className="w-full"
            />

            <FilterDropdown
              label="Intermediate"
              icon={PulseIcon}
              options={levelOptions}
              value={levelFilter}
              onChange={resetPage(setLevelFilter)}
              className="w-full"
            />

            <FilterDropdown
              label="Status"
              icon={SlidersHorizontal}
              options={statusOptions}
              value={statusFilter}
              onChange={resetPage(setStatusFilter)}
              className="w-full"
            />

            <button
              type="button"
              onClick={() => document.getElementById('global-search-input')?.focus()}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-[13px] font-bold text-primary-600 transition-colors hover:bg-primary-50 active:bg-primary-100"
            >
              <Funnel size={18} weight="bold" />
              {t('Filter')}
            </button>
          </div>

          <PrimaryButton
            icon={Plus}
            onClick={() => setShowAddProgramModal(true)}
            className="w-full rounded-xl font-bold sm:w-fit"
          >
            {t('Add Program')}
          </PrimaryButton>
        </div>

        {showAddProgramModal && <AddProgramModal onClose={() => setShowAddProgramModal(false)} onCreated={loadPrograms} />}

        {error && (
          <div className="mt-6 rounded-xl border border-error/20 bg-error-bg px-5 py-3 text-sm font-semibold text-error">
            {t(error)}
          </div>
        )}

        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-semibold text-secondary-500">{t('Loading programs...')}</p>
          </div>
        ) : paginatedPrograms.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => navigate(`/coach/programs/${program.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-secondary-300 bg-secondary-50 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <BarbellIcon size={30} weight="bold" />
            </div>
            <h2 className="text-lg font-bold text-secondary-800">{t('No programs found')}</h2>
            <p className="mt-1 max-w-md text-sm font-medium text-secondary-500">
              {t(error ? 'Fix the connection or try again after the backend is available.' : "We couldn't find anything matching your filters.")}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setEquipmentFilter('All')
                setLevelFilter('All')
                setStatusFilter('All')
                setCurrentPage(1)
              }}
              className="mt-4 rounded-md px-4 py-2 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-50"
            >
              {t('Clear Filters')}
            </button>
          </div>
        )}

        <div className="mt-8 pb-8">
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}
