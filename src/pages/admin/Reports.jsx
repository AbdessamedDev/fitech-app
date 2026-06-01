import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download, Eye, Copy, Trash2, RefreshCw, ChevronLeft, ChevronRight, Undo2 } from 'lucide-react';
import { FileTextIcon, SlidersHorizontal, Funnel, CalendarIcon, CalendarDotsIcon, ChartLineIcon, GearSixIcon, ClockIcon, FilesIcon } from '../../icons/index';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/shared/Pagination';
import { SearchInput } from '../../components/shared/SearchInput';
import { FilterDropdown } from '../../components/shared/FilterDropdown';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import GenerateReportModal from '../../components/ui/GenerateReportModal';

// ─── Data ────────────────────────────────────────────────────────────────────

const revenueData = [
  { name: 'JAN', value: 2400 },
  { name: 'FEB', value: 2800 },
  { name: 'MAR', value: 2500 },
  { name: 'APR', value: 3200 },
  { name: 'MAY', value: 3800 },
  { name: 'JUN', value: 4200 },
  { name: 'JUL', value: 3900 },
];

const paymentChannelsData = [
  { name: 'Baridi Card', value: 65, color: '#6942FF' },
  { name: 'Manually',   value: 23, color: '#A88BFF' },
  { name: 'Other',      value: 12, color: '#E2E8F0' },
];

// Program badge config: name → { color, icon, bg }
const PROGRAM_BADGE_MAP = {
  'Elite HIIT 30':    { label: 'HIIT',    color: '#16a34a', bg: '#dcfce7', icon: '⚡' },
  'Elite HIT 3D':     { label: 'HIIT',    color: '#16a34a', bg: '#dcfce7', icon: '⚡' },
  'Zen Flow Yoga':    { label: 'YOGA',    color: '#7c3aed', bg: '#ede9fe', icon: '🧘' },
  'Power Lifting':    { label: 'LIFTING', color: '#b45309', bg: '#fef3c7', icon: '🏋️' },
  'Cardio Blast':     { label: 'CARDIO',  color: '#0369a1', bg: '#e0f2fe', icon: '🏃' },
  'Pilates Core':     { label: 'PILATES', color: '#be185d', bg: '#fce7f3', icon: '🤸' },
  'CrossFit X':       { label: 'CROSS',   color: '#dc2626', bg: '#fee2e2', icon: '💪' },
  'Aqua Aerobics':    { label: 'AQUA',    color: '#0891b2', bg: '#cffafe', icon: '🏊' },
  'Spin Studio':      { label: 'SPIN',    color: '#ea580c', bg: '#ffedd5', icon: '🚴' },
  'Boxing Basics':    { label: 'BOXING',  color: '#991b1b', bg: '#fecaca', icon: '🥊' },
};

const getProgramBadge = (name) =>
  PROGRAM_BADGE_MAP[name] ?? { label: 'CLASS', color: '#6b7280', bg: '#f3f4f6', icon: '🏅' };

const allProgramsData = [
  { id: 1, name: 'Elite HIIT 30',  revenue: '$42.8k', attendees: 842  },
  { id: 2, name: 'Power Lifting',  revenue: '$31.5k', attendees: 452  },
  { id: 3, name: 'Zen Flow Yoga',  revenue: '$28.2k', attendees: 156  },
  { id: 4, name: 'Cardio Blast',   revenue: '$19.1k', attendees: 390  },
  { id: 5, name: 'CrossFit X',     revenue: '$16.4k', attendees: 310  },
  { id: 6, name: 'Pilates Core',   revenue: '$14.8k', attendees: 275  },
  { id: 7, name: 'Spin Studio',    revenue: '$12.2k', attendees: 240  },
  { id: 8, name: 'Boxing Basics',  revenue: '$10.9k', attendees: 198  },
  { id: 9, name: 'Aqua Aerobics',  revenue: '$9.5k',  attendees: 175  },
].sort((a, b) => b.attendees - a.attendees);

// Derive top‑3 from sorted data
const topProgramsData = allProgramsData.slice(0, 3);

// ─── Large mock report dataset ────────────────────────────────────────────────

