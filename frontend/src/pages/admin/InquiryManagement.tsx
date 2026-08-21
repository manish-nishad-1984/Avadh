import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services';
import { Inquiry, InquiryStatus } from '../../types';
import { Search, Eye } from 'lucide-react';
import { Pagination } from '../../components/shared/Pagination';

export const InquiryManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getInquiries({
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      if (res.success) {
        setInquiries(res.data);
        if (res.meta) setTotalPages(res.meta.totalPages);
      }
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [page, search, statusFilter]);

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">New</span>;
      case 'contacted':
        return <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Contacted</span>;
      case 'quoted':
        return <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Quoted</span>;
      case 'in_progress':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">In Progress</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Completed</span>;
      case 'cancelled':
        return <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="font-serif font-bold text-xl text-slate-800">Inquiry Management</h1>
        <p className="text-xs text-slate-500">Track and respond to customer product inquiries</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search customer name, inquiry #, mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="text-xs p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Inquiry #</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Mobile / WhatsApp</th>
                <th className="p-4">Type</th>
                <th className="p-4">Items</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No customer inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{inq.inquiry_number}</td>
                    <td className="p-4 font-bold text-slate-800">{inq.customer_name}</td>
                    <td className="p-4 font-mono text-slate-600">
                      <div>{inq.mobile}</div>
                      {inq.whatsapp && <div className="text-[10px] text-emerald-600">WA: {inq.whatsapp}</div>}
                    </td>
                    <td className="p-4 uppercase font-bold text-slate-500 text-[10px]">{inq.inquiry_type}</td>
                    <td className="p-4 font-bold text-maroon-900">{inq.item_count} Item(s)</td>
                    <td className="p-4">{getStatusBadge(inq.status)}</td>
                    <td className="p-4 text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/admin/inquiries/${inq.id}`}
                        className="inline-flex items-center gap-1 p-1.5 bg-amber-50 text-maroon-950 font-semibold rounded-lg hover:bg-gold-500 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 border-t border-slate-100">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </div>
      )}
    </div>
  );
};
