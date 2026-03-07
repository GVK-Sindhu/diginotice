import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, X } from 'lucide-react';

const ImageScanner = ({ onCapture, onClose }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    const confirm = () => {
        onCapture(imgSrc);
        onClose();
    };

    return (
        <div className="scanner-modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <div style={{ position: 'relative', maxWidth: '640px', width: '100%', backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '-1rem', right: '-1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px' }}
                >
                    <X size={18} />
                </button>

                <h2 style={{ color: '#000080', marginBottom: '1.5rem', textAlign: 'center' }}>Notice Scanner</h2>

                {!imgSrc ? (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                ) : (
                    <img src={imgSrc} alt="captured" style={{ width: '100%', borderRadius: '8px' }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    {!imgSrc ? (
                        <button
                            className="btn-primary"
                            onClick={capture}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Camera size={20} />
                            Capture Photo
                        </button>
                    ) : (
                        <>
                            <button
                                className="btn-secondary"
                                onClick={retake}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#666' }}
                            >
                                <RefreshCw size={20} />
                                Retake
                            </button>
                            <button
                                className="btn-primary"
                                onClick={confirm}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#28a745' }}
                            >
                                <Check size={20} />
                                Use Photo
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageScanner;