const REPORT_TYPES   = ['Revenue', 'Attendance', 'Retention', 'Expense', 'Profit'];
const REPORT_STATUS  = ['READY', 'PROCESSING', 'FAILED'];
const QUARTERS       = ['Q1', 'Q2', 'Q3', 'Q4'];
const YEARS          = [2025, 2026, 2027, 2028, 2029];

const generateReports = () => {
  const items = [];
  let id = 1;
  YEARS.forEach(year => {
    QUARTERS.forEach((q, qi) => {
      REPORT_TYPES.forEach(type => {
        const month  = qi * 3 + 1;
        const startM = String(month).padStart(2, '0');
        const endM   = String(month + 2).padStart(2, '0');
        const status = REPORT_STATUS[Math.floor(Math.random() * REPORT_STATUS.length)];
        items.push({
          id,
          name:      `${q} ${type} Summary`,
          type,
          status,
          date:      `${['Jan','Apr','Jul','Oct'][qi]} 01, ${year}`,
          dateRange: `${['Jan','Apr','Jul','Oct'][qi]} 01, ${year} – ${['Mar','Jun','Sep','Dec'][qi]} 30, ${year}`,
          time:      `${(8 + (id % 10)).toString().padStart(2,'0')}:${(id % 6) * 10 || '00'} AM`,
        });
        id++;
      });
    });
  });
  return items;
};

const mockReports = generateReports(); // 100 rows

// ─── Retention badge ─────────────────────────────────────────────────────────

const getRetentionBadge = (pct) => {
  if (pct >= 80) return { label: 'GOOD',    color: '#336D3B', bg: '#D6FBC7', border: '#86efac' };
  if (pct >= 60) return { label: 'AVERAGE', color: '#6D7580', bg: '#ECF0F3', border: '#fcd34d' };
  return               { label: 'BAD',     color: '#BF3846', bg: '#FDE5E1', border: '#fca5a5' };
};

const RETENTION_PCT = 84.2;

// ─── Sub‑components ───────────────────────────────────────────────────────────

