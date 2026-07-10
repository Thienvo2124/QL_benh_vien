const { NlpManager } = require('node-nlp');

// Khởi tạo NLP Manager cho tiếng Việt (mặc định node-nlp hỗ trợ đa ngôn ngữ)
const manager = new NlpManager({ languages: ['vi', 'en'], forceNER: true, autoSave: false });

// 1. Dạy AI nhận diện ý định ĐẶT LỊCH KHÁM (book.appointment)
manager.addDocument('vi', 'đặt lịch khám', 'book.appointment');
manager.addDocument('vi', 'tôi muốn hẹn bác sĩ', 'book.appointment');
manager.addDocument('vi', 'đăng ký khám bệnh', 'book.appointment');
manager.addDocument('vi', 'book lịch', 'book.appointment');
manager.addDocument('vi', 'hướng dẫn đặt lịch', 'book.appointment');
manager.addDocument('vi', 'đặt khám', 'book.appointment');

// 2. Dạy AI nhận diện BỆNH NHA KHOA (disease.dental)
manager.addDocument('vi', 'nhức răng', 'disease.dental');
manager.addDocument('vi', 'đau răng', 'disease.dental');
manager.addDocument('vi', 'chảy máu chân răng', 'disease.dental');
manager.addDocument('vi', 'viêm lợi', 'disease.dental');
manager.addDocument('vi', 'nhổ răng khôn', 'disease.dental');

// 3. Dạy AI nhận diện BỆNH HÔ HẤP (disease.respiratory)
manager.addDocument('vi', 'ho nhiều', 'disease.respiratory');
manager.addDocument('vi', 'sốt cao', 'disease.respiratory');
manager.addDocument('vi', 'khó thở', 'disease.respiratory');
manager.addDocument('vi', 'đau họng', 'disease.respiratory');
manager.addDocument('vi', 'ngạt mũi', 'disease.respiratory');
manager.addDocument('vi', 'bị ho và sốt', 'disease.respiratory');
manager.addDocument('vi', 'triệu chứng bệnh lý', 'disease.respiratory');

// 4. Dạy AI nhận diện HỎI ĐÁP THUỐC (pharmacy.info)
manager.addDocument('vi', 'hỏi về thuốc', 'pharmacy.info');
manager.addDocument('vi', 'uống thuốc sao', 'pharmacy.info');
manager.addDocument('vi', 'tác dụng phụ', 'pharmacy.info');
manager.addDocument('vi', 'thuốc này uống lúc nào', 'pharmacy.info');
manager.addDocument('vi', 'hỏi về tác dụng thuốc', 'pharmacy.info');

// 5. Dạy AI nhận diện GIỜ LÀM VIÊC & BHYT (hospital.info)
manager.addDocument('vi', 'mấy giờ đóng cửa', 'hospital.info');
manager.addDocument('vi', 'thứ 7 có làm không', 'hospital.info');
manager.addDocument('vi', 'khám bhyt không', 'hospital.info');
manager.addDocument('vi', 'giờ làm việc', 'hospital.info');
manager.addDocument('vi', 'bảo hiểm y tế', 'hospital.info');

// 6. Chào hỏi cơ bản (greetings)
manager.addDocument('vi', 'xin chào', 'greetings.hello');
manager.addDocument('vi', 'chào bạn', 'greetings.hello');
manager.addDocument('vi', 'alo', 'greetings.hello');


// ================= CÂU TRẢ LỜI CỦA AI =================
manager.addAnswer('vi', 'book.appointment', 'Dạ, để đặt lịch khám nhanh chóng, anh/chị có thể truy cập mục "Lịch hẹn của tôi" trên menu, hoặc gọi Hotline 1900-1515 để được xếp lịch ưu tiên ạ!');
manager.addAnswer('vi', 'disease.dental', 'Dạ, triệu chứng của anh/chị liên quan đến chuyên khoa Nha Khoa. Anh/chị nên đặt lịch khám tại Khoa Răng Hàm Mặt để bác sĩ kiểm tra và xử lý sớm nhé!');
manager.addAnswer('vi', 'disease.respiratory', 'Dạ, đây có thể là dấu hiệu của bệnh viêm đường hô hấp. Anh/chị nên mang khẩu trang và đặt lịch khám Nội Hô Hấp sớm nhất có thể để bác sĩ chẩn đoán ạ.');
manager.addAnswer('vi', 'pharmacy.info', 'Dạ, mọi hướng dẫn về liều lượng và tác dụng phụ đều được bác sĩ ghi rõ trong "Đơn thuốc điện tử" ở mục Hồ sơ của anh/chị. Để an toàn, anh/chị không nên tự ý đổi thuốc nhé!');
manager.addAnswer('vi', 'hospital.info', 'Dạ Bệnh viện Nhân Dân làm việc từ 7:00 - 17:00 (Thứ 2 đến Thứ 7). Bệnh viện có áp dụng thanh toán BHYT tất cả các tuyến ạ!');
manager.addAnswer('vi', 'greetings.hello', 'Dạ, em là Y tế Trợ lý AI. Anh/chị đang cần hỗ trợ vấn đề gì ạ?');

// Câu trả lời mặc định khi AI không hiểu
const defaultAnswers = [
  "Dạ, câu hỏi của anh/chị khá chuyên sâu, em khuyên anh/chị nên đặt lịch khám để Bác sĩ trực tiếp chẩn đoán ạ.",
  "Dạ em chưa rõ ý anh/chị lắm. Anh/chị có thể gọi Hotline 1900-1515 để được tổng đài viên tư vấn trực tiếp nhé!",
  "Dạ, vấn đề này nằm ngoài dữ liệu của em. Anh/chị vui lòng tham khảo ý kiến Bác sĩ chuyên khoa tại bệnh viện ạ."
];

// Hàm Train Model (chạy ngay khi file được load)
let isTrained = false;
const trainAI = async () => {
  if (isTrained) return;
  console.log("Đang huấn luyện AI Nội Bộ Bệnh Viện (node-nlp)...");
  await manager.train();
  isTrained = true;
  console.log("Huấn luyện AI thành công! Hệ thống sẵn sàng.");
};

// Gọi hàm train ngay lập tức (bất đồng bộ)
trainAI();

// Hàm xử lý câu hỏi từ người dùng
const processMessage = async (message) => {
  // Đợi AI train xong nếu nó đang train
  if (!isTrained) {
    await trainAI();
  }

  const response = await manager.process('vi', message);
  
  // Nếu độ tự tin (score) dưới 0.5 (50%), AI sẽ trả lời câu mặc định để tránh nói bậy
  if (response.intent === 'None' || response.score < 0.5) {
    const randomDefault = defaultAnswers[Math.floor(Math.random() * defaultAnswers.length)];
    return randomDefault;
  }

  return response.answer;
};

module.exports = {
  processMessage
};
