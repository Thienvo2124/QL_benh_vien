const Dashboard = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Tổng bệnh nhân</h3>
          <p className="text-3xl font-bold mt-2">1,245</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-teal-500">
          <h3 className="text-gray-500 text-sm">Bác sĩ</h3>
          <p className="text-3xl font-bold mt-2">42</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm">Lịch hẹn hôm nay</h3>
          <p className="text-3xl font-bold mt-2">86</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
