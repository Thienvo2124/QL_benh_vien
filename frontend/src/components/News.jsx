const newsItems = [
  {
    title: 'Biện pháp bảo vệ nam giới trước bệnh lý lây truyền qua đường tình dục',
    date: '21/05/2026',
    author: 'Phạm Khánh Nhật',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=60',
    link: '#',
  },
  {
    title: 'Thông báo kết quả xét chọn danh hiệu Thầy thuốc ưu tú lần thứ 15',
    date: '21/05/2026',
    author: 'Phạm Khánh Nhật',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=500&auto=format&fit=crop&q=60',
    link: '#',
  },
  {
    title: 'Bệnh viện Nhân Dân đồng hành chăm sóc sức khỏe sinh sản cộng đồng',
    date: '20/05/2026',
    author: 'Phạm Khánh Nhật',
    image: 'https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?w=500&auto=format&fit=crop&q=60',
    link: '#',
  },
];

const News = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10 border-b-2 border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-[#004e92] uppercase relative before:content-[''] before:absolute before:-bottom-[18px] before:left-0 before:w-16 before:h-1 before:bg-red-500">
            Tin tức & hoạt động
          </h2>
          <a href="#" className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-1">
            Xem tất cả
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article key={item.title} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="h-56 overflow-hidden relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Tin mới
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 gap-4">
                  <span>{item.date}</span>
                  <span>{item.author}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 leading-snug mb-4 hover:text-[#004e92] transition-colors line-clamp-3">
                  <a href={item.link}>{item.title}</a>
                </h3>
                <div className="mt-auto">
                  <a href={item.link} className="text-[#004e92] font-semibold text-sm uppercase tracking-wide hover:underline flex items-center gap-1">
                    Xem chi tiết
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
