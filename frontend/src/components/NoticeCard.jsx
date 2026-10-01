import React from 'react';
import { Calendar, Tag, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../services/api';

const NoticeCard = ({ notice }) => {
  const navigate = useNavigate();
  const {
    _id,
    id,
    title,
    description,
    category,
    postedDate,
    attachments,
    isPinned,
    createdBy,
    isRead
  } = notice;

  const handleCardClick = () => {
    navigate(`/notices/${_id || id}`);
  };

  const rawDate = postedDate || notice.createdAt || '2026-03-07T09:00:00.000Z';
  const parsedDate = new Date(rawDate);
  const formattedDate = isNaN(parsedDate.getTime()) ? '7 Mar 2026' : parsedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const imageAttachment = attachments?.find(a => 
    a.fileType === 'image' || 
    (a.url && (a.url.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)/i.test(a.url)))
  );
  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div
      className="card fade-in"
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isPinned ? '#f6f8fe' : '#ffffff',
        borderLeft: isPinned ? '4px solid #000080' : '4px solid #FF8C00',
        borderRadius: '12px',
        padding: '1.5rem 1.8rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {imageAttachment && (
        <div style={{ height: '160px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
          <img
            src={getMediaUrl(imageAttachment.url)}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h3 style={{ color: '#000080', margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h3>
            {!isRead && (
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>NEW</span>
            )}
          </div>
          {isPinned && <Pin size={18} style={{ color: '#000080' }} fill="#000080" />}
        </div>

        <p style={{
          color: '#4b5563',
          margin: '0.5rem 0 1.25rem 0',
          fontSize: '0.95rem',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
          <Calendar size={14} style={{ marginRight: '0.4rem' }} />
          {formattedDate}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tag size={14} style={{ marginRight: '0.4rem', color: '#6b7280' }} />
          <span style={{
            color: '#000080',
            fontWeight: 'bold'
          }}>
            {category}
          </span>
        </div>
        <div style={{ color: '#6b7280' }}>
          By: {createdBy?.name || 'Super Admin'}
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
