import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaWallet, FaArrowRight, FaFilter, FaSearch, FaHistory, FaCheckCircle, FaTimesCircle, FaReceipt, FaFileInvoiceDollar } from 'react-icons/fa';

const Finance = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalRevenue: 0, pendingReview: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getFinancialReports();
            setEnrollments(response.data.data.enrollments || []);
            setStats({
                totalRevenue: response.data.data.totalRevenue,
                pendingReview: response.data.data.pendingPayments
            });
        } catch (error) {
            console.error('Error fetching finance reports:', error);
            alert('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePayment = async (enrollmentId, newStatus) => {
        try {
            await adminAPI.updateEnrollmentPaymentStatus(enrollmentId, { paymentStatus: newStatus });
            setEnrollments(enrollments.map(e => e._id === enrollmentId ? { ...e, paymentStatus: newStatus } : e));
            fetchReports(); // Refresh stats
        } catch (error) {
            alert('Failed to update payment status');
        }
    };

    const filteredEnrollments = enrollments.filter(e => {
        const matchesSearch = e.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || e.paymentStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="admin-portal min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-slate-900"></div>
        </div>
    );

    return (
        <div className="admin-portal min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-6">
                <div className="portal-header mb-12">
                    <span className="text-emerald-500 font-black uppercase text-xs tracking-widest bg-emerald-50 px-5 py-2 rounded-full mb-4 inline-block italic">Revenue Control</span>
                    <h1 className="text-5xl font-black text-slate-900 italic tracking-tight">Financial Ledger</h1>
                    <p className="text-slate-500 font-medium">Audit transaction streams, verify settlements, and track growth.</p>
                </div>

                {/* FINANCIAL SNAPSHOTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 -mr-4 -mt-4 transition-transform group-hover:scale-110">
                            <FaWallet size={120} />
                        </div>
                        <h3 className="text-lg font-black italic text-emerald-400 mb-2">Aggregate Revenue</h3>
                        <p className="text-4xl font-black italic">Rs. {stats.totalRevenue.toLocaleString()}</p>
                        <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-400">
                            <FaHistory /> Real-time Settlement Matrix
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Pending Clearances</h3>
                            <p className="text-4xl font-black text-slate-900 italic">{stats.pendingReview}</p>
                        </div>
                        <p className="text-xs font-bold text-amber-600 mt-4 italic flex items-center gap-2">
                            Requires manual verification
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Active Contracts</h3>
                            <p className="text-4xl font-black text-slate-900 italic">{enrollments.length}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-4 italic">
                            Subscription-based industrial training seats
                        </p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 mb-12 flex flex-wrap items-center gap-8">
                    <div className="flex-1 min-w-[300px] relative">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Find by Student or Course title..."
                            className="w-full bg-slate-50 border-0 rounded-2xl pl-14 pr-6 py-4 focus:ring-4 ring-emerald-50 outline-none font-bold text-slate-800 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <select
                            className="bg-slate-50 border-0 rounded-2xl pl-12 pr-10 py-4 focus:ring-4 ring-emerald-50 outline-none font-black text-[10px] uppercase tracking-widest text-slate-600 appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Full Stream</option>
                            <option value="completed">Settled</option>
                            <option value="pending">Escrow / Pending</option>
                            <option value="failed">Rejected</option>
                            <option value="installment">Partial / Installment</option>
                        </select>
                    </div>
                </div>

                {/* TRANSACTION TABLE */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Contractual Party</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Selected Module</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Capital Value</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right">Settlement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredEnrollments.map(e => (
                                    <tr key={e._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <FaReceipt />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-800 italic leading-tight">{e.student?.name}</h4>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{e.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="font-bold text-slate-600 italic text-sm">{e.course?.title}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="font-black text-slate-900">Rs. {e.course?.fee?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${e.paymentStatus === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                e.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    e.paymentStatus === 'installment' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                        'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                {e.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            {e.paymentStatus === 'pending' && (
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleUpdatePayment(e._id, 'completed')}
                                                        className="h-10 w-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="Approve Settlement"
                                                    >
                                                        <FaCheckCircle />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdatePayment(e._id, 'failed')}
                                                        className="h-10 w-10 bg-red-50 text-red-500 flex items-center justify-center rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                        title="Reject Transaction"
                                                    >
                                                        <FaTimesCircle />
                                                    </button>
                                                </div>
                                            )}
                                            {e.paymentStatus === 'completed' && (
                                                <button className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ml-auto">
                                                    Auditted <FaCheckCircle />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredEnrollments.length === 0 && (
                        <div className="p-20 text-center text-slate-400 italic font-black uppercase tracking-widest flex flex-col items-center gap-4">
                            <FaFileInvoiceDollar size={40} className="opacity-20" />
                            Financial logs are clear for this sector.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Finance;
