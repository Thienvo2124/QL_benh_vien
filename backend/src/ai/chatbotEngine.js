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
manager.addDocument('vi', 'đặt lịc', 'book.appointment'); // Sai chính tả
manager.addDocument('vi', 'đăng kí khám', 'book.appointment'); // Sai chính tả
manager.addDocument('vi', 'đạt lịch', 'book.appointment'); // Sai chính tả

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
manager.addDocument('vi', 'sôts cao', 'disease.respiratory'); // Sai chính tả
manager.addDocument('vi', 'sốt z', 'disease.respiratory'); // Sai chính tả
manager.addDocument('vi', 'ho nhièu', 'disease.respiratory'); // Sai chính tả
manager.addDocument('vi', 'khó thỡ', 'disease.respiratory'); // Sai chính tả

// 4. Dạy AI nhận diện HỎI ĐÁP THUỐC (pharmacy.info)
manager.addDocument('vi', 'hỏi về thuốc', 'pharmacy.info');
manager.addDocument('vi', 'uống thuốc sao', 'pharmacy.info');
manager.addDocument('vi', 'tác dụng phụ', 'pharmacy.info');
manager.addDocument('vi', 'thuốc này uống lúc nào', 'pharmacy.info');
manager.addDocument('vi', 'hỏi về tác dụng thuốc', 'pharmacy.info');

// 4.1 BỆNH TIÊU HÓA (disease.digestive)
manager.addDocument('vi', 'đau bụng', 'disease.digestive');
manager.addDocument('vi', 'tiêu chảy', 'disease.digestive');
manager.addDocument('vi', 'đau dạ dày', 'disease.digestive');
manager.addDocument('vi', 'buồn nôn', 'disease.digestive');
manager.addDocument('vi', 'khó tiêu', 'disease.digestive');
manager.addDocument('vi', 'đau bụg', 'disease.digestive'); // Sai chính tả
manager.addDocument('vi', 'đau bao tử', 'disease.digestive'); 
manager.addDocument('vi', 'ỉa chảy', 'disease.digestive');

// 4.2 BỆNH XƯƠNG KHỚP (disease.bone)
manager.addDocument('vi', 'đau lưng', 'disease.bone');
manager.addDocument('vi', 'nhức mỏi xương khớp', 'disease.bone');
manager.addDocument('vi', 'gãy xương', 'disease.bone');
manager.addDocument('vi', 'thoái hóa cột sống', 'disease.bone');
manager.addDocument('vi', 'đau khớp gối', 'disease.bone');
manager.addDocument('vi', 'đau lưg', 'disease.bone'); // Sai chính tả
manager.addDocument('vi', 'nhứt mỏi', 'disease.bone'); // Sai chính tả

// 4.3 BỆNH TIM MẠCH (disease.cardio)
manager.addDocument('vi', 'đau ngực', 'disease.cardio');
manager.addDocument('vi', 'huyết áp cao', 'disease.cardio');
manager.addDocument('vi', 'tim đập nhanh', 'disease.cardio');
manager.addDocument('vi', 'khó thở tức ngực', 'disease.cardio');

// 4.3.1 BỆNH THẦN KINH (disease.neuro)
manager.addDocument('vi', 'đau đầu', 'disease.neuro');
manager.addDocument('vi', 'chóng mặt', 'disease.neuro');
manager.addDocument('vi', 'mất ngủ', 'disease.neuro');
manager.addDocument('vi', 'rối loạn tiền đình', 'disease.neuro');
manager.addDocument('vi', 'nhức đầu', 'disease.neuro');
manager.addDocument('vi', 'dao đàu', 'disease.neuro'); // Sai chính tả
manager.addDocument('vi', 'đau đàu', 'disease.neuro'); // Sai chính tả
manager.addDocument('vi', 'nữa đàu', 'disease.neuro'); // Sai chính tả
manager.addDocument('vi', 'đau nữa đầu', 'disease.neuro'); // Sai chính tả
manager.addDocument('vi', 'tạo bị dao nữa đàu', 'disease.neuro'); // Sai chính tả gõ teencode
manager.addDocument('vi', 'chống mặt', 'disease.neuro'); // Sai chính tả
manager.addDocument('vi', 'nhứt đầu', 'disease.neuro'); // Sai chính tả

// 4.4 TÌNH TRẠNG CẤP CỨU (emergency)
manager.addDocument('vi', 'cấp cứu', 'emergency');
manager.addDocument('vi', 'bị tai nạn', 'emergency');
manager.addDocument('vi', 'chảy máu nhiều', 'emergency');
manager.addDocument('vi', 'bất tỉnh', 'emergency');
manager.addDocument('vi', 'ngất xỉu', 'emergency');

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

