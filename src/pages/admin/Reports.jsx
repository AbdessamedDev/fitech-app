import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download, Eye, Copy, Trash2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { FileText, SlidersHorizontal, Funnel } from '../../icons/index';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/shared/Pagination';
import { SearchInput } from '../../components/shared/SearchInput';
import { FilterDropdown } from '../../components/shared/FilterDropdown';
import { PrimaryButton } from '../../components/shared/PrimaryButton';

// Chart Data
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
  { name: 'Bardi Card', value: 65, color: '#6942FF' },
  { name: 'Manually', value: 23, color: '#A88BFF' },
  { name: 'Other', value: 12, color: '#E2E8F0' },
];

// Program Badge Config with colors and icons
const programBadgeConfig = {
  'Elite HIT 3D': { 
    badgeColor: '#10B981', 
    badgeBg: 'bg-emerald-50',
    icon: '💪',
    attendees: 342
  },
  'Zen Flow Yoga': { 
    badgeColor: '#8B5CF6', 
    badgeBg: 'bg-purple-50',
    icon: '🧘',
    attendees: 156
  },
  'Power Lifting': { 
    badgeColor: '#EF4444', 
    badgeBg: 'bg-rose-50',
    icon: '🏋️',
    attendees: 205
  },
  'Strength Training': { 
    badgeColor: '#06B6D4', 
    badgeBg: 'bg-cyan-50',
    icon: '🦾',
    attendees: 189
  },
  'Cardio Blast': { 
    badgeColor: '#F59E0B', 
    badgeBg: 'bg-amber-50',
    icon: '🏃',
    attendees: 267
  },
  'Pilates Core': { 
    badgeColor: '#EC4899', 
    badgeBg: 'bg-pink-50',
    icon: '🧘‍♀️',
    attendees: 143
  },
  'Boxing Fitness': { 
    badgeColor: '#D946EF', 
    badgeBg: 'bg-fuchsia-50',
    icon: '🥊',
    attendees: 198
  },
  'Dance Moves': { 
    badgeColor: '#14B8A6', 
    badgeBg: 'bg-teal-50',
    icon: '💃',
    attendees: 221
  },
  'HIIT Sessions': { 
    badgeColor: '#F97316', 
    badgeBg: 'bg-orange-50',
    icon: '⚡',
    attendees: 312
  },
};

const topProgramsData = Object.entries(programBadgeConfig).map(([name, config], idx) => ({
  id: idx + 1,
  name,
  icon: config.icon,
  revenue: `$${(Math.random() * 50 + 20).toFixed(1)}k`,
  subscribers: `${config.attendees} ATTENDEES`,
  attendees: config.attendees,
  badgeColor: config.badgeColor,
  badgeBg: config.badgeBg,
})).sort((a, b) => b.attendees - a.attendees);

