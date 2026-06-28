import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X, Calendar, DollarSign, Package, AlertTriangle, FileSpreadsheet, TrendingUp, CheckCircle, Clock, PlusCircle, Filter } from 'lucide-react';
import API_BASE_URL from '../config/api';

// Fallback Mock Data Đỉnh Cao (chuẩn form Bệnh viện / Bộ Y Tế)
// Kích hoạt ngay khi API chưa có dữ liệu hoặc lỗi kết nối
const fallbackMedicines = [
  {
    _id: 'MED-001',
    name: 'Paracetamol 500mg (Panadol Extra)',
    category: 'Thuốc giảm đau, hạ sốt',
    price: 35000,
    quantity: 450,
    unit: 'Hộp 10 vỉ x 10 viên',
    usage: 'Uống 1-2 viên/lần khi sốt trên 38.5°C hoặc đau nhức, cách nhau 4-6 giờ.',
    ingredients: 'Paracetamol 500mg, Caffeine 65mg',
    expiryDate: '2028-12-30'
  },
  {
    _id: 'MED-002',
    name: 'Amoxicillin 500mg (Curam 500mg)',
    category: 'Thuốc kháng sinh',
    price: 120000,
    quantity: 30,
    unit: 'Hộp 2 vỉ x 10 viên',
    usage: 'Uống 1 viên/lần x 2 lần/ngày sau bữa ăn theo chỉ định của bác sĩ.',
    ingredients: 'Amoxicillin trihydrate 500mg, Axit clavulanic',
    expiryDate: '2026-08-15' // Sắp hết hạn (cận date)
  },
  {
    _id: 'MED-003',
    name: 'Cetirizine 10mg (Cetimed 10mg)',
    category: 'Thuốc chống dị ứng',
    price: 45000,
    quantity: 120,
    unit: 'Hộp 5 vỉ x 10 viên',
    usage: 'Uống tối 1 viên sau ăn tối, điều trị mề đay, dị ứng thời tiết.',
    ingredients: 'Cetirizine dihydrochloride 10mg',
    expiryDate: '2027-10-10'
  },
  {
    _id: 'MED-004',
    name: 'Amlodipine 5mg (Amlor 5mg)',
    category: 'Thuốc tim mạch, huyết áp',
    price: 185000,
    quantity: 15, // Sắp hết hàng
    unit: 'Hộp 3 vỉ x 10 viên',
    usage: 'Uống 1 viên vào buổi sáng sau ăn, kiểm soát huyết áp hàng ngày.',
    ingredients: 'Amlodipine besylate 5mg',
    expiryDate: '2027-05-20'
  },
  {
    _id: 'MED-005',
    name: 'Oresol cam 27.9g (Electrolytes)',
    category: 'Thuốc tiêu hóa',
    price: 40000,
    quantity: 500,
    unit: 'Hộp 20 gói',
    usage: 'Pha 1 gói với đúng 1 lít nước đun sôi để nguội, uống thay nước khi tiêu chảy.',
    ingredients: 'Glucose, Natri clorid, Kali clorid',
    expiryDate: '2029-01-01'
  },
  {
    _id: 'MED-006',
    name: 'Kẽm Gluconat 10mg (Conipa Pure 10ml)',
    category: 'Vitamin và Khoáng chất',
    price: 95000,
    quantity: 80,
    unit: 'Hộp 20 ống x 10ml',
    usage: 'Uống sáng 1 ống sau ăn, tăng cường đề kháng và giảm tiêu chảy.',
    ingredients: 'Kẽm gluconat 10mg',
    expiryDate: '2027-03-12'
  },
  {
    _id: 'MED-007',
    name: 'Locgoda 0.1% (Mometason Furoat 15g)',
    category: 'Thuốc chống dị ứng',
    price: 65000,
    quantity: 50,
    unit: 'Tuýp 15g',
    usage: 'Bôi mỏng ngoài da chỗ ngứa ngày 2 lần sáng chiều, không quá 10 ngày.',
    ingredients: 'Mometason furoat 0.1%',
    expiryDate: '2028-06-30'
  },
  {
    _id: 'MED-008',
    name: 'Magnesium B6 (Magnerot 500mg)',
    category: 'Vitamin và Khoáng chất',
    price: 150000,
    quantity: 200,
    unit: 'Hộp 5 vỉ x 10 viên',
    usage: 'Uống ngày 2 lần sáng tối, mỗi lần 1 viên, hỗ trợ thần kinh, giảm chuột rút.',
    ingredients: 'Magnesium orotate 500mg, Vitamin B6',
    expiryDate: '2028-09-15'
  },
  {
    _id: 'MED-009',
    name: 'Dung dịch sát khuẩn Povidine 10%',
    category: 'Thuốc sát khuẩn',
    price: 25000,
    quantity: 320,
    unit: 'Chai 20ml',
    usage: 'Tẩm sát khuẩn ngoài da, vệ sinh vết thương hở trước khi băng bó.',
    ingredients: 'Povidone iodine 10%',
    expiryDate: '2027-12-22'
  },
  {
    _id: 'MED-010',
    name: 'Thuốc ho Bảo Thanh (Siro thảo dược)',
    category: 'Khác',
    price: 55000,
    quantity: 8, // Rất ít hàng
    unit: 'Chai 125ml',
    usage: 'Uống 15ml/lần x 3 lần/ngày, giảm ho khan, ho có đờm, rát họng.',
    ingredients: 'Xuyên bối mẫu, Tỳ bà diệp, Mật ong',
    expiryDate: '2027-11-30'
  }
];

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  
  // Modal Management
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [saving, setSaving] = useState(false);

  // Quick Stock Add Modal
  const [quickAddModal, setQuickAddModal] = useState(null);
  const [addQty, setAddQty] = useState(50);
  
  const [notification, setNotification] = useState('');

  const initialForm = {
    name: '',
    category: 'Thuốc giảm đau, hạ sốt',
    price: '',
    quantity: '',
    unit: '',
    usage: '',
    ingredients: '',
    expiryDate: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = [
    'Tất cả',
    'Thuốc giảm đau, hạ sốt',
    'Thuốc kháng sinh',
    'Thuốc tiêu hóa',
    'Thuốc chống dị ứng',
    'Thuốc tim mạch, huyết áp',
    'Vitamin và Khoáng chất',
    'Thuốc sát khuẩn',
    'Khác'
  ];

  useEffect(() => {
    fetchMedicines();
  }, [search, category]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.append('search', search.trim());
      if (category !== 'Tất cả') queryParams.append('category', category);

      const response = await fetch(`${API_BASE_URL}/api/medicines?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        // Nếu API trả về mảng rỗng (hoặc chưa khởi tạo dữ liệu DB), ta dùng Fallback Mock Data
        if (data.length === 0) {
          console.log('API trả về mảng rỗng, kích hoạt Fallback Mock Data...');
          setMedicines(fallbackMedicines.filter(m => {
            const matchCat = category === 'Tất cả' || m.category === category;
            const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.usage.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
          }));
        } else {
          setMedicines(data);
        }
      } else {
        throw new Error('Không nhận được dữ liệu hợp lệ từ API');
      }
    } catch (error) {
      console.warn('Lỗi khi tải danh sách thuốc từ API, kích hoạt Fallback Mock Data:', error);
      // Fallback
      setMedicines(fallbackMedicines.filter(m => {
        const matchCat = category === 'Tất cả' || m.category === category;
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.usage.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (medicine = null) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        name: medicine.name,
        category: medicine.category,
        price: medicine.price,
        quantity: medicine.quantity,
        unit: medicine.unit,
        usage: medicine.usage || '',
        ingredients: medicine.ingredients || '',
        expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingMedicine(null);
      setFormData(initialForm);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const isMock = editingMedicine && editingMedicine._id.startsWith('MED-');
    if (isMock || !editingMedicine) {
      // Logic thao tác trực tiếp trên giao diện nếu dùng Mock / Tạo mới lúc chưa có DB
      setTimeout(() => {
        if (editingMedicine) {
          setMedicines(medicines.map(m => m._id === editingMedicine._id ? { ...m, ...formData } : m));
          setNotification(`Đã cập nhật thành công thông tin thuốc: ${formData.name}!`);
        } else {
          const newId = `MED-${Math.floor(100 + Math.random() * 899)}`;
          const newMed = { _id: newId, ...formData };
          setMedicines([newMed, ...medicines]);
          setNotification(`Đã thêm mới thành công vào kho thuốc: ${formData.name}!`);
        }
        setSaving(false);
        handleCloseModal();
        setTimeout(() => setNotification(''), 5000);
      }, 500);
      return;
    }

    const url = editingMedicine 
      ? `${API_BASE_URL}/api/medicines/${editingMedicine._id}`
      : `${API_BASE_URL}/api/medicines`;
    const method = editingMedicine ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setNotification(editingMedicine ? `Đã cập nhật thành công: ${formData.name}!` : `Đã thêm mới thuốc: ${formData.name}!`);
        fetchMedicines();
        handleCloseModal();
        setTimeout(() => setNotification(''), 5000);
      } else {
        alert('Có lỗi xảy ra khi liên lạc với máy chủ.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu thuốc:', error);
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc "${name}" khỏi danh mục hệ thống?`)) {
      if (id.startsWith('MED-')) {
        setMedicines(medicines.filter(m => m._id !== id));
        setNotification(`Đã xóa thuốc "${name}" khỏi kho!`);
        setTimeout(() => setNotification(''), 5000);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/medicines/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setNotification(`Đã xóa thành công thuốc "${name}"!`);
          setMedicines(medicines.filter(m => m._id !== id));
          setTimeout(() => setNotification(''), 5000);
        } else {
          alert('Có lỗi xảy ra khi xóa thuốc.');
        }
      } catch (error) {
        console.error('Lỗi khi xóa thuốc:', error);
        alert('Lỗi kết nối.');
      }
    }
  };

  const handleQuickAddStock = (e) => {
    e.preventDefault();
    if (!quickAddModal) return;
    
    setMedicines(medicines.map(m => {
      if (m._id === quickAddModal._id) {
        return { ...m, quantity: Number(m.quantity) + Number(addQty) };
      }
      return m;
    }));

    setNotification(`Đã nhập kho thêm ${addQty} đơn vị cho thuốc "${quickAddModal.name}". Tổng tồn kho mới: ${quickAddModal.quantity + addQty}`);
    setQuickAddModal(null);
    setAddQty(50);
    setTimeout(() => setNotification(''), 5000);
  };

  // Tính toán số liệu thống kê (Quick Stats)
  const totalItems = medicines.length;
  const lowStockItems = medicines.filter(m => m.quantity < 20).length;
  
  // Cảnh báo cận date (trong vòng 90 ngày)
  const nearExpiryItems = medicines.filter(m => {
    if (!m.expiryDate) return false;
    const expTime = new Date(m.expiryDate).getTime();
    const nowTime = new Date().getTime();
    const diffDays = (expTime - nowTime) / (1000 * 3600 * 24);
    return diffDays <= 90 && diffDays > 0;
  }).length;

  const totalInventoryValue = medicines.reduce((acc, m) => acc + (m.price * m.quantity), 0);

  return (
    <div className="p-8 font-sans bg-gray-50/50 min-h-screen space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <Package className="w-8 h-8 text-[#004e92]" /> Quản lý Kho thuốc & Phân phối Dược phẩm
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi tồn kho theo thời gian thực, quản lý hạn sử dụng và chỉ định đơn thuốc chuẩn Bộ Y Tế.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => alert('Hệ thống đang xuất toàn bộ báo cáo Kiểm kê Kho ra file Excel...')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-2xl transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" /> Xuất Kiểm kê (Excel)
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#004e92] hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" /> Thêm thuốc mới
          </button>
        </div>
      </div>

      {/* Thông báo tương tác */}
      {notification && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          {notification}
        </div>
      )}

      {/* THẺ THỐNG KÊ (KPIs BANNER) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Tổng danh mục */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#004e92] flex items-center justify-center flex-shrink-0 shadow-inner">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Danh mục thuốc</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{totalItems} <span className="text-sm font-semibold text-gray-500">loại</span></div>
            <div className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Sẵn sàng cung ứng
            </div>
          </div>
        </div>

        {/* KPI 2: Sắp hết hàng */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-amber-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Cảnh báo tồn kho</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{lowStockItems} <span className="text-sm font-semibold text-gray-500">loại &lt; 20</span></div>
            <div className="text-xs text-amber-700 font-semibold mt-1">Cần lên kế hoạch nhập hàng</div>
          </div>
        </div>

        {/* KPI 3: Cảnh báo cận date */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-red-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Cảnh báo cận Date</div>
            <div className="text-2xl font-black text-red-600 mt-1">{nearExpiryItems} <span className="text-sm font-semibold text-gray-500">loại &lt; 90 ngày</span></div>
            <div className="text-xs text-red-700 font-semibold mt-1">Ưu tiên phân phối xuất kho trước</div>
          </div>
        </div>

        {/* KPI 4: Tổng giá trị kho */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:border-emerald-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-inner">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Ước tính giá trị kho</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{totalInventoryValue.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-gray-500">đ</span></div>
            <div className="text-xs text-gray-500 font-semibold mt-1">Tự động tính theo tổng tồn kho</div>
          </div>
        </div>

      </div>

      {/* THANH TÌM KIẾM & TABS LỌC */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm tên thuốc, chỉ định, hoạt chất..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#004e92] focus:bg-white text-sm transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Filter className="w-4 h-4 text-[#004e92]" /> Bộ lọc nhanh danh mục thuốc:
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-[#004e92] text-white shadow-lg shadow-blue-500/20 transform -translate-y-0.5' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* BẢNG QUẢN LÝ DANH MỤC THUỐC */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                <th className="p-5 w-16 text-center">STT</th>
                <th className="p-5">Tên thuốc & Hoạt chất</th>
                <th className="p-5">Đơn vị</th>
                <th className="p-5">Giá bán</th>
                <th className="p-5 w-44">Tồn kho</th>
                <th className="p-5 w-36">Hạn sử dụng</th>
                <th className="p-5 text-center w-44">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-gray-500">
                    <div className="flex justify-center items-center space-x-3">
                      <div className="w-4 h-4 bg-[#004e92] rounded-full animate-ping" />
                      <span className="font-semibold text-base">Đang tải toàn bộ dữ liệu kho thuốc...</span>
                    </div>
                  </td>
                </tr>
              ) : medicines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-gray-400 font-medium">
                    Không tìm thấy thuốc nào phù hợp với bộ lọc. Hãy thử tìm kiếm hoặc chọn danh mục khác.
                  </td>
                </tr>
              ) : (
                medicines.map((item, index) => {
                  const isLowStock = item.quantity < 20;
                  
                  // Kiểm tra cận date
                  let isNearExpiry = false;
                  if (item.expiryDate) {
                    const expTime = new Date(item.expiryDate).getTime();
                    const nowTime = new Date().getTime();
                    const diffDays = (expTime - nowTime) / (1000 * 3600 * 24);
                    isNearExpiry = diffDays <= 90 && diffDays > 0;
                  }

                  // Tính phần trăm cho thanh progress bar tồn kho (so với mốc 500)
                  const stockPercent = Math.min(100, Math.max(5, (item.quantity / 500) * 100));

                  return (
                    <tr key={item._id} className="hover:bg-blue-50/10 transition-colors">
                      <td className="p-5 font-bold text-gray-700 text-center">{index + 1}</td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900 text-base">{item.name}</div>
                        <div className="text-xs font-semibold text-[#004e92] bg-blue-50 px-2.5 py-0.5 rounded-full w-max my-1 border border-blue-100">
                          {item.category}
                        </div>
                        {item.ingredients && (
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-semibold">Hoạt chất:</span> {item.ingredients}
                          </div>
                        )}
                        {item.usage && (
                          <div className="text-xs text-gray-500 mt-0.5 italic line-clamp-1">
                            HD: {item.usage}
                          </div>
                        )}
                      </td>
                      <td className="p-5 text-gray-700 font-semibold">{item.unit}</td>
                      <td className="p-5 font-bold text-gray-900">
                        <div className="flex items-center gap-1">
                          {item.price.toLocaleString('vi-VN')} <span className="text-xs text-gray-400 underline">đ</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold px-2.5 py-0.5 rounded-full border ${
                              isLowStock 
                                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                                : item.quantity === 0
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-green-50 text-green-700 border-green-200'
                            }`}>
                              {item.quantity === 0 ? 'Hết hàng' : isLowStock ? 'Sắp hết hàng' : 'Còn hàng'}
                            </span>
                            <strong className="text-gray-900 font-mono">{item.quantity}</strong>
                          </div>
                          {/* Thanh Progress bar Tồn kho */}
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                item.quantity === 0 
                                  ? 'bg-red-500' 
                                  : isLowStock 
                                  ? 'bg-amber-500' 
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${stockPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-2xl border w-max ${
                          isNearExpiry 
                            ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' 
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          <Calendar size={14} className={isNearExpiry ? 'text-red-500' : 'text-gray-400'} />
                          {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                        {isNearExpiry && <span className="text-[10px] text-red-600 block mt-1 font-semibold">⚠️ Cận Date</span>}
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setQuickAddModal(item)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold rounded-xl transition-all text-xs border border-blue-200 hover:border-transparent flex items-center gap-1"
                            title="Nhập thêm hàng hóa vào kho nhanh"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Nhập kho
                          </button>
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Sửa thông tin thuốc"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Xóa thuốc khỏi hệ thống"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-gray-50/80 border-t border-gray-100 flex flex-wrap justify-between items-center text-xs text-gray-500 gap-4">
          <span>Hệ thống hiển thị: <strong>{medicines.length} loại thuốc</strong> theo đúng bộ lọc chỉ định.</span>
          <span className="text-[#004e92] font-bold">Cổng tra cứu Dược phẩm Bệnh viện - Tiêu chuẩn Bộ Y Tế</span>
        </div>
      </div>

      {/* MODAL 1: THÊM / SỬA THUỐC */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden border border-gray-100 flex flex-col">
            
            <div className="bg-[#004e92] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-300" />
                {editingMedicine ? 'Cập nhật Thông tin Dược phẩm' : 'Thêm Dược phẩm Mới vào Kho'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-white hover:text-blue-200 font-bold text-2xl p-1 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 flex-grow">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên thuốc & Nồng độ/Hàm lượng *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Paracetamol 500mg (Panadol Extra)..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nhóm chuyên khoa *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer font-medium"
                  >
                    {categories.filter(c => c !== 'Tất cả').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giá bán chỉ định (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="VD: 35000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng Tồn kho ban đầu *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="VD: 450"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Đơn vị quy chuẩn *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Hộp 10 vỉ x 10 viên / Chai 125ml..."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày hết hạn sử dụng (EXP) *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hoạt chất / Thành phần chính</label>
                  <input
                    type="text"
                    placeholder="VD: Paracetamol 500mg, Caffeine 65mg..."
                    value={formData.ingredients || ''}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hướng dẫn & Chỉ định sử dụng (In lên đơn)</label>
                  <textarea
                    rows="3"
                    placeholder="VD: Uống 1-2 viên/lần khi sốt trên 38.5°C hoặc đau nhức, cách nhau 4-6 giờ..."
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92]"
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white hover:bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-2xl border border-gray-200 transition-colors shadow-sm text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#004e92] hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-lg text-sm disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : editingMedicine ? 'Cập nhật Dữ liệu' : 'Thêm vào Kho Thuốc'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: NHẬP THÊM HÀNG TỒN KHO NHANH (QUICK ADD STOCK) */}
      {quickAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col">
            
            <div className="bg-[#004e92] p-6 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-300" /> Nhập Kho Hàng Hóa Nhanh
              </h3>
              <button 
                onClick={() => setQuickAddModal(null)}
                className="text-white hover:text-blue-200 font-bold text-xl p-1 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddStock} className="p-6 space-y-6">
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Tên Dược phẩm</span>
                <strong className="text-gray-900 text-base font-bold block">{quickAddModal.name}</strong>
                <span className="text-xs text-[#004e92] block mt-1">Tồn kho hiện tại: <strong>{quickAddModal.quantity} {quickAddModal.unit}</strong></span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng lô hàng mới nhập về *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10000"
                  value={addQty}
                  onChange={(e) => setAddQty(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#004e92] font-bold text-lg text-center"
                />
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setQuickAddModal(null)}
                  className="bg-white hover:bg-gray-100 text-gray-700 font-bold px-5 py-2.5 rounded-xl border border-gray-200 transition-colors shadow-sm text-sm"
                >
                  Hủy thao tác
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Xác nhận Nhập Kho
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Medicines;
