import React, { useEffect, useState } from 'react';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaAward, FaDownload, FaImage } from 'react-icons/fa';

const Certificates = () => {
    const [certs, setCerts] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await studentAPI.getMyCertificates();
                setCerts((res.data?.data || []).filter(c => c?.certificateImage && ['issued', 'available', 'claimed'].includes(c?.status)));
                const cRes = await studentAPI.getMyCourses();
                setWaiting((cRes.data?.enrollments || []).filter(e => e.status === 'completed' && !e.certificateIssued));
            } catch (e) { setErr(e.response?.data?.message || 'Failed to load'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>My Certificates</h1>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            {waiting.length > 0 && (
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                    <strong>Awaiting certificate from instructor:</strong>
                    <ul style={{ margin: '0.5rem 0 0 1rem' }}>
                        {waiting.map(e => <li key={e._id} style={{ fontSize: '0.85rem' }}>{e.course?.title}</li>)}
                    </ul>
                </div>
            )}
            {certs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <FaAward style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }} />
                    <h2>No certificates yet</h2>
                    <p style={{ color: '#64748b' }}>Complete your course and ask your instructor to upload your certificate.</p>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Preview</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Course</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Certificate No.</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certs.map(c => {
                            const url = `${UPLOAD_URL}/${c.certificateImage}`;
                            return (
                                <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem' }}>
                                        <img src={url} alt={c.course?.title} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{c.course?.title}</td>
                                    <td style={{ padding: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>{c.certificateNumber}</td>
                                    <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                        <a href={url} target="_blank" rel="noreferrer" style={{ padding: '0.25rem 0.75rem', background: '#1e1b4b', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <FaImage /> View
                                        </a>
                                        <a href={url} download style={{ padding: '0.25rem 0.75rem', background: '#059669', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <FaDownload /> Download
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Certificates;
