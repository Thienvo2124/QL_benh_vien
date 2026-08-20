import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Stethoscope, 
  Pill, 
  Receipt, 
  RefreshCw, 
  Calendar, 
  ArrowUpRight, 
  CreditCard, 
  Coins,
  Filter,
  Users
} from 'lucide-react';
import API_BASE_URL from '../config/api';

const RevenueStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState(null);
  
  // Settings & Toggles
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' | 'daily'
  const [chartType, setChartType] = useState('revenue'); // 'revenue' | 'patients'
  
  // Filter States
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('Tất cả');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments/revenue-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setStatsData(data);
      } else {
        setError(data.message || 'Lỗi khi tải dữ liệu doanh thu.');
      }
    } catch (err) {
      console.error('Lỗi fetch stats:', err);
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#004e92] animate-spin" />
          <span className="text-gray-500 font-bold text-sm">Đang tổng hợp dữ liệu thống kê...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center max-w-lg mx-auto my-8">
        <p className="text-red-700 font-bold mb-4">{error}</p>
        <button 
          onClick={fetchStats}
          className="bg-[#004e92] hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-2xl text-sm transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { allTransactions } = statsData;

  // 1. Get list of available years from transactions
  const availableYears = ['Tất cả'];
  if (allTransactions) {
    allTransactions.forEach(tx => {
      const d = new Date(tx.date);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear().toString();
        if (!availableYears.includes(y)) {
          availableYears.push(y);
        }
      }
    });
  }
  // Sort years descending
  availableYears.sort((a, b) => {
    if (a === 'Tất cả') return -1;
    if (b === 'Tất cả') return 1;
    return parseInt(b) - parseInt(a);
  });

  // 2. Perform local filtering
  const filteredTx = (allTransactions || []).filter(tx => {
    const d = new Date(tx.date);
    if (isNaN(d.getTime())) return false;
    
    const txYear = d.getFullYear().toString();
    const txMonth = (d.getMonth() + 1).toString();
    
    const yearMatches = selectedYear === 'Tất cả' || txYear === selectedYear;
    const monthMatches = selectedMonth === 'Tất cả' || txMonth === selectedMonth;
    
    return yearMatches && monthMatches;
  });

  // 3. Compute KPI summary metrics based on filtered transactions
  let localTotalExamRev = 0;
  let localTotalRxRev = 0;
  let localCashRev = 0;
  let localTransferRev = 0;
  const localDeptMap = {};

  filteredTx.forEach(tx => {
    localTotalExamRev += tx.examFee || 0;
    localTotalRxRev += tx.prescriptionFee || 0;

    if (tx.examFee > 0) {
      if (tx.examPaymentMethod === 'Chuyển khoản') localTransferRev += tx.examFee;
      else localCashRev += tx.examFee;
    }
    if (tx.prescriptionFee > 0) {
      if (tx.prescriptionPaymentMethod === 'Chuyển khoản') localTransferRev += tx.prescriptionFee;
      else localCashRev += tx.prescriptionFee;
    }

    if (tx.dept) {
      if (!localDeptMap[tx.dept]) {
        localDeptMap[tx.dept] = { revenue: 0, count: 0 };
      }
      localDeptMap[tx.dept].revenue += tx.totalFee || 0;
      if (tx.status === 'completed') {
        localDeptMap[tx.dept].count += 1;
      }
    }
  });

  const localCompletedCount = filteredTx.filter(tx => tx.status === 'completed').length;
  const localTotalRev = localTotalExamRev + localTotalRxRev;
  const localCount = filteredTx.length;

  const localDeptData = Object.keys(localDeptMap).map(dept => ({
    dept,
    revenue: localDeptMap[dept].revenue,
    count: localDeptMap[dept].count
  })).sort((a, b) => {
    if (chartType === 'revenue') {
      return b.revenue - a.revenue;
    } else {
      return b.count - a.count;
    }
  });

  // 4. Generate Chart Data (Supporting dynamic switch between Doanh thu and Số bệnh nhân đã khám)
  let localChartData = [];
  if (timeframe === 'monthly') {
    if (selectedYear === 'Tất cả') {
      // Group by year-month dynamically
      const monthlyGroups = {};
      filteredTx.forEach(tx => {
        if (chartType === 'patients' && tx.status !== 'completed') return;
        const d = new Date(tx.date);
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const val = chartType === 'revenue' ? tx.totalFee : 1;
        monthlyGroups[monthStr] = (monthlyGroups[monthStr] || 0) + val;
      });
      localChartData = Object.keys(monthlyGroups).sort().map(m => ({
        label: m,
        value: monthlyGroups[m]
      }));
    } else {
      // Show all 12 months for the selected year
      const yearInt = parseInt(selectedYear);
      localChartData = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        const val = filteredTx.reduce((sum, tx) => {
          const d = new Date(tx.date);
          if (d.getFullYear() === yearInt && d.getMonth() === i) {
            if (chartType === 'patients' && tx.status !== 'completed') return sum;
            return sum + (chartType === 'revenue' ? tx.totalFee : 1);
          }
          return sum;
        }, 0);
        return {
          label: `Tháng ${m}`,
          value: val
        };
      });
    }
  } else {
    // Daily timeframe
    if (selectedMonth === 'Tất cả') {
      // Show daily records of last 30 days dynamically
      const dailyGroups = {};
      filteredTx.forEach(tx => {
        if (chartType === 'patients' && tx.status !== 'completed') return;
        const d = new Date(tx.date);
        const dayStr = d.toLocaleDateString('sv-SE'); // YYYY-MM-DD
        const val = chartType === 'revenue' ? tx.totalFee : 1;
        dailyGroups[dayStr] = (dailyGroups[dayStr] || 0) + val;
      });
      localChartData = Object.keys(dailyGroups).sort().slice(-30).map(d => ({
        label: d.slice(5), // MM-DD
        value: dailyGroups[d]
      }));
    } else {
      // Show all days of the selected month
      const yearVal = selectedYear === 'Tất cả' ? new Date().getFullYear() : parseInt(selectedYear);
      const monthVal = parseInt(selectedMonth);
      const daysInMonth = new Date(yearVal, monthVal, 0).getDate();

      localChartData = Array.from({ length: daysInMonth }, (_, i) => {
        const d = i + 1;
        const val = filteredTx.reduce((sum, tx) => {
          const txDate = new Date(tx.date);
          if (
            txDate.getFullYear() === yearVal &&
            txDate.getMonth() + 1 === monthVal &&
            txDate.getDate() === d
          ) {
            if (chartType === 'patients' && tx.status !== 'completed') return sum;
            return sum + (chartType === 'revenue' ? tx.totalFee : 1);
          }
          return sum;
        }, 0);
        return {
          label: `${d}/${monthVal}`,
          value: val
        };
      });
    }
  }

  const maxVal = localChartData.reduce((max, item) => Math.max(max, item.value || 0), 0) || 1;
  const maxDeptRevenue = localDeptData.reduce((max, item) => Math.max(max, chartType === 'revenue' ? (item.revenue || 0) : (item.count || 0)), 0) || 1;

  // Payment method breakdowns
  const totalPayMethodRev = localCashRev + localTransferRev || 1;
  const cashPercent = ((localCashRev / totalPayMethodRev) * 100).toFixed(1);
  const transferPercent = ((localTransferRev / totalPayMethodRev) * 100).toFixed(1);

  const formatDateSafe = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-10">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 flex-wrap">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#004e92]" /> Báo cáo & Thống kê Tổng hợp
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi tổng quan tài chính, doanh thu phòng khám, doanh thu thuốc và lượng bệnh nhân tiếp nhận.
          </p>
        </div>
        
        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
            <Filter size={14} className="text-gray-400" />
            <span>Bộ lọc:</span>
            
            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                if (e.target.value === 'Tất cả') {
                  setSelectedMonth('Tất cả');
                }
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-[#004e92] cursor-pointer"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y === 'Tất cả' ? 'Tất cả các năm' : `Năm ${y}`}</option>
              ))}
            </select>

            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={selectedYear === 'Tất cả'}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-[#004e92] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="Tất cả">Tất cả các tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={(i+1).toString()}>Tháng {i+1}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={fetchStats}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-2xl text-xs border border-gray-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Tải lại
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL REVENUE */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tổng doanh thu</span>
            <span className="text-2xl font-black text-gray-900 block">{localTotalRev.toLocaleString('vi-VN')} đ</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight size={14} /> Giao dịch hoàn tất
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#004e92]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* TOTAL PATIENTS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Bệnh nhân đã khám</span>
            <span className="text-2xl font-black text-gray-900 block">{localCompletedCount} lượt khám</span>
            <span className="text-xs text-indigo-600 font-bold block mt-1">
              Đăng ký: {localCount} ca khám
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* CLINIC REVENUE */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Doanh thu khám</span>
            <span className="text-2xl font-black text-gray-900 block">{localTotalExamRev.toLocaleString('vi-VN')} đ</span>
            <span className="text-xs text-gray-500 font-semibold block mt-1">
              Chiếm {((localTotalExamRev / (localTotalRev || 1)) * 100).toFixed(1)}% cơ cấu
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* DRUG REVENUE */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Doanh thu thuốc</span>
            <span className="text-2xl font-black text-gray-900 block">{localTotalRxRev.toLocaleString('vi-VN')} đ</span>
            <span className="text-xs text-gray-500 font-semibold block mt-1">
              Chiếm {((localTotalRxRev / (localTotalRev || 1)) * 100).toFixed(1)}% cơ cấu
            </span>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <Pill className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CHART & PAYMENT METHODS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REVENUE TIMEFRAME & DATA-TYPE CHART (2 columns) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            
            {/* Left selector toggle: Revenue vs Patients */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button 
                onClick={() => setChartType('revenue')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${chartType === 'revenue' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <DollarSign size={13} /> Doanh thu (đ)
              </button>
              <button 
                onClick={() => setChartType('patients')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${chartType === 'patients' ? 'bg-white text-[#004e92] shadow-sm font-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Users size={13} /> Số bệnh nhân (ca)
              </button>
            </div>

            {/* Right selector toggle: Monthly vs Daily */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeframe === 'monthly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Theo Tháng
              </button>
              <button 
                onClick={() => setTimeframe('daily')}
                disabled={selectedYear === 'Tất cả'}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${timeframe === 'daily' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Chi tiết ngày
              </button>
            </div>
          </div>

          {/* Bar chart container */}
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-6 border-b border-gray-100 pb-1 font-mono overflow-x-auto">
            {localChartData.length > 0 ? (
              localChartData.map((item, idx) => {
                const heightPercent = ((item.value || 0) / maxVal) * 100;
                const isMonthLabel = item.label.startsWith('Tháng ');
                const displayLabel = isMonthLabel ? item.label.replace('Tháng ', 'T') : item.label;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end min-w-[20px]">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-20">
                      {item.label}: {chartType === 'revenue' ? `${(item.value || 0).toLocaleString('vi-VN')} đ` : `${item.value} bệnh nhân`}
                    </div>
                    {/* Bar */}
                    <div 
                      style={{ height: `${Math.max(heightPercent, item.value > 0 ? 3 : 0)}%` }} 
                      className={`w-12 max-w-full rounded-t transition-all duration-300 ${
                        item.value > 0
                          ? (chartType === 'revenue' 
                              ? (timeframe === 'monthly' ? 'bg-[#004e92] hover:bg-blue-800' : 'bg-emerald-600 hover:bg-emerald-700')
                              : 'bg-indigo-600 hover:bg-indigo-700')
                          : 'bg-transparent border-t border-dashed border-gray-200'
                      }`}
                    />
                    {/* Label at bottom */}
                    <span 
                      className="text-[9px] md:text-[10px] text-gray-400 font-bold mt-2 select-none text-center truncate w-full"
                      title={item.label}
                    >
                      {displayLabel}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-sm">
                Chưa ghi nhận dữ liệu thống kê trong khoảng thời gian này.
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT METHODS & STRUCTURE (1 column) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-1">
              Phương thức thanh toán
            </h3>
            <p className="text-xs text-gray-500 font-medium">Đối soát tỷ lệ doanh thu tiền mặt vs chuyển khoản</p>
          </div>

          <div className="space-y-6">
            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${transferPercent}%` }} 
                  className="bg-blue-600 h-full transition-all"
                  title={`Chuyển khoản: ${transferPercent}%`}
                />
                <div 
                  style={{ width: `${cashPercent}%` }} 
                  className="bg-amber-500 h-full transition-all"
                  title={`Tiền mặt: ${cashPercent}%`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-bold">
                <span>Chuyển khoản ({transferPercent}%)</span>
                <span>Tiền mặt ({cashPercent}%)</span>
              </div>
            </div>

            {/* List breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-800 block">Chuyển khoản (SePay)</span>
                    <span className="text-[10px] text-gray-400 block font-semibold">Tự động nhận diện</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-gray-900 text-sm">{localTransferRev.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Coins size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-800 block">Tiền mặt tại quầy</span>
                    <span className="text-[10px] text-gray-400 block font-semibold">Thu ngân xác nhận</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-gray-900 text-sm">{localCashRev.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTMENT DISTRIBUTION */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          Thống kê lượt khám theo chuyên khoa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localDeptData.length > 0 ? (
            localDeptData.map((item, idx) => {
              const currentValue = chartType === 'revenue' ? (item.revenue || 0) : (item.count || 0);
              const percentage = (currentValue / maxDeptRevenue) * 100;
              
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700">{item.dept}</span>
                    <span className="font-mono font-bold text-gray-900 flex items-center gap-1.5">
                      {chartType === 'revenue' ? (
                        <>
                          <span className="text-gray-900">{(item.revenue || 0).toLocaleString('vi-VN')} đ</span>
                          <span className="text-[11px] text-gray-400 font-sans font-semibold">({item.count || 0} lượt)</span>
                        </>
                      ) : (
                        <>
                          <span className="text-indigo-600">{item.count || 0} lượt khám</span>
                          <span className="text-[11px] text-gray-400 font-sans font-semibold">({(item.revenue || 0).toLocaleString('vi-VN')} đ)</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%` }} 
                      className={`h-full rounded-full transition-all duration-500 ${
                        chartType === 'revenue' ? 'bg-[#004e92]' : 'bg-indigo-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center text-gray-400 italic text-sm py-4">
              Không có dữ liệu {chartType === 'revenue' ? 'doanh thu' : 'lượt khám'} chuyên khoa trong khoảng thời gian lọc.
            </div>
          )}
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg">Giao dịch thu phí & Hồ sơ bệnh nhân gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 font-bold">
                <th className="p-5 w-32">Mã HS</th>
                <th className="p-5">Bệnh nhân</th>
                <th className="p-5">Chuyên khoa</th>
                <th className="p-5 text-right">Lệ phí khám</th>
                <th className="p-5 text-right">Tiền thuốc</th>
                <th className="p-5 text-right">Tổng thu</th>
                <th className="p-5 text-center">Hình thức</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 font-semibold text-gray-700">
              {filteredTx.length > 0 ? (
                filteredTx.slice(0, 15).map((tx) => {
                  const methods = [];
                  if (tx.examFee > 0) {
                    methods.push(`Khám: ${tx.examPaymentMethod || 'Tiền mặt'}`);
                  }
                  if (tx.prescriptionFee > 0) {
                    methods.push(`Thuốc: ${tx.prescriptionPaymentMethod || 'Tiền mặt'}`);
                  }

                  return (
                    <tr key={tx._id} className="hover:bg-blue-50/10 transition-colors">
                      <td className="p-5 font-mono text-gray-900 font-bold">{tx.appointmentCode}</td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{tx.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">SĐT: {tx.phone} {tx.cccd && `| CCCD: ${tx.cccd}`} | Ngày: {formatDateSafe(tx.date)}</div>
                      </td>
                      <td className="p-5 font-medium text-gray-500">{tx.dept}</td>
                      <td className="p-5 text-right font-mono text-gray-600">
                        {tx.examFee > 0 ? `${tx.examFee.toLocaleString('vi-VN')} đ` : '-'}
                      </td>
                      <td className="p-5 text-right font-mono text-gray-600">
                        {tx.prescriptionFee > 0 ? `${tx.prescriptionFee.toLocaleString('vi-VN')} đ` : '-'}
                      </td>
                      <td className="p-5 text-right font-mono font-bold text-gray-900">
                        {tx.totalFee.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-5 text-center text-xs text-gray-500">
                        <div className="space-y-1">
                          {methods.map((m, i) => (
                            <span key={i} className="inline-block bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5 font-semibold text-[10px] block w-max mx-auto">
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 italic">
                    Không tìm thấy giao dịch thanh toán nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RevenueStats;
