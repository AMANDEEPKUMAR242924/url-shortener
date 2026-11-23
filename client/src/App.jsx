import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link2, Copy, Check, Trash2, BarChart3, ExternalLink, MousePointerClick } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const COLORS = ['#6366f1', '#10b981'];

export default function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUrls = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/urls`);
      setUrls(data);
      setSelectedUrl((prev) => {
        if (!prev) return data[0] || null;
        return data.find((u) => u._id === prev._id) || data[0] || null;
      });
    } catch (err) {
      console.error('Error fetching URLs:', err);
    }
  };

  useEffect(() => {
    let ignore = false;
    axios
      .get(`${BACKEND_URL}/api/urls`)
      .then(({ data }) => {
        if (!ignore) {
          setUrls(data);
          setSelectedUrl(data[0] || null);
        }
      })
      .catch((err) => console.error('Error fetching URLs:', err));
    return () => {
      ignore = true;
    };
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/urls/shorten`, { originalUrl });
      setOriginalUrl('');
      setSelectedUrl(data);
      fetchUrls();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/urls/${id}`);
      if (selectedUrl?._id === id) setSelectedUrl(null);
      fetchUrls();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCopy = (shortCode, id) => {
    navigator.clipboard.writeText(`${BACKEND_URL}/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

  const deviceData = selectedUrl
    ? [
        {
          name: 'Desktop',
          value: selectedUrl.analytics.filter((a) => a.device === 'Desktop').length,
        },
        {
          name: 'Mobile',
          value: selectedUrl.analytics.filter((a) => a.device === 'Mobile').length,
        },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-2">
        <Link2 className="w-7 h-7 text-indigo-600" />
        <h1 className="text-xl font-bold">ShortLink Analytics</h1>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Shorten Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Paste a Long URL to Shorten</h2>
          <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="https://example.com/very-long-article-link"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition cursor-pointer"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Shortened Links</p>
              <h3 className="text-2xl font-bold">{urls.length}</h3>
            </div>
            <Link2 className="w-10 h-10 text-indigo-500 bg-indigo-50 p-2 rounded-lg" />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Clicks Tracked</p>
              <h3 className="text-2xl font-bold text-emerald-600">{totalClicks}</h3>
            </div>
            <MousePointerClick className="w-10 h-10 text-emerald-500 bg-emerald-50 p-2 rounded-lg" />
          </div>
        </div>

        {/* Links List + Analytics Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Links Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Links</h2>
            {urls.length === 0 ? (
              <p className="text-slate-400 text-center py-10">No links yet. Create one above!</p>
            ) : (
              <div className="divide-y">
                {urls.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => setSelectedUrl(u)}
                    className={`py-3.5 px-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition ${
                      selectedUrl?._id === u._id ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <a
                          href={`${BACKEND_URL}/${u.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTimeout(fetchUrls, 800);
                          }}
                          className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          /{u.shortCode} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(u.shortCode, u._id);
                          }}
                          className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                          title="Copy Short URL"
                        >
                          {copiedId === u._id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">{u.originalUrl}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
                        {u.clicks} clicks
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(u._id);
                        }}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Click Analytics */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              {selectedUrl ? `/${selectedUrl.shortCode} Analytics` : 'Click Analytics'}
            </h2>
            {!selectedUrl || deviceData.length === 0 ? (
              <p className="text-slate-400 text-center py-14 text-sm">
                Short link par click karke dekho — yahan Desktop vs Mobile breakdown dikhega!
              </p>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceData} dataKey="value" nameKey="name" outerRadius={75} label>
                      {deviceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}