import { useState, useContext, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Save, Key, UserCheck, CreditCard, MapPin, Briefcase, Users, FileText } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_BASE_URL from '../config/api';

const Profile = () => {
  const { user, login, token } = useContext(AuthContext);
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [bhytCode, setBhytCode] = useState(user?.bhytCode || '');
  const [idCard, setIdCard] = useState(user?.idCard || '');
  const [guarantorName, setGuarantorName] = useState(user?.guarantorName || '');
  const [guarantorPhone, setGuarantorPhone] = useState(user?.guarantorPhone || '');
  const [guarantorIdCard, setGuarantorIdCard] = useState(user?.guarantorIdCard || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [ethnicity, setEthnicity] = useState(user?.ethnicity || 'Kinh');
  const [country, setCountry] = useState(user?.country || 'Việt Nam');
  const [province, setProvince] = useState(user?.province || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [ward, setWard] = useState(user?.ward || '');
  const [address, setAddress] = useState(user?.address || '');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setGender(user.gender || '');
      setBirthDate(user.birthDate || '');
      setBhytCode(user.bhytCode || '');
      setIdCard(user.idCard || '');
      setGuarantorName(user.guarantorName || '');
      setGuarantorPhone(user.guarantorPhone || '');
      setGuarantorIdCard(user.guarantorIdCard || '');
      setOccupation(user.occupation || '');
      setEthnicity(user.ethnicity || 'Kinh');
      setCountry(user.country || 'Việt Nam');
      setProvince(user.province || '');
      setDistrict(user.district || '');
      setWard(user.ward || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id || user._id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName,
          phone,
          gender,
          birthDate,
          bhytCode,
          idCard,
          guarantorName,
          guarantorPhone,
          guarantorIdCard,
          occupation,
          ethnicity,
          country,
          province,
          district,
          ward,
          address
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg('Đã cập nhật thông tin hồ sơ thành công!');
        login({ ...user, ...data.user, id: user.id || user._id }, token); // Cập nhật AuthContext
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setErrorMsg(data.message || 'Có lỗi xảy ra khi cập nhật.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Banner */}
      <div className="bg-[#004e92] text-white py-12 px-4 sm:px-8 shadow-inner">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-wide uppercase flex items-center gap-3">
              <UserCheck className="w-9 h-9 text-blue-300" /> Quản lý tài khoản & BHYT
            </h1>
            <p className="text-blue-100 text-base mt-2 max-w-xl">
              Cập nhật thông tin định danh cá nhân, thẻ Bảo hiểm y tế (BHYT) và thông tin liên hệ bảo lãnh.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#004e92] flex items-center justify-center font-bold text-xl shadow-lg">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Tài khoản</div>
              <div className="text-lg font-bold text-white">{user?.phone || 'Chưa có SĐT'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Thẻ BHYT Mockup */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-400/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              
              <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-yellow-300" />
                  <span className="font-bold text-sm tracking-wider uppercase">Thẻ Bảo Hiểm Y Tế</span>
                </div>
                <span className="text-xs bg-yellow-300 text-blue-900 font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  Hoạt động
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider font-medium">Mã số thẻ BHYT</div>
                  <div className="text-xl font-mono font-bold tracking-wider text-yellow-300 mt-0.5">
                    {bhytCode || 'CHƯA CẬP NHẬT'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-medium">Họ và tên</div>
                    <div className="font-bold text-base text-white mt-0.5 truncate">{fullName || 'Người dùng mới'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-medium">Ngày sinh</div>
                    <div className="font-bold text-base text-white mt-0.5">{birthDate ? birthDate.split('-').reverse().join('/') : 'CHƯA CẬP NHẬT'}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
                  <span>Bệnh viện ĐK Hợp lệ</span>
                  <span className="font-bold">BV Nhân Dân</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#004e92]" /> Bảo mật tài khoản
              </h3>
              <p className="text-xs text-gray-600">
                Mật khẩu của bạn đã được mã hóa an toàn trên máy chủ. Bạn có thể đổi mật khẩu mới nếu muốn.
              </p>
              <button 
                onClick={() => alert('Đang chuyển hướng sang trang Đổi Mật Khẩu...')}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Key className="w-4 h-4 text-gray-500" /> Đổi mật khẩu tài khoản
              </button>
            </div>
          </div>

          {/* Cột phải: Form chỉnh sửa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#004e92]" /> Cập nhật thông tin chi tiết
              </h2>

              {successMsg && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fadeIn shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fadeIn shadow-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* Khối: Thông tin cá nhân */}
                <div>
                  <h3 className="text-md font-bold text-[#004e92] mb-4 uppercase tracking-wider text-xs">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input type="text" placeholder="Họ và tên (Bắt buộc)" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="tel" disabled value={user?.phone || ''} className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed" title="Số điện thoại đăng nhập không thể đổi" />
                    </div>
                    <div>
                      <input type="date" placeholder="Ngày sinh" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div className="flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                      <label className="mr-4 text-gray-600">Giới tính:</label>
                      <label className="mr-4 flex items-center cursor-pointer">
                        <input type="radio" name="gender" value="Nam" checked={gender === 'Nam'} onChange={(e) => setGender(e.target.value)} className="mr-1" /> Nam
                      </label>
                      <label className="mr-4 flex items-center cursor-pointer">
                        <input type="radio" name="gender" value="Nữ" checked={gender === 'Nữ'} onChange={(e) => setGender(e.target.value)} className="mr-1" /> Nữ
                      </label>
                    </div>
                    <div>
                      <input type="text" placeholder="Nhập số CCCD hoặc mã định danh cá nhân" value={idCard} onChange={(e) => setIdCard(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="text" placeholder="Mã số Bảo hiểm Y tế (BHYT)" value={bhytCode} onChange={(e) => setBhytCode(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="text" placeholder="Nghề nghiệp" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="text" placeholder="Dân tộc (VD: Kinh)" value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                  </div>
                </div>

                {/* Khối: Người bảo lãnh */}
                <div>
                  <h3 className="text-md font-bold text-[#004e92] mb-4 uppercase tracking-wider text-xs">Thông tin Người bảo lãnh</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input type="text" placeholder="Tên người bảo lãnh (Bắt buộc nếu dưới 16 tuổi)" value={guarantorName} onChange={(e) => setGuarantorName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="tel" placeholder="Số điện thoại người bảo lãnh" value={guarantorPhone} onChange={(e) => setGuarantorPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div className="sm:col-span-2">
                      <input type="text" placeholder="Nhập số CCCD hoặc mã định danh của người bảo lãnh" value={guarantorIdCard} onChange={(e) => setGuarantorIdCard(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                  </div>
                </div>

                {/* Khối: Địa chỉ */}
                <div>
                  <h3 className="text-md font-bold text-[#004e92] mb-4 uppercase tracking-wider text-xs">Địa chỉ liên hệ</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input type="text" placeholder="Quốc gia" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="text" placeholder="Tỉnh/Thành phố" value={province} onChange={(e) => setProvince(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="text" placeholder="Quận/Huyện" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div>
                      <input type="text" placeholder="Xã/Phường" value={ward} onChange={(e) => setWard(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                    <div className="sm:col-span-2">
                      <input type="text" placeholder="Địa chỉ cụ thể (Số nhà, Tên đường...)" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#004e92] hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" /> {loading ? 'Đang lưu...' : 'Lưu thông tin hồ sơ'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
