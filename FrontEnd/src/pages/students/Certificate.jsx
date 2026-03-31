import React, { useEffect, useState } from 'react';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaAward, FaDownload, FaImage, FaSpinner } from 'react-icons/fa';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const res = await studentAPI.getMyCertificates();
            const list = res.data?.data || [];
            const issuedWithImage = list.filter(
                (c) => c?.certificateImage && ['issued', 'available', 'claimed'].includes(c?.status)
            );
            setCertificates(issuedWithImage);

            const courseRes = await studentAPI.getMyCourses();
            const enrollments = courseRes.data?.enrollments || [];
            const waitingForCertificate = enrollments.filter((e) => e.status === 'completed' && !e.certificateIssued);
            setCompletedCourses(waitingForCertificate);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load certificates.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-600 font-bold">
                    <FaSpinner className="animate-spin" />
                    Loading certificates...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-6">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900">My Certificates</h1>
                    <p className="text-slate-500 mt-2">
                        Certificates appear here after your instructor marks completion and uploads certificate image.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 font-semibold">
                        {error}
                    </div>
                )}

                {completedCourses.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-700">
                        <p className="font-bold mb-2">Completed Courses</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {completedCourses.map((item) => (
                                <li key={item._id}>
                                    {item.course?.title} - completed, waiting for instructor certificate upload.
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {certificates.length === 0 ? (
                    <div className="bg-white rounded-3xl p-14 text-center border border-slate-100 shadow-sm">
                        <FaAward className="mx-auto text-5xl text-slate-300 mb-4" />
                        <h2 className="text-2xl font-black text-slate-800">No issued certificate yet</h2>
                        <p className="text-slate-500 mt-2">
                            Complete your course, ensure attendance and grading are done, then ask your instructor to upload your certificate.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {certificates.map((cert) => {
                            const imageUrl = `${UPLOAD_URL}/${cert.certificateImage}`;
                            return (
                                <div key={cert._id} className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
                                    <div className="aspect-[16/10] bg-slate-100">
                                        <img
                                            src={imageUrl}
                                            alt={`${cert.course?.title || 'Course'} certificate`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-black text-slate-900">{cert.course?.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Certificate No: {cert.certificateNumber}
                                        </p>
                                        <div className="mt-5 flex gap-3">
                                            <a
                                                href={imageUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm inline-flex items-center gap-2"
                                            >
                                                <FaImage /> View
                                            </a>
                                            <a
                                                href={imageUrl}
                                                download
                                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm inline-flex items-center gap-2"
                                            >
                                                <FaDownload /> Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificates;
