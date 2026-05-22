import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] bg-blue-50 flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop")' }}
      ></div>
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#004e92]/90 to-[#004e92]/40"></div>

      <div className="relative z-10 container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-white">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight uppercase">
            Vươn tầm<br className="hidden md:block"/> cao mới
          </h2>
          <p className="text-lg md:text-xl mb-8 font-light drop-shadow-md max-w-lg">
            Bệnh viện Đa khoa loại I trực thuộc Sở Y tế TP.HCM. Chăm sóc sức khỏe toàn diện, tận tâm và chuyên nghiệp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1">
              Đặt Hẹn Khám
            </a>
            <a href="#" className="bg-white hover:bg-gray-100 text-[#004e92] font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1">
              Tìm Bác Sĩ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
