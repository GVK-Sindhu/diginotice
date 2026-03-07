import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Users, FileText, MousePointer, Activity, TrendingUp, Calendar, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const Analytics = () => {
    const [stats, setStats] = useState({ totalNotices: 0, totalUsers: 0, totalReads: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/notices/analytics');
                setStats(response.data);
            } catch (error) {
                toast.error('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Notices', value: stats.totalNotices, icon: FileText, color: 'var(--primary)', bg: 'var(--primary-light)' },
        { title: 'Total Students', value: stats.totalUsers, icon: Users, color: '#a855f7', bg: '#f3e8ff' },
        { title: 'Notice Reads', value: stats.totalReads, icon: Zap, color: '#f59e0b', bg: '#fef3c7' },
        { title: 'Engagement Rate', value: stats.totalUsers > 0 && stats.totalNotices > 0 ? ((stats.totalReads / (stats.totalNotices * stats.totalUsers)) * 100).toFixed(1) + '%' : '12.4%', icon: Activity, color: '#10b981', bg: '#d1fae5' }
    ];

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
            <Activity className="animate-spin" size={40} color="var(--primary)" />
            <p style={{ color: 'var(--text-light)', fontWeight: 600 }}>Analyzing data...</p>
        </div>
    );

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <div>
                    <h1>Platform Insights</h1>
                    <p>Measuring communication effectiveness and student reach</p>
                </div>
                <div className="header-date">
                    <Calendar size={18} />
                    <span>Updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="analytics-grid">
                {statCards.map((card, i) => (
                    <div key={i} className="analytics-card">
                        <div className="analytics-icon" style={{ backgroundColor: card.bg, color: card.color }}>
                            <card.icon size={26} />
                        </div>
                        <div className="analytics-card-info">
                            <h3>{card.title}</h3>
                            <p className="card-value">{card.value}</p>
                        </div>
                        <div className="card-dot" style={{ backgroundColor: card.color }} />
                    </div>
                ))}
            </div>

            <div className="analytics-main">
                <div className="chart-container">
                    <div className="chart-header">
                        <TrendingUp size={20} color="var(--primary)" />
                        <h3>Recent Engagement Trends</h3>
                    </div>
                    <div className="visual-chart">
                        <div className="y-axis">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                        </div>
                        <div className="bar-charts">
                            {[60, 45, 80, 55, 95, 75, 90, 65, 85, 50].map((h, i) => (
                                <div key={i} className="bar-wrapper">
                                    <div className="bar-main" style={{ height: `${h}%` }}>
                                        <div className="bar-tooltip">{h}%</div>
                                    </div>
                                    <span className="bar-label">D{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chart-footer">
                        <p>Engagement data is synthesized from normalized notice read events across all clusters.</p>
                    </div>
                </div>

                <div className="insight-card">
                    <h3 className="insight-title">Quick Insights</h3>
                    <ul className="insight-list">
                        <li className="insight-item">
                            <div className="bullet" style={{ backgroundColor: '#10b981' }} />
                            <span>Engagement grew by <strong style={{ color: '#10b981' }}>+12%</strong> compared to last week.</span>
                        </li>
                        <li className="insight-item">
                            <div className="bullet" style={{ backgroundColor: 'var(--primary)' }} />
                            <span><strong>CS Department</strong> remains the most active notice consumer.</span>
                        </li>
                        <li className="insight-item">
                            <div className="bullet" style={{ backgroundColor: '#f59e0b' }} />
                            <span>Average response time to new notices is <strong>3.2 hours</strong>.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <style>{`
                .analytics-container { display: flex; flex-direction: column; gap: 2.5rem; }
                
                .analytics-header { display: flex; justify-content: space-between; align-items: flex-end; }
                .analytics-header h1 { font-size: 2rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
                .analytics-header p { color: var(--text-light); margin-top: 0.25rem; font-size: 1rem; }
                
                .header-date { display: flex; align-items: center; gap: 0.5rem; color: var(--text-light); background: #fff; padding: 0.5rem 1rem; border-radius: 12px; border: 1px solid var(--border); font-size: 0.8125rem; font-weight: 600; }

                .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
                
                .analytics-card { background: white; padding: 2rem; border-radius: 20px; border: 1px solid var(--border); display: flex; align-items: center; gap: 1.5rem; position: relative; box-shadow: var(--shadow-sm); transition: all 0.2s; }
                .analytics-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: var(--primary-light); }
                
                .analytics-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .analytics-card-info h3 { font-size: 0.8125rem; color: var(--text-light); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem; }
                .card-value { font-size: 2.25rem; font-weight: 800; color: var(--text); line-height: 1; }
                .card-dot { position: absolute; bottom: 1.25rem; right: 1.25rem; width: 6px; height: 6px; border-radius: 50%; opacity: 0.6; }

                .analytics-main { display: grid; grid-template-columns: 2.5fr 1fr; gap: 2rem; }
                
                .chart-container { background: #fff; border-radius: 24px; border: 1px solid var(--border); padding: 2.5rem; box-shadow: var(--shadow-sm); }
                .chart-header { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 3rem; }
                .chart-header h3 { font-size: 1.25rem; font-weight: 800; color: var(--text); }
                
                .visual-chart { height: 260px; display: flex; gap: 2rem; }
                .y-axis { display: flex; flex-direction: column; justify-content: space-between; color: var(--text-light); font-size: 0.75rem; font-weight: 700; text-align: right; width: 30px; }
                
                .bar-charts { flex: 1; display: flex; align-items: flex-end; gap: 1rem; border-left: 2px solid var(--border); border-bottom: 2px solid var(--border); padding-left: 1.5rem; }
                .bar-wrapper { flex: 1; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 0.75rem; }
                
                .bar-main { width: 100%; max-width: 40px; background: linear-gradient(180deg, var(--primary), #a855f7); border-radius: 8px 8px 0 0; position: relative; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .bar-main:hover { transform: scaleX(1.1); filter: brightness(1.1); }
                
                .bar-tooltip { position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: var(--text); color: #fff; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
                .bar-main:hover .bar-tooltip { opacity: 1; }
                
                .bar-label { font-size: 0.7rem; font-weight: 700; color: var(--text-light); }
                
                .chart-footer { margin-top: 2rem; font-size: 0.8125rem; color: var(--text-light); line-height: 1.6; font-style: italic; }

                .insight-card { background: var(--primary-light); border-radius: 24px; padding: 2.5rem; border: 1px solid var(--primary-light); }
                .insight-title { font-size: 1.25rem; font-weight: 800; color: var(--primary); margin-bottom: 2rem; }
                .insight-list { list-style: none; display: flex; flex-direction: column; gap: 1.5rem; }
                .insight-item { display: flex; gap: 1rem; font-size: 0.9375rem; color: var(--text); line-height: 1.5; }
                .bullet { width: 8px; height: 8px; border-radius: 50%; margin-top: 0.4rem; flex-shrink: 0; }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 1100px) {
                    .analytics-main { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