// 7. Thông tin về bản thân AI (about.bot)
manager.addDocument('vi', 'bạn là người hay máy', 'about.bot');
manager.addDocument('vi', 'bạn là AI', 'about.bot');
manager.addDocument('vi', 'ai tạo ra bạn', 'about.bot');
manager.addDocument('vi', 'bạn là trợ lý', 'about.bot');
manager.addDocument('vi', 'Bệnh viện Nhân Dân', 'about.bot');
manager.addDocument('vi', 'AI Virtual Virtual', 'about.bot');
manager.addDocument('vi', 'Bạn là AI Virtual Virtual được hỗ trợ của Bệnh viện Nhân Dân', 'about.bot');

// ================= CÂU TRẢ LỜI CỦA AI =================
manager.addAnswer('vi', 'book.appointment', 'Dạ, để đặt lịch khám nhanh chóng, anh/chị có thể truy cập mục "Lịch hẹn của tôi" trên menu, hoặc gọi Hotline 1900-1515 để được xếp lịch ưu tiên ạ!');
manager.addAnswer('vi', 'disease.dental', 'Dạ, triệu chứng của anh/chị liên quan đến chuyên khoa Nha Khoa. Anh/chị nên đặt lịch khám tại Khoa Răng Hàm Mặt để bác sĩ kiểm tra và xử lý sớm nhé!');
manager.addAnswer('vi', 'disease.respiratory', 'Dạ, đây có thể là dấu hiệu của bệnh viêm đường hô hấp. Anh/chị nên mang khẩu trang và đặt lịch khám Nội Hô Hấp sớm nhất có thể để bác sĩ chẩn đoán ạ.');
manager.addAnswer('vi', 'disease.digestive', 'Dạ, các triệu chứng này liên quan đến đường Tiêu hóa. Anh/chị nên hạn chế đồ cay nóng và đặt lịch khám Nội Tiêu Hóa để bác sĩ nội soi hoặc kiểm tra chi tiết ạ.');
manager.addAnswer('vi', 'disease.bone', 'Dạ, vấn đề đau nhức xương khớp cần được thăm khám kỹ. Anh/chị hãy đặt lịch khám tại Khoa Cơ Xương Khớp, bác sĩ có thể sẽ chỉ định chụp X-Quang để chẩn đoán chính xác.');
manager.addAnswer('vi', 'disease.cardio', 'Dạ, các triệu chứng tim mạch và huyết áp rất nguy hiểm! Anh/chị nên đến trực tiếp Khoa Tim Mạch để được đo điện tim và kiểm tra ngay nhé.');
manager.addAnswer('vi', 'disease.neuro', 'Dạ, triệu chứng như đau đầu, chóng mặt thường liên quan đến Thần kinh. Anh/chị nên nghỉ ngơi và đặt lịch khám Nội Thần Kinh để được kiểm tra huyết áp và não bộ ạ.');
manager.addAnswer('vi', 'emergency', '🚨 TÌNH TRẠNG KHẨN CẤP! Vui lòng gọi ngay 115 hoặc đưa bệnh nhân đến khoa Cấp cứu của bệnh viện gần nhất. Không nên chờ đợi tư vấn lúc này!');
manager.addAnswer('vi', 'pharmacy.info', 'Dạ, mọi hướng dẫn về liều lượng và tác dụng phụ đều được bác sĩ ghi rõ trong "Đơn thuốc điện tử" ở mục Hồ sơ của anh/chị. Để an toàn, anh/chị không nên tự ý đổi thuốc nhé!');
manager.addAnswer('vi', 'hospital.info', 'Dạ Bệnh viện Nhân Dân làm việc từ 7:00 - 17:00 (Thứ 2 đến Thứ 7). Bệnh viện có áp dụng thanh toán BHYT tất cả các tuyến ạ!');
manager.addAnswer('vi', 'greetings.hello', 'Dạ, em là Y tế Trợ lý AI. Anh/chị đang cần hỗ trợ vấn đề gì ạ?');
manager.addAnswer('vi', 'about.bot', 'Dạ vâng chính xác ạ! Em là AI Virtual Virtual (Bác sĩ Ảo) được phát triển độc quyền cho Bệnh viện Nhân Dân. Khác với các AI bên ngoài, bộ não của em được thiết kế riêng để đảm bảo bảo mật 100% dữ liệu y tế của bệnh viện!');

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
  
  // Nếu độ tự tin (score) dưới 0.75 (75%), AI sẽ trả lời câu mặc định để tránh nói bậy (tránh nhận diện nhầm từ)
  if (response.intent === 'None' || response.score < 0.75) {
    const randomDefault = defaultAnswers[Math.floor(Math.random() * defaultAnswers.length)];
    return randomDefault;
  }

  return response.answer;
};

module.exports = {
  processMessage
};