// Generate 50+ mock reports for pagination testing
const generateMockReports = () => {
  const statuses = ['READY', 'PROCESSING', 'FAILED'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const types = ['Revenue', 'Members', 'Subscriptions', 'Attendance'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const reports = [];
  for (let i = 1; i <= 52; i++) {
    const month = months[Math.floor(Math.random() * 12)];
    const year = 2026 + Math.floor(i / 13);
    const quarter = quarters[Math.floor(Math.random() * 4)];
    const status = statuses[Math.floor(Math.random() * 3)];
    const type = types[Math.floor(Math.random() * 4)];
    const day = Math.floor(Math.random() * 28) + 1;
    const endDay = Math.floor(Math.random() * 5) + day + 1;
    
    reports.push({
      id: i,
      name: `${quarter} Financial Summary`,
      type,
      status,
      date: `${month} ${day}, ${year}`,
      dateRange: `${month} ${day}, ${year} - ${month} ${endDay}, ${year}`,
      time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    });
  }
  return reports;
};

const mockReports = generateMockReports();

// Utility function to determine retention status badge
const getRetentionStatus = (percentage) => {
  if (percentage >= 80) return { label: 'GOOD', color: '#10B981' };
  if (percentage >= 60) return { label: 'AVERAGE', color: '#F59E0B' };
  return { label: 'BAD', color: '#EF4444' };
};

const ReportStatusBadge = ({ status }) => {
  const statusStyles = {
    READY: 'bg-success-bg text-success border border-success/40',
    PROCESSING: 'bg-secondary-200 text-secondary-600 border border-secondary-300',
    FAILED: 'bg-error-bg text-error border border-error/40',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const TableHeaderCell = ({ icon: Icon, title, showPipe = true }) => {
  const { t } = useTranslation();
  return (
    <TableHead className="p-0 align-middle">
      <div className="flex items-center justify-between h-10">
        <div className="flex flex-1 items-center justify-center gap-2 px-3 lg:px-4 text-secondary-500 font-semibold text-[13px]">
          {Icon && <Icon size={16} strokeWidth={2} />}
          {title && <span>{t(title)}</span>}
        </div>
        {showPipe && <div className="w-px h-[18px] bg-secondary-200"></div>}
      </div>
    </TableHead>
  );
};

export default function Reports() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselMode, setCarouselMode] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = 8;

  // Retention status badge
  const retentionPercentage = 84.2;
  const retentionStatus = getRetentionStatus(retentionPercentage);

  // Top 3 programs by attendance (for default view)
  const topThreePrograms = topProgramsData.slice(0, 3);

  // Carousel handlers
  const handleCarouselNext = () => {
    setCarouselIndex((prev) => (prev + 1) % topProgramsData.length);
  };

  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + topProgramsData.length) % topProgramsData.length);
  };

  const handleBackToDefault = () => {
    setCarouselMode(false);
    setCarouselIndex(0);
  };

  const filteredReports = useMemo(() => {
    let reports = mockReports.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'newest') {
      reports.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      reports.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return reports;
  }, [search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const sortOptions = [
    { label: 'Sort by', value: 'All' },
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
  ];

  const statusOptions = [
    { label: 'Status', value: 'All' },
    { label: 'READY', value: 'READY' },
    { label: 'PROCESSING', value: 'PROCESSING' },
    { label: 'FAILED', value: 'FAILED' },
  ];

  const currentCarouselProgram = topProgramsData[carouselIndex];

  return (
    <div className="bg-secondary-50 min-h-screen py-8 px-4 sm:px-8 w-full flex justify-center text-sm font-sans">
      <div className="w-full max-w-350 flex flex-col gap-8">
        
        {/* Revenue Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-secondary-900 font-sans tracking-tight">{t('Revenue Trend')}</h3>
                <p className="text-[14px] font-normal text-secondary-600 mt-1">{t('Cumulative monthly earnings')}</p>
              </div>
              <button className="flex items-center gap-2 bg-secondary-200 text-secondary-900 px-4 py-2 rounded-full text-xs font-semibold hover:bg-secondary-300 transition-colors">
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
                  <Bar 
                    dataKey="value" 
                    fill="#6942FF" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Channels Pie Chart */}
          <div className="lg:col-span-4 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <div className="w-full mb-6">
              <h3 className="text-xl font-bold text-secondary-800 font-sans tracking-tight">{t('Payment Channels')}</h3>
              <p className="text-[14px] text-secondary-700 mt-1">{t('Transaction source volume')}</p>
            </div>
            
            <div className="relative w-full h-60 flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 100 }]}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={95}
                    fill="#F1F3F5"
                    stroke="none"
                    isAnimationActive={false}
                  />
                  <Pie
                    data={paymentChannelsData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                    animationDuration={1500}
                  >
                    {paymentChannelsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[32px] font-black text-secondary-800 tracking-tight">55%</span>
                <span className="text-[10px] font-bold text-secondary-700 tracking-widest mt-1 uppercase">{t('Bardi MOB')}</span>
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-3 mt-4">
              {paymentChannelsData.map(channel => (
                <div key={channel.name} className="flex justify-between items-center text-[14px]">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: channel.color }}></div>
                    <span className="text-[14px] text-secondary-800 font-medium">{t(channel.name)}</span>
                  </div>
                  <span className="font-bold text-secondary-800 text-[14px]">{channel.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Retention & Top Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Member Retention Card */}
          <div className="lg:col-span-4 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <h3 className="text-xl font-bold text-secondary-800 font-sans tracking-tight mb-8">{t('Member Retention')}</h3>
            
            <div className="flex items-center gap-4 mb-8">
              <p className="text-[48px] font-black text-secondary-800 leading-none tracking-tight">{retentionPercentage}%</p>
              <div className="px-4 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: retentionStatus.color + '20', color: retentionStatus.color, border: `1px solid ${retentionStatus.color}40` }}>
                {retentionStatus.label}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[12px] font-bold text-secondary-700 uppercase tracking-wider">{t('NEW MEMBERS')}</span>
                  <span className="text-[13px] font-bold text-secondary-800">1,304</span>
                </div>
                <div className="h-2 w-full bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[75%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[12px] font-bold text-secondary-700 uppercase tracking-wider">{t('CHURN RATE')}</span>
                  <span className="text-[13px] font-bold text-secondary-800">4.2%</span>
                </div>
                <div className="h-2 w-full bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full bg-error w-[42%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Programs Section */}
          <div className="lg:col-span-8 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xl font-bold text-secondary-800 font-sans tracking-tight">{t('Top Programs Performance')}</h3>
              
              {!carouselMode && (
                <button 
                  onClick={() => setCarouselMode(true)}
                  className="text-success font-bold text-[14px] hover:opacity-80 transition-opacity"
                >
                  {t('View All Programs')}
                </button>
              )}
              
              {carouselMode && (
                <button 
                  onClick={handleBackToDefault}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-bold text-[14px]"
                >
                  <RotateCcw size={18} />
                  Back
                </button>
              )}
            </div>

            {!carouselMode ? (
              // Default View: Top 3 Programs
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300">
                {topThreePrograms.map(program => (
                  <div 
                    key={program.id} 
                    className="bg-secondary-100 p-6 rounded-[16px] border border-secondary-200 hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: program.badgeColor + '20' }}>
                        {program.icon}
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: program.badgeColor }}>
                        #{program.id}
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-secondary-800 mb-4">{program.name}</h4>
                    <div className="flex flex-col gap-2">
                      <p className="text-[13px] text-secondary-600 font-bold">{program.revenue}</p>
                      <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-wide">{program.subscribers}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Carousel View: One program at a time
              <div className="flex flex-col items-center justify-center gap-6 transition-all duration-300 py-8">
                <div className="w-full max-w-sm bg-secondary-100 p-8 rounded-[16px] border border-secondary-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center text-4xl" style={{ backgroundColor: currentCarouselProgram.badgeColor + '20' }}>
                      {currentCarouselProgram.icon}
                    </div>
                    <span className="px-3 py-1.5 rounded text-sm font-bold text-white" style={{ backgroundColor: currentCarouselProgram.badgeColor }}>
                      #{currentCarouselProgram.id}
                    </span>
                  </div>
                  <h4 className="text-[18px] font-bold text-secondary-800 mb-6">{currentCarouselProgram.name}</h4>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-[12px] text-secondary-600 uppercase tracking-wide mb-1">Revenue</p>
                      <p className="text-[20px] font-black text-secondary-800">{currentCarouselProgram.revenue}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-secondary-600 uppercase tracking-wide mb-1">Attendees</p>
                      <p className="text-[16px] font-bold text-secondary-800">{currentCarouselProgram.subscribers}</p>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCarouselPrev}
                    className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-100 transition-colors text-secondary-700"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm font-bold text-secondary-700">
                      {carouselIndex + 1} / {topProgramsData.length}
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleCarouselNext}
                    className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-100 transition-colors text-secondary-700"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 w-full">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1); }}
              placeholder={t('Search reports...')}
              className="flex-1 md:flex-initial"
            />

            <FilterDropdown
              label={t('Sort by')}
              icon={SlidersHorizontal}
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />

            <FilterDropdown
              label={t('Filter')}
              icon={Funnel}
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <span className="hidden sm:inline-block text-secondary-300 font-extrabold opacity-50">|</span>

            <button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap">
              <Download size={18} />
              {t('Import')}
            </button>
          </div>

          <PrimaryButton>
            {t('Generate Report')}
          </PrimaryButton>
        </div>

        {/* Table */}
        <Table className="rounded-xl border border-secondary-200 overflow-hidden shadow-sm w-full bg-secondary-50 text-[14px]">
          <TableHeader className="bg-secondary-100">
            <TableRow isHeader={true}>
              <TableHeaderCell icon={FileText} title="Report Name" />
              <TableHeaderCell title="Type" />
              <TableHeaderCell title="Status" />
              <TableHeaderCell title="Date" />
              <TableHeaderCell title="Date Range" />
              <TableHeaderCell title="Time" />
              <TableHeaderCell title="Operations" showPipe={false} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-secondary-100 transition-colors">
                <TableCell className="text-center font-medium text-secondary-700 px-2 lg:px-4">
                  <div className="flex items-center gap-2 justify-center">
                    <FileText size={16} className="text-secondary-500" />
                    <span>{report.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4">{t(report.type)}</TableCell>
                <TableCell className="text-center px-2 lg:px-4">
                  <div className="flex justify-center">
                    <ReportStatusBadge status={report.status} />
                  </div>
                </TableCell>
                <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4">{report.date}</TableCell>
                <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4 whitespace-nowrap text-xs">{report.dateRange}</TableCell>
                <TableCell className="text-center text-secondary-600 font-medium px-2 lg:px-4">{report.time}</TableCell>
                <TableCell className="text-center px-2 lg:px-4">
                  <div className="flex justify-center gap-1">
                    <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors" title="Download">
                      <Download size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-secondary-200 text-secondary-500 transition-colors" title="Copy">
                      <Copy size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-error-bg text-secondary-500 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="mt-8">
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
