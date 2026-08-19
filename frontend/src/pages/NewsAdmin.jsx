import { useState, useEffect, useContext, useRef } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Pin, PinOff, Newspaper, X, Save, RefreshCw, Search, Upload, ImageIcon, Copy, Check } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import API_BASE_URL from '../config/api';

const CATEGORIES = ['Thong bao', 'Suc khoe', 'Hoat dong', 'Tuyen dung', 'Khac'];

const emptyForm = { title: '', summary: '', content: '', imageUrl: '', category: 'Thong bao', author: 'Ban Quan tri', isPinned: false, isVisible: true };

const NewsAdmin = () => {
  const { token } = useContext(AuthContext);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [extraImages, setExtraImages] = useState([]);
  const fileInputRef = useRef(null);

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/all`, { headers });
      if (res.ok) setNewsList(await res.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditItem(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ title: item.title, summary: item.summary || '', content: item.content || '', imageUrl: item.imageUrl || '', category: item.category, author: item.author, isPinned: item.isPinned, isVisible: item.isVisible }); setEditItem(item); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim()) return alert('Vui long nhap tieu de bai viet.');
    setSaving(true);
    try {
      let res;
      if (editItem) {
        res = await fetch(`${API_BASE_URL}/api/news/${editItem._id}`, { method: 'PUT', headers, body: JSON.stringify(form) });
      } else {
        res = await fetch(`${API_BASE_URL}/api/news`, { method: 'POST', headers, body: JSON.stringify(form) });
      }
      if (res.ok) { setShowForm(false); setMsg(editItem ? 'Da cap nhat bai tin.' : 'Da them bai tin moi.'); fetchNews(); setTimeout(() => setMsg(''), 3000); }
      else { const d = await res.json(); alert(d.message || 'Co loi xay ra.'); }
    } finally { setSaving(false); }
  };

  const handleToggle = async (item) => {
    const res = await fetch(`${API_BASE_URL}/api/news/${item._id}/toggle`, { method: 'PATCH', headers });
    if (res.ok) fetchNews();
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Ban co chac muon xoa bai tin nay?')) return;
    const res = await fetch(`${API_BASE_URL}/api/news/${item._id}`, { method: 'DELETE', headers });
    if (res.ok) { setMsg('Da xoa bai tin.'); fetchNews(); setTimeout(() => setMsg(''), 3000); }
  };

  const handlePin = async (item) => {
    const res = await fetch(`${API_BASE_URL}/api/news/${item._id}`, { method: 'PUT', headers, body: JSON.stringify({ ...item, isPinned: !item.isPinned }) });
    if (res.ok) fetchNews();
  };

  const uploadImage = async (file, isHeader = true) => {
    if (!file || !file.type.startsWith('image/')) return alert('Vui long chon file anh.');
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (isHeader) {
          setForm(f => ({ ...f, imageUrl: data.url }));
        } else {
          setExtraImages(prev => [...prev, data.url]);
        }
      } else {
        alert('Upload anh that bai.');
      }
    } finally { setUploadLoading(false); }
  };

  const handleDrop = (e, isHeader = true) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadImage(file, isHeader);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(`![](${url})`);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const filtered = newsList.filter(n => n.title?.toLowerCase().includes(search.toLowerCase()) || n.author?.toLowerCase().includes(search.toLowerCase()) || n.category?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className='p-6 font-sans min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 text-[#004e92] rounded-xl flex items-center justify-center'><Newspaper className='w-5 h-5' /></div>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>Quan ly Tin tuc</h1>
              <p className='text-xs text-gray-500'>Them, sua, an/hien bai viet tren trang chu</p>
            </div>
          </div>
          <button onClick={openAdd} className='bg-[#004e92] hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-md transition-colors'>
            <Plus className='w-4 h-4' /> Them bai moi
          </button>
        </div>

        {msg && <div className='mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium'>{msg}</div>}

        {/* Search */}
        <div className='relative mb-4'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Tim kiem theo tieu de, tac gia, danh muc...' className='w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] transition-colors' />
        </div>

        {/* Table */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-100'>
              <tr>
                <th className='p-4 text-left'>Bai viet</th>
                <th className='p-4 text-left hidden md:table-cell'>Danh muc</th>
                <th className='p-4 text-left hidden lg:table-cell'>Ngay dang</th>
                <th className='p-4 text-center'>Trang thai</th>
                <th className='p-4 text-center'>Thao tac</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {loading ? (
                <tr><td colSpan='5' className='p-10 text-center text-gray-400'><RefreshCw className='w-5 h-5 animate-spin mx-auto mb-2' />Dang tai...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan='5' className='p-10 text-center text-gray-400'>Chua co bai tin nao.</td></tr>
              ) : filtered.map(item => (
                <tr key={item._id} className='hover:bg-blue-50/20 transition-colors'>
                  <td className='p-4'>
                    <div className='flex items-start gap-3'>
                      {item.imageUrl && <img src={item.imageUrl} alt='' className='w-14 h-10 object-cover rounded-lg border border-gray-100 shrink-0' onError={e => e.target.style.display='none'} />}
                      <div>
                        <div className='font-semibold text-gray-800 line-clamp-1 flex items-center gap-1'>{item.isPinned && <Pin className='w-3 h-3 text-orange-500 shrink-0' />}{item.title}</div>
                        <div className='text-xs text-gray-500 mt-0.5'>{item.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className='p-4 hidden md:table-cell'><span className='bg-blue-50 text-[#004e92] text-xs font-bold px-2 py-1 rounded-full border border-blue-100'>{item.category}</span></td>
                  <td className='p-4 text-gray-500 hidden lg:table-cell text-xs'>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                  <td className='p-4 text-center'>
                    {item.isVisible
                      ? <span className='bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full'>Hien</span>
                      : <span className='bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full'>An</span>
                    }
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center justify-center gap-1.5'>
                      <button onClick={() => handlePin(item)} className={`p-1.5 rounded-lg transition-colors ${item.isPinned ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} title={item.isPinned ? 'Bo ghim' : 'Ghim len dau'}>
                        {item.isPinned ? <PinOff className='w-3.5 h-3.5' /> : <Pin className='w-3.5 h-3.5' />}
                      </button>
                      <button onClick={() => handleToggle(item)} className='p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors' title={item.isVisible ? 'An bai' : 'Hien bai'}>
                        {item.isVisible ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
                      </button>
                      <button onClick={() => openEdit(item)} className='p-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors' title='Sua bai'>
                        <Pencil className='w-3.5 h-3.5' />
                      </button>
                      <button onClick={() => handleDelete(item)} className='p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors' title='Xoa bai'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='bg-[#004e92] text-white px-6 py-4 flex justify-between items-center rounded-t-2xl'>
              <h2 className='font-bold text-lg'>{editItem ? 'Sua bai tin' : 'Them bai viet moi'}</h2>
              <button onClick={() => setShowForm(false)} className='w-8 h-8 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors'><X className='w-4 h-4' /></button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-xs font-bold text-gray-700 mb-1'>Tieu de bai viet *</label>
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]' placeholder='Nhap tieu de...' />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-bold text-gray-700 mb-1'>Danh muc</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] bg-white'>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-700 mb-1'>Tac gia</label>
                  <input value={form.author} onChange={e => setForm(f => ({...f, author: e.target.value}))} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92]' placeholder='Ten tac gia...' />
                </div>
              </div>
              <div>
                <label className='block text-xs font-bold text-gray-700 mb-1'>Anh dai dien (keo thu hoac bam chon)</label>
                <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={e => { if (e.target.files[0]) uploadImage(e.target.files[0], true); }} />
                <div
                  onDrop={e => handleDrop(e, true)}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${dragOver ? 'border-[#004e92] bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  {uploadLoading ? (
                    <div className='text-sm text-blue-600 font-medium'>Dang tai anh len...</div>
                  ) : form.imageUrl ? (
                    <div className='flex items-center gap-3'>
                      <img src={form.imageUrl} alt='preview' className='h-20 rounded-lg object-cover border border-gray-100' onError={e => e.target.style.display='none'} />
                      <div className='text-left'>
                        <p className='text-xs text-green-600 font-bold mb-1'>Da tai anh len</p>
                        <p className='text-xs text-gray-400 break-all line-clamp-2'>{form.imageUrl}</p>
                        <button type='button' onClick={e => { e.stopPropagation(); setForm(f => ({...f, imageUrl: ''})); }} className='text-xs text-red-500 hover:underline mt-1'>Xoa anh</button>
                      </div>
                    </div>
                  ) : (
                    <div className='py-3'>
                      <Upload className='w-6 h-6 text-gray-300 mx-auto mb-2' />
                      <p className='text-sm text-gray-500'>Keo anh vao day hoac <span className='text-[#004e92] font-bold'>bam de chon file</span></p>
                      <p className='text-xs text-gray-400 mt-1'>PNG, JPG, WEBP — toi da 5MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className='block text-xs font-bold text-gray-700 mb-1'>Noi dung day du</label>
                <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={6} className='w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#004e92] resize-none font-mono' placeholder={'Gõ nội dung tại đây...\nChen anh bang cach copy ma phia duoi va dan vao noi can chen.'} />
              </div>

              {/* Anh bo sung cho noi dung */}
              <div className='bg-blue-50 border border-blue-100 rounded-xl p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <label className='text-xs font-bold text-[#004e92] flex items-center gap-1.5'><ImageIcon className='w-3.5 h-3.5' />Anh chen vao noi dung</label>
                  <label className='text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1'>
                    <Upload className='w-3 h-3' /> Tai anh len
                    <input type='file' accept='image/*' className='hidden' onChange={e => { if (e.target.files[0]) uploadImage(e.target.files[0], false); }} />
                  </label>
                </div>
                {extraImages.length === 0 ? (
                  <p className='text-xs text-gray-400 italic'>Tai anh len, sau do copy ma markdown de dan vao noi dung.</p>
                ) : (
                  <div className='space-y-2'>
                    {extraImages.map((url, i) => (
                      <div key={i} className='flex items-center gap-3 bg-white rounded-lg p-2 border border-blue-100'>
                        <img src={url} alt='' className='h-12 w-16 object-cover rounded border border-gray-100 shrink-0' />
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs font-mono text-gray-600 truncate'>{`![](${url})`}</p>
                        </div>
                        <button
                          type='button'
                          onClick={() => copyToClipboard(url)}
                          className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors ${copiedUrl === url ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-[#004e92] hover:bg-blue-200'}`}
                        >
                          {copiedUrl === url ? <><Check className='w-3 h-3' />Da copy</> : <><Copy className='w-3 h-3' />Copy ma</>}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='flex gap-6'>
                <label className='flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700'>
                  <input type='checkbox' checked={form.isPinned} onChange={e => setForm(f => ({...f, isPinned: e.target.checked}))} className='w-4 h-4 accent-orange-500' />
                  Ghim len dau
                </label>
                <label className='flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700'>
                  <input type='checkbox' checked={form.isVisible} onChange={e => setForm(f => ({...f, isVisible: e.target.checked}))} className='w-4 h-4 accent-blue-600' />
                  Hien thi tren trang chu
                </label>
              </div>
            </div>
            <div className='px-6 pb-6 flex justify-end gap-3'>
              <button onClick={() => setShowForm(false)} className='px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors'>Huy</button>
              <button onClick={handleSave} disabled={saving} className='px-5 py-2.5 bg-[#004e92] hover:bg-blue-800 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors disabled:opacity-50'>
                <Save className='w-4 h-4' />{saving ? 'Dang luu...' : 'Luu bai viet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAdmin;
