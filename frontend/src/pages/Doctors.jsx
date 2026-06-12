import { useState } from 'react';
import { Link } from 'react-router-dom';
import departments from '../data/departments';

const allDoctors = departments.flatMap((dept) =>
  dept.doctors_list.map((doctor) => ({
    ...doctor,
    dept: dept.name,
    deptSlug: dept.slug,
    icon: dept.icon,
  })),
);

const Doctors = () => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  const deptNames = ['Tất cả', ...departments.map((dept) => dept.name)];

  const filtered = allDoctors.filter(
    (doctor) =>
      (selectedDept === 'Tất cả' || doctor.dept === selectedDept) &&
      doctor.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-14 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-3">Đội ngũ bác sĩ</h1>
          <p className="text-blue-100 text-lg mb-6">Chuyên môn cao, tận tâm với người bệnh</p>
          <input
            type="text"
            placeholder="Tìm kiếm tên bác sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-5 py-3 rounded-full bg-transparent text-white placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </section>

      <div className="bg-gray-100 px-4 py-3 text-sm text-gray-500 border-b">
        <div className="container mx-auto">
          <Link to="/" className="hover:text-[#004e92]">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-700">Tìm bác sĩ</span>
        </div>
      </div>

      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {deptNames.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedDept === dept
                    ? 'bg-[#004e92] text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-[#004e92] hover:text-[#004e92]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">⌕</div>
              <p>Không tìm thấy bác sĩ phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((doctor) => (
                <div key={`${doctor.dept}-${doctor.name}`} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-5xl">
                    BS
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 group-hover:text-[#004e92] transition-colors mb-2 text-sm">
                      {doctor.name}
                    </h3>
                    <span className="inline-block bg-blue-50 text-[#004e92] text-xs px-3 py-1 rounded-full font-medium mb-3">
                      {doctor.icon} {doctor.dept}
                    </span>
                    <div className="text-xs text-gray-500 space-y-1 mb-4">
                      <div>Kinh nghiệm: <strong>{doctor.exp}</strong></div>
                      <div>Đánh giá: <strong>{doctor.rating}</strong> <span className="text-gray-400">({doctor.reviews} lượt)</span></div>
                    </div>
                    <Link to="/booking" className="block text-center bg-[#004e92] hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                      Đặt lịch khám
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Doctors;
