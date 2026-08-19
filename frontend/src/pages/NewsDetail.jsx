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
      <div className='bg-[#004e92] text-white py-10 px-4'>
        <div className='container mx-auto max-w-3xl'>
          <Link to='/' className='inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors'>
            <ArrowLeft className='w-4 h-4' /> Trang chu
          </Link>
          {!loading && article && (
            <h1 className='text-2xl md:text-3xl font-bold leading-snug'>{article.title}</h1>
          )}
        </div>
      </div>

      <main className='flex-grow container mx-auto max-w-3xl px-4 py-10'>
        {loading ? (
          <div className='text-center text-gray-400 py-20'>Dang tai bai viet...</div>
        ) : notFound || !article ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 text-lg mb-4'>Khong tim thay bai viet nay.</p>
            <Link to='/' className='text-[#004e92] font-bold hover:underline'>Quay ve trang chu</Link>
          </div>
        ) : (
          <article className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            {article.imageUrl && (
              <img src={article.imageUrl} alt={article.title} className='w-full h-64 md:h-80 object-cover' />
            )}
            <div className='p-6 md:p-8'>
              <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100'>
                <span className='flex items-center gap-1.5'><Calendar className='w-4 h-4 text-gray-400' />{article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                <span className='flex items-center gap-1.5'><User className='w-4 h-4 text-gray-400' />{article.author}</span>
                <span className='flex items-center gap-1.5 bg-blue-50 text-[#004e92] px-2 py-0.5 rounded-full border border-blue-100 font-semibold text-xs'><Tag className='w-3 h-3' />{article.category}</span>
              </div>
              {article.summary && (
                <p className='text-gray-600 text-base italic border-l-4 border-[#004e92] pl-4 mb-6 leading-relaxed'>{article.summary}</p>
              )}
              {article.content ? (
                <div className='prose prose-blue max-w-none text-gray-700 leading-relaxed'>
                  <ReactMarkdown
                    components={{
                      img: ({src, alt}) => (
                        <img src={src} alt={alt || ''} className='rounded-xl shadow-md my-4 max-w-full' />
                      ),
                      p: ({children}) => <p className='mb-4 text-base leading-relaxed'>{children}</p>,
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className='text-gray-400 italic'>Bai viet chua co noi dung day du.</p>
              )}
            </div>
          </article>
        )}

        <div className='mt-8'>
          <Link to='/' className='inline-flex items-center gap-2 text-[#004e92] font-semibold hover:underline text-sm'>
            <ArrowLeft className='w-4 h-4' /> Quay ve trang chu
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
