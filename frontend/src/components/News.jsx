import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news?limit=3`);
        if (res.ok) {
          const data = await res.json();
          setNewsItems(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Loi tai tin tuc:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-400">Dang tai tin tuc...</div>
      </section>
    );
  }

  if (newsItems.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10 border-b-2 border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-[#004e92] uppercase relative before:content-[''] before:absolute before:-bottom-[18px] before:left-0 before:w-16 before:h-1 before:bg-red-500">
            Tin tức &amp; hoạt động
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article key={item._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {item.imageUrl && (
                <div className="h-56 overflow-hidden relative group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {item.isPinned ? 'Nổi bật' : item.category || 'Tin mới'}
                  </div>
                </div>
              )}
              {!item.imageUrl && (
                <div className="px-6 pt-5">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {item.isPinned ? 'Nổi bật' : item.category || 'Tin mới'}
                  </span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 gap-4">
                  <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                  <span>{item.author}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 leading-snug mb-2 hover:text-[#004e92] transition-colors line-clamp-3">
                  {item.title}
                </h3>
                {item.summary && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{item.summary}</p>
                )}
                <div className="mt-auto">
                  <Link to={`/news/${item._id}`} className="text-[#004e92] font-semibold text-sm uppercase tracking-wide hover:underline flex items-center gap-1">
                    Xem chi tiết
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
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

