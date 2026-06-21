import React from 'react';
import { useParams, Link } from 'react-router-dom';
import departments from '../data/departments';

const DepartmentDetail = () => {
  const { slug } = useParams();

  const dept = departments.find(d => d.slug === slug);

  console.log('slug =', slug);
  console.log('dept =', dept);

  if (!dept) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Không tìm thấy chuyên khoa
        </h1>
      </div>
    );
  }

  const others = departments
    .filter(d => d.slug !== slug)
    .slice(0, 5);

  return (
    <>
      <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-14 px-4">
        <div className="container mx-auto flex items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-white shadow-lg">
            {dept.icon}
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-1">
              {dept.name}
            </h1>

            <p className="text-blue-100">
              {dept.shortDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Nội dung */}
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#004e92] mb-4">
                  Giới thiệu khoa {dept.name}
                </h2>

                <p className="text-gray-600 leading-relaxed text-sm">
                  {dept.fullDesc}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#004e92] mb-6">
                  Dịch vụ cung cấp
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dept.services.map(service => (
                    <div
                      key={service}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                    >
                      <span>✅</span>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#004e92] mb-6">
                  Đội ngũ bác sĩ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dept.doctors_list?.map(doc => (
                    <div
                      key={doc.name}
                      className="flex items-center gap-4 p-4 border rounded-xl"
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                        👨‍⚕️
                      </div>

                      <div>
                        <div className="font-bold">
                          {doc.name}
                        </div>

                        <div className="text-xs text-gray-500">
                          {doc.exp} kinh nghiệm
                        </div>

                        <div className="text-xs text-yellow-600">
                          ⭐ {doc.rating} ({doc.reviews} đánh giá)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/doctors"
                    className="text-[#004e92] font-semibold"
                  >
                    Xem tất cả bác sĩ →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              <div className="bg-[#004e92] text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">
                  Đặt lịch khám
                </h3>

                <p className="text-sm mb-4">
                  Đặt lịch trực tuyến nhanh chóng
                </p>

                <Link
                  to="/booking"
                  className="block text-center bg-red-600 py-3 rounded-lg"
                >
                  Đặt lịch ngay
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-4">
                  Thông tin khoa
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Số bác sĩ</span>
                    <span>{dept.doctors}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Số dịch vụ</span>
                    <span>{dept.services.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold mb-4">
                  Chuyên khoa khác
                </h3>

                <div className="space-y-2">
                  {others.map(item => (
                    <Link
                      key={item.slug}
                      to={`/departmentdetail/${item.slug}`}
                      className="block p-2 hover:bg-blue-50 rounded"
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default DepartmentDetail;