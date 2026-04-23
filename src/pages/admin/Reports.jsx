import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download, Eye, Copy, Trash2 } from 'lucide-react';
import { FileText, SlidersHorizontal, Funnel } from '../../icons/index';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/shared/Pagination';
import { SearchInput } from '../../components/shared/SearchInput';
import { FilterDropdown } from '../../components/shared/FilterDropdown';
import { PrimaryButton } from '../../components/shared/PrimaryButton';

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

const topProgramsData = [
  { id: 1, name: 'Elite HIT 3D', icon: '💪', revenue: '$42.8k', subscribers: '342 ATTENDEES' },
  { id: 2, name: 'Zen Flow Yoga', icon: '🧘', revenue: '$28.2k', subscribers: '156 ATTENDEES' },
  { id: 3, name: 'Power Lifting', icon: '🏋️', revenue: '$31.5k', subscribers: '205 ATTENDEES' },
];

const mockReports = [
  { id: 1, name: 'Q2 Financial Summary', type: 'Revenue', status: 'READY', date: 'Nov 12, 2026', dateRange: 'Nov 12, 2026 - Nov 15, 2026', time: '12:45 PM' },
  { id: 2, name: 'Q3 Financial Summary', type: 'Revenue', status: 'READY', date: 'Feb 15, 2027', dateRange: 'Feb 15, 2027 - Feb 18, 2027', time: '10:30 AM' },
  { id: 3, name: 'Q4 Financial Summary', type: 'Revenue', status: 'PROCESSING', date: 'May 10, 2027', dateRange: 'May 10, 2027 - May 16, 2027', time: '2:00 PM' },
  { id: 4, name: 'Q1 Financial Summary', type: 'Revenue', status: 'FAILED', date: 'Aug 15, 2027', dateRange: 'Aug 15, 2027 - Aug 15, 2027', time: '11:00 AM' },
  { id: 5, name: 'Q2 Financial Summary', type: 'Revenue', status: 'FAILED', date: 'Nov 12, 2027', dateRange: 'Nov 12, 2027 - Aug 15, 2027', time: '12:00 PM' },
  { id: 6, name: 'Q3 Financial Summary', type: 'Revenue', status: 'FAILED', date: 'Feb 20, 2028', dateRange: 'Feb 20, 2028 - Aug 15, 2027', time: '1:30 PM' },
  { id: 7, name: 'Q4 Financial Summary', type: 'Revenue', status: 'READY', date: 'May 28, 2028', dateRange: 'May 28, 2028 - May 31, 2028', time: '3:15 PM' },
  { id: 8, name: 'Q4 Financial Summary', type: 'Revenue', status: 'READY', date: 'May 28, 2028', dateRange: 'May 28, 2028 - May 31, 2028', time: '3:15 PM' },
];

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
  const itemsPerPage = 8;

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
                    <span className="text-[14px] text-secondary-800 font-medium">{channel.name}</span>
                  </div>
                  <span className="font-bold text-secondary-800 text-[14px]">{channel.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Retention & Top Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <h3 className="text-xl font-bold text-secondary-800 font-sans tracking-tight mb-6">{t('Member Retention')}</h3>
            
            <div className="text-center mb-8">
              <p className="text-[48px] font-black text-secondary-800 leading-none tracking-tight">84.2%</p>
              <p className="text-success text-[12px] font-bold mt-2">+2.5%</p>
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

          <div className="lg:col-span-8 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xl font-bold text-secondary-800 font-sans tracking-tight">{t('Top Programs Performance')}</h3>
              <button className="text-success font-bold text-[14px] hover:opacity-80 transition-opacity">
                {t('View All Programs')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topProgramsData.map(program => (
                <div key={program.id} className="bg-secondary-100 p-6 rounded-[16px] border border-secondary-200 hover:border-primary-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{program.icon}</span>
                    <span className="text-xs font-bold text-secondary-500">★ {program.id}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-secondary-800 mb-4">{program.name}</h4>
                  <div className="flex flex-col gap-2">
                    <p className="text-[13px] text-secondary-600">{program.revenue}</p>
                    <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-wide">{program.subscribers}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 w-full">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1); }}
              placeholder={t('Search reports...')}
              className="w-full md:w-64"
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
