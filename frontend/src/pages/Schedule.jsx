import Header from '../components/Header';
import Footer from '../components/Footer';

const Schedule = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold text-[#004e92] mb-4">Lịch Khám Chữa Bệnh</h2>
          <p className="text-gray-600 text-lg">
            Nội dung lịch khám chi tiết của các khoa và bác sĩ sẽ được cập nhật tại đây trong thời gian tới.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schedule;
