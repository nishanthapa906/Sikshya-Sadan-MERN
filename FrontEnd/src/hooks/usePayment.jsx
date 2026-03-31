import { useState } from 'react';
import { paymentAPI } from '../services/api';

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const processesewa = async (courseId, installmentPlanId) => {
        try {
            setLoading(true);
            setError(null);
            const res = await paymentAPI.initiateEsewa(courseId, installmentPlanId);
            const { esewaParams, url: esewaUrl } = res.data;
            
            // Create hidden form to redirect to eSewa
            const form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action', esewaUrl);

            for (const key in esewaParams) {
                const hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('value', esewaParams[key]);
                form.appendChild(hiddenField);
            }

            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            console.error('eSewa error:', err);
            setError(err.response?.data?.message || 'Failed to initiate eSewa payment');
            setLoading(false);
            throw err;
        }
    };

    const processKhalti = async (courseId, installmentPlanId) => {
        try {
            setLoading(true);
            setError(null);
            const res = await paymentAPI.initiateKhalti(courseId, installmentPlanId);
            if (res.data.payment_url) {
                window.location.href = res.data.payment_url;
            } else {
                throw new Error('Failed to get Khalti payment URL');
            }
        } catch (err) {
            console.error('Khalti error:', err);
            setError(err.response?.data?.message || 'Failed to initiate Khalti payment');
            setLoading(false);
            throw err;
        }
    };

    const processStripe = async (courseId, installmentPlanId) => {
        try {
            setLoading(true);
            setError(null);
            const res = await paymentAPI.createStripeSession(courseId, installmentPlanId);
            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                throw new Error('Failed to create Stripe checkout session');
            }
        } catch (err) {
            console.error('Stripe error:', err);
            setError(err.response?.data?.message || 'Failed to initiate Stripe payment');
            setLoading(false);
            throw err;
        }
    };

    const processPayment = async (method, courseId, installmentPlanId) => {
        if (!courseId) {
            setError('Course ID is required');
            return;
        }

        if (method === 'esewa') {
            await processesewa(courseId, installmentPlanId);
        } else if (method === 'stripe') {
            await processStripe(courseId, installmentPlanId);
        } else if (method === 'khalti') {
            await processKhalti(courseId, installmentPlanId);
        } else {
            setError('Unsupported payment method');
        }
    };

    return {
        processPayment,
        loading,
        error
    };
};
