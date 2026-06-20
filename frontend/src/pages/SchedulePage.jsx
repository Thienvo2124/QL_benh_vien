import React from 'react';
import { Link } from 'react-router-dom';
import HeroSmall from '../components/HeroSmall';
import Breadcrumb from '../components/Breadcrumb';

const rows = [
  { dept: 'Tim mạch',     t2: 'BS. Tuấn',  t3: 'BS. Hải',   t4: 'BS. Tuấn',  t5: 'BS. Hải',   t6: 'BS. Tuấn',  t7: '—' },
  { dept: 'Thần kinh',    t2: 'BS. Hùng',  t3: 'BS. Linh',  t4: 'BS. Hùng',  t5: 'BS. Linh',  t6: 'BS. Hùng',  t7: 'BS. Linh' },
  { dept: 'Nha khoa',     t2: 'BS. Long',  t3: 'BS. Nga',   t4: 'BS. Long',  t5: 'BS. Nga',   t6: 'BS. Long',  t7: 'BS. Long' },
  { dept: 'Nhi khoa',     t2: 'BS. Hoa',   t3: 'BS. Hoa',   t4: 'BS. Nam',   t5: 'BS. Hoa',   t6: 'BS. Nam',   t7: 'BS. Hoa' },
  { dept: 'Sản phụ khoa', t2: 'BS. Lan',   t3: 'BS. Lan',   t4: 'BS. Bích',  t5: 'BS. Lan',   t6: 'BS. Bích',  t7: '—' },
  { dept: 'Nhãn khoa',    t2: 'BS. Mai',   t3: 'BS. Minh',  t4: 'BS. Mai',   t5: 'BS. Minh',  t6: 'BS. Mai',   t7: '—' },
  { dept: 'Nội tổng quát',t2: 'BS. Hương', t3: 'BS. Đức',   t4: 'BS. Hương', t5: 'BS. Đức',   t6: 'BS. Hương', t7: 'BS. Hương' },
  { dept: 'Da liễu',      t2: 'BS. Thanh', t3: 'BS. Hùng',  t4: 'BS. Thanh', t5: 'BS. Hùng',  t6: 'BS. Thanh', t7: '—' },
  { dept: 'Tai mũi họng', t2: 'BS. Vinh',  t3: 'BS. Kim',   t4: 'BS. Vinh',  t5: 'BS. Kim',   t6: 'BS. Vinh',  t7: 'BS. Vinh' },
];

const days = [
  { label: 'Thứ 2', key: 't2' }, { label: 'Thứ 3', key: 't3' },
  { label: 'Thứ 4', key: 't4' }, { label: 'Thứ 5', key: 't5' },
  { label: 'Thứ 6', key: 't6' }, { label: 'Thứ 7', key: 't7' },
];

const SchedulePage = () => (
  <>
    <HeroSmall title="Lịch Khám Chữa Bệnh" subtitle="Giờ khám: 7:00–11:30 và 13:00–17:00" />

    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-[#004e92] rounded-r-xl p-4 text-sm text-gray-700">
            📌 Lịch trực có thể thay đổi đột xuất. Vui lòng gọi <strong>1900 2115</strong> để xác nhận trước khi đến.
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-4 text-sm text-gray-700">
            ⏰ Bệnh nhân đặt lịch trực tuyến được ưu tiên phục vụ theo khung giờ đã chọn.
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full bg-white text-sm">
            <thead>
              <tr className="bg-[#004e92] text-white">
                <th className="px-5 py-4 text-left font-semibold">Chuyên khoa</th>
                {days.map(d => (
                  <th key={d.key} className="px-4 py-4 text-center font-semibold">{d.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.dept} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                  <td className="px-5 py-3 font-semibold text-gray-800">{row.dept}</td>
                  {days.map(d => (
                    <td key={d.key} className="px-4 py-3 text-center">
                      {row[d.key] === '—'
                        ? <span className="text-gray-300">—</span>
                        : <span className="bg-blue-100 text-[#004e92] text-xs px-2 py-1 rounded-full font-medium">{row[d.key]}</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Time slots info */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#004e92] mb-5">Khung giờ khám theo buổi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['🌅', 'Buổi sáng', '7:00 – 11:30', 'Đăng ký lấy số từ 6:30. Khuyến khích đến trước 7:00 để tránh chờ đợi.'],
              ['🌞', 'Buổi chiều', '13:00 – 17:00', 'Đăng ký lấy số từ 12:30. Thứ 7 chỉ có buổi sáng.'],
            ].map(([icon, title, time, note]) => (
              <div key={title} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <div className="font-bold text-gray-800 mb-1">{icon} {title}: <span className="text-[#004e92]">{time}</span></div>
                <p className="text-sm text-gray-600">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/booking" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full text-sm shadow-lg transition-colors">
            Đặt lịch khám trực tuyến
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default SchedulePage;