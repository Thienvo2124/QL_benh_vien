// src/data/departments.js

const departments = [
  {
    slug: 'goi-kham-co-ban',
    name: 'Gói khám sức khỏe tổng quát Cơ Bản',
    icon: '📋',
    color: 'bg-blue-100 text-blue-600',
    doctors: 4,
    shortDesc: 'Đánh giá sức khỏe định kỳ cơ bản cho mọi lứa tuổi',
    fullDesc: 'Gói khám sức khỏe tổng quát cơ bản bao gồm đầy đủ các xét nghiệm máu, nước tiểu, siêu âm bụng tổng quát, chụp X-quang phổi và đo điện tim nhằm phát hiện sớm các bệnh lý phổ biến.',
    services: ['Xét nghiệm công thức máu', 'Kiểm tra chức năng gan thận', 'Siêu âm bụng tổng quát', 'X-quang phổi kỹ thuật số'],
    doctors_list: [
      { name: 'BS.CK1 Lê Thị Hương', exp: '13 năm', rating: 4.7, reviews: 187 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'goi-kham-nang-cao',
    name: 'Gói khám sức khỏe tổng quát Nâng Cao',
    icon: '📋',
    color: 'bg-teal-100 text-teal-600',
    doctors: 4,
    shortDesc: 'Tầm soát sức khỏe toàn diện và chuyên sâu hơn',
    fullDesc: 'Gói nâng cao bổ sung thêm các chỉ số mỡ máu, tầm soát gút, siêu âm tim, tuyến giáp và đo độ loãng xương giúp phát hiện kịp thời các bệnh lý chuyển hóa và tim mạch.',
    services: ['Tầm soát rối loạn mỡ máu', 'Siêu âm tim', 'Siêu âm tuyến giáp', 'Đo loãng xương'],
    doctors_list: [
      { name: 'PGS.TS. Trần Hoàng Hải', exp: '20 năm', rating: 4.8, reviews: 254 },
      { name: 'BS.CK1 Lê Thị Hương', exp: '13 năm', rating: 4.7, reviews: 187 }
    ]
  },
  {
    slug: 'goi-kham-chuyen-sau',
    name: 'Gói khám sức khỏe tổng quát Chuyên Sâu',
    icon: '📋',
    color: 'bg-indigo-100 text-indigo-600',
    doctors: 5,
    shortDesc: 'Khám tầm soát sâu các bộ phận chính trên cơ thể',
    fullDesc: 'Gói chuyên sâu thực hiện chẩn đoán hình ảnh kỹ thuật cao, chụp CT phổi liều thấp hoặc chụp MRI, đánh giá toàn diện nguy cơ ung thư, tim mạch và các bệnh mãn tính.',
    services: ['Chụp CT phổi liều thấp', 'Điện tâm đồ gắng sức', 'Xét nghiệm định lượng miễn dịch', 'Đánh giá xơ vữa động mạch'],
    doctors_list: [
      { name: 'GS.TS. Nguyễn Minh Tuấn', exp: '25 năm', rating: 4.9, reviews: 312 },
      { name: 'TS.BS. Lê Văn Hùng', exp: '18 năm', rating: 4.8, reviews: 198 }
    ]
  },
  {
    slug: 'goi-kham-vip-gold',
    name: 'Gói khám sức khỏe tổng quát VIP Gold',
    icon: '📋',
    color: 'bg-amber-100 text-amber-600',
    doctors: 6,
    shortDesc: 'Trải nghiệm dịch vụ y tế đẳng cấp và toàn diện',
    fullDesc: 'Dịch vụ khám VIP Gold bao gồm các danh mục kiểm tra cao cấp nhất, phòng nghỉ riêng, điều dưỡng hộ tống và tư vấn dinh dưỡng, lối sống chuyên sâu cùng các chuyên gia hàng đầu.',
    services: ['Xét nghiệm dấu ấn ung thư', 'Chụp cộng hưởng từ MRI', 'Tư vấn dinh dưỡng cá nhân', 'Phòng chờ hạng thương gia'],
    doctors_list: [
      { name: 'GS.TS. Nguyễn Minh Tuấn', exp: '25 năm', rating: 4.9, reviews: 312 },
      { name: 'PGS.TS. Trần Thị Lan', exp: '20 năm', rating: 4.8, reviews: 254 }
    ]
  },
  {
    slug: 'goi-kham-vip-platinum',
    name: 'Gói khám sức khỏe tổng quát VIP Platinum',
    icon: '📋',
    color: 'bg-rose-100 text-rose-600',
    doctors: 6,
    shortDesc: 'Gói tầm soát sức khỏe tối đa cao cấp nhất',
    fullDesc: 'Gói Platinum mang lại giá trị chẩn đoán tối ưu với công nghệ chụp PET-CT, chụp mạch vành, nội soi không đau dạ dày đại tràng và phân tích di truyền tầm soát bệnh lý bẩm sinh.',
    services: ['Chụp mạch vành CT', 'Nội soi dạ dày đại tràng', 'Đo đa ký giấc ngủ', 'Phân tích di truyền'],
    doctors_list: [
      { name: 'GS.TS. Nguyễn Minh Tuấn', exp: '25 năm', rating: 4.9, reviews: 312 },
      { name: 'BS.CK2 Lê Thị Bích', exp: '16 năm', rating: 4.9, reviews: 312 }
    ]
  },
  {
    slug: 'goi-kham-tam-soat-ung-thu-tong-quat',
    name: 'Gói khám tầm soát ung thư tổng quát',
    icon: '🔬',
    color: 'bg-red-100 text-red-600',
    doctors: 5,
    shortDesc: 'Phát hiện sớm các dấu hiệu tế bào ung thư phổ biến',
    fullDesc: 'Tầm soát ung thư sớm bằng xét nghiệm tìm dấu ấn sinh học của các loại ung thư phổ biến như phổi, gan, tiêu hóa, tiền liệt tuyến (ở nam) và vú, cổ tử cung (ở nữ).',
    services: ['Xét nghiệm dấu ấn AFP, CEA, CA 19-9', 'Siêu âm tuyến vú/tuyến giáp', 'Xét nghiệm tế bào cổ tử cung', 'Nội soi tầm soát'],
    doctors_list: [
      { name: 'PGS.TS. Lê Thị Thu', exp: '19 năm', rating: 4.9, reviews: 231 },
      { name: 'TS.BS. Trần Minh Khoa', exp: '14 năm', rating: 4.8, reviews: 187 }
    ]
  },
  {
    slug: 'goi-kham-tam-soat-ung-thu-tieu-hoa',
    name: 'Gói khám tầm soát ung thư tiêu hóa',
    icon: '🔬',
    color: 'bg-emerald-100 text-emerald-600',
    doctors: 4,
    shortDesc: 'Tầm soát polyp, viêm loét và khối u dạ dày đại tràng',
    fullDesc: 'Kết hợp xét nghiệm máu ẩn trong phân, xét nghiệm HP dạ dày và nội soi ống tiêu hóa mềm có gây mê giúp chẩn đoán cực kỳ chính xác bệnh lý tiền ung thư tiêu hóa.',
    services: ['Nội soi dạ dày gây mê', 'Nội soi đại tràng không đau', 'Test tìm HP qua hơi thở', 'Xét nghiệm máu ẩn trong phân'],
    doctors_list: [
      { name: 'TS.BS. Trần Minh Khoa', exp: '14 năm', rating: 4.8, reviews: 187 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'goi-kham-tam-soat-dot-quy',
    name: 'Gói khám tầm soát đột quỵ',
    icon: '🧠',
    color: 'bg-purple-100 text-purple-600',
    doctors: 5,
    shortDesc: 'Đánh giá nguy cơ tắc nghẽn và xuất huyết não',
    fullDesc: 'Tầm soát xơ vữa động mạch cảnh, chụp cộng hưởng từ mạch máu não (MRA), đo huyết áp liên tục và xét nghiệm đông máu để dự phòng và phát hiện sớm nguy cơ đột quỵ.',
    services: ['Chụp MRI & MRA não', 'Siêu âm doppler động mạch cảnh', 'Điện tâm đồ phát hiện rung nhĩ', 'Xét nghiệm đông máu toàn bộ'],
    doctors_list: [
      { name: 'TS.BS. Lê Văn Hùng', exp: '18 năm', rating: 4.8, reviews: 198 },
      { name: 'BS.CK2 Nguyễn Thị Linh', exp: '14 năm', rating: 4.7, reviews: 165 }
    ]
  },
  {
    slug: 'chan-doan-hinh-anh',
    name: 'Chẩn đoán hình ảnh (Xquang, CT, Mri, Đo loãng xương)',
    icon: '📷',
    color: 'bg-slate-100 text-slate-600',
    doctors: 6,
    shortDesc: 'Khảo sát cấu trúc bên trong cơ thể bằng công nghệ cao',
    fullDesc: 'Khoa cung cấp các dịch vụ chẩn đoán hình ảnh hiện đại bao gồm chụp X-quang kỹ thuật số, chụp cắt lớp vi tính CT đa dãy, chụp cộng hưởng từ MRI chất lượng cao và đo mật độ xương DEXA.',
    services: ['Chụp X-quang kỹ thuật số', 'Chụp CT-scan 128 lát cắt', 'Chụp cộng hưởng từ MRI 3.0 Tesla', 'Đo mật độ xương DEXA'],
    doctors_list: [
      { name: 'TS.BS. Lê Anh Tuấn', exp: '16 năm', rating: 4.8, reviews: 201 },
      { name: 'ThS.BS. Nguyễn Thị Hà', exp: '11 năm', rating: 4.7, reviews: 165 }
    ]
  },
  {
    slug: 'noi-tong-quat',
    name: 'Nội tổng quát',
    icon: '🩺',
    color: 'bg-green-100 text-green-600',
    doctors: 8,
    shortDesc: 'Khám lâm sàng và điều trị các bệnh lý nội khoa mãn tính',
    fullDesc: 'Điều trị toàn diện các bệnh nội khoa như Tăng huyết áp, Đái tháo đường, rối loạn mỡ máu, gút, bệnh lý tiêu hóa nhẹ và theo dõi sức khỏe tổng quát định kỳ.',
    services: ['Điều trị cao huyết áp', 'Kiểm soát đường huyết', 'Khám tổng quát sức khỏe', 'Tư vấn sử dụng thuốc'],
    doctors_list: [
      { name: 'BS.CK1 Lê Thị Hương', exp: '13 năm', rating: 4.7, reviews: 187 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'tai-mui-hong',
    name: 'Tai mũi họng',
    icon: '👂',
    color: 'bg-teal-100 text-teal-600',
    doctors: 5,
    shortDesc: 'Khám điều trị viêm xoang, viêm tai, họng thanh quản',
    fullDesc: 'Khoa được trang bị hệ thống máy nội soi ống mềm hiện đại phục vụ khám, phát hiện và xử lý chính xác các tổn thương vùng tai mũi họng cho trẻ em và người lớn.',
    services: ['Nội soi Tai Mũi Họng', 'Rửa xoang, hút mũi', 'Điều trị viêm tai giữa', 'Đo thính lực'],
    doctors_list: [
      { name: 'BS.CK2 Phạm Quang Vinh', exp: '14 năm', rating: 4.8, reviews: 178 },
      { name: 'ThS.BS. Trần Thị Kim', exp: '10 năm', rating: 4.7, reviews: 143 }
    ]
  },
  {
    slug: 'mat',
    name: 'Mắt',
    icon: '👁️',
    color: 'bg-cyan-100 text-cyan-600',
    doctors: 4,
    shortDesc: 'Chẩn đoán tật khúc xạ và điều trị các bệnh về mắt',
    fullDesc: 'Đo thị lực bằng máy tự động, chẩn đoán glôcôm, đục thủy tinh thể, viêm kết mạc, bệnh võng mạc đái tháo đường và thực hiện các tiểu phẫu lấy dị vật, mộng thịt.',
    services: ['Đo khúc xạ mắt', 'Khám mắt sinh hiển vi', 'Soi đáy mắt', 'Điều trị khô mắt'],
    doctors_list: [
      { name: 'BS.CK1 Nguyễn Thị Mai', exp: '10 năm', rating: 4.8, reviews: 143 },
      { name: 'ThS.BS. Trần Quang Minh', exp: '9 năm', rating: 4.7, reviews: 121 }
    ]
  },
  {
    slug: 'rang-ham-mat',
    name: 'Răng hàm mặt',
    icon: '🦷',
    color: 'bg-blue-100 text-blue-600',
    doctors: 5,
    shortDesc: 'Chăm sóc răng miệng và nha khoa thẩm mỹ cao cấp',
    fullDesc: 'Khám phát hiện sớm sâu răng, viêm lợi. Dịch vụ hàn trám răng, điều trị tủy răng không đau, cạo vôi răng, tẩy trắng răng và cấy ghép phục hình răng thẩm mỹ.',
    services: ['Trám răng sâu', 'Lấy cao răng siêu âm', 'Tẩy trắng răng thẩm mỹ', 'Nhổ răng khôn không đau'],
    doctors_list: [
      { name: 'ThS.BS. Võ Thanh Long', exp: '12 năm', rating: 4.7, reviews: 176 },
      { name: 'BS.CK1 Nguyễn Thị Nga', exp: '8 năm', rating: 4.8, reviews: 143 }
    ]
  },
  {
    slug: 'tim-mach',
    name: 'Tim mạch',
    icon: '❤️',
    color: 'bg-red-100 text-red-600',
    doctors: 6,
    shortDesc: 'Điều trị suy tim, cao huyết áp và mạch vành',
    fullDesc: 'Tư vấn, chẩn đoán xác định các bệnh lý hẹp mạch vành, loạn nhịp tim thông qua điện tâm đồ, siêu âm tim màu Doppler và chỉ định can thiệp nong đặt stent động mạch.',
    services: ['Siêu âm tim màu', 'Đo điện tâm đồ (ECG)', 'Lập bản đồ huyết áp 24h', 'Tư vấn can thiệp mạch'],
    doctors_list: [
      { name: 'GS.TS. Nguyễn Minh Tuấn', exp: '25 năm', rating: 4.9, reviews: 312 },
      { name: 'PGS.TS. Trần Hoàng Hải', exp: '20 năm', rating: 4.8, reviews: 254 }
    ]
  },
  {
    slug: 'san-phu-khoa',
    name: 'Sản phụ khoa',
    icon: '🤰',
    color: 'bg-pink-100 text-pink-600',
    doctors: 8,
    shortDesc: 'Khám thai định kỳ và điều trị các bệnh lý phụ khoa',
    fullDesc: 'Theo dõi thai kỳ toàn diện từ lúc mang thai đến khi sinh, sàng lọc dị tật thai nhi, khám phát hiện điều trị u xơ, u nang và các viêm nhiễm phụ khoa.',
    services: ['Siêu âm thai 4D/5D', 'Khám phụ khoa định kỳ', 'Tầm soát ung thư cổ tử cung', 'Tư vấn kế hoạch hóa gia đình'],
    doctors_list: [
      { name: 'PGS.TS. Trần Thị Lan', exp: '20 năm', rating: 4.8, reviews: 254 },
      { name: 'BS.CK2 Lê Thị Bích', exp: '16 năm', rating: 4.9, reviews: 312 }
    ]
  },
  {
    slug: 'tuyen-vu',
    name: 'Tuyến vú',
    icon: '🎀',
    color: 'bg-rose-100 text-rose-600',
    doctors: 4,
    shortDesc: 'Tầm soát sớm ung thư vú và điều trị u tuyến vú',
    fullDesc: 'Khoa chuyên biệt giúp tầm soát sớm các bất thường ở tuyến vú bằng hệ thống siêu âm đàn hồi mô độ phân giải cao và chụp nhũ ảnh (Mammography) hiện đại bậc nhất.',
    services: ['Siêu âm đàn hồi mô tuyến vú', 'Chụp nhũ ảnh Mammography', 'Sinh thiết u vú dưới siêu âm', 'Chọc hút tế bào bằng kim nhỏ (FNA)'],
    doctors_list: [
      { name: 'BS.CK2 Lê Thị Bích', exp: '16 năm', rating: 4.9, reviews: 312 },
      { name: 'PGS.TS. Trần Thị Lan', exp: '20 năm', rating: 4.8, reviews: 254 }
    ]
  },
  {
    slug: 'ho-hap',
    name: 'Hô hấp',
    icon: '🫁',
    color: 'bg-blue-50 text-blue-600',
    doctors: 4,
    shortDesc: 'Điều trị hen suyễn, bệnh phổi tắc nghẽn mãn tính (COPD)',
    fullDesc: 'Khoa chuyên khoa sâu thăm khám, thực hiện đo chức năng hô hấp để chẩn đoán xác định các bệnh lý tắc nghẽn đường thở, ho kéo dài, hen phế quản và viêm phổi.',
    services: ['Đo chức năng hô hấp', 'Xét nghiệm đờm', 'Khám hen suyễn & COPD', 'Tư vấn cai thuốc lá'],
    doctors_list: [
      { name: 'TS.BS. Lê Văn Hùng', exp: '18 năm', rating: 4.8, reviews: 198 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'di-ung-mien-dich',
    name: 'Dị ứng miễn dịch',
    icon: '🧪',
    color: 'bg-emerald-100 text-emerald-600',
    doctors: 4,
    shortDesc: 'Chẩn đoán và làm dịu các phản ứng dị ứng, viêm da',
    fullDesc: 'Thực hiện test lẩy da tìm dị nguyên gây dị ứng, điều trị mề đay mãn tính, viêm da cơ địa dị ứng, hen dị ứng và các bệnh lý tự miễn như lupus ban đỏ hệ thống.',
    services: ['Test lẩy da tìm dị nguyên', 'Định lượng IgE toàn phần', 'Điều trị viêm da cơ địa', 'Điều trị mề đay mãn tính'],
    doctors_list: [
      { name: 'BS.CK2 Nguyễn Thị Thanh', exp: '12 năm', rating: 4.7, reviews: 156 },
      { name: 'ThS.BS. Lê Quốc Hùng', exp: '9 năm', rating: 4.6, reviews: 132 }
    ]
  },
  {
    slug: 'tu-van-giac-ngu',
    name: 'Tư vấn giấc ngủ',
    icon: '💤',
    color: 'bg-indigo-100 text-indigo-700',
    doctors: 4,
    shortDesc: 'Điều trị mất ngủ kéo dài, ngưng thở khi ngủ',
    fullDesc: 'Khám và tư vấn phục hồi giấc ngủ tự nhiên. Đo đa ký giấc ngủ để chẩn đoán chứng ngưng thở khi ngủ nguy hiểm, từ đó đưa ra hướng điều trị phù hợp nhất.',
    services: ['Khám mất ngủ', 'Tư vấn liệu pháp hành vi', 'Đo đa ký giấc ngủ (Polysomnography)', 'Điều trị ngưng thở khi ngủ'],
    doctors_list: [
      { name: 'TS.BS. Lê Văn Hùng', exp: '18 năm', rating: 4.8, reviews: 198 },
      { name: 'BS.CK2 Nguyễn Thị Linh', exp: '14 năm', rating: 4.7, reviews: 165 }
    ]
  },
  {
    slug: 'nhi-khoa',
    name: 'Nhi khoa',
    icon: '🧒',
    color: 'bg-yellow-100 text-yellow-600',
    doctors: 6,
    shortDesc: 'Chăm sóc sức khỏe và phát triển của trẻ nhỏ',
    fullDesc: 'Tiếp nhận thăm khám tất cả các bệnh lý nhi khoa như sốt, ho, rối loạn tiêu hóa, tư vấn dinh dưỡng cho trẻ phát triển thể chất và tinh thần tốt nhất.',
    services: ['Khám bệnh nhi tổng quát', 'Khám và tư vấn dinh dưỡng', 'Khám theo dõi phát triển sơ sinh', 'Khám các bệnh truyền nhiễm'],
    doctors_list: [
      { name: 'BS.CK2 Phạm Thị Hoa', exp: '15 năm', rating: 4.9, reviews: 421 },
      { name: 'ThS.BS. Nguyễn Văn Nam', exp: '11 năm', rating: 4.8, reviews: 198 }
    ]
  },
  {
    slug: 'tiem-ngua',
    name: 'Tiêm ngừa',
    icon: '💉',
    color: 'bg-sky-100 text-sky-600',
    doctors: 4,
    shortDesc: 'Tiêm chủng vắc xin đầy đủ cho trẻ em và người lớn',
    fullDesc: 'Cung cấp các gói tiêm vắc xin trọn gói và riêng lẻ, vắc xin thế hệ mới chất lượng cao, khám sàng lọc kỹ càng trước tiêm và theo dõi sau tiêm an toàn.',
    services: ['Khám sàng lọc trước tiêm', 'Tiêm vắc xin phòng cúm', 'Tiêm vắc xin cho trẻ sơ sinh', 'Tiêm chủng du lịch'],
    doctors_list: [
      { name: 'BS.CK2 Phạm Thị Hoa', exp: '15 năm', rating: 4.9, reviews: 421 },
      { name: 'ThS.BS. Nguyễn Văn Nam', exp: '11 năm', rating: 4.8, reviews: 198 }
    ]
  },
  {
    slug: 'noi-tiet',
    name: 'Nội tiết',
    icon: '💧',
    color: 'bg-cyan-50 text-cyan-600',
    doctors: 4,
    shortDesc: 'Khám điều trị tiểu đường, cường giáp, suy giáp',
    fullDesc: 'Chẩn đoán và quản lý tối ưu bệnh đái tháo đường, các bệnh lý tuyến giáp (như bướu cổ, nhân giáp), rối loạn tuyến thượng thận và các rối loạn hormone cơ thể.',
    services: ['Khám bàn chân đái tháo đường', 'Xét nghiệm định lượng hormone', 'Siêu âm tuyến giáp', 'Xét nghiệm HbA1c định kỳ'],
    doctors_list: [
      { name: 'BS.CK1 Lê Thị Hương', exp: '13 năm', rating: 4.7, reviews: 187 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'co-xuong-khop',
    name: 'Cơ xương khớp',
    icon: '🦴',
    color: 'bg-orange-100 text-orange-600',
    doctors: 5,
    shortDesc: 'Điều trị thoái hóa khớp, loãng xương, gút, đau lưng',
    fullDesc: 'Khám, chẩn đoán hình ảnh và tiêm nội khớp giảm đau nhanh. Điều trị hiệu quả thoái hóa khớp gối, viêm khớp dạng thấp, loãng xương và các bệnh lý đau cột sống cổ/lưng.',
    services: ['Tiêm dịch khớp giảm đau', 'Vật lý trị liệu khớp', 'Tầm soát loãng xương', 'Khám điều trị gút'],
    doctors_list: [
      { name: 'TS.BS. Hoàng Văn Tuấn', exp: '17 năm', rating: 4.8, reviews: 203 },
      { name: 'BS.CK2 Nguyễn Đức Mạnh', exp: '13 năm', rating: 4.7, reviews: 167 }
    ]
  },
  {
    slug: 'tam-the',
    name: 'Tâm thể (Tâm thần kinh)',
    icon: '🧠',
    color: 'bg-pink-100 text-pink-700',
    doctors: 4,
    shortDesc: 'Tư vấn tâm lý, điều trị stress, lo âu, trầm cảm',
    fullDesc: 'Khoa hỗ trợ tư vấn trị liệu tâm lý sâu cho các trường hợp stress nặng, rối loạn lo âu, trầm cảm, rối loạn hoảng sợ và các triệu chứng thực thể không giải thích được.',
    services: ['Trị liệu tâm lý hành vi', 'Khám stress và trầm cảm', 'Tư vấn liệu pháp giấc ngủ', 'Kê đơn an thần nhẹ'],
    doctors_list: [
      { name: 'TS.BS. Lê Văn Hùng', exp: '18 năm', rating: 4.8, reviews: 198 },
      { name: 'BS.CK2 Nguyễn Thị Linh', exp: '14 năm', rating: 4.7, reviews: 165 }
    ]
  },
  {
    slug: 'noi-than-kinh',
    name: 'Nội thần kinh',
    icon: '🧠',
    color: 'bg-purple-100 text-purple-700',
    doctors: 4,
    shortDesc: 'Khám điều trị đau đầu, chóng mặt, tiền đình',
    fullDesc: 'Khám chữa trị các chứng đau nửa đầu (Migraine), rối loạn tiền đình, thiểu năng tuần hoàn não, bệnh lý thần kinh ngoại biên, liệt dây VII ngoại biên và đau thần kinh liên sườn.',
    services: ['Khám điều trị rối loạn tiền đình', 'Đo điện cơ (EMG)', 'Chụp CT/MRI sọ não', 'Điều trị đau nửa đầu'],
    doctors_list: [
      { name: 'TS.BS. Lê Văn Hùng', exp: '18 năm', rating: 4.8, reviews: 198 },
      { name: 'BS.CK2 Nguyễn Thị Linh', exp: '14 năm', rating: 4.7, reviews: 165 }
    ]
  },
  {
    slug: 'tieu-hoa-gan-mat',
    name: 'Tiêu hóa gan mật',
    icon: '🧪',
    color: 'bg-green-100 text-green-700',
    doctors: 4,
    shortDesc: 'Điều trị viêm loét dạ dày, trào ngược, viêm gan',
    fullDesc: 'Khám lâm sàng kết hợp xét nghiệm chẩn đoán nhanh trào ngược dạ dày thực quản (GERD), viêm gan siêu vi B/C, gan nhiễm mỡ, xơ gan và viêm tụy cấp/mãn tính.',
    services: ['Xét nghiệm kháng nguyên viêm gan', 'Siêu âm gan mật', 'Khám trào ngược dạ dày', 'Tư vấn dinh dưỡng gan mật'],
    doctors_list: [
      { name: 'TS.BS. Trần Minh Khoa', exp: '14 năm', rating: 4.8, reviews: 187 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'noi-soi',
    name: 'Nội soi',
    icon: '🔬',
    color: 'bg-emerald-100 text-emerald-700',
    doctors: 4,
    shortDesc: 'Nội soi chẩn đoán dạ dày, đại tràng không đau',
    fullDesc: 'Dịch vụ nội soi chẩn đoán chất lượng cao sử dụng ống soi mềm hiện đại, có áp dụng gây mê nhẹ giúp quá trình nội soi diễn ra hoàn toàn êm ái và không đau đớn.',
    services: ['Nội soi dạ dày gây mê', 'Nội soi đại tràng gây mê', 'Sinh thiết tế bào chẩn đoán', 'Cắt polyp trực tiếp'],
    doctors_list: [
      { name: 'TS.BS. Trần Minh Khoa', exp: '14 năm', rating: 4.8, reviews: 187 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'ngoai-khoa',
    name: 'Ngoại khoa',
    icon: '🔪',
    color: 'bg-rose-100 text-rose-700',
    doctors: 5,
    shortDesc: 'Khám chỉ định phẫu thuật và xử lý tiểu phẫu',
    fullDesc: 'Khám chẩn đoán các bệnh lý ngoại khoa như ruột thừa, sỏi mật, thoát vị bẹn, trĩ và thực hiện khâu vết thương rách da, xử lý u bã đậu, u nang bao hoạt dịch.',
    services: ['Tiểu phẫu u bã đậu', 'Khâu vết thương', 'Khám chỉ định phẫu thuật', 'Thay băng cắt chỉ'],
    doctors_list: [
      { name: 'TS.BS. Hoàng Văn Tuấn', exp: '17 năm', rating: 4.8, reviews: 203 },
      { name: 'BS.CK2 Nguyễn Đức Mạnh', exp: '13 năm', rating: 4.7, reviews: 167 }
    ]
  },
  {
    slug: 'goi-kham-khac',
    name: 'Gói khám khác ...',
    icon: '📋',
    color: 'bg-gray-100 text-gray-700',
    doctors: 4,
    shortDesc: 'Đăng ký các gói kiểm tra sức khỏe theo yêu cầu riêng',
    fullDesc: 'Thiết lập các danh mục kiểm tra sức khỏe đặc biệt hoặc theo yêu cầu doanh nghiệp, khám sức khỏe xin việc, đổi bằng lái xe hoặc đi học tập, lao động nước ngoài.',
    services: ['Khám sức khỏe lái xe', 'Khám tuyển dụng doanh nghiệp', 'Xét nghiệm chất gây nghiện', 'Cấp giấy chứng nhận sức khỏe'],
    doctors_list: [
      { name: 'BS.CK1 Lê Thị Hương', exp: '13 năm', rating: 4.7, reviews: 187 },
      { name: 'ThS.BS. Phạm Văn Đức', exp: '10 năm', rating: 4.6, reviews: 154 }
    ]
  },
  {
    slug: 'goi-kham-tam-soat-ung-thu-khac',
    name: 'Gói khám tầm soát ung thư khác ...',
    icon: '🔬',
    color: 'bg-red-50 text-red-700',
    doctors: 4,
    shortDesc: 'Các gói tầm soát ung thư bộ phận theo yêu cầu đặc biệt',
    fullDesc: 'Bao gồm gói tầm soát ung thư tuyến giáp, ung thư tiền liệt tuyến nâng cao, ung thư vòm họng bằng nội soi ống mềm NBI và chụp CT toàn thân đa lát cắt phát hiện khối u.',
    services: ['Chụp CT toàn thân tầm soát', 'Nội soi NBI tai mũi họng', 'Định lượng dấu ấn CA 125, CA 15-3', 'Siêu âm tuyến giáp doppler'],
    doctors_list: [
      { name: 'PGS.TS. Lê Thị Thu', exp: '19 năm', rating: 4.9, reviews: 231 },
      { name: 'TS.BS. Trần Minh Khoa', exp: '14 năm', rating: 4.8, reviews: 187 }
    ]
  },
  {
    slug: 'do-gang-suc-tim-mach-ho-hap',
    name: 'Đo gắng sức tim mạch - Hô hấp (CPET)',
    icon: '🫁',
    color: 'bg-orange-100 text-orange-700',
    doctors: 4,
    shortDesc: 'Đo lường thể lực, đánh giá dự trữ tim phổi gắng sức',
    fullDesc: 'Kỹ thuật đo gắng sức tim mạch - hô hấp (CPET) giúp đánh giá toàn diện khả năng gắng sức của cơ thể, chẩn đoán nguyên nhân khó thở không rõ nguồn gốc và theo dõi phục hồi tim phổi.',
    services: ['Nghiệm pháp thảm lăn gắng sức', 'Phân tích khí thở O2 & CO2', 'Đo ECG gắng sức liên tục', 'Đo SpO2 liên tục khi vận động'],
    doctors_list: [
      { name: 'GS.TS. Nguyễn Minh Tuấn', exp: '25 năm', rating: 4.9, reviews: 312 },
      { name: 'TS.BS. Lê Văn Hùng', exp: '18 năm', rating: 4.8, reviews: 198 }
    ]
  }
];

export default departments;