const ReportStatusBadge = ({ status }) => {
  const statusStyles = {
    READY:      'bg-success-bg text-success border border-success/40',
    PROCESSING: 'bg-secondary-200 text-secondary-600 border border-secondary-300',
    FAILED:     'bg-error-bg text-error border border-error/40',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

// ─── Member Retention Card ────────────────────────────────────────────────────

const MemberRetentionCard = () => {
  const { t } = useTranslation();
  const badge = getRetentionBadge(RETENTION_PCT);
  return (
    <div className="lg:col-span-4 bg-secondary-50 p-8 rounded-lg lg:rounded-xl xl:rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-secondary-700 font-sans tracking-tight mb-6">
        {t('Member Retention')}
      </h3>

      {/* Percentage + badge side‑by‑side */}
      <div className="flex items-center gap-4 mb-10">
        <p className="text-[42px] font-extrabold text-secondary-800 leading-none tracking-tight">
          {RETENTION_PCT}%
        </p>
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase"
          style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.border}` }}
        >
          {badge.label}
        </span>
      </div>
      
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs xl:text-[13px] font-bold text-secondary-800 uppercase tracking-wider">
              {t('NEW MEMBERS')}
            </span>
            <span className="text-xs xl:text-[13px] font-bold text-secondary-800 mb-1">1,204</span>
          </div>
          <div className="h-2 xl:h-2.5 mb-3 w-full bg-secondary-200 rounded-full overflow-hidden">
            <div className="h-full bg-success w-[75%]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs xl:text-[13px] font-bold text-secondary-800 uppercase tracking-wider">
              {t('CHURN RATE')}
            </span>
            <span className="text-xs xl:text-[13px] font-bold text-secondary-800 mb-1">4.2%</span>
          </div>
          <div className="h-2 xl:h-2.5 w-full bg-secondary-200 rounded-full overflow-hidden">
            <div className="h-full bg-error w-[42%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Top Programs Card ────────────────────────────────────────────────────────

const PAGE_SIZE = 3; // cards per page

const TopProgramsCard = () => {
  const { t } = useTranslation();

  const [carouselMode, setCarouselMode] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('left');

  const totalPages = Math.ceil(allProgramsData.length / PAGE_SIZE);

  const navigate = (dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setPageIdx(prev => {
        if (dir === 'right') return (prev + 1) % totalPages;
        return (prev - 1 + totalPages) % totalPages;
      });
      setAnimating(false);
    }, 280);
  };

  const startIdx = pageIdx * PAGE_SIZE;
  const visiblePrograms = allProgramsData.slice(startIdx, startIdx + PAGE_SIZE);
  const paddedPrograms = visiblePrograms.length === PAGE_SIZE
    ? visiblePrograms
    : [...visiblePrograms, ...allProgramsData.slice(0, PAGE_SIZE - visiblePrograms.length)];

  const displayPrograms = carouselMode ? paddedPrograms : topProgramsData;

  const enterCarousel = () => {
    setPageIdx(0);
    setCarouselMode(true);
  };

  const exitCarousel = () => {
    setCarouselMode(false);
  };

  const globalStart = pageIdx * PAGE_SIZE + 1;
  const globalEnd   = Math.min(globalStart + PAGE_SIZE - 1, allProgramsData.length);

  return (
    <div className="lg:col-span-8 bg-secondary-50 p-8 rounded-lg lg:rounded-xl xl:rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-secondary-800 font-sans tracking-tight">
          {t('Top Programs Performance')}
        </h3>

        <div className="flex items-center gap-2 transition-all duration-300">
          {carouselMode ? (
            <>
              <button
                onClick={exitCarousel}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-secondary-300 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                title={t('Back to top programs')}
              >
                <Undo2 size={15} />
              </button>

              <button
                onClick={() => navigate('left')}
                disabled={animating}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-secondary-300 bg-secondary-50 text-secondary-700 hover:bg-secondary-100 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-[12px] font-semibold text-secondary-500 min-w-[48px] text-center">
                {pageIdx + 1}/{totalPages}
              </span>

              <button
                onClick={() => navigate('right')}
                disabled={animating}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-secondary-300 bg-secondary-50 text-secondary-700 hover:bg-secondary-100 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={enterCarousel}
              className="text-success font-semibold text-[14px] hover:opacity-80 transition-opacity cursor-pointer"
            >
              {t('View All Programs')}
            </button>
          )}
        </div>
      </div>

      {/* Program cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden"
        style={{
          opacity:   animating ? 0 : 1,
          transform: animating ? `translateX(${direction === 'right' ? '-12px' : '12px'})` : 'translateX(0)',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
        }}
      >
        {displayPrograms.map((program, idx) => {
          const badge = getProgramBadge(program.name);
          const isTopRank = !carouselMode && idx < 3;
          const globalRank = carouselMode ? startIdx + idx + 1 : idx + 1;

          return (
            <div
              key={`${program.id}-${pageIdx}-${idx}`}
              className="bg-secondary-100 p-6 rounded-2xl border border-secondary-200 hover:border-primary-600 transition-colors flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shrink-0"
                    style={{ color: badge.color, background: badge.bg }}
                  >
                    <span style={{ fontSize: 13 }}>{badge.icon}</span>
                    {badge.label}
                  </span>
                  <h4 className="text-[13px] font-bold text-secondary-800 truncate">{program.name}</h4>
                </div>
                {isTopRank && (
                  <span className="text-xs font-bold text-secondary-500 shrink-0">
                    #{globalRank}
                  </span>
                )}
              </div>

              <p className="text-[28px] font-extrabold text-secondary-800 leading-none">
                {program.revenue}
              </p>

              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-secondary-500">
                  {program.attendees >= 1000
                    ? `${(program.attendees / 1000).toFixed(1)}k`
                    : program.attendees}
                </p>
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wide">
                  ATTENDEES
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Reports Page ────────────────────────────────────────────────────────

export default function Reports() {
  const { t } = useTranslation();
  const [search, setSearch]             = useState('');
  const [sortBy, setSortBy]             = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter]     = useState('All');
  const [currentPage, setCurrentPage]   = useState(1);
  const [showModal, setShowModal]       = useState(false);
  const itemsPerPage = 8;

  const filteredReports = useMemo(() => {
    let reports = mockReports.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      const matchesType   = typeFilter   === 'All' || report.type   === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

    if (sortBy === 'newest') {
      reports = [...reports].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      reports = [...reports].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'name_asc') {
      reports = [...reports].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      reports = [...reports].sort((a, b) => b.name.localeCompare(a.name));
    }

    return reports;
  }, [search, statusFilter, typeFilter, sortBy]);

  const totalPages       = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex       = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const resetPage = () => setCurrentPage(1);

  const sortOptions = [
    { label: t('Sort by'),   value: 'All'       },
    { label: t('Newest'),    value: 'newest'    },
    { label: t('Oldest'),    value: 'oldest'    },
    { label: t('Name A-Z'),  value: 'name_asc'  },
    { label: t('Name Z-A'),  value: 'name_desc' },
  ];

  const statusOptions = [
    { label: t('All Statuses'), value: 'All'        },
    { label: 'READY',           value: 'READY'      },
    { label: 'PROCESSING',      value: 'PROCESSING' },
    { label: 'FAILED',          value: 'FAILED'     },
  ];

  const typeOptions = [
    { label: t('All Types'),  value: 'All'       },
    ...REPORT_TYPES.map(tp => ({ label: t(tp), value: tp })),
  ];

  return (
    <div className="bg-secondary-100 min-h-screen py-8 px-4 sm:px-8 w-full flex justify-center text-sm font-sans">
      {showModal && <GenerateReportModal onClose={() => setShowModal(false)} />}
      <div className="w-full max-w-380 flex flex-col gap-8 xl:gap-12">

        {/* ── Revenue Trend + Payment Channels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Trend */}
          <div className="lg:col-span-8 bg-secondary-50 p-8 rounded-lg lg:rounded-xl xl:rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-secondary-800 font-sans tracking-tight">{t('Revenue Trend')}</h3>
                <p className="text-xs lg:text-[14px] font-normal text-secondary-500 mt-1">{t('Cumulative monthly earnings')}</p>
              </div>
              <button className="flex items-center gap-2 bg-secondary-100 text-secondary-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-secondary-200 transition-colors cursor-pointer">
                {t('CURRENT YEAR')}
              </button>
            </div>
            <div className="flex-1 w-full min-h-75 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#868E96', fontWeight: 600 }}
                    dy={10}
                  />
                  <RechartsTooltip
                    cursor={{ fill: '#E5E7EB', opacity: 0.2 }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#9B86FF" radius={[8, 8, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Channels */}
          <div className="lg:col-span-4 bg-secondary-50 p-8 rounded-lg lg:rounded-xl xl:rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <div className="w-full mb-6">
              <h3 className="text-xl font-semibold text-secondary-700 font-sans tracking-tight">{t('Payment Channels')}</h3>
              <p className="text-xs xl:text-[14px] text-secondary-600 mt-1">{t('Transaction source volume')}</p>
            </div>
            <div className="relative w-full h-60 flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ value: 100 }]} cx="50%" cy="50%" innerRadius={70} outerRadius={95} fill="#F1F3F5" stroke="none" isAnimationActive={false} />
                  <Pie data={paymentChannelsData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={8} animationDuration={1500}>
                    {paymentChannelsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[32px] font-black text-secondary-800 tracking-tight">55%</span>
                <span className="text-[10px] font-bold text-secondary-700 tracking-widest mt-1 uppercase">{t('Baridi MOB')}</span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3 mt-4">
              {paymentChannelsData.map(channel => (
                <div key={channel.name} className="flex justify-between items-center text-[14px]">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: channel.color }} />
                    <span className="text-[14px] text-secondary-800 font-medium">{channel.name}</span>
                  </div>
                  <span className="font-bold text-secondary-800 text-[14px]">{channel.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Member Retention + Top Programs ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <MemberRetentionCard />
          <TopProgramsCard />
        </div>

        {/* ── Table Controls ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">

            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); resetPage(); }}
              placeholder={t('Search reports...')}
              className="w-full md:w-80"
            />

            <div className="w-full md:w-52">
              <FilterDropdown
                label={t('Sort by')}
                icon={SlidersHorizontal}
                options={sortOptions}
                value={sortBy}
                onChange={(v) => { setSortBy(v); resetPage(); }}
              />
            </div>

            <FilterDropdown
              label={t('Filter')}
              icon={Funnel}
              options={statusOptions}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); resetPage(); }}
            />

            <FilterDropdown
              label={t('Type')}
              icon={FileTextIcon}
              options={typeOptions}
              value={typeFilter}
              onChange={(v) => { setTypeFilter(v); resetPage(); }}
            />

          </div>

          <PrimaryButton onClick={() => setShowModal(true)}>{t('Generate Report')}</PrimaryButton>
        </div>

        {/* ── Table ── */}
        <Table className="rounded-xl border border-secondary-200 overflow-hidden shadow-sm w-full text-[14px]">
          <TableHeader className="bg-secondary-100 border-b border-secondary-300">
            <TableRow isHeader={true} className="h-9 bg-secondary-100">

              {/* Report Name – left-aligned with left padding */}
              <TableHead className="w-56 py-2 pl-6 pr-3 text-left">
                <div className="flex items-center gap-2 text-secondary-500 font-bold text-[14px]">
                  <FilesIcon size={15} strokeWidth={2} />
                  <span>{t('Report Name')}</span>
                  <div className="w-0.5 h-7 bg-secondary-300 ml-20" />
                </div>
              </TableHead>

              {[
                { key: 'Type',       Icon: () => <FileTextIcon size={18} className="text-secondary-600 font-semibold" /> },
                { key: 'Status',     Icon: () => <ChartLineIcon size={18} className="text-secondary-600 font-semibold" /> },
                { key: 'Date',       Icon: () => <CalendarIcon size={18} className="text-secondary-600 font-semibold" /> },
                { key: 'Date Range', Icon: () => <CalendarDotsIcon size={18} className="text-secondary-600 font-semibold" /> },
                { key: 'Time',       Icon: () => <ClockIcon size={18} className="text-secondary-600 font-semibold" /> },
                { key: 'Operations', Icon: () => <GearSixIcon size={18} className="text-secondary-600 font-semibold" /> },
              ].map(({ key, Icon }, i, arr) => (
                <TableHead key={key} className="p-0 align-middle">
                  <div className="flex items-center justify-between h-9">
                    <div className="flex flex-1 items-center justify-center gap-1.5 px-3 lg:px-4 text-secondary-500 font-bold text-[14px]">
                      <Icon />
                      <span>{t(key)}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-0.5 h-7 bg-secondary-300" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-secondary-400 font-medium">
                  {t('No reports found')}
                </TableCell>
              </TableRow>
            ) : (
              paginatedReports.map((report) => (
                <TableRow
                  key={report.id}
                  className="hover:bg-secondary-100 transition-colors border-b border-secondary-200"
                  style={{ borderBottomWidth: '1.5px' }}
                >
                  {/* Report Name */}
                  <TableCell className="pl-6 pr-3 py-3.5 w-56">
                    <div className="flex items-center gap-2">
                      <FileTextIcon size={15} className="text-secondary-400 shrink-0" />
                      <span className="font-medium text-secondary-700 truncate">{report.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4 py-3.5">
                    {t(report.type)}
                  </TableCell>
                  <TableCell className="text-center px-2 lg:px-4 py-3.5">
                    <div className="flex justify-center">
                      <ReportStatusBadge status={report.status} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4 py-3.5">
                    {report.date}
                  </TableCell>
                  <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4 py-3.5 whitespace-nowrap text-xs">
                    {report.dateRange}
                  </TableCell>
                  <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4 py-3.5">
                    {report.time}
                  </TableCell>
                  <TableCell className="text-center px-2 lg:px-4 py-3.5">
                    <div className="flex justify-center gap-1">
                      {report.status === 'FAILED' ? (
                        <>
                          <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors" title={t('Retry')}>
                            <RefreshCw size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-error-bg text-secondary-500 transition-colors" title={t('Delete')}>
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : report.status === 'PROCESSING' ? (
                        <>
                          <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors opacity-50 cursor-not-allowed" title={t('View')} disabled>
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors opacity-50 cursor-not-allowed" title={t('Download')} disabled>
                            <Download size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors" title={t('View')}>
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors" title={t('Download')}>
                            <Download size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors" title={t('Copy')}>
                            <Copy size={16} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-error-bg text-secondary-500 transition-colors" title={t('Delete')}>
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ── Pagination ── */}
        <div className="mt-4 mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}