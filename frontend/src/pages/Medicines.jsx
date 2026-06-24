import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X, Calendar, DollarSign, Package, AlertTriangle } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: '',
    category: 'Thuốc giảm đau, hạ sốt',
    price: '',
    quantity: '',
    unit: '',
    usage: '',
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
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.append('search', search.trim());
      if (category !== 'Tất cả') queryParams.append('category', category);

      const response = await fetch(`${API_BASE_URL}/api/medicines?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách thuốc:', error);
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
        expiryDate: new Date(medicine.expiryDate).toISOString().split('T')[0],
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

      const data = await response.json();

      if (response.ok) {
        alert(editingMedicine ? 'Cập nhật thuốc thành công!' : 'Thêm thuốc mới thành công!');
        fetchMedicines();
        handleCloseModal();
      } else {
        alert(data.message || 'Có lỗi xảy ra.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu thuốc:', error);
      alert('Lỗi kết nối.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc "${name}"?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/medicines/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Xóa thuốc thành công!');
          setMedicines(medicines.filter(m => m._id !== id));
        } else {
          alert('Có lỗi xảy ra khi xóa thuốc.');
        }
      } catch (error) {
        console.error('Lỗi khi xóa thuốc:', error);
        alert('Lỗi kết nối.');
      }
    }
  };

  return (
    <div className="p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Kho thuốc</h2>
          <p className="text-gray-500 text-sm mt-1">Lưu trữ, kiểm kê và quản lý danh mục thuốc ({medicines.length} loại)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#004e92] hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          Thêm thuốc mới
        </button>
      </div>

      {/* Thanh tìm kiếm & Tabs lọc */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm tên thuốc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] focus:border-transparent text-sm transition-all"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#004e92] text-white shadow-md shadow-blue-500/20' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12">#</th>
                <th className="p-4">Tên thuốc & Nhóm</th>
                <th className="p-4">Đơn vị</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Tồn kho</th>
                <th className="p-4">Hạn sử dụng</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-500">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-3 h-3 bg-[#004e92] rounded-full animate-ping" />
                      <span>Đang tải kho thuốc...</span>
                    </div>
                  </td>
                </tr>
              ) : medicines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-500">
                    Không tìm thấy thuốc nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                medicines.map((item, index) => {
                  const isLowStock = item.quantity < 15;
                  return (
                    <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-xs text-blue-600 mt-0.5">{item.category}</div>
                        {item.usage && <div className="text-xs text-gray-500 mt-1 italic">HD: {item.usage}</div>}
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{item.unit}</td>
                      <td className="p-4 font-semibold text-gray-800 flex items-center gap-1 mt-2">
                        <DollarSign size={14} className="text-gray-400" />
                        {item.price.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          isLowStock ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-100 text-green-700'
                        }`}>
                          {isLowStock ? <AlertTriangle size={12} /> : <Package size={12} />}
                          {item.quantity} {item.quantity === 0 ? '(Hết hàng)' : ''}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa thông tin"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa thuốc"
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
      </div>

      {/* Modal Thêm / Sửa Thuốc */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 animate-scaleUp">
            <div className="bg-gradient-to-r from-[#004e92] to-[#000428] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingMedicine ? 'Cập nhật thông tin thuốc' : 'Thêm thuốc mới'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-white hover:text-red-300 transition-colors focus:outline-none"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Tên thuốc *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Paracetamol 500mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Nhóm thuốc *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] text-sm cursor-pointer"
                >
                  {categories.filter(c => c !== 'Tất cả').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Giá bán (VND) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="VD: 25000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="VD: 200"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Đơn vị tính *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Hộp 10 vỉ x 10 viên"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Ngày hết hạn *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] text-sm cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Hướng dẫn sử dụng</label>
                <textarea
                  rows="3"
                  placeholder="VD: Uống 1-2 viên/lần khi sốt trên 38.5 độ C..."
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004e92] text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#004e92] hover:bg-blue-800 text-white rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : editingMedicine ? 'Cập nhật' : 'Thêm mới'}
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
