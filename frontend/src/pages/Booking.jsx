import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Calendar, Clock, Stethoscope, CheckCircle, Bot, Sparkles, ChevronRight, ChevronLeft, UserCheck, UserPlus, FileText, Sun, SunDim, Check, Award, Star, Smile, Ticket } from 'lucide-react';
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
  time: '',
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

  // Sync Day/Month/Year dropdowns with form.dob
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const formattedDob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
      if (form.dob !== formattedDob) {
        setForm(prev => ({ ...prev, dob: formattedDob }));
      }
    } else {
      if (form.dob !== '') {
        setForm(prev => ({ ...prev, dob: '' }));
      }
    }
  }, [dobDay, dobMonth, dobYear]);

  // Sync form.dob back to Day/Month/Year dropdowns (e.g. on profile autofill or clear)
  useEffect(() => {
    if (form.dob) {
      const parts = form.dob.split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10).toString();
        const d = parseInt(parts[2], 10).toString();
        if (y !== dobYear) setDobYear(y);
        if (m !== dobMonth) setDobMonth(m);
        if (d !== dobDay) setDobDay(d);
      }
    } else {
      if (dobDay !== '') setDobDay('');
      if (dobMonth !== '') setDobMonth('');
      if (dobYear !== '') setDobYear('');
    }
  }, [form.dob]);

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
    } else if (!isForSelf) {
      // Clear thông tin khi chọn đặt cho người thân
      setForm((prev) => ({
        ...prev,
        name: '',
        phone: '',
        dob: '',
        gender: '',
      }));
    }
  }, [user, isForSelf]);

  const set = (key, value) => {
    setError('');
    setForm((current) => ({ ...current, [key]: value }));
  };

  const selectedDept = departments.find((dept) => dept.name === form.dept);

  // Tính 7 ngày tiếp theo để chọn
  const getNext7Days = () => {
    const days = [];
    const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      // Không cho đặt lịch vào Chủ Nhật
      if (d.getDay() === 0) continue;

      const dateString = d.toISOString().split('T')[0];
      const dayName = weekdays[d.getDay()];
      const dayNum = d.getDate().toString().padStart(2, '0');
      const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
      
      days.push({
        dateString,
        dayName: i === 0 ? 'Hôm nay' : dayName,
        label: `${dayNum}/${monthNum}`,
      });
    }
    return days;
  };

  const next7Days = getNext7Days();

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

  const handleConfirm = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể đặt lịch khám. Vui lòng thử lại.');
      }

      setCode(data.appointmentCode);
      setStep(5);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại.');
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
          <p className="text-blue-100 text-sm">Đặt lịch hẹn nhanh chóng trong 4 bước, nhận vé xác nhận tức thì.</p>
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
        <div className="container mx-auto max-w-3xl">
          
          {step < 5 && <StepIndicator />}

          {/* Màn hình từng bước */}
          {step < 5 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 transition-all animate-fadeIn">
              
              {/* BƯỚC 1: THÔNG TIN CÁ NHÂN */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#004e92]" /> Bước 1: Thông tin người bệnh
                    </h2>
                    
                    {/* Toggle Người khám */}
                    <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setIsForSelf(true)}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          isForSelf ? 'bg-white text-[#004e92] shadow-sm' : 'text-gray-500'
                        }`}
                      >
                        <UserCheck size={14} /> Cho bản thân
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsForSelf(false)}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          !isForSelf ? 'bg-white text-[#004e92] shadow-sm' : 'text-gray-500'
                        }`}
                      >
                        <UserPlus size={14} /> Cho người thân
                      </button>
                    </div>
                  </div>

                  {user && isForSelf && (
                    <div className="bg-blue-50/60 border border-blue-100 text-blue-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2">
                      <Smile size={16} className="text-[#004e92]" />
                      <span>Chào **{user.fullName}**, hệ thống đã tự động điền thông tin định danh từ hồ sơ của bạn.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Họ và tên *</label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Số điện thoại *</label>
                      <input
                        type="tel"
                        placeholder="09xxxxxxxx"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Ngày sinh *</label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white"
                          value={dobDay}
                          onChange={(e) => setDobDay(e.target.value)}
                        >
                          <option value="">Ngày</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <select
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white"
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value)}
                        >
                          <option value="">Tháng</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>Tháng {m}</option>
                          ))}
                        </select>
                        <select
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold bg-white"
                          value={dobYear}
                          onChange={(e) => setDobYear(e.target.value)}
                        >
                          <option value="">Năm</option>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Giới tính *</label>
                      <select
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        value={form.gender}
                        onChange={(e) => set('gender', e.target.value)}
                      >
                        <option value="">-- Chọn --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Triệu chứng & AI Assistant */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-gray-600">Mô tả triệu chứng / Lý do khám</label>
                      
                      {/* AI Suggest Button */}
                      <button
                        type="button"
                        onClick={handleAiSuggest}
                        disabled={aiSuggesting || !form.reason.trim()}
                        className="text-xs bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Bot size={14} className={aiSuggesting ? 'animate-bounce' : ''} />
                        {aiSuggesting ? 'AI đang chẩn đoán...' : 'Nhờ AI gợi ý chuyên khoa'}
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Hãy mô tả ngắn gọn tình trạng sức khỏe của bạn (VD: Tôi bị đau răng và sưng lợi / bị đau bụng tức ngực...)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] resize-none"
                      value={form.reason}
                      onChange={(e) => set('reason', e.target.value)}
                    />

                    {/* AI Suggest Result Box */}
                    {suggestedDept && (
                      <div className="mt-3 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            <Sparkles size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">Trợ lý AI đề xuất:</p>
                            <p className="text-sm font-bold text-indigo-900">
                              Khám khoa **{suggestedDept.name}** {suggestedDept.icon}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            set('dept', suggestedDept.name);
                            // Tự động chuyển qua bước 2
                            setError('');
                            setStep(2);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-md self-end sm:self-auto"
                        >
                          <Check size={14} /> Đồng ý & Chọn Khoa này
                        </button>
                      </div>
                    )}
                  </div>

                  {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

                  <button
                    onClick={() => {
                      if (!form.name.trim() || !form.phone.trim() || !form.dob || !form.gender) {
                        setError('Vui lòng điền đầy đủ tất cả các trường thông tin bắt buộc (*)!');
                        return;
                      }
                      setError('');
                      setStep(2);
                    }}
                    className="w-full bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1"
                  >
                    Tiếp theo <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* BƯỚC 2: CHỌN KHOA & BÁC SĨ */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                    <Stethoscope className="w-5 h-5 text-[#004e92]" /> Bước 2: Chọn Chuyên khoa & Bác sĩ
                  </h2>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-2">Chuyên khoa khám *</label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004e92] font-semibold"
                      value={form.dept}
                      onChange={(e) => {
                        set('dept', e.target.value);
                        set('doctor', ''); // Reset bác sĩ khi đổi khoa
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

                  {selectedDept && (
                    <div className="space-y-3 animate-fadeIn">
                      <label className="block text-xs font-bold text-gray-600">Đội ngũ bác sĩ khoa {selectedDept.name} *</label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Option 1: Hệ thống tự chỉ định */}
                        <div
                          onClick={() => set('doctor', 'Hệ thống tự phân công')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            form.doctor === 'Hệ thống tự phân công' || !form.doctor
                              ? 'border-[#004e92] bg-blue-50/40 shadow-md'
                              : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#004e92] font-bold">
                              AI
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">Hệ thống tự phân công</h4>
                              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Xếp lịch nhanh nhất, tối ưu thời gian chờ</p>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.doctor === 'Hệ thống tự phân công' || !form.doctor ? 'border-[#004e92]' : 'border-gray-300'}`}>
                              {(form.doctor === 'Hệ thống tự phân công' || !form.doctor) && <div className="w-2 h-2 bg-[#004e92] rounded-full" />}
                            </div>
                          </div>
                        </div>

                        {/* Danh sách Bác sĩ thực */}
                        {selectedDept.doctors_list.map((doc) => (
                          <div
                            key={doc.name}
                            onClick={() => set('doctor', doc.name)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              form.doctor === doc.name
                                ? 'border-[#004e92] bg-blue-50/40 shadow-md'
                                : 'border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                                {doc.name.split('. ').pop().charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                                  {doc.name}
                                </h4>
                                <span className="text-[10px] bg-teal-50 border border-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 w-max mt-1">
                                  <Award size={10} /> Kinh nghiệm: {doc.exp}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                              <div className="flex items-center text-xs text-yellow-500 font-bold gap-0.5">
                                <Star size={12} fill="currentColor" /> {doc.rating} <span className="text-gray-400 font-medium">({doc.reviews})</span>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.doctor === doc.name ? 'border-[#004e92]' : 'border-gray-300'}`}>
                                {form.doctor === doc.name && <div className="w-2 h-2 bg-[#004e92] rounded-full" />}
                              </div>
                            </div>
                          </div>
                        ))}

                      </div>
                    </div>
                  )}

                  {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <ChevronLeft size={16} /> Quay lại
                    </button>
                    <button
                      onClick={() => {
                        if (!form.dept) {
                          setError('Vui lòng chọn Chuyên khoa khám bệnh!');
                          return;
                        }
                        // Gán mặc định Hệ thống tự phân công nếu không chọn bác sĩ
                        if (!form.doctor) {
                          set('doctor', 'Hệ thống tự phân công');
                        }
                        setError('');
                        setStep(3);
                      }}
                      className="flex-[2] bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1 text-sm"
                    >
                      Tiếp theo <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* BƯỚC 3: CHỌN LỊCH KHÁM */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                    <Calendar className="w-5 h-5 text-[#004e92]" /> Bước 3: Chọn Ngày & Giờ khám
                  </h2>

                  {/* Bộ chọn Ngày dạng thẻ trượt ngang */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-600">Chọn ngày hẹn khám *</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {next7Days.map((day) => (
                        <div
                          key={day.dateString}
                          onClick={() => set('date', day.dateString)}
                          className={`flex-shrink-0 w-24 p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                            form.date === day.dateString
                              ? 'border-[#004e92] bg-blue-50/40 shadow-md scale-105'
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{day.dayName}</p>
                          <p className="text-lg font-extrabold text-gray-800 mt-1">{day.label.split('/')[0]}</p>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Tháng {day.label.split('/')[1]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bộ chọn Giờ chia buổi sáng/chiều */}
                  {form.date && (
                    <div className="space-y-4 pt-2 animate-fadeIn">
                      
                      {/* Buổi sáng */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                          <Sun size={14} /> Buổi sáng (07:30 - 11:00)
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {morningTimes.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => set('time', t)}
                              className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                                form.time === t
                                  ? 'bg-[#004e92] text-white border-[#004e92] shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Buổi chiều */}
                      <div className="space-y-2.5 pt-2">
                        <h4 className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                          <SunDim size={14} /> Buổi chiều (13:30 - 16:00)
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {afternoonTimes.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => set('time', t)}
                              className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                                form.time === t
                                  ? 'bg-[#004e92] text-white border-[#004e92] shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <ChevronLeft size={16} /> Quay lại
                    </button>
                    <button
                      onClick={() => {
                        if (!form.date || !form.time) {
                          setError('Vui lòng chọn Ngày hẹn khám và Khung giờ khám cụ thể!');
                          return;
                        }
                        setError('');
                        setStep(4);
                      }}
                      className="flex-[2] bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1 text-sm"
                    >
                      Xác nhận thông tin <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* BƯỚC 4: XÁC NHẬN LỊCH KHÁM (PHẦN VÉ KHÁM) */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                    <CheckCircle className="w-5 h-5 text-green-500" /> Bước 4: Kiểm tra & Xác nhận lịch hẹn
                  </h2>

                  {/* Thiết kế chiếc vé khám bệnh */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl overflow-hidden relative shadow-md">
                    {/* Đường cắt nét đứt */}
                    <div className="absolute top-[38%] left-0 right-0 h-[2px] border-b-2 border-dashed border-blue-200 -z-0"></div>
                    <div className="absolute top-[38%] left-[-8px] w-4 h-4 bg-white border-r border-blue-200 rounded-full transform translate-y-[-50%]"></div>
                    <div className="absolute top-[38%] right-[-8px] w-4 h-4 bg-white border-l border-blue-200 rounded-full transform translate-y-[-50%]"></div>

                    {/* Đầu vé */}
                    <div className="p-6 pb-8 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-[#004e92] text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          Vé Khám Hẹn Giờ
                        </span>
                        <h3 className="text-xl font-black text-[#004e92] mt-3 uppercase tracking-wide">Bệnh viện Nhân Dân</h3>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Số 1 Nơ Trang Long, Bình Thạnh, TP.HCM</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">Thời gian hẹn</p>
                        <p className="text-lg font-extrabold text-[#004e92] mt-1">{form.time}</p>
                        <p className="text-xs text-gray-600 font-bold mt-0.5">
                          {form.date ? form.date.split('-').reverse().join('/') : ''}
                        </p>
                      </div>
                    </div>

                    {/* Thân vé */}
                    <div className="p-6 pt-8 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bệnh nhân</p>
                          <p className="text-sm font-bold text-gray-800 mt-0.5">{form.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Số điện thoại</p>
                          <p className="text-sm font-bold text-gray-800 mt-0.5">{form.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Chuyên khoa khám</p>
                          <p className="text-sm font-bold text-[#004e92] mt-0.5">{form.dept}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bác sĩ phụ trách</p>
                          <p className="text-sm font-bold text-gray-800 mt-0.5">{form.doctor || 'Hệ thống tự phân công'}</p>
                        </div>
                      </div>

                      {form.reason && (
                        <div className="pt-2 border-t border-blue-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lý do / Triệu chứng bệnh</p>
                          <p className="text-xs text-gray-600 italic mt-0.5">"{form.reason}"</p>
                        </div>
                      )}

                      {/* Barcode mockup */}
                      <div className="pt-4 flex flex-col items-center justify-center opacity-80 select-none">
                        <div className="flex h-10 w-full max-w-[200px] gap-[2px] items-center bg-transparent">
                          {[2,1,3,2,1,4,2,1,3,1,2,4,1,2,3,2,1,4,2,1,3].map((w, idx) => (
                            <div key={idx} className="bg-gray-800 h-full flex-grow" style={{ maxWidth: `${w}px` }} />
                          ))}
                        </div>
                        <p className="text-[9px] font-mono tracking-widest text-gray-400 font-bold uppercase mt-1">APPOINTMENT VERIFICATION</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-xs text-green-800 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping mt-1 flex-shrink-0"></span>
                    <p className="leading-relaxed">
                      Lịch khám này sẽ được gửi duyệt tự động. Vui lòng có mặt tại quầy tiếp đón **trước 15 phút** so với khung giờ hẹn để làm thủ tục.
                    </p>
                  </div>

                  {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(3)}
                      disabled={isSubmitting}
                      className="flex-1 border-2 border-red-200 text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                    >
                      ← Quay lại chỉnh sửa
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isSubmitting}
                      className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Xác nhận Đặt lịch khám'}
                    </button>
                  </div>
                </div>
              )}

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
                    setCode('');
                    setError('');
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
