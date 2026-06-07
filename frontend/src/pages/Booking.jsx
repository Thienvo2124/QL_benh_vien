import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import departments from '../data/departments';

const steps = ['Thông tin cá nhân', 'Chọn khoa & Bác sĩ', 'Chọn lịch', 'Xác nhận'];
const times = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '13:30', '14:00', '14:30', '15:00', '15:30'];

const Booking = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', dob: '', gender: '', dept: '', doctor: '', date: '', time: '', reason: '' });
  const [code, setCode] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectedDept = departments.find(d => d.name === form.dept);

  const handleConfirm = () => {
    setCode(`BV${Math.floor(Math.random() * 900000 + 100000)}`);
    setStep(5);
  };

  const StepDot = ({ n }) => {
    const done = step > n;
    const active = step === n;
    return (
      <div className="flex items-center flex-1">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
          done ? 'bg-green-500 border-green-500 text-white'
            : active ? 'bg-[#004e92] border-[#004e92] text-white'
            : 'bg-white border-gray-300 text-gray-400'
        }`}>
          {done ? '✓' : n}
        </div>
        {n < 4 && <div className={`flex-1 h-1 mx-1 ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />}
      </div>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-14 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-2">Đặt Lịch Khám</h1>
          <p className="text-blue-100">Đặt hẹn trực tuyến nhanh chóng – nhận xác nhận qua SMS/Email</p>
        </div>
      </section>

      {/* Breadcrumb */}
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
              {/* Step indicator */}
              <div className="flex items-end mb-8">
                {steps.map((label, i) => (
                  <div key={i} className={`flex-1 ${i < steps.length - 1 ? 'flex items-center' : ''}`}>
                    <div className="text-center">
                      <StepDot n={i + 1} />
                      <p className={`text-xs mt-1 ${step === i + 1 ? 'text-[#004e92] font-semibold' : 'text-gray-400'}`}>
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

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                        <input type="text" placeholder="Nguyễn Văn A"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]"
                          value={form.name} onChange={e => set('name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Điện thoại *</label>
                        <input type="tel" placeholder="09xxxxxxxx"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]"
                          value={form.phone} onChange={e => set('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
                        <input type="date"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]"
                          value={form.dob} onChange={e => set('dob', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]"
                          value={form.gender} onChange={e => set('gender', e.target.value)}>
                          <option value="">-- Chọn --</option>
                          <option>Nam</option><option>Nữ</option><option>Khác</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả triệu chứng</label>
                      <textarea rows={3} placeholder="Mô tả tình trạng sức khỏe của bạn..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92] resize-none"
                        value={form.reason} onChange={e => set('reason', e.target.value)} />
                    </div>
                    <button onClick={() => setStep(2)}
                      className="w-full bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors">
                      Tiếp theo →
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Chuyên khoa *</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]"
                        value={form.dept} onChange={e => set('dept', e.target.value)}>
                        <option value="">-- Chọn chuyên khoa --</option>
                        {departments.map(d => <option key={d.slug}>{d.name}</option>)}
                      </select>
                    </div>
                    {selectedDept && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bác sĩ</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]"
                          value={form.doctor} onChange={e => set('doctor', e.target.value)}>
                          <option value="">-- Hệ thống tự phân công --</option>
                          {selectedDept.doctors_list.map(doc => (
                            <option key={doc.name}>{doc.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="bg-blue-50 border-l-4 border-[#004e92] rounded-r-lg p-4 text-sm text-gray-600">
                      💡 AI sẽ tự gợi ý bác sĩ phù hợp nhất dựa trên triệu chứng bạn đã mô tả nếu không chỉ định cụ thể.
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">← Quay lại</button>
                      <button onClick={() => setStep(3)} className="flex-[2] bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors">Tiếp theo →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày khám *</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#004e92]"
                        value={form.date} onChange={e => set('date', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Khung giờ *</label>
                      <div className="grid grid-cols-4 gap-2">
                        {times.map(t => (
                          <button key={t} onClick={() => set('time', t)}
                            className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                              form.time === t
                                ? 'bg-[#004e92] text-white border-[#004e92]'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#004e92]'
                            }`}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">← Quay lại</button>
                      <button onClick={() => setStep(4)} className="flex-[2] bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors">Xem xác nhận →</button>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div>
                    <div className="space-y-3 mb-6">
                      {[
                        ['👤 Họ tên', form.name || '(chưa nhập)'],
                        ['📞 Điện thoại', form.phone || '(chưa nhập)'],
                        ['🏥 Chuyên khoa', form.dept || '(chưa chọn)'],
                        ['👨‍⚕️ Bác sĩ', form.doctor || 'Hệ thống tự phân công'],
                        ['📅 Ngày khám', form.date || '(chưa chọn)'],
                        ['⏰ Giờ khám', form.time || '(chưa chọn)'],
                        ['📝 Triệu chứng', form.reason || '(không có)'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">{label}</span>
                          <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%]">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 text-sm text-green-700 mb-6">
                      ✅ Sau khi xác nhận, hệ thống sẽ gửi thông tin lịch hẹn qua SMS và Email trong vòng 5 phút.
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(3)} className="flex-1 border-2 border-[#004e92] text-[#004e92] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">← Quay lại</button>
                      <button onClick={handleConfirm} className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">✅ Xác nhận đặt lịch</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* SUCCESS */}
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
                Chúng tôi sẽ gửi xác nhận qua SMS và Email trong vòng 5 phút.<br />
                Vui lòng đến trước giờ hẹn <strong>15 phút</strong> để làm thủ tục.
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => { setStep(1); setForm({ name: '', phone: '', dob: '', gender: '', dept: '', doctor: '', date: '', time: '', reason: '' }); }}
                  className="px-6 py-3 border-2 border-[#004e92] text-[#004e92] font-bold rounded-xl hover:bg-blue-50 transition-colors">
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
    </>
  );
};

export default Booking;