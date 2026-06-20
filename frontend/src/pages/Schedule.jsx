import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, Clock, User, Search, MapPin, ChevronRight } from 'lucide-react';
import departments from '../data/departments';

// Mock data for schedule
const mockDoctors = [
  {
    id: 1,
    name: 'GS.TS. Nguyễn Minh Tuấn',
    dept: 'Tim mạch',
    avatar: 'https://i.pravatar.cc/150?img=11',
    schedule: [
      { day: 'Thứ 2', date: '15/06', slots: ['08:00', '09:30', '14:00', '15:30'] },
      { day: 'Thứ 4', date: '17/06', slots: ['08:00', '10:00'] },
      { day: 'Thứ 6', date: '19/06', slots: ['13:30', '15:00', '16:30'] },
    ]
  },
  {
    id: 2,
    name: 'PGS.TS. Trần Hoàng Hải',
    dept: 'Tim mạch',
    avatar: 'https://i.pravatar.cc/150?img=12',
    schedule: [
      { day: 'Thứ 3', date: '16/06', slots: ['07:30', '09:00', '10:30'] },
      { day: 'Thứ 5', date: '18/06', slots: ['13:00', '14:30', '16:00'] },
    ]
  },
  {
    id: 3,
    name: 'TS.BS. Lê Văn Hùng',
    dept: 'Thần kinh',
    avatar: 'https://i.pravatar.cc/150?img=13',
    schedule: [
      { day: 'Thứ 2', date: '15/06', slots: ['13:30', '15:00'] },
      { day: 'Thứ 4', date: '17/06', slots: ['08:30', '10:00', '14:00'] },
      { day: 'Thứ 7', date: '20/06', slots: ['08:00', '09:30', '11:00'] },
    ]
  }
];

const Schedule = () => {
  const [selectedDept, setSelectedDept] = useState('');

  const filteredDoctors = selectedDept 
    ? mockDoctors.filter(d => d.dept === departments.find(dep => dep.slug === selectedDept)?.name)
    : mockDoctors;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#004e92] to-[#000428] py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="2" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">LỊCH KHÁM CHỮA BỆNH</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Tra cứu lịch làm việc của đội ngũ y bác sĩ và đặt lịch hẹn khám nhanh chóng, tiện lợi.
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl -mt-8 relative z-20">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Search size={16} className="text-[#004e92]"/> Tìm theo chuyên khoa
              </label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004e92] focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50 hover:bg-white"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">Tất cả chuyên khoa</option>
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept.slug}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-[#004e92]"/> Ngày khám
              </label>
              <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004e92] focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50 hover:bg-white" />
            </div>
            <div>
              <button className="w-full bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
                <Search size={20} /> Lọc kết quả
              </button>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-6">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col md:flex-row">
              {/* Doctor Info */}
              <div className="md:w-1/3 bg-blue-50/30 p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center md:items-start text-center md:text-left">
                <img src={doc.avatar} alt={doc.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4" />
                <h3 className="text-xl font-bold text-[#004e92] mb-1">{doc.name}</h3>
                <p className="text-gray-600 font-medium mb-3 flex items-center gap-1">
                  <MapPin size={16} className="text-red-400"/> Chuyên khoa {doc.dept}
                </p>
                <Link to="/booking" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#004e92] hover:text-blue-700 bg-blue-100 px-4 py-2 rounded-full transition-colors">
                  <User size={16} /> Xem hồ sơ <ChevronRight size={16} />
                </Link>
              </div>

              {/* Schedule Slots */}
              <div className="md:w-2/3 p-6">
                <h4 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-orange-500"/> Lịch làm việc tuần này
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doc.schedule.map((dayItem, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-[#004e92]">{dayItem.day}</span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-md">{dayItem.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dayItem.slots.map((time, tIdx) => (
                          <Link 
                            to="/booking" 
                            key={tIdx} 
                            className="text-sm bg-white border border-blue-200 text-blue-700 hover:bg-[#004e92] hover:text-white font-medium py-1.5 px-3 rounded-lg transition-colors cursor-pointer shadow-sm text-center flex-grow"
                          >
                            {time}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Không tìm thấy lịch khám phù hợp.</p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Schedule;
