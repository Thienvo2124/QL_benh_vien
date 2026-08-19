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
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news/${id}`);
        if (res.ok) {
          setArticle(await res.json());
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col font-sans'>
      <Header />

      <main className='flex-grow container mx-auto max-w-4xl px-4 py-12'>
        {/* Breadcrumb / Quay lai */}
        <div className='mb-8 pl-1'>
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
          <article className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10'>
            {/* Category badge */}
            <div className='mb-4'>
              <span className='bg-blue-50 text-[#004e92] px-3 py-1 rounded-full border border-blue-100 font-bold text-xs uppercase tracking-wide'>
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className='text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4'>
              {article.title}
            </h1>

            {/* Meta info */}
            <div className='flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100'>
              <span className='flex items-center gap-1.5'>
                <Calendar className='w-4 h-4 text-gray-400' />
                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
              </span>
              <span className='w-1 h-1 bg-gray-300 rounded-full hidden md:inline-block'></span>
              <span className='flex items-center gap-1.5'>
                <User className='w-4 h-4 text-gray-400' />
                Đăng bởi: <strong className='text-gray-700 font-semibold'>{article.author}</strong>
              </span>
            </div>

            {/* Main Image */}
            {article.imageUrl && (
              <div className='mb-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 max-h-[480px] flex items-center justify-center'>
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className='w-full h-auto max-h-[480px] object-contain md:object-cover'
                />
              </div>
            )}

            {/* Summary */}
            {article.summary && (
              <div className='bg-blue-50/50 border-l-4 border-[#004e92] rounded-r-xl p-4 md:p-5 mb-8 text-gray-700 text-base md:text-lg font-medium leading-relaxed italic'>
                {article.summary}
              </div>
            )}

            {/* Content body */}
            {article.content ? (
              <div className='prose prose-blue max-w-none text-gray-800 leading-relaxed text-base md:text-lg space-y-6'>
                <ReactMarkdown
                  components={{
                    img: ({ src, alt }) => (
                      <div className='my-6 rounded-xl overflow-hidden shadow-md max-h-[450px] flex justify-center bg-gray-50 border border-gray-100'>
                        <img src={src} alt={alt || ''} className='w-full h-auto max-h-[450px] object-contain' />
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
