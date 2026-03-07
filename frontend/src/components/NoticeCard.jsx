import React from 'react';
import { Calendar, Tag, ExternalLink, Paperclip, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../services/api';

const NoticeCard = ({ notice }) => {
  const navigate = useNavigate();
  const {
    _id,
    title,
    description,
    category,
    postedDate,
    eventLink,
    attachments,
    isPinned,
    createdBy,
    isRead
  } = notice;

  const handleCardClick = () => {
    navigate(`/notices/${_id}`);
  };

  const formattedDate = new Date(postedDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const imageAttachment = attachments?.find(a => a.fileType === 'image');

  return (
    <div
      className={`card notice-card ${isPinned ? 'pinned' : ''} fade-in`}
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {imageAttachment && (
        <div style={{ height: '160px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
          <img
            src={imageAttachment.url.startsWith('http') ? imageAttachment.url : `${BACKEND_URL}${imageAttachment.url.startsWith('/') ? '' : '/'}${imageAttachment.url}`}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <h3 style={{ color: '#000080', margin: 0, fontSize: '1.2rem' }}>{title}</h3>
            {!isRead && (
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.6rem',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>NEW</span>
            )}
          </div>
          {isPinned && <Pin size={16} style={{ color: '#000080' }} fill="#000080" />}
        </div>

        <p style={{
          color: '#666',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#999', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Calendar size={12} style={{ marginRight: '0.3rem' }} />
          {formattedDate}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tag size={12} style={{ marginRight: '0.3rem' }} />
          <span style={{
            backgroundColor: '#f0f4ff',
            color: '#000080',
            padding: '1px 6px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }}>
            {category}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          By: {createdBy?.name || 'Admin'}
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
