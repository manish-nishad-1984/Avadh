import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services';
import {
  FolderTree,
  Gem,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        if (res.success) {
          setData(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard stats', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recent = data?.recent_inquiries || [];
  const popular = data?.popular_products || [];

  const statCards = [
    { label: 'Total Categories', value: stats.total_categories || 0, icon: FolderTree, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats.total_products || 0, icon: Gem, color: 'bg-indigo-500' },
    { label: 'Active Products', value: stats.active_products || 0, icon: Eye, color: 'bg-emerald-500' },
    { label: 'Hidden Products', value: stats.hidden_products || 0, icon: EyeOff, color: 'bg-amber-500' },
    { label: 'Featured Products', value: stats.featured_products || 0, icon: Star, color: 'bg-purple-500' },
    { label: 'New Inquiries', value: stats.new_inquiries || 0, icon: MessageSquare, color: 'bg-rose-500' },
    { label: 'Pending Inquiries', value: stats.pending_inquiries || 0, icon: Clock, color: 'bg-amber-600' },
    { label: 'Completed Inquiries', value: stats.completed_inquiries || 0, icon: CheckCircle, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-serif font-bold text-2xl text-slate-800">ERP Dashboard Overview</h1>
        <p className="text-xs text-slate-500">Real-time statistics for AVADH Imitation Jewellery</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl text-white ${card.color} shadow-md`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold-600" /> Recent Customer Inquiries
            </h3>
            <Link to="/admin/inquiries" className="text-xs font-bold text-gold-600 hover:text-gold-800 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-3">Inquiry #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400">
                      No inquiries recorded yet.
                    </td>
                  </tr>
                ) : (
                  recent.map((inq: any) => (
                    <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">
                        <Link to={`/admin/inquiries/${inq.id}`} className="hover:underline text-maroon-900">
                          {inq.inquiry_number}
                        </Link>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{inq.customer_name}</td>
                      <td className="p-3 font-mono text-slate-600">{inq.mobile}</td>
                      <td className="p-3 font-bold text-amber-900">{inq.item_count} item(s)</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inq.status === 'new' ? 'bg-rose-100 text-rose-700' :
                          inq.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Inquired Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold-600" /> Popular Inquired Items
          </h3>

          <div className="space-y-3">
            {popular.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No popular items data yet.</p>
            ) : (
              popular.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-800">{item.name}</h4>
                    <span className="font-mono text-[10px] text-amber-800">SKU: {item.sku}</span>
                  </div>
                  <span className="font-bold text-maroon-900 bg-amber-100 px-2 py-1 rounded-md">
                    {item.inquiry_count} Inquiries
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
