import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';

const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const { token } = useAuth();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [data, setData] = useState(null);
    const [count, setCount] = useState(5);

    useEffect(() => {
        const verify = async () => {
            const esewa = params.get('data'), stripe = params.get('session_id'), pidx = params.get('pidx'), eid = params.get('enrollmentId');
            try {
                let res;
                if (esewa) res = await paymentAPI.verifyEsewa({ data: esewa });
                else if (stripe) res = await paymentAPI.verifyStripe({ sessionId: stripe, enrollmentId: eid });
                else if (pidx) res = await paymentAPI.verifyKhalti({ pidx, enrollmentId: eid });
                else if (eid) res = await paymentAPI.getPaymentStatus(eid);
                else return setErr('Invalid request');

                if (res?.data?.success) setData(res.data.enrollment || res.data.data);
                else setErr(res?.data?.message || 'Verification failed');
            } catch (e) { setErr(e.response?.data?.message || 'Verification error'); }
            finally { setLoading(false); }
        };
        if (params.get('data') || token) verify();
        else { setErr('Login required'); setLoading(false); }
    }, [params, token]);

    useEffect(() => {
        if (!loading && !err) {
            const t = setInterval(() => setCount(c => { if(c<=1) { nav('/student/dashboard'); return 0; } return c-1; }), 1000);
            return () => clearInterval(t);
        }
    }, [loading, err, nav]);

    if (loading) return <div className="p-12 text-center text-xl font-bold text-slate-500 min-h-[50vh] flex items-center justify-center">Verifying Payment...</div>;
    if (err) return (
        <div className="flex justify-center items-center min-h-[60vh] px-4 font-sans bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-red-200 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6 text-4xl">❌</div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Payment Failed</h2>
                <p className="text-slate-500 mb-8">{err}</p>
                <Link to="/courses" className="inline-block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors">Back to Courses</Link>
            </div>
        </div>
    );

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4 font-sans bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-emerald-200 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-6 text-5xl">✅</div>
                <h1 className="text-3xl font-black text-emerald-600 mb-2">Payment Successful!</h1>
                <p className="text-slate-500 font-medium mb-8">Redirecting to dashboard in {count}s...</p>
                
                {data && (
                    <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-100 mb-8 space-y-3">
                        <div className="flex flex-col"><span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Course</span> <span className="text-slate-800 font-bold">{data.course?.title}</span></div>
                        <div className="flex flex-col"><span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Amount Paid</span> <span className="text-emerald-500 text-xl font-black">Rs. {data.paidAmount || data.totalAmount}</span></div>
                        <div className="flex flex-col"><span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Status</span> <span className="text-indigo-600 font-bold capitalize">{data.paymentStatus}</span></div>
                    </div>
                )}
                
                <Link to="/student/dashboard" className="inline-block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors">Go to Dashboard</Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
