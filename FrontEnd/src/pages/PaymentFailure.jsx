import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';

const PaymentFailure = () => {
    const [params] = useSearchParams();
    const nav = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        const esewaData = params.get('data');
        if (esewaData) {
            try {
                const fail = JSON.parse(atob(esewaData));
                if (fail.transaction_uuid && token) {
                    paymentAPI.getPaymentStatus(fail.transaction_uuid)
                        .then(res => { if(res.data.success) setData(res.data.data); })
                        .catch(console.error);
                }
            } catch(e) {}
        }
    }, [params, token]);

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4 font-sans bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-red-200 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6 text-5xl">⚠️</div>
                <h1 className="text-3xl font-black text-red-500 mb-2">Payment Failed</h1>
                <p className="text-slate-500 font-medium mb-8">Your payment could not be processed.</p>
                
                {data?.course && (
                    <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-100 mb-8 space-y-3">
                        <div className="flex flex-col"><span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Course</span> <span className="text-slate-800 font-bold">{data.course.title}</span></div>
                        <div className="flex flex-col"><span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Amount Attempted</span> <span className="text-red-500 text-xl font-black">Rs. {data.amount}</span></div>
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {data?.course ? (
                         <button onClick={() => nav('/admission', { state: { courseId: data.course._id }})} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors">Retry Payment</button>
                    ) : <button onClick={() => nav('/courses')} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors">Try Again</button>}
                    <Link to="/contact" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors block leading-none flex items-center justify-center">Support</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
