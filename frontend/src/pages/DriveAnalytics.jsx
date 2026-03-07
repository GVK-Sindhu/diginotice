import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3, Users, Download, UserCheck, UserMinus, Loader2, Database } from 'lucide-react';
import { toast } from 'react-toastify';

const DriveAnalytics = () => {
    const [drives, setDrives] = useState([]);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const response = await api.get('/notices', { params: { category: 'DRIVE', includeArchived: 'true' } });
                setDrives(response.data.data.notices);
                if (response.data.data.notices.length > 0) {
                    handleSelectDrive(response.data.data.notices[0].id);
                }
            } catch (error) {
                toast.error('Failed to load drives');
            } finally {
                setLoading(false);
            }
        };
        fetchDrives();
    }, []);

    const handleSelectDrive = async (id) => {
        setLoadingDetails(true);
        setSelectedDrive(id);
        try {
            const [metricsRes, studentsRes] = await Promise.all([
                api.get(`/drives/${id}/metrics`),
                api.get(`/drives/${id}/students`)
            ]);
            setMetrics(metricsRes.data.data.metrics);
            setStudents(studentsRes.data.data);
        } catch (error) {
            toast.error('Failed to load drive details');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleExport = () => {
        if (!selectedDrive) return;
        window.open(`http://localhost:5000/api/drives/${selectedDrive}/export`, '_blank');
    };

    if (loading) return (
        <div className="loader-overlay">
            <Loader2 className="animate-spin" size={40} />
            <p>Scanning drive data...</p>
        </div>
    );

    return (
        <div className="analytics-container">
            <div className="drive-selector-grid">
                <div className="sidebar-list">
                    <h3 className="section-title">Select Placement Drive</h3>
                    <div className="drive-items">
                        {drives.map(drive => (
                            <button
                                key={drive.id}
                                className={`drive-item ${selectedDrive === drive.id ? 'active' : ''}`}
                                onClick={() => handleSelectDrive(drive.id)}
                            >
                                <div className="drive-dot" />
                                <span>{drive.title}</span>
                            </button>
                        ))}
                        {drives.length === 0 && <p className="empty-text">No placement drives found.</p>}
                    </div>
                </div>

                <div className="analytics-content">
                    {loadingDetails ? (
                        <div className="details-loader">
                            <Loader2 className="animate-spin" />
                            <span>Calculating metrics...</span>
                        </div>
                    ) : metrics ? (
                        <>
                            <div className="metrics-summary">
                                <div className="metric-card">
                                    <div className="metric-icon" style={{ background: '#f0efff', color: 'var(--primary)' }}>
                                        <UserCheck size={24} />
                                    </div>
                                    <div className="metric-data">
                                        <span className="metric-label">Registered Students</span>
                                        <span className="metric-value">{metrics.registeredCount}</span>
                                    </div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-icon" style={{ background: '#fff1f2', color: '#f43f5e' }}>
                                        <UserMinus size={24} />
                                    </div>
                                    <div className="metric-data">
                                        <span className="metric-label">Not Registered</span>
                                        <span className="metric-value">{metrics.notRegisteredCount}</span>
                                    </div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-icon" style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
                                        <Database size={24} />
                                    </div>
                                    <div className="metric-data">
                                        <span className="metric-label">Overall Eligibility</span>
                                        <span className="metric-value">{metrics.totalEligible}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="students-list-section premium-card">
                                <div className="section-header">
                                    <div className="header-left">
                                        <Users size={20} className="primary-icon" />
                                        <h3>Registered Students</h3>
                                    </div>
                                    <button onClick={handleExport} className="btn-export">
                                        <Download size={16} />
                                        <span>Export List</span>
                                    </button>
                                </div>

                                <div className="students-table-wrapper">
                                    <table className="students-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Dept</th>
                                                <th>Year</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, i) => (
                                                <tr key={i}>
                                                    <td className="student-name">{student.name}</td>
                                                    <td className="student-email">{student.email}</td>
                                                    <td><span className="dept-pill">{student.department}</span></td>
                                                    <td>Year {student.year}</td>
                                                </tr>
                                            ))}
                                            {students.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="empty-row">No students registered yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-selection">
                            <BarChart3 size={64} />
                            <h3>Select a drive to view analytics</h3>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .analytics-container { display: flex; flex-direction: column; gap: 2rem; }
                
                .drive-selector-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 2.5rem;
                }

                .sidebar-list {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid var(--border);
                    padding: 1.5rem;
                    height: fit-content;
                }

                .section-title {
                    font-size: 0.875rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: var(--text-light);
                    margin-bottom: 1.5rem;
                    letter-spacing: 0.5px;
                }

                .drive-items { display: flex; flex-direction: column; gap: 0.5rem; }

                .drive-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.875rem 1.25rem;
                    border-radius: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: var(--text);
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .drive-item:hover { background: var(--background); color: var(--primary); }

                .drive-item.active {
                    background: var(--primary-light);
                    color: var(--primary);
                    border-color: var(--primary-light);
                }

                .drive-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--border);
                    transition: all 0.2s;
                }

                .drive-item.active .drive-dot { background: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }

                .analytics-content { display: flex; flex-direction: column; gap: 2rem; }

                .metrics-summary {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }

                .metric-card {
                    background: white;
                    padding: 1.75rem;
                    border-radius: 20px;
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .metric-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .metric-data { display: flex; flex-direction: column; }
                .metric-label { font-size: 0.8125rem; color: var(--text-light); font-weight: 700; }
                .metric-value { font-size: 1.75rem; font-weight: 800; color: var(--text); }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding: 0 0.5rem;
                }

                .header-left { display: flex; align-items: center; gap: 0.75rem; }
                .header-left h3 { font-size: 1.25rem; font-weight: 800; color: var(--text); }
                .primary-icon { color: var(--primary); }

                .btn-export {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.25rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }

                .btn-export:hover { background: var(--primary-hover); transform: translateY(-1px); }

                .students-table { width: 100%; border-collapse: collapse; }
                .students-table th {
                    padding: 1.25rem;
                    text-align: left;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: var(--text-light);
                    border-bottom: 2px solid var(--background);
                    font-weight: 800;
                }
                .students-table td { padding: 1.25rem; border-bottom: 1px solid var(--background); font-size: 0.875rem; }
                .student-name { font-weight: 700; color: var(--text); }
                .student-email { color: var(--text-light); }
                .dept-pill {
                    background: var(--background);
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text);
                }

                .empty-row { padding: 3rem !important; text-align: center; color: var(--text-light); font-style: italic; }
                .loader-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 1rem; color: var(--text-light); font-weight: 600; }
                .details-loader { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 5rem; color: var(--primary); font-weight: 700; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default DriveAnalytics;
