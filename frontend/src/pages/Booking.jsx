import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Calendar, Clock, Stethoscope, CheckCircle, Bot, Sparkles, ChevronRight, ChevronLeft, UserCheck, UserPlus, FileText, Sun, SunDim, Check, Award, Star, Smile, Ticket, RefreshCw } from 'lucide-react';
import API_BASE_URL from '../config/api';
import departments from '../data/departments';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../contexts/AuthContext';

const steps = ['Thông tin cá nhân', 'Chọn khoa & bác sĩ', 'Chọn lịch', 'Xác nhận'];
const morningTimes = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30'];
const afternoonTimes = ['13:30', '14:00', '14:30', '15:00', '15:30'];

const initialForm = {
  name: '',
  phone: '',
  dob: '',
  gender: '',
  dept: '',
  doctor: '',
  date: '',
  time: 'Trong ngày',
  reason: '',
};

const Booking = () => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [isForSelf, setIsForSelf] = useState(true);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Suggestion State
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [suggestedDept, setSuggestedDept] = useState(null);

  // Day/Month/Year dropdown states for date of birth
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  // UMC UI states: Address, Captcha, BuoiKham
  const [address, setAddress] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [buoiKham, setBuoiKham] = useState('Sáng');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Cập nhật nguyên tử dobDay/dobMonth/dobYear và form.dob
  const handleDobChange = (type, value) => {
    let newDay = dobDay;
    let newMonth = dobMonth;
    let newYear = dobYear;

    if (type === 'day') {
      newDay = value;
      setDobDay(value);
    } else if (type === 'month') {
      newMonth = value;
      setDobMonth(value);
    } else if (type === 'year') {
      newYear = value;
      setDobYear(value);
    }

    if (newDay && newMonth && newYear) {
      const formattedDob = `${newYear}-${newMonth}-${newDay}`;
      if (form.dob !== formattedDob) {
        setForm(prev => ({ ...prev, dob: formattedDob }));
      }
    } else {
      if (form.dob !== '') {
        setForm(prev => ({ ...prev, dob: '' }));
      }
    }
  };

  // Điền tự động thông tin từ tài khoản đăng nhập khi vào trang
  useEffect(() => {
    if (user && isForSelf) {
      setForm((prev) => ({
        ...prev,
        name: user.fullName || '',
        phone: user.phone || '',
        dob: user.birthDate || '',
        gender: user.gender || '',
      }));
      
      // Điền trực tiếp vào các ô chọn ngày sinh nếu user có ngày sinh
      if (user.birthDate) {
        const parts = user.birthDate.split('-');
        if (parts.length === 3) {
          setDobYear(parts[0]);
          setDobMonth(parts[1]);
          setDobDay(parts[2]);
        }
      }
    } else if (!isForSelf) {
      // Clear thông tin khi chọn đặt cho người thân
      setForm((prev) => ({
        ...prev,
        name: '',
        phone: '',
        dob: '',
        gender: '',
      }));
      setDobDay('');
      setDobMonth('');
      setDobYear('');
    }
  }, [user, isForSelf]);

  const set = (key, value) => {
    setError('');
    setForm((current) => ({ ...current, [key]: value }));
  };

  const selectedDept = departments.find((dept) => dept.name === form.dept);

  // Tính ngày tối thiểu (hôm nay) và tối đa (30 ngày sau) để giới hạn lịch
  const getMinMaxDates = () => {
    const today = new Date();
    const minStr = today.toLocaleDateString('sv-SE'); // Định dạng YYYY-MM-DD
    
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    const maxStr = maxDate.toLocaleDateString('sv-SE');
    
    return { min: minStr, max: maxStr };
  };

  const { min: minDate, max: maxDate } = getMinMaxDates();

  // Gọi AI tư vấn khoa dựa trên triệu chứng
  const handleAiSuggest = async () => {
    if (!form.reason.trim()) {
      setError('Vui lòng mô tả triệu chứng của bạn trước khi nhờ AI hỗ trợ!');
      return;
    }

    setAiSuggesting(true);
    setSuggestedDept(null);
    setError('');

    try {
      const promptText = `Tôi có triệu chứng sau: "${form.reason}". Vui lòng phân tích và chỉ ra tôi nên đi khám chuyên khoa nào trong số các chuyên khoa sau của Bệnh viện: [Tim mạch, Thần kinh, Nha khoa, Nhãn khoa, Sản phụ khoa, Nhi khoa, Nội tổng quát, Chấn thương chỉnh hình, Ung bướu, Da liễu, Tai mũi họng]. Chỉ trả về duy nhất tên chuyên khoa được chọn (Ví dụ: "Thần kinh" hoặc "Tim mạch" hoặc "Nội tổng quát"). Không viết thêm bất kỳ từ nào khác.`;

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText })
      });

      const data = await response.json();
      if (data.success) {
        const reply = data.reply.trim();
        // Tìm xem chuyên khoa nào khớp với kết quả trả về của AI
        const matched = departments.find(d => reply.toLowerCase().includes(d.name.toLowerCase()));
        if (matched) {
          setSuggestedDept(matched);
        } else {
          // Fallback sang Nội tổng quát nếu AI không chốt được khoa
          const generalDept = departments.find(d => d.name === 'Nội tổng quát');
          setSuggestedDept(generalDept);
        }
      } else {
        throw new Error();
      }
    } catch {
      // Dự phòng nếu API lỗi thì tự động đề xuất Nội tổng quát
      const generalDept = departments.find(d => d.name === 'Nội tổng quát');
      setSuggestedDept(generalDept);
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    // Validations
    if (!form.name.trim()) return setError('Vui lòng nhập Họ và tên.');
    if (!form.phone.trim()) return setError('Vui lòng nhập Số điện thoại.');
    if (!form.dob) return setError('Vui lòng chọn Ngày sinh.');
    if (!form.gender) return setError('Vui lòng chọn Giới tính.');
    if (!form.dept) return setError('Vui lòng chọn Chuyên khoa khám.');
    if (!form.date) return setError('Vui lòng chọn Ngày khám.');
    if (!form.time) return setError('Vui lòng chọn Giờ khám.');


    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          doctor: form.doctor || 'Hệ thống tự phân công'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể đặt lịch khám. Vui lòng thử lại.');
      }

      setCode(data.appointmentCode);
      setStep(5);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại.');
      generateCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => {
    const icons = [<User size={16} />, <Stethoscope size={16} />, <Calendar size={16} />, <CheckCircle size={16} />];
    return (
      <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        {steps.map((label, index) => {
          const n = index + 1;
          const done = step > n;
          const active = step === n;

          return (
            <div key={label} className="flex-1 flex items-center justify-center relative">
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    done
                      ? 'bg-green-500 text-white shadow-lg'
                      : active
                        ? 'bg-[#004e92] text-white shadow-lg scale-110 ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {done ? <Check size={16} /> : icons[index]}
                </div>
                <span className={`text-[11px] mt-2 font-bold ${active ? 'text-[#004e92]' : 'text-gray-400'} hidden md:block`}>
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute right-[-50%] top-4 w-full h-[3px] bg-gray-100 -z-0">
                  <div
                    className="h-full bg-green-400 transition-all duration-500"
                    style={{ width: step > n ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Header />
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-12 px-4 shadow-inner">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <Ticket className="w-8 h-8 text-blue-300" /> Đặt lịch khám trực tuyến
          </h1>
          <p className="text-blue-100 text-sm">Đặt lịch hẹn nhanh chóng, nhận vé xác nhận tức thì.</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white px-4 py-3 text-xs text-gray-400 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <Link to="/" className="hover:text-[#004e92]">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600 font-semibold">Đặt lịch khám</span>
        </div>
      </div>

      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          
          {/* MÀN HÌNH ĐĂNG KÝ MỘT TRANG */}
          {step < 5 && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row max-w-5xl mx-auto animate-fadeIn">
              
              {/* CỘT TRÁI: LƯU Ý / THÔNG TIN CHÍNH SÁCH */}
              <div className="lg:w-1/3 bg-gradient-to-br from-[#004e92] to-[#000428] text-white p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black border-b border-blue-400/30 pb-3 mb-6 uppercase tracking-wider text-blue-300">
                    Lưu ý quan trọng:
                  </h3>
                  <ul className="space-y-5 text-xs font-semibold leading-relaxed text-blue-100">
                    <li className="flex gap-2">
                      <span className="text-blue-300 font-bold">1.</span>
                      <span>Lịch hẹn có hiệu lực sau khi có cuộc gọi hoặc tin nhắn xác nhận chính thức từ tổng đài Bệnh viện Nhân Dân.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-300 font-bold">2.</span>
                      <span>Quý khách hàng vui lòng cung cấp thông tin chính xác để được phục vụ tốt nhất. Trong trường hợp cung cấp sai số điện thoại hoặc email, cuộc hẹn sẽ tự động bị hủy bỏ.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-300 font-bold">3.</span>
                      <span>Quý khách sử dụng dịch vụ đặt hẹn trực tuyến xin vui lòng hoàn tất đăng ký ít nhất là 24 giờ trước giờ khám dự kiến.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-300 font-bold">4.</span>
                      <span>Trong trường hợp khẩn cấp hoặc nghi ngờ có các triệu chứng nguy hiểm nguy kịch, vui lòng ĐẾN TRỰC TIẾP Phòng Cấp Cứu của bệnh viện gần nhất để xử lý kịp thời.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-12 pt-6 border-t border-blue-400/20 text-[10px] text-blue-400 font-bold text-center tracking-widest uppercase">
                  Bệnh viện Nhân Dân • Hotline 1900 2115
                </div>
              </div>

              {/* CỘT PHẢI: FORM ĐĂNG KÝ KHÁM */}
              <div className="lg:w-2/3 p-8 sm:p-10 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <h2 className="text-2xl font-black text-[#004e92] uppercase tracking-wide">ĐĂNG KÝ KHÁM</h2>
                    <p className="text-gray-500 text-xs mt-1">
                      Vui lòng điền thông tin vào form dưới đây để đăng ký khám bệnh theo yêu cầu!
                    </p>
                  </div>
                </div>

                {user && isForSelf && (
                  <div className="bg-blue-50/60 border border-blue-100 text-blue-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2">
                    <Smile size={16} className="text-[#004e92] flex-shrink-0" />
                    <span>Chào <strong>{user.fullName}</strong>, thông tin hồ sơ của bạn đã được tự động nhập dưới đây.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Họ tên & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Họ và tên *</label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] transition-colors"
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="nhap.email@vi-du.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] transition-colors"
                        value={form.email || ''}
                        onChange={(e) => set('email', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Ngày sinh & Số điện thoại */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Ngày sinh *</label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white cursor-pointer"
                          value={dobDay}
                          onChange={(e) => handleDobChange('day', e.target.value)}
                        >
                          <option value="">Ngày</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                            const val = String(d).padStart(2, '0');
                            return <option key={d} value={val}>{d}</option>;
                          })}
                        </select>
                        <select
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white cursor-pointer"
                          value={dobMonth}
                          onChange={(e) => handleDobChange('month', e.target.value)}
                        >
                          <option value="">Tháng</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                            const val = String(m).padStart(2, '0');
                            return <option key={m} value={val}>Tháng {m}</option>;
                          })}
                        </select>
                        <select
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white cursor-pointer"
                          value={dobYear}
                          onChange={(e) => handleDobChange('year', e.target.value)}
                        >
                          <option value="">Năm</option>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                            <option key={y} value={String(y)}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Số điện thoại *</label>
                      <input
                        type="tel"
                        placeholder="09xxxxxxxx"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] transition-colors"
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Giới tính & Địa chỉ */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Giới tính *</label>
                      <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] transition-colors bg-white cursor-pointer font-medium"
                        value={form.gender}
                        onChange={(e) => set('gender', e.target.value)}
                      >
                        <option value="">-- Chọn --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Địa chỉ</label>
                      <input
                        type="text"
                        placeholder="Nhập địa chỉ thường trú (đường, phường, quận...)"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] transition-colors"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>


                  {/* Chuyên khoa */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Chuyên khoa khám *</label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] transition-colors bg-white cursor-pointer font-semibold"
                      value={form.dept}
                      onChange={(e) => {
                        set('dept', e.target.value);
                        set('doctor', ''); // Reset bác sĩ
                      }}
                    >
                      <option value="">-- Chọn chuyên khoa --</option>
                      {departments.map((dept) => (
                        <option key={dept.slug} value={dept.name}>
                          {dept.icon} {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ngày khám */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Ngày khám bệnh *</label>
                    <input
                      type="date"
                      min={minDate}
                      max={maxDate}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] transition-colors bg-white cursor-pointer font-semibold text-gray-700"
                      value={form.date}
                      onChange={(e) => set('date', e.target.value)}
                    />
                    <div className="mt-1.5 space-y-1">
                      <p className="text-[11px] text-gray-500 font-semibold">
                        * Lưu ý: Bệnh viện hoạt động từ Thứ Hai đến Thứ Bảy và <strong className="text-[#004e92]">BUỔI SÁNG Chủ Nhật</strong>.
                      </p>
                      {form.date && new Date(form.date).getDay() === 0 && (
                        <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                          ⚠️ Bạn đã chọn Chủ Nhật. Lịch khám sẽ tự động được xếp vào buổi sáng.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Triệu chứng */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Triệu chứng lâm sàng / Lý do khám</label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả cụ thể triệu chứng của bạn (Ví dụ: đau đầu, chóng mặt, sưng nhức chân tay...)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] resize-none"
                      value={form.reason}
                      onChange={(e) => set('reason', e.target.value)}
                    />
                  </div>



                  {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3.5 rounded-xl border border-red-100 animate-fadeIn">{error}</div>}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#004e92] hover:bg-blue-800 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm uppercase tracking-wider"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'GỬI ĐĂNG KÝ'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* BƯỚC 5: ĐẶT LỊCH THÀNH CÔNG */}
          {step === 5 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center transition-all animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-black text-green-600 mb-2">Đăng ký đặt lịch thành công!</h2>
              <p className="text-gray-500 text-sm">Mã số phiếu lịch hẹn của bạn là:</p>
              
              <div className="text-3xl font-black text-[#004e92] my-5 tracking-widest bg-blue-50 py-3.5 px-6 rounded-2xl w-max mx-auto shadow-sm border border-blue-100">
                #{code}
              </div>

              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mb-8">
                Phiếu hẹn đã được tiếp nhận. Chúng tôi sẽ nhắn tin xác nhận qua số điện thoại đăng ký trong ít phút. Vui lòng kiểm tra mục **"Lịch hẹn khám"** trong tài khoản của bạn để theo dõi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setForm(initialForm);
                    setAddress('');
                    setUserCaptcha('');
                    generateCaptcha();
                    setCode('');
                    setError('');
                    setDobDay('');
                    setDobMonth('');
                    setDobYear('');
                  }}
                  className="px-6 py-3 border-2 border-[#004e92] text-[#004e92] font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  Đặt lịch khám khác
                </button>
                <Link
                  to="/my-appointments"
                  className="px-6 py-3 bg-[#004e92] text-white font-bold rounded-xl hover:bg-blue-800 transition-colors text-sm shadow-md"
                >
                  Xem lịch hẹn của tôi
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
