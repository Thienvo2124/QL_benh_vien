import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_BASE_URL from '../config/api';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticleAndLatest = async () => {
      setLoading(true);
      try {
        // Lay chi tiet bai viet
        const res = await fetch(`${API_BASE_URL}/api/news/${id}`);
        if (res.ok) {
          setArticle(await res.json());
        } else {
          setNotFound(true);
        }

        // Lay tin moi cho sidebar
        const resList = await fetch(`${API_BASE_URL}/api/news?limit=6`);
        if (resList.ok) {
          const list = await resList.json();
          setLatestNews(list);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleAndLatest();
  }, [id]);

  // Loc bo bai viet hien tai khoi sidebar
  const sidebarNews = latestNews.filter(item => item._id !== id).slice(0, 5);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans'>
      <Header />

      {/* Banner Tieu de o dau trang (giong trang mau) */}
      {!loading && article && (
        <div className='bg-gray-100 border-b border-gray-200 py-8 px-4'>
          <div className='container mx-auto max-w-6xl'>
            <h1 className='text-xl md:text-2xl font-bold text-[#004e92] uppercase leading-snug text-center max-w-4xl mx-auto'>
              {article.title}
            </h1>
          </div>
        </div>
      )}

      <main className='flex-grow container mx-auto max-w-6xl px-4 py-8'>
        {/* Breadcrumb / Quay lai */}
        <div className='mb-6 pl-1'>
          <Link to='/' className='inline-flex items-center gap-2 text-gray-400 hover:text-[#004e92] text-sm font-semibold transition-colors'>
            <ArrowLeft className='w-4 h-4' /> Quay lại Trang chủ
          </Link>
        </div>

        {loading ? (
          <div className='bg-white rounded-2xl p-20 shadow-sm border border-gray-100 text-center text-gray-400'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            Đang tải bài viết...
          </div>
        ) : notFound || !article ? (
          <div className='bg-white rounded-2xl p-16 shadow-sm border border-gray-100 text-center'>
            <p className='text-gray-500 text-lg mb-4'>Không tìm thấy bài viết này hoặc bài viết đã bị ẩn.</p>
            <Link to='/' className='inline-block bg-[#004e92] hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md'>
              Quay về trang chủ
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* COT TRAI: Chi tiet bai viet (70%) */}
            <div className='lg:col-span-2'>
              <article className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'>
                {/* Category badge & Title */}
                <div className='mb-4 flex items-center justify-between'>
                  <span className='bg-blue-50 text-[#004e92] px-3 py-1 rounded-full border border-blue-100 font-bold text-xs uppercase tracking-wide'>
                    {article.category}
                  </span>
                </div>

                <h2 className='text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4'>
                  {article.title}
                </h2>

                {/* Meta info */}
                <div className='flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100'>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='w-4 h-4 text-gray-400' />
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                  </span>
                  <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                  <span className='flex items-center gap-1.5'>
                    <User className='w-4 h-4 text-gray-400' />
                    Đăng bởi: <strong className='text-gray-700 font-semibold'>{article.author}</strong>
                  </span>
                </div>

                {/* Content body */}
                {article.content ? (
                  <div className='prose prose-blue max-w-none text-gray-800 leading-relaxed text-base space-y-6'>
                    <ReactMarkdown
                      components={{
                        img: ({ src, alt }) => (
                          <div className='my-6 rounded-xl overflow-hidden shadow-md max-h-[400px] flex justify-center bg-gray-50 border border-gray-100'>
                            <img src={src} alt={alt || ''} className='w-full h-auto max-h-[400px] object-contain' />
                          </div>
                        ),
                        p: ({ children }) => <p className='mb-4 text-gray-700 leading-relaxed'>{children}</p>,
                        h2: ({ children }) => <h2 className='text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2'>{children}</h2>,
                        h3: ({ children }) => <h3 className='text-lg md:text-xl font-bold text-gray-900 mt-6 mb-3'>{children}</h3>,
                        ul: ({ children }) => <ul className='list-disc pl-6 mb-4 space-y-1.5'>{children}</ul>,
                        ol: ({ children }) => <ol className='list-decimal pl-6 mb-4 space-y-1.5'>{children}</ol>,
                        li: ({ children }) => <li className='text-gray-700'>{children}</li>,
                        blockquote: ({ children }) => <blockquote className='border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600'>{children}</blockquote>
                      }}
                    >
                      {article.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className='text-gray-400 italic text-center py-6'>Bài viết chưa có nội dung chi tiết.</p>
                )}
              </article>
            </div>

            {/* COT PHAI: Sidebar Tin moi nhat (30%) */}
            <div className='lg:col-span-1 space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                <h3 className='text-lg font-bold text-gray-900 border-b-2 border-red-500 pb-3 mb-4 flex items-center gap-2'>
                  Tin mới nhất
                </h3>
                {sidebarNews.length === 0 ? (
                  <p className='text-xs text-gray-400 italic'>Không có bài viết khác.</p>
                ) : (
                  <div className='divide-y divide-gray-100'>
                    {sidebarNews.map((item) => (
                      <Link
                        key={item._id}
                        to={`/news/${item._id}`}
                        className='group py-3.5 flex items-start gap-3 first:pt-0 last:pb-0 block hover:text-[#004e92] transition-colors'
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=''
                            className='w-20 h-14 object-cover rounded-lg border border-gray-100 shrink-0 group-hover:opacity-90'
                          />
                        )}
                        <div className='min-w-0'>
                          <h4 className='text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#004e92] transition-colors'>
                            {item.title}
                          </h4>
                          <span className='text-[11px] text-gray-400 block mt-1'>
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
