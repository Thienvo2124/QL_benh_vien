import { useState } from 'react';
import { Link } from 'react-router-dom';
import departments from '../data/departments';
import Header from '../components/Header';
import Footer from '../components/Footer';

const steps = ['Thông tin cá nhân', 'Chọn khoa & bác sĩ', 'Chọn lịch', 'Xác nhận'];
const times = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '13:30', '14:00', '14:30', '15:00', '15:30'];

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
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const selectedDept = departments.find((dept) => dept.name === form.dept);

  const handleConfirm = () => {
    setCode(`BV${Math.floor(Math.random() * 900000 + 100000)}`);
    setStep(5);
  };

  const StepDot = ({ n }) => {
    const done = step > n;
    const active = step === n;

    return (
      <div className="flex items-center flex-1">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
            done
              ? 'bg-green-500 border-green-500 text-white'
              : active
                ? 'bg-[#004e92] border-[#004e92] text-white'
                : 'bg-white border-gray-300 text-gray-400'
          }`}
        >
          {done ? '✓' : n}
        </div>
        {n < 4 && <div className={`flex-1 h-1 mx-1 ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header />
      <div className="flex-grow">
        <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-14 px-4">
          <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-2">Đặt lịch khám</h1>
          <p className="text-blue-100">Đặt hẹn trực tuyến nhanh chóng, nhận xác nhận qua SMS hoặc email</p>
        </div>
      </section>

      <div className="bg-gray-100 px-4 py-3 text-sm text-gray-500 border-b">
        <div className="container mx-auto">
          <Link to="/" className="hover:text-[#004e92]">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Đặt lịch khám</span>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          {step < 5 && (
            <>
              <div className="flex items-end mb-8">
                {steps.map((label, index) => (
                  <div key={label} className={`flex-1 ${index < steps.length - 1 ? 'flex items-center' : ''}`}>
                    <div className="text-center">
                      <StepDot n={index + 1} />
                      <p className={`text-xs mt-1 ${step === index + 1 ? 'text-[#004e92] font-semibold' : 'text-gray-400'}`}>
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-[#004e92] mb-6">
                  Bước {step}: {steps[step - 1]}
                </h2>

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                        <input type="text" placeholder="Nguyễn Văn A" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]" value={form.name} onChange={(e) => set('name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Điện thoại *</label>
                        <input type="tel" placeholder="09xxxxxxxx" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
                        <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                          <option value="">-- Chọn --</option>
                          <option>Nam</option>
                          <option>Nữ</option>
                          <option>Khác</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả triệu chứng</label>
                      <textarea rows={3} placeholder="Mô tả tình trạng sức khỏe của bạn..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92] resize-none" value={form.reason} onChange={(e) => set('reason', e.target.value)} />
                    </div>
                    {error && step === 1 && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <button 
                      onClick={() => {
                        if (!form.name.trim() || !form.phone.trim()) {
                          setError('Vui lòng điền đầy đủ Họ và tên và Điện thoại!');
                          return;
                        }
                        setError('');
                        setStep(2);
                      }} 
                      className="w-full bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors mt-2 shadow-md"
                    >
                      Tiếp theo →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Chuyên khoa *</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]" value={form.dept} onChange={(e) => set('dept', e.target.value)}>
                        <option value="">-- Chọn chuyên khoa --</option>
                        {departments.map((dept) => <option key={dept.slug}>{dept.name}</option>)}
                      </select>
                    </div>
                    {selectedDept && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bác sĩ</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]" value={form.doctor} onChange={(e) => set('doctor', e.target.value)}>
                          <option value="">-- Hệ thống tự phân công --</option>
                          {selectedDept.doctors_list.map((doctor) => <option key={doctor.name}>{doctor.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="bg-blue-50 border-l-4 border-[#004e92] rounded-r-lg p-4 text-sm text-gray-600 mb-2">
                      AI sẽ gợi ý bác sĩ phù hợp dựa trên triệu chứng nếu bạn không chỉ định cụ thể.
                    </div>
                    {error && step === 2 && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <div className="flex gap-3">
                      <button onClick={() => { setError(''); setStep(1); }} className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">← Quay lại</button>
                      <button 
                        onClick={() => {
                          if (!form.dept) {
                            setError('Vui lòng chọn Chuyên khoa!');
                            return;
                          }
                          setError('');
                          setStep(3);
                        }} 
                        className="flex-[2] bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                      >
                        Tiếp theo →
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày khám *</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]" value={form.date} onChange={(e) => set('date', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Khung giờ *</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {times.map((time) => (
                          <button key={time} onClick={() => set('time', time)} className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${form.time === time ? 'bg-[#004e92] text-white border-[#004e92]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#004e92]'}`}>
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    {error && step === 3 && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => { setError(''); setStep(2); }} className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">← Quay lại</button>
                      <button 
                        onClick={() => {
                          if (!form.date || !form.time) {
                            setError('Vui lòng chọn Ngày khám và Khung giờ!');
                            return;
                          }
                          setError('');
                          setStep(4);
                        }} 
                        className="flex-[2] bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                      >
                        Xem xác nhận →
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div className="space-y-3 mb-6">
                      {[
                        ['Họ tên', form.name || '(chưa nhập)'],
                        ['Điện thoại', form.phone || '(chưa nhập)'],
                        ['Chuyên khoa', form.dept || '(chưa chọn)'],
                        ['Bác sĩ', form.doctor || 'Hệ thống tự phân công'],
                        ['Ngày khám', form.date || '(chưa chọn)'],
                        ['Giờ khám', form.time || '(chưa chọn)'],
                        ['Triệu chứng', form.reason || '(không có)'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">{label}</span>
                          <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%]">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 text-sm text-green-700 mb-6">
                      Sau khi xác nhận, hệ thống sẽ gửi thông tin lịch hẹn qua SMS và email trong vòng 5 phút.
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(3)} className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">← Quay lại</button>
                      <button onClick={handleConfirm} className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">Xác nhận đặt lịch</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-green-600 mb-3">Đặt lịch thành công!</h2>
              <p className="text-gray-600 mb-2">Mã lịch hẹn của bạn:</p>
              <div className="text-3xl font-extrabold text-[#004e92] mb-6">#{code}</div>
              <p className="text-gray-500 text-sm mb-8">
                Chúng tôi sẽ gửi xác nhận qua SMS và email trong vòng 5 phút.<br />
                Vui lòng đến trước giờ hẹn <strong>15 phút</strong> để làm thủ tục.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => { setStep(1); setForm(initialForm); }} className="px-6 py-3 border-2 border-[#004e92] text-[#004e92] font-bold rounded-xl hover:bg-blue-50 transition-colors">
                  Đặt lịch khác
                </button>
                <Link to="/" className="px-6 py-3 bg-[#004e92] text-white font-bold rounded-xl hover:bg-blue-800 transition-colors">
                  Về trang chủ
                </Link>
              </div>
            </div>
          )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
