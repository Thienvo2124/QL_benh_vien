import Header from '../components/Header';
import Footer from '../components/Footer';

const Procedures = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold text-[#004e92] mb-4">Quy Trình Khám Bệnh</h2>
          <p className="text-gray-600 text-lg">
            Nội dung chi tiết về các bước đăng ký, khám bệnh và lấy thuốc sẽ được cập nhật tại đây.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Procedures;
