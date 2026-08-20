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
  Coins 
} from 'lucide-react';
import API_BASE_URL from '../config/api';

const RevenueStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' | 'daily'

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
          <span className="text-gray-500 font-bold text-sm">Đang tổng hợp dữ liệu doanh thu...</span>
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

  const { summary, dailyData, monthlyData, deptData, paymentMethodStats, recentTransactions } = statsData;

  // Helpers for chart calculations
  const chartData = timeframe === 'monthly' ? monthlyData : dailyData;
  const maxRevenue = chartData.reduce((max, item) => Math.max(max, item.revenue || 0), 0) || 1;
  const maxDeptRevenue = deptData.reduce((max, item) => Math.max(max, item.revenue || 0), 0) || 1;

  // Payment methods breakdown
  const cashRev = paymentMethodStats["Tiền mặt"] || 0;
  const transferRev = paymentMethodStats["Chuyển khoản"] || 0;
  const totalPayMethodRev = cashRev + transferRev || 1;
  const cashPercent = ((cashRev / totalPayMethodRev) * 100).toFixed(1);
  const transferPercent = ((transferRev / totalPayMethodRev) * 100).toFixed(1);

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
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#004e92]" /> Báo cáo & Thống kê Doanh thu
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi tổng quan tài chính, doanh thu phòng khám, doanh thu thuốc và phương thức thanh toán.
          </p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-2xl text-xs border border-gray-200 transition-colors cursor-pointer self-start md:self-center"
        >
          <RefreshCw className="w-4 h-4" /> Tải lại dữ liệu
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL REVENUE */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Tổng doanh thu</span>
            <span className="text-2xl font-black text-gray-900 block">{(summary.totalRevenue || 0).toLocaleString('vi-VN')} đ</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight size={14} /> Giao dịch hoàn tất
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#004e92]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* CLINIC REVENUE */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Doanh thu khám</span>
            <span className="text-2xl font-black text-gray-900 block">{(summary.totalExamRevenue || 0).toLocaleString('vi-VN')} đ</span>
            <span className="text-xs text-gray-500 font-semibold block mt-1">
              Chiếm {((summary.totalExamRevenue / (summary.totalRevenue || 1)) * 100).toFixed(1)}% cơ cấu
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
            <span className="text-2xl font-black text-gray-900 block">{(summary.totalPrescriptionRevenue || 0).toLocaleString('vi-VN')} đ</span>
            <span className="text-xs text-gray-500 font-semibold block mt-1">
              Chiếm {((summary.totalPrescriptionRevenue / (summary.totalRevenue || 1)) * 100).toFixed(1)}% cơ cấu
            </span>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Số lượt thanh toán</span>
            <span className="text-2xl font-black text-gray-900 block">{summary.count} hóa đơn</span>
            <span className="text-xs text-gray-500 font-semibold block mt-1">
              Trung bình: {Math.round(summary.totalRevenue / (summary.count || 1)).toLocaleString('vi-VN')} đ/hđ
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CHART & PAYMENT METHODS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REVENUE TIMEFRAME CHART (2 columns) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#004e92]" /> Lịch sử doanh thu
            </h3>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeframe === 'monthly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Theo Tháng
              </button>
              <button 
                onClick={() => setTimeframe('daily')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeframe === 'daily' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                30 ngày gần đây
              </button>
            </div>
          </div>

          {/* Bar chart container */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 border-b border-gray-100 pb-1 font-mono">
            {chartData.length > 0 ? (
              chartData.map((item, idx) => {
                const label = timeframe === 'monthly' ? item.month : item.date.slice(5); // Show MM-DD for daily
                const heightPercent = ((item.revenue || 0) / maxRevenue) * 100;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-20">
                      {(item.revenue || 0).toLocaleString('vi-VN')} đ
                    </div>
                    {/* Bar */}
                    <div 
                      style={{ height: `${Math.max(heightPercent, 3)}%` }} 
                      className={`w-full rounded-t-lg transition-all duration-300 group-hover:bg-[#004e92] ${
                        timeframe === 'monthly' 
                          ? 'bg-blue-100 text-[#004e92]' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    />
                    {/* Label at bottom */}
                    <span className="text-[10px] text-gray-400 font-semibold mt-2 select-none text-center truncate w-full">
                      {label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-sm">
                Chưa ghi nhận dữ liệu doanh thu trong khoảng thời gian này.
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
                <span className="font-mono font-bold text-gray-900 text-sm">{transferRev.toLocaleString('vi-VN')} đ</span>
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
                <span className="font-mono font-bold text-gray-900 text-sm">{cashRev.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTMENT REVENUE DISTRIBUTION */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          Doanh thu theo Chuyên khoa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deptData.length > 0 ? (
            deptData.map((item, idx) => {
              const percentage = ((item.revenue || 0) / maxDeptRevenue) * 100;
              
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700">{item.dept}</span>
                    <span className="font-mono font-bold text-gray-900">{(item.revenue || 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%` }} 
                      className="bg-[#004e92] h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center text-gray-400 italic text-sm py-4">
              Chưa ghi nhận doanh thu phát sinh của chuyên khoa nào.
            </div>
          )}
        </div>
      </div>

      {/* RECENT REVENUE TRANSACTIONS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">Giao dịch thu phí gần đây</h3>
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
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => {
                  // Determine combined payment method display
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
                        <div className="text-xs text-gray-400 mt-0.5">SĐT: {tx.phone} {tx.cccd && `| CCCD: ${tx.cccd}`}</div>
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
                    Chưa có giao dịch thanh toán thành công nào được ghi nhận.
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
