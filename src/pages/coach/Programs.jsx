import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FilterDropdown } from '../../components/shared/FilterDropdown'
import { Pagination } from '../../components/shared/Pagination'
import { PrimaryButton } from '../../components/shared/PrimaryButton'
import { SearchInput } from '../../components/shared/SearchInput'
import AddProgramModal from '../../components/ui/AddProgramModal'
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

const programSeeds = [
  {
    title: 'Hypertrophy Blueprint: Phase I',
    equipment: 'Equipments',
    level: 'Intermediate',
    status: 'Published',
    durationWeeks: 8,
    exercises: 42,
    price: 49,
    rating: 4.8,
    reviews: 132,
  },
  {
    title: 'Strength Foundation: Phase I',
    equipment: 'Equipments',
    level: 'Beginner',
    status: 'Published',
    durationWeeks: 6,
    exercises: 36,
    price: 39,
    rating: 4.7,
    reviews: 98,
  },
  {
    title: 'Athletic Conditioning: Phase I',
    equipment: 'Bodyweight',
    level: 'Advanced',
    status: 'Draft',
    durationWeeks: 10,
    exercises: 48,
    price: 59,
    rating: 4.9,
    reviews: 164,
  },
  {
    title: 'Functional Muscle: Phase I',
    equipment: 'Bands',
    level: 'Intermediate',
    status: 'Published',
    durationWeeks: 8,
    exercises: 40,
    price: 45,
    rating: 4.8,
    reviews: 121,
  },
]

const programs = Array.from({ length: 32 }, (_, index) => {
  const seed = programSeeds[index % programSeeds.length]
  return {
    id: index + 1,
    ...seed,
    title: index < PROGRAMS_PER_PAGE ? 'Hypertrophy Blueprint: Phase I' : seed.title,
    equipment: index < PROGRAMS_PER_PAGE ? 'Equipments' : seed.equipment,
    level: index < PROGRAMS_PER_PAGE ? 'Intermediate' : seed.level,
    status: index < PROGRAMS_PER_PAGE ? 'Published' : seed.status,
    durationWeeks: index < PROGRAMS_PER_PAGE ? 8 : seed.durationWeeks,
    exercises: index < PROGRAMS_PER_PAGE ? 42 : seed.exercises,
    price: index < PROGRAMS_PER_PAGE ? 49 : seed.price,
    rating: index < PROGRAMS_PER_PAGE ? 4.8 : seed.rating,
    reviews: index < PROGRAMS_PER_PAGE ? 132 : seed.reviews,
  }
})

const equipmentOptions = [
  { label: 'Equipments', value: 'All' },
  { label: 'Equipments', value: 'Equipments' },
  { label: 'Bodyweight', value: 'Bodyweight' },
  { label: 'Bands', value: 'Bands' },
]

const levelOptions = [
  { label: 'Intermediate', value: 'All' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
]

const statusOptions = [
  { label: 'Status', value: 'All' },
  { label: 'Published', value: 'Published' },
  { label: 'Draft', value: 'Draft' },
]

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
              {program.durationWeeks} {t('Weeks')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BarbellIcon size={15} weight="bold" />
              {program.exercises} {t('Exercises')}
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
  return <div className="min-h-full bg-secondary-100" />
}

export default function Programs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [equipmentFilter, setEquipmentFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddProgramModal, setShowAddProgramModal] = useState(false)

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

        {paginatedPrograms.length > 0 ? (
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
              {t("We couldn't find anything matching your filters.")}
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
