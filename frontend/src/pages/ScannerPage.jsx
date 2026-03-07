import React from 'react';
import { ImageScanner } from '../components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ScannerPage = () => {
    const navigate = useNavigate();

    const handleCapture = (base64) => {
        // In a real app, we might navigate back to Create Notice with this image
        console.log('Captured image:', base64);
        toast.info('Image captured! You can now use this in your notice.');
    };

    return (
        <div className="scanner-page fade-in" style={{
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80vh',
            justifyContent: 'center'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ color: '#000080', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Document Scanner</h1>
                <p style={{ color: '#666' }}>Align the notice within the frame and capture a high-quality photo.</p>
            </div>

            <div style={{ width: '100%', maxWidth: '800px' }}>
                <ImageScanner onCapture={handleCapture} onClose={() => navigate('/')} />
            </div>
        </div>
    );
};

export default ScannerPage;
