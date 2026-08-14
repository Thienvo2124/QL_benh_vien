import { Link } from 'react-router-dom';

const serviceItems = [
  {
    title: 'Chuyên khoa',
    description: 'Hướng dẫn chi tiết từng bước',
    color: 'bg-blue-500',
    link: '/procedures',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  },
  {
    title: 'Lịch hẹn của tôi',
    description: 'Xem danh sách lịch khám đã đặt',
    color: 'bg-teal-500',
    link: '/my-appointments',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
];

const Services = () => {
  return (
    <section className="py-12 bg-white relative -mt-10 z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {serviceItems.map((item) => (
            <Link
              to={item.link}
              key={item.title}
              className="flex items-center p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-lg transition-all transform hover:-translate-y-2 border border-gray-100 group"
            >
              <div className={`${item.color} text-white p-4 rounded-full mr-4 group-hover:scale-110 transition-transform`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#004e92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
