import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { FaDownload, FaAward, FaCheckCircle, FaStar, FaShieldAlt, FaArrowRight, FaHourglassHalf, FaLock, FaClock, FaGraduationCap, FaMedal } from 'react-icons/fa';


// ─── Inline SVG Logo (Sikshya Sadan Crest) ────────────────────────────────────
const SikshyadanLogo = ({ size = 60 }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#1e1b4b" stroke="#c8a84b" strokeWidth="3" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#c8a84b" strokeWidth="1" strokeDasharray="4 2" />
        {/* Book icon */}
        <path d="M24 28 C24 26 26 25 28 25 L38 25 L38 55 L28 55 C26 55 24 54 24 52 Z" fill="#c8a84b" opacity="0.9" />
        <path d="M56 28 C56 26 54 25 52 25 L42 25 L42 55 L52 55 C54 55 56 54 56 52 Z" fill="#c8a84b" opacity="0.7" />
        <rect x="38" y="24" width="4" height="32" fill="#fff" opacity="0.5" />
        {/* Stars */}
        <text x="40" y="70" textAnchor="middle" fill="#c8a84b" fontSize="7" fontFamily="serif" fontWeight="bold">✦ ✦ ✦</text>
    </svg>
);

// ─── Certificate HTML template ─────────────────────────────────────────────────
const generateCertificateHTML = (cert, studentName) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate of Completion — ${cert.course?.title || 'Course'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 297mm; height: 210mm; background: #fff; }
    .page { width: 297mm; height: 210mm; position: relative; overflow: hidden; font-family: 'Crimson Text', Georgia, serif; }
    
    /* Ornate border */
    .outer-border { position: absolute; inset: 8mm; border: 3px solid #c8a84b; }
    .inner-border { position: absolute; inset: 12mm; border: 1px solid #c8a84b99; }
    
    /* Corner ornaments */
    .corner { position: absolute; width: 22mm; height: 22mm; }
    .corner svg { width: 100%; height: 100%; }
    .corner-tl { top: 6mm; left: 6mm; }
    .corner-tr { top: 6mm; right: 6mm; transform: scaleX(-1); }
    .corner-bl { bottom: 6mm; left: 6mm; transform: scaleY(-1); }
    .corner-br { bottom: 6mm; right: 6mm; transform: scale(-1); }
    
    /* Background watermark */
    .watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.04; font-family: 'Cinzel', serif; font-size: 120px; color: #1e1b4b; font-weight: 700; letter-spacing: -4px; transform: rotate(-15deg); user-select: none; }
    
    /* Content */
    .content { position: absolute; inset: 16mm; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; }
    
    .header { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .logo-circle { width: 70px; height: 70px; background: #1e1b4b; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #c8a84b; margin-bottom: 4px; }
    .school-name { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; letter-spacing: 6px; color: #1e1b4b; text-transform: uppercase; }
    .school-sub { font-size: 11px; color: #6b6b6b; letter-spacing: 4px; text-transform: uppercase; font-family: 'Montserrat', sans-serif; }
    .divider { width: 80mm; height: 1px; background: linear-gradient(to right, transparent, #c8a84b, transparent); margin: 4px auto; }
    
    .certifies-text { font-size: 13px; color: #555; letter-spacing: 3px; text-transform: uppercase; font-family: 'Montserrat', sans-serif; }
    
    .student-name-block { }
    .this-certifies { font-size: 12px; color: #888; letter-spacing: 2px; text-transform: uppercase; font-family: 'Montserrat', sans-serif; margin-bottom: 4px; }
    .student-name { font-family: 'Cinzel', serif; font-size: 38px; font-weight: 700; color: #1e1b4b; letter-spacing: 2px; line-height: 1.1; border-bottom: 2px solid #c8a84b; padding-bottom: 6px; min-width: 150mm; }
    
    .completion-text { font-size: 14px; color: #555; font-style: italic; }
    
    .course-block { }
    .course-label { font-size: 10px; color: #888; letter-spacing: 3px; text-transform: uppercase; font-family: 'Montserrat', sans-serif; margin-bottom: 4px; }
    .course-title { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 600; color: #c8a84b; letter-spacing: 1px; }
    
    .footer { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; }
    .sig-block { text-align: center; min-width: 50mm; }
    .sig-line { width: 50mm; height: 1px; background: #1e1b4b; margin-bottom: 4px; }
    .sig-title { font-size: 10px; color: #555; letter-spacing: 2px; text-transform: uppercase; font-family: 'Montserrat', sans-serif; }
    .sig-name { font-size: 13px; color: #1e1b4b; font-weight: 600; }
    
    .seal-block { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .seal-ring { width: 22mm; height: 22mm; border-radius: 50%; border: 3px solid #c8a84b; background: #1e1b4b; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .seal-text { font-family: 'Cinzel', serif; font-size: 5.5px; color: #c8a84b; letter-spacing: 0.5px; text-align: center; font-weight: 700; line-height: 1.4; }
    
    .cert-id { font-size: 9px; color: #bbb; letter-spacing: 1px; font-family: 'Montserrat', sans-serif; margin-top: 3px; }
    .issue-date { font-size: 9px; color: #888; font-family: 'Montserrat', sans-serif; }
    
    @media print { 
      html, body { margin: 0; }
      @page { size: A4 landscape; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Watermark -->
    <div class="watermark">SS</div>
    <!-- Borders -->
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    <!-- Corner ornaments -->
    <div class="corner corner-tl"><svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L80,0 L80,8 L8,8 L8,80 L0,80 Z" fill="#c8a84b" opacity="0.4"/><path d="M0,0 L50,0 L50,4 L4,4 L4,50 L0,50 Z" fill="#c8a84b"/><circle cx="12" cy="12" r="4" fill="#c8a84b"/><path d="M20,20 Q35,8 50,20" stroke="#c8a84b" strokeWidth="1.5" fill="none"/></svg></div>
    <div class="corner corner-tr"><svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L80,0 L80,0 L80,80 L72,80 L72,8 L0,8 Z" fill="#c8a84b" opacity="0.4"/><path d="M30,0 L80,0 L80,50 L76,50 L76,4 L30,4 Z" fill="#c8a84b"/><circle cx="68" cy="12" r="4" fill="#c8a84b"/></svg></div>
    <div class="corner corner-bl"><svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L8,0 L8,72 L80,72 L80,80 L0,80 Z" fill="#c8a84b" opacity="0.4"/><path d="M0,30 L4,30 L4,76 L50,76 L50,80 L0,80 Z" fill="#c8a84b"/><circle cx="12" cy="68" r="4" fill="#c8a84b"/></svg></div>
    <div class="corner corner-br"><svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M72,0 L80,0 L80,80 L0,80 L0,72 L72,72 Z" fill="#c8a84b" opacity="0.4"/><path d="M76,30 L80,30 L80,80 L30,80 L30,76 L76,76 Z" fill="#c8a84b"/><circle cx="68" cy="68" r="4" fill="#c8a84b"/></svg></div>
    
    <!-- Main Content -->
    <div class="content">
      <!-- Header -->
      <div class="header">
        <div class="logo-circle">
          <svg width="44" height="44" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 28 C24 26 26 25 28 25 L38 25 L38 55 L28 55 C26 55 24 54 24 52 Z" fill="#c8a84b" opacity="0.95"/>
            <path d="M56 28 C56 26 54 25 52 25 L42 25 L42 55 L52 55 C54 55 56 54 56 52 Z" fill="#c8a84b" opacity="0.7"/>
            <rect x="38" y="24" width="4" height="32" fill="#fff" opacity="0.6"/>
            <circle cx="40" cy="20" r="3" fill="#c8a84b"/>
          </svg>
        </div>
        <div class="school-name">Sikshya Sadan</div>
        <div class="school-sub">IT Training &amp; Professional Development</div>
        <div class="divider"></div>
        <div class="certifies-text">Certificate of Completion</div>
      </div>
      
      <!-- This certifies -->
      <div class="student-name-block">
        <div class="this-certifies">This is to certify that</div>
        <div class="student-name">${studentName || cert.student?.name || 'Student'}</div>
      </div>
      
      <!-- Course info -->
      <div class="course-block">
        <div class="completion-text">has successfully completed the course</div>
        <div class="divider" style="margin: 8px auto;"></div>
        <div class="course-label">Course Title</div>
        <div class="course-title">${cert.course?.title || 'Course'}</div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Course Instructor</div>
          <div class="sig-title">Authorized Signature</div>
        </div>
        
        <div class="seal-block">
          <div class="seal-ring">
            <div class="seal-text">SIKSHYA<br>SADAN<br>✦<br>CERTIFIED</div>
          </div>
          <div class="issue-date">${cert.certificateIssuedDate ? new Date(cert.certificateIssuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div class="cert-id">ID: ${cert.certificateId || cert._id}</div>
        </div>
        
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Program Director</div>
          <div class="sig-title">Sikshya Sadan</div>
        </div>
      </div>
    </div>
  </div>
  <script>
    window.addEventListener('load', function() { setTimeout(function() { window.print(); }, 500); });
  </script>
</body>
</html>`;

// ─── Main Component ────────────────────────────────────────────────────────────
const Certificates = () => {
    const [issuedCertificates, setIssuedCertificates] = useState([]);
    const [eligibleCourses, setEligibleCourses] = useState([]);
    const [inProgressCourses, setInProgressCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);
    const [error, setError] = useState('');
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getMyCourses();
            const enrollments = response.data.enrollments || [];

            // Grab student name from first enrollment
            if (enrollments.length > 0 && enrollments[0].student?.name) {
                setStudentName(enrollments[0].student.name);
            }

            const issued = enrollments.filter(e => e.certificateIssued);
            const eligible = enrollments.filter(e => e.status === 'completed' && !e.certificateIssued);
            const inProgress = enrollments.filter(e => e.status !== 'completed' && !e.certificateIssued);

            setIssuedCertificates(issued);
            setEligibleCourses(eligible);
            setInProgressCourses(inProgress);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load certification data');
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (courseId) => {
        try {
            setClaimingId(courseId);
            const response = await studentAPI.claimCertificate(courseId);
            if (response.data.success) {
                alert('🎓 Certificate successfully issued! Download it from "Earned Assets" below.');
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Verification process failed. Please contact your instructor.');
        } finally {
            setClaimingId(null);
        }
    };

    const handleDownload = (cert) => {
        const name = studentName || cert.student?.name || 'Student';
        const certWindow = window.open('', '_blank');
        certWindow.document.write(generateCertificateHTML(cert, name));
        certWindow.document.close();
    };

    const formatDate = (d) => {
        if (!d) return 'N/A';
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) return (
        <div className="student-portal min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Loading Credentials...</p>
            </div>
        </div>
    );

    return (
        <div className="student-portal min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-6">

                {/* Page Header */}
                <div className="portal-header mb-12 flex items-start justify-between">
                    <div>
                        <span className="text-primary-600 font-black uppercase text-xs tracking-widest bg-primary-50 px-5 py-2 rounded-full mb-4 inline-block italic">Achievement Vault</span>
                        <h1 className="text-5xl font-black text-slate-900 italic tracking-tight">Certification Center</h1>
                        <p className="text-slate-500 font-medium mt-2">Sikshya Sadan verified credentials for your professional trajectory.</p>
                    </div>
                    {/* Mini preview of Sikshya Sadan crest */}
                    <div className="hidden md:flex flex-col items-center gap-2 opacity-60">
                        <SikshyadanLogo size={64} />
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sikshya Sadan</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 font-bold mb-8 italic flex items-center gap-3">
                        <FaShieldAlt /> {error}
                    </div>
                )}

                {/* ✅ READY TO CLAIM */}
                {eligibleCourses.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <FaCheckCircle className="text-emerald-500 text-xl" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 italic">Ready to Claim</h2>
                            <span className="bg-emerald-100 text-emerald-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">{eligibleCourses.length} Available</span>
                            <div className="h-1 flex-grow bg-slate-100 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {eligibleCourses.map((enrollment) => (
                                <div key={enrollment._id} className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-dashed border-emerald-200 relative group overflow-hidden hover:-translate-y-1 transition-all">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                                        <FaMedal size={80} className="text-emerald-500" />
                                    </div>
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                                        <FaGraduationCap size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">✓ Instructor Verified</span>
                                    <h3 className="text-xl font-black text-slate-900 italic leading-tight mt-4 mb-2">{enrollment.course?.title}</h3>
                                    <p className="text-slate-400 font-medium text-sm mb-6">Your instructor has confirmed completion. Click below to seal your credential.</p>
                                    <button
                                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black italic tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={() => handleClaim(enrollment.course._id)}
                                        disabled={claimingId === enrollment.course._id}
                                    >
                                        {claimingId === enrollment.course._id ? (
                                            <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div> Issuing...</>
                                        ) : (
                                            <>Seal &amp; Issue Certificate <FaArrowRight /></>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ⏳ IN PROGRESS */}
                {inProgressCourses.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <FaHourglassHalf className="text-amber-500 text-xl" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 italic">In Progress</h2>
                            <span className="bg-amber-100 text-amber-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">{inProgressCourses.length} Active</span>
                            <div className="h-1 flex-grow bg-slate-100 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {inProgressCourses.map((enrollment) => (
                                <div key={enrollment._id} className="bg-white p-8 rounded-[2.5rem] shadow-md border border-amber-100 relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                                            <FaLock size={18} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Awaiting Verification</span>
                                            <h3 className="text-lg font-black text-slate-800 leading-tight">{enrollment.course?.title}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 rounded-2xl p-4">
                                        <p className="text-xs text-amber-700 font-medium">
                                            Your instructor needs to verify your completion. If you've finished the course, contact your instructor.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-bold">
                                        <FaClock className="text-slate-300" />
                                        Enrolled: {formatDate(enrollment.enrollmentDate)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🏅 EARNED ASSETS */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-2 bg-primary-50 rounded-xl">
                        <FaAward className="text-primary-600 text-xl" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 italic">Earned Assets</h2>
                    {issuedCertificates.length > 0 && (
                        <span className="bg-primary-100 text-primary-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">{issuedCertificates.length} Certified</span>
                    )}
                    <div className="h-1 flex-grow bg-slate-100 rounded-full"></div>
                </div>

                {issuedCertificates.length === 0 ? (
                    <div className="bg-white rounded-[4rem] p-20 text-center shadow-2xl border border-slate-50">
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                            <FaAward size={64} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 italic">Portfolio Inactive</h3>
                        <p className="text-slate-400 mt-4 font-medium max-w-md mx-auto italic">
                            Complete your active courses and get instructor verification to earn your professional Sikshya Sadan credentials.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {issuedCertificates.map((cert) => (
                            <div key={cert._id} className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 relative group transition-all hover:-translate-y-2">
                                {/* Verified badge */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">
                                    <FaCheckCircle />
                                </div>

                                {/* Header */}
                                <div className="mb-6 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <SikshyadanLogo size={52} />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sikshya Sadan</p>
                                            <p className="text-xs font-black text-slate-600">Certified</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest italic">
                                        {cert.certificateId?.split('-').pop() || 'VALID'}
                                    </span>
                                </div>

                                {/* Student name on cert */}
                                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Awarded To</p>
                                    <p className="text-lg font-black text-slate-900 italic">{studentName || cert.student?.name || 'Student'}</p>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 italic tracking-tight mb-6 group-hover:text-primary-600 transition-colors leading-tight">{cert.course?.title}</h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                        <FaClock className="text-primary-300" />
                                        Issued: {formatDate(cert.certificateIssuedDate)}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 break-all">
                                        <FaShieldAlt className="text-primary-300 flex-shrink-0" />
                                        <span className="truncate">{cert.certificateId || cert._id}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black italic tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95"
                                    onClick={() => handleDownload(cert)}
                                >
                                    <FaDownload /> Download Certificate
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificates;
