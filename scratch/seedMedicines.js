require("dotenv").config({ path: "c:/Users/ADMIN/Documents/GitHub/QL_benh_vien/backend/.env" });
const mongoose = require("mongoose");
const Medicine = require("c:/Users/ADMIN/Documents/GitHub/QL_benh_vien/backend/src/models/Medicine");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ql_benhvien";

const newMedicines = [
  {
    name: "Panadol Extra (Paracetamol + Caffeine)",
    category: "Chung",
    price: 3000,
    importPrice: 1800,
    quantity: 500,
    unit: "Viên",
    usage: "Uống 1-2 viên/lần khi đau đầu, đau răng hoặc sốt trên 38.5 độ C. Cách nhau ít nhất 4-6 tiếng.",
    ingredients: "Paracetamol 500mg, Caffeine 65mg",
    expiryDate: new Date("2028-12-31")
  },
  {
    name: "Gofen 400mg (Ibuprofen)",
    category: "Chung",
    price: 5000,
    importPrice: 3200,
    quantity: 300,
    unit: "Viên",
    usage: "Uống 1 viên sau khi ăn no khi bị đau răng, đau khớp hoặc đau vai gáy. Không uống lúc đói.",
    ingredients: "Ibuprofen 400mg",
    expiryDate: new Date("2028-10-15")
  },
  {
    name: "Clamoxyl 500mg (Amoxicillin)",
    category: "Chung",
    price: 4500,
    importPrice: 2800,
    quantity: 400,
    unit: "Viên",
    usage: "Uống 1 viên/lần x 2-3 lần/ngày theo chỉ định của bác sĩ. Dùng để điều trị nhiễm khuẩn tai mũi họng.",
    ingredients: "Amoxicillin Trihydrate 500mg",
    expiryDate: new Date("2027-08-20")
  },
  {
    name: "Cephalexin 500mg",
    category: "Chung",
    price: 3500,
    importPrice: 2000,
    quantity: 350,
    unit: "Viên",
    usage: "Uống theo đơn bác sĩ. Thường dùng 1 viên/lần x 2 lần/ngày để điều trị nhiễm khuẩn đường tiết niệu hoặc da.",
    ingredients: "Cephalexin 500mg",
    expiryDate: new Date("2028-03-12")
  },
  {
    name: "Zithromax 500mg (Azithromycin)",
    category: "Chung",
    price: 35000,
    importPrice: 24000,
    quantity: 150,
    unit: "Hộp 3 viên",
    usage: "Uống 1 viên/ngày vào trước bữa ăn 1 tiếng hoặc sau ăn 2 tiếng. Liệu trình thường kéo dài 3 ngày.",
    ingredients: "Azithromycin 500mg",
    expiryDate: new Date("2028-06-30")
  },
  {
    name: "Nexium Mups 40mg (Esomeprazole)",
    category: "Chung",
    price: 25000,
    importPrice: 18500,
    quantity: 250,
    unit: "Viên",
    usage: "Uống 1 viên trước ăn sáng 30 phút. Dùng cho người trào ngược dạ dày thực quản, loét dạ dày tá tràng.",
    ingredients: "Esomeprazole Magnesium 40mg",
    expiryDate: new Date("2028-11-25")
  },
  {
    name: "Lomaprazol 20mg (Omeprazole)",
    category: "Chung",
    price: 2000,
    importPrice: 1100,
    quantity: 600,
    unit: "Viên",
    usage: "Uống 1 viên trước khi ăn sáng 30 phút để giảm tiết acid dạ dày.",
    ingredients: "Omeprazole 20mg",
    expiryDate: new Date("2028-02-18")
  },
  {
    name: "Imodium 2mg (Loperamide)",
    category: "Chung",
    price: 4000,
    importPrice: 2200,
    quantity: 200,
    unit: "Viên",
    usage: "Uống 2 viên ngay sau lần đi tiêu lỏng đầu tiên, sau đó uống 1 viên sau mỗi lần đi tiêu lỏng. Không quá 8 viên/ngày.",
    ingredients: "Loperamide Hydrochloride 2mg",
    expiryDate: new Date("2028-07-14")
  },
  {
    name: "Berberin 100mg",
    category: "Chung",
    price: 120,
    importPrice: 70,
    quantity: 5000,
    unit: "Viên",
    usage: "Uống 4-6 viên/lần x 2 lần/ngày sau khi ăn. Trị viêm ruột, kiết lỵ, tiêu chảy cấp.",
    ingredients: "Berberine Hydrochloride 100mg",
    expiryDate: new Date("2029-01-01")
  },
  {
    name: "Zyrtec 10mg (Cetirizine)",
    category: "Chung",
    price: 8000,
    importPrice: 5500,
    quantity: 300,
    unit: "Viên",
    usage: "Uống 1 viên vào buổi tối trước khi đi ngủ. Có thể gây buồn ngủ nhẹ. Trị dị ứng, nghẹt mũi, mề đay.",
    ingredients: "Cetirizine Dihydrochloride 10mg",
    expiryDate: new Date("2028-09-09")
  },
  {
    name: "Telfast 180mg (Fexofenadine)",
    category: "Chung",
    price: 12000,
    importPrice: 8500,
    quantity: 250,
    unit: "Viên",
    usage: "Uống 1 viên/ngày với nước lọc. Dành cho người lớn và trẻ em trên 12 tuổi bị viêm mũi dị ứng nặng hoặc mề đay mãn tính.",
    ingredients: "Fexofenadine Hydrochloride 180mg",
    expiryDate: new Date("2028-04-05")
  },
  {
    name: "Amlor 5mg (Amlodipine)",
    category: "Chung",
    price: 11000,
    importPrice: 8200,
    quantity: 300,
    unit: "Viên",
    usage: "Uống 1 viên vào một khung giờ cố định trong ngày (thường là buổi sáng) để kiểm soát huyết áp.",
    ingredients: "Amlodipine Besylate 5mg",
    expiryDate: new Date("2028-05-19")
  },
  {
    name: "Cozaar 50mg (Losartan)",
    category: "Chung",
    price: 15000,
    importPrice: 11500,
    quantity: 180,
    unit: "Viên",
    usage: "Uống 1 viên/ngày theo chỉ định của bác sĩ tim mạch để hạ huyết áp.",
    ingredients: "Losartan Potassium 50mg",
    expiryDate: new Date("2028-08-30")
  },
  {
    name: "Glucophage 850mg (Metformin)",
    category: "Chung",
    price: 4500,
    importPrice: 3000,
    quantity: 600,
    unit: "Viên",
    usage: "Uống cùng hoặc ngay sau bữa ăn để giảm thiểu tác dụng phụ đường tiêu hóa. Dành cho bệnh nhân đái tháo đường tuýp 2.",
    ingredients: "Metformin Hydrochloride 850mg",
    expiryDate: new Date("2028-10-10")
  },
  {
    name: "Lipitor 20mg (Atorvastatin)",
    category: "Chung",
    price: 24000,
    importPrice: 17500,
    quantity: 200,
    unit: "Viên",
    usage: "Uống 1 viên vào buổi tối trước khi đi ngủ để hạ mỡ máu và ngăn ngừa xơ vữa động mạch.",
    ingredients: "Atorvastatin Calcium 20mg",
    expiryDate: new Date("2028-09-28")
  },
  {
    name: "Crestor 10mg (Rosuvastatin)",
    category: "Chung",
    price: 26000,
    importPrice: 19500,
    quantity: 200,
    unit: "Viên",
    usage: "Uống 1 viên/ngày vào bất kỳ lúc nào có ăn hoặc không ăn. Kiểm soát Cholesterol xấu trong máu.",
    ingredients: "Rosuvastatin Calcium 10mg",
    expiryDate: new Date("2028-12-15")
  },
  {
    name: "Singulair 10mg (Montelukast)",
    category: "Chung",
    price: 21000,
    importPrice: 15500,
    quantity: 150,
    unit: "Viên",
    usage: "Uống 1 viên vào buổi tối trước khi ngủ để dự phòng hen suyễn và giảm triệu chứng viêm mũi dị ứng.",
    ingredients: "Montelukast Sodium 10mg",
    expiryDate: new Date("2028-01-20")
  },
  {
    name: "Ventolin Inhaler 100mcg",
    category: "Chung",
    price: 95000,
    importPrice: 70000,
    quantity: 100,
    unit: "Bình xịt",
    usage: "Xịt họng 1-2 nhát khi có cơn co thắt phế quản, khó thở hoặc khò khè (cắt cơn hen suyễn).",
    ingredients: "Salbutamol Sulfate 100mcg/nhát xịt",
    expiryDate: new Date("2027-12-31")
  },
  {
    name: "Pharmaton Capsules",
    category: "Chung",
    price: 6000,
    importPrice: 4200,
    quantity: 400,
    unit: "Viên",
    usage: "Uống 1 viên/ngày sau bữa ăn sáng. Giúp giảm mệt mỏi, suy nhược cơ thể và bổ sung Vitamin khoáng chất.",
    ingredients: "Nhân sâm G115, Vitamin A, B, C, D, E, Zinc, Sắt, Canxi",
    expiryDate: new Date("2028-06-01")
  },
  {
    name: "Calcium Corbiere 10ml (Dạng ống)",
    category: "Chung",
    price: 8000,
    importPrice: 5800,
    quantity: 500,
    unit: "Ống",
    usage: "Bẻ 2 đầu ống và uống trực tiếp. Trẻ em: 1 ống/ngày. Người lớn: 1-2 ống/ngày vào buổi sáng hoặc trưa.",
    ingredients: "Calcium Glucoheptonate, Vitamin C, Vitamin PP",
    expiryDate: new Date("2027-09-30")
  },
  {
    name: "Acemuc 200mg (Thuốc ho long đờm)",
    category: "Chung",
    price: 3200,
    importPrice: 2100,
    quantity: 600,
    unit: "Gói bột",
    usage: "Hòa tan gói bột vào 50ml nước ấm. Uống 1 gói/lần x 3 lần/ngày để làm lỏng chất nhầy trong phế quản.",
    ingredients: "Acetylcysteine 200mg",
    expiryDate: new Date("2028-02-28")
  },
  {
    name: "Strepsils Cool (Viên ngậm đau họng)",
    category: "Chung",
    price: 3500,
    importPrice: 2000,
    quantity: 1000,
    unit: "Viên",
    usage: "Ngậm tan từ từ trong miệng khi bị rát họng, đau họng. Cách 2-3 tiếng ngậm 1 viên. Tối đa 12 viên/ngày.",
    ingredients: "Dichlorobenzyl Alcohol, Amylmetacresol, Menthol",
    expiryDate: new Date("2028-05-15")
  },
  {
    name: "Smecta 3g (Trị tiêu chảy)",
    category: "Chung",
    price: 5500,
    importPrice: 3800,
    quantity: 300,
    unit: "Gói bột",
    usage: "Hòa tan gói bột vào khoảng 50ml nước lọc. Uống sau ăn ở người lớn bị viêm loét đường ruột hoặc bất kỳ lúc nào bị tiêu chảy cấp.",
    ingredients: "Diosmectite 3g",
    expiryDate: new Date("2028-03-25")
  },
  {
    name: "Medrol 16mg (Kháng viêm Corticoid)",
    category: "Chung",
    price: 12000,
    importPrice: 8500,
    quantity: 150,
    unit: "Viên",
    usage: "Uống 1 lần vào buổi sáng sau khi ăn no theo chỉ dẫn của bác sĩ. Không tự ý ngưng thuốc đột ngột.",
    ingredients: "Methylprednisolone 16mg",
    expiryDate: new Date("2028-07-20")
  },
  {
    name: "Motilium-M 10mg (Trị đầy hơi, buồn nôn)",
    category: "Chung",
    price: 4500,
    importPrice: 2900,
    quantity: 300,
    unit: "Viên",
    usage: "Uống 1 viên trước bữa ăn 15-30 phút để giảm triệu chứng buồn nôn, khó tiêu hoặc đầy bụng.",
    ingredients: "Domperidone Maleate 10mg",
    expiryDate: new Date("2028-04-12")
  },
  {
    name: "Tanakan 40mg (Ginkgo Biloba)",
    category: "Chung",
    price: 6500,
    importPrice: 4800,
    quantity: 450,
    unit: "Viên",
    usage: "Uống 1 viên/lần x 3 lần/ngày vào các bữa ăn chính. Giúp tăng cường tuần hoàn máu não, giảm chóng mặt và ù tai.",
    ingredients: "Cao lá Ginkgo Biloba chuẩn hóa 40mg",
    expiryDate: new Date("2028-10-30")
  },
  {
    name: "Eugica (Viên nang mềm trị ho)",
    category: "Chung",
    price: 1500,
    importPrice: 900,
    quantity: 1000,
    unit: "Viên",
    usage: "Uống 1-2 viên/lần x 3 lần/ngày để làm giảm nhanh cơn ho khan, ho gió hoặc khản tiếng.",
    ingredients: "Eucalyptol, Tinh dầu tràm, Tinh dầu gừng, Menthol",
    expiryDate: new Date("2028-11-11")
  },
  {
    name: "Betadine 10% 125ml (Sát khuẩn ngoài da)",
    category: "Chung",
    price: 85000,
    importPrice: 62000,
    quantity: 80,
    unit: "Chai",
    usage: "Bôi trực tiếp lên vùng da bị tổn thương hoặc vết thương hở để sát trùng vết thương, phòng ngừa nhiễm trùng.",
    ingredients: "Povidone Iodine 10%",
    expiryDate: new Date("2027-10-01")
  },
  {
    name: "Oresol Bù Nước & Điện Giải",
    category: "Chung",
    price: 2500,
    importPrice: 1500,
    quantity: 1000,
    unit: "Gói",
    usage: "Pha toàn bộ 1 gói vào đúng 1 lít nước đun sôi để nguội. Uống rải rác cả ngày khi bị sốt cao, tiêu chảy hoặc vận động ra nhiều mồ hôi.",
    ingredients: "Glucose khan, Natri clorid, Kali clorid, Natri citrate",
    expiryDate: new Date("2029-05-30")
  },
  {
    name: "Decolgen Forte (Trị cảm cúm)",
    category: "Chung",
    price: 2000,
    importPrice: 1200,
    quantity: 800,
    unit: "Viên",
    usage: "Uống 1-2 viên/lần x 3-4 lần/ngày để điều trị các triệu chứng nhức đầu, sổ mũi, hắt hơi do cảm cúm.",
    ingredients: "Paracetamol 500mg, Phenylephrine 10mg, Chlorpheniramine 2mg",
    expiryDate: new Date("2028-09-15")
  }
];

const seedMedicines = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Seeding Medicines...");

    console.log("Deleting old medicines...");
    await Medicine.deleteMany({});

    console.log("Inserting new Western Medicines...");
    await Medicine.insertMany(newMedicines);

    console.log("Medicines seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding medicines:", error);
    process.exit(1);
  }
};

seedMedicines();
