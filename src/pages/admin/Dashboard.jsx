import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, UserCircleCheck, PiggyBankIcon, BarbellIcon, IdentificationCard, TrendUp, TrendDown,
  UserPlus, CreditCard, BoxingGloveIcon, Megaphone, CaretDown, CaretLeft, CaretRight
} from '../../icons/index';
import { api } from '../../services/api';

const defaultGrowthData = [
  { name: 'JAN', members: 400 },
  { name: 'FEB', members: 450 },
  { name: 'MAR', members: 430 },
  { name: 'APR', members: 700 },
  { name: 'MAY', members: 850 },
  { name: 'JUN', members: 1248 },
];

const defaultPlansData = [
  { name: 'Premium Elite', value: 58, color: '#6942FF' },
  { name: 'Basic Standard', value: 32, color: '#A88BFF' },
  { name: 'Custom Corporate', value: 10, color: '#E2E8F0' },
];

const defaultSessionsData = [
  { id: 1, type: "HIIT", time: "08:00 AM", title: "Morning Burnout", avatar: "https://i.pravatar.cc/150?u=sarah", instructor: "Sarah Miller", enrolled: "18/20" },
  { id: 2, type: "Yoga", time: "10:30 AM", title: "Flow & Focus", avatar: "https://i.pravatar.cc/150?u=david", instructor: "David Chen", enrolled: "12/15" },
  { id: 3, type: "Power", time: "02:00 PM", title: "Strength 101", avatar: "https://i.pravatar.cc/150?u=mike", instructor: "Mike Rourke", enrolled: "8/10" },
  { id: 4, type: "BJJ", time: "05:00 PM", title: "Grappling Fundamentals", avatar: "https://i.pravatar.cc/150?u=carlos", instructor: "Carlos Silva", enrolled: "22/25" },
];

const sessionTypeStyles = {
  "HIIT": { text: "text-[#6942FF]", bg: "bg-[#F4F0FF]" },
  "Yoga": { text: "text-[#E67E22]", bg: "bg-[#FFF4E5]" },
  "Power": { text: "text-[#339AF0]", bg: "bg-[#E5F4FF]" },
  "BJJ": { text: "text-[#FA5252]", bg: "bg-[#FFEBEB]" },
  "Pilates": { text: "text-[#20C997]", bg: "bg-[#E6FCF5]" },
  "Boxing": { text: "text-[#F59F00]", bg: "bg-[#FFF9E6]" },
  "Cycle": { text: "text-[#E64980]", bg: "bg-[#FFF0F6]" },
  "default": { text: "text-secondary-600", bg: "bg-secondary-100" }
};

function useEntranceAnimation() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
  }, []);
  return isReady;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAnimated = useEntranceAnimation();
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  // Dynamic backend integration states
  const [dashboardData, setDashboardData] = useState(null);
  const [todaySessions, setTodaySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [adminStats, sessions] = await Promise.all([
        api.getAdminDashboard(),
        api.getSessionsToday().catch(() => [])
      ]);
      setDashboardData(adminStats);

      if (Array.isArray(sessions) && sessions.length > 0) {
        const mapped = sessions.map((s) => ({
          id: s.sessionId || s.id,
          type: s.exerciseType || s.type || "Workout",
          time: s.startTime ? new Date(s.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : s.time || "08:00 AM",
          title: s.name || s.title || "Daily Training Session",
          avatar: s.coachPhotoUrl || s.avatar || "https://i.pravatar.cc/150?u=coach",
          instructor: s.coachName || s.instructor || "Coach",
          enrolled: `${s.enrolledCount || 0}/${s.capacity || 20}`
        }));
        setTodaySessions(mapped);
      } else {
        setTodaySessions(defaultSessionsData);
      }
    } catch (err) {
      console.error("Dashboard failed to retrieve live C# api metrics:", err);
      setError(err.message || 'Connecting to backend microservices failed.');
      setTodaySessions(defaultSessionsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNextSession = () => {
    const listLength = todaySessions.length > 0 ? todaySessions.length : 1;
    setCurrentSessionIndex((prev) => (prev + 1) % listLength);
  };

  const handlePrevSession = () => {
    const listLength = todaySessions.length > 0 ? todaySessions.length : 1;
    setCurrentSessionIndex((prev) => (prev - 1 + listLength) % listLength);
  };

  const extendedSessions = todaySessions.length > 0 ? [...todaySessions, ...todaySessions] : [];

  // Mapped metrics from backend response
  const membersCount = dashboardData?.totalMembers !== undefined ? dashboardData.totalMembers.toLocaleString() : "1,248";
  const checkinsCount = dashboardData?.todayCheckIns !== undefined ? dashboardData.todayCheckIns.toLocaleString() : "156";
  const revenueAmount = dashboardData?.monthlyRevenue !== undefined ? `$${Number(dashboardData.monthlyRevenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "$45,200";
  const activeSubsCount = dashboardData?.activeSubscriptions !== undefined ? dashboardData.activeSubscriptions.toLocaleString() : "942";

  // Mapped growth data
  const growthData = dashboardData?.membershipGrowth && dashboardData.membershipGrowth.length > 0
    ? dashboardData.membershipGrowth.map(p => ({ name: String(p.month).toUpperCase(), members: p.count }))
    : defaultGrowthData;

  // Mapped plans breakdown
  const planColors = ['#6942FF', '#A88BFF', '#20C997', '#FA5252', '#339AF0'];
  const plansData = dashboardData?.plansBreakdown && dashboardData.plansBreakdown.length > 0
    ? dashboardData.plansBreakdown.map((p, idx) => ({
        name: p.planName,
        value: Number(p.percentage),
        color: planColors[idx % planColors.length]
      }))
    : defaultPlansData;

  const totalActivePlans = dashboardData?.activeSubscriptions !== undefined ? dashboardData.activeSubscriptions.toLocaleString() : "1.1k";

  return (
    <div className="bg-secondary-100 min-h-screen py-8 px-4 sm:px-8 flex justify-center text-sm font-sans w-full overflow-hidden">
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            opacity: 0;
            animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .carousel-track {
            --translate-step: calc(-100% - 20px);
          }
          .carousel-item {
            flex: 0 0 100%;
          }
          @media (min-width: 640px) {
            .carousel-track {
              --translate-step: calc(-50% - 10px);
            }
            .carousel-item {
              flex: 0 0 calc(50% - 10px);
            }
          }
          @media (min-width: 1024px) {
            .carousel-track {
              --translate-step: calc(-25% - 5px);
            }
            .carousel-item {
              flex: 0 0 calc(25% - 15px);
            }
          }
        `}
      </style>

      <div className="w-full max-w-350 flex flex-col gap-6">
        
        {/* Error notification banner */}
        {error && (
          <div className="rounded-xl border border-error/20 bg-error-bg p-4 flex items-center justify-between shadow-sm animate-fade-up">
            <p className="text-sm font-semibold text-error">
              {t("Error connecting to live server dashboard details. Displaying offline simulator placeholders.")}
            </p>
            <button onClick={loadData} className="px-3 py-1.5 bg-error text-white text-xs font-bold rounded-lg hover:bg-error/90 cursor-pointer">
              {t("Retry Connection")}
            </button>
          </div>
        )}

        {/* Row 1: Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
            <MetricCard
              title={t('Total Members')}
              value={membersCount}
              icon={<Users size={26} weight="regular" color="#6942FF" />}
              trend="+12%"
              isPositive={true}
            />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <MetricCard
              title={t("Today's Check-ins")}
              value={checkinsCount}
              icon={<UserCircleCheck size={26} weight="regular" color="#6942FF" />}
              trend="-2%"
              isPositive={false}
            />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            <MetricCard
              title={t('Monthly Revenue')}
              value={revenueAmount}
              icon={<PiggyBankIcon size={26} weight="regular" color="#6942FF" />}
              trend="+18%"
              isPositive={true}
            />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            <MetricCard
              title={t('Active Subs')}
              value={activeSubsCount}
              icon={<IdentificationCard size={26} weight="regular" color="#6942FF" />}
              trend="+5%"
              isPositive={true}
            />
          </div>
        </div>

        {/* Row 2: Charts (Membership Growth & Membership Plans) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Membership Growth Chart */}
          <div className="lg:col-span-8 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-200 flex flex-col animate-fade-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-300" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-secondary-900 font-sans tracking-tight">{t('Membership Growth')}</h3>
                <p className="text-[14px] font-normal text-secondary-600 mt-1">{t('Historical performance over the current year')}</p>
              </div>
            </div>
            <div className="flex-1 w-full min-h-75 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6942FF" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6942FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#868E96', fontWeight: 600 }} 
                    dy={10} 
                  />
                  <RechartsTooltip 
                    cursor={{ stroke: '#E5E7EB', strokeWidth: 2, strokeDasharray: '4 4' }} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="members" 
                    stroke="#6942FF" 
                    strokeWidth={3.5} 
                    fillOpacity={1} 
                    fill="url(#colorMembers)" 
                    activeDot={{ r: 6, fill: '#6942FF', stroke: '#fff', strokeWidth: 3 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Membership Plans Donut Chart */}
          <div className="lg:col-span-4 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-300 flex flex-col animate-fade-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300" style={{ animationDelay: '500ms' }}>
            <div className="w-full mb-8">
              <h3 className="text-xl font-bold text-secondary-800 font-sans tracking-tight">{t('Membership Plans')}</h3>
              <p className="text-[14px] text-secondary-700 mt-1">{t('Active distribution by tier')}</p>
            </div>
            
            <div className="relative w-full h-60 flex items-center justify-center my-4 opacity-0 animate-[fadeUp_0.5s_ease-out_1s_forwards]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* Background Track Pie */}
                  <Pie
                    data={[{ value: 100 }]}
                    cx="50%" cy="50%"
                    innerRadius={76} outerRadius={98}
                    fill="#F1F3F5"
                    stroke="none"
                    isAnimationActive={false}
                  />
                  {/* Actual Data Pie */}
                  <Pie
                    data={plansData}
                    cx="50%" cy="50%"
                    innerRadius={76} outerRadius={98}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                    animationDuration={1500}
                  >
                    {plansData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip cursor={false} contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-[30px] font-black text-secondary-800 tracking-tight">{totalActivePlans}</span>
                <span className="text-[10px] font-bold text-secondary-700 tracking-widest mt-1 uppercase">{t('TOTAL ACTIVE')}</span>
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-4 mt-auto pt-2">
              {plansData.map(plan => (
                <div key={plan.name} className="flex justify-between items-center text-[14px]">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: plan.color }}></div>
                    <span className="text-[14px] text-secondary-800 font-medium">{plan.name}</span>
                  </div>
                  <span className="font-bold text-secondary-800 text-[14px]">{plan.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Upcoming Sessions & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Upcoming Sessions Carousel */}
          <div className="lg:col-span-8 bg-secondary-50 p-8 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-secondary-300 flex flex-col animate-fade-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300" style={{ animationDelay: '600ms' }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-secondary-900 font-sans tracking-tight">{t('Upcoming Sessions')}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevSession}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary-100 transition-colors text-secondary-900 cursor-pointer"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <button 
                  onClick={handleNextSession}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary-100 transition-colors text-secondary-900 cursor-pointer"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden w-full px-4 pt-6 pb-8 -mx-4 -mt-6 -mb-8">
              <div 
                className="flex gap-5 carousel-track transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateX(calc(${currentSessionIndex} * var(--translate-step)))` }}
              >
                {extendedSessions.map((session, idx) => {
                  const styles = sessionTypeStyles[session.type] || sessionTypeStyles.default;
                  return (
                    <div key={`${session.id}-${idx}`} className="carousel-item">
                      <SessionCard 
                        type={session.type} typeColor={styles.text} typeBg={styles.bg}
                        time={session.time} title={session.title}
                        avatar={session.avatar} instructor={session.instructor} enrolled={session.enrolled}
                        idx={(idx % 4) + 1}
                      />
                    </div>
                  );
                })}
                {extendedSessions.length === 0 && (
                  <p className="w-full text-center text-secondary-400 font-semibold py-8">{t("No sessions scheduled for today.")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions (Without Gym Occupancy) */}
          <div className="lg:col-span-4 p-8 bg-secondary-50 border border-secondary-300 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-start animate-fade-up hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300" style={{ animationDelay: '700ms' }}>
            <h3 className="text-xl font-bold text-secondary-800 mb-6 font-sans tracking-tight">{t('Quick Actions')}</h3>
            <div className="grid grid-cols-2 gap-4 flex-1 items-center">
              <div onClick={() => navigate('/admin/members')} className="w-full h-full">
                <QuickAction icon={<UserPlus size={26} weight="regular" color="#6942FF" />} title={t('Add Member')} />
              </div>
              <div onClick={() => navigate('/admin/subscriptions')} className="w-full h-full">
                <QuickAction icon={<CreditCard size={26} weight="regular" color="#6942FF" />} title={t('New Subscription')} />
              </div>
              <div onClick={() => navigate('/admin/settings')} className="w-full h-full">
                <QuickAction icon={<BoxingGloveIcon size={26} weight="regular" color="#6942FF" />} title={t('Add a Coach')} />
              </div>
              <div onClick={() => navigate('/admin/requests')} className="w-full h-full">
                <QuickAction icon={<Megaphone size={26} weight="regular" color="#6942FF" />} title={t('Review Requests')} />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, isPositive }) {
  return (
    <div className="group bg-secondary-50 p-6 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-secondary-200 flex flex-col gap-5 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-[0_18px_42px_rgba(105,66,255,0.14)] transition-all duration-500 ease-out cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
        <div className={`px-2.5 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1 ${isPositive ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
          {isPositive ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
          {trend}
        </div>
      </div>
      <div className="flex flex-col gap-1.75 overflow-hidden">
        <h3 className="text-[14px] font-medium text-secondary-600">{title}</h3>
        <p className="text-[30px] font-bold text-secondary-800 leading-none font-sans tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, title }) {
  return (
    <button className="flex flex-col items-center justify-center p-5 border border-secondary-200 bg-secondary-50 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-gray-200 transition-all duration-300 group">
      <div className="mb-3 group-hover:scale-110 transition-transform duration-300 font-extrabold w-12 h-12 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[13px] font-bold text-secondary-800 text-center leading-snug">
        {title.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              {i === 2 && <br />}
              {i !== 0 && ' '}
              {word}
            </React.Fragment>
          ))}
      </span>
    </button>
  );
}

function CourseProgress({ title, percentage, delay }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-end mb-0.5">
        <span className="text-[12px] font-semibold text-secondary-600 tracking-wide font-sans">{title}</span>
        <span className="text-[12px] font-semibold text-secondary-600">{percentage}% <span className="text-secondary-600 font-semibold ml-0.5 uppercase">{t('Full')}</span></span>
      </div>
      <div className="w-full h-3 bg-secondary-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-600 rounded-full opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]" 
          style={{ width: `${percentage}%`, animationDelay: delay }}
        ></div>
      </div>
    </div>
  );
}

function SessionCard({ type, typeColor, typeBg, time, title, avatar, instructor, enrolled, idx }) {
  const { t } = useTranslation();
  return (
    <div className="h-[215px] bg-secondary-100 border border-secondary-200 rounded-[20px] p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 opacity-0 animate-fade-up" style={{ animationDelay: `${800 + (idx * 100)}ms` }}>
      <div>
        <div className="flex justify-between items-center mb-4 text-[11px] font-bold">
          <span className={`px-2.5 py-1 rounded-md ${typeBg} ${typeColor}`}>{type}</span>
          <span className="text-[10px] text-secondary-600 font-semibold">{time}</span>
        </div>
        <h4 className="text-base font-semibold text-secondary-900 mb-8 leading-snug">{title}</h4>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={instructor} className="w-9 h-9 rounded-full shadow-sm" />
          <div className="flex flex-col rtl:text-right">
            <span className="text-xs font-medium text-secondary-900 leading-tight block max-w-20">{instructor.split(' ')[0]}<br/>{instructor.split(' ')[1]}</span>
          </div>
        </div>
        <div className="flex flex-col ltr:text-right rtl:text-left">
          <span className="text-[10px] font-semibold text-secondary-600 leading-tight">{enrolled}</span>
          <span className="text-[10px] font-semibold text-secondary-600 mt-0.5">{t('Enrolled')}</span>
        </div>
      </div>
    </div>
  );
}
