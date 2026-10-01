// Comprehensive mock data engine for NoticeHub
// Allows full interactive demo without requiring backend or MongoDB

export const MOCK_ADMIN_USER = {
    id: 'admin-001',
    _id: 'admin-001',
    name: 'Super Admin',
    email: 'admin@college.edu',
    role: 'ADMIN',
    department: 'Administration',
    year: 'Faculty'
};

export const MOCK_STUDENT_USER = {
    id: 'student-001',
    _id: 'student-001',
    name: 'johndoe',
    email: 'john@college.edu',
    role: 'STUDENT',
    department: 'Computer Science',
    year: '3rd Year'
};

export const DEFAULT_NOTICES = [
    {
        _id: 'mock-notice-1',
        id: 'mock-notice-1',
        title: 'Orientation Program 2026',
        description: 'Mandatory orientation for all first-year students in the main auditorium.',
        category: 'Academic',
        isPinned: true,
        isRead: false,
        readCount: 8,
        unreadCount: 4,
        viewsCount: 342,
        postedDate: '2026-03-07T09:00:00.000Z',
        createdAt: '2026-03-07T09:00:00.000Z',
        createdBy: { name: 'Super Admin', email: 'admin@college.edu' },
        attachments: [],
        eventLink: ''
    },
    {
        _id: 'mock-notice-2',
        id: 'mock-notice-2',
        title: 'Placement Training - TCS',
        description: 'TCS Inframind training sessions starting next Monday. Register via the link.',
        category: 'Placements',
        isPinned: false,
        isRead: false,
        readCount: 20,
        unreadCount: 6,
        viewsCount: 528,
        postedDate: '2026-03-07T10:00:00.000Z',
        createdAt: '2026-03-07T10:00:00.000Z',
        createdBy: { name: 'Super Admin', email: 'admin@college.edu' },
        attachments: [],
        eventLink: 'https://careers.tcs.com/campus-2026'
    },
    {
        _id: 'mock-notice-3',
        id: 'mock-notice-3',
        title: 'Semester Exam Schedule',
        description: 'The final semester exam schedule is now available for download.',
        category: 'Exams',
        isPinned: false,
        isRead: false,
        readCount: 23,
        unreadCount: 6,
        viewsCount: 489,
        postedDate: '2026-03-07T11:00:00.000Z',
        createdAt: '2026-03-07T11:00:00.000Z',
        createdBy: { name: 'Super Admin', email: 'admin@college.edu' },
        attachments: [],
        eventLink: ''
    },
    {
        _id: 'mock-notice-4',
        id: 'mock-notice-4',
        title: 'Annual Cultural Fest - Revels',
        description: 'Join the annual cultural fest Revels 2026. Registrations are now open.',
        category: 'Events',
        isPinned: false,
        isRead: false,
        readCount: 10,
        unreadCount: 9,
        viewsCount: 612,
        postedDate: '2026-03-07T12:00:00.000Z',
        createdAt: '2026-03-07T12:00:00.000Z',
        createdBy: { name: 'Super Admin', email: 'admin@college.edu' },
        attachments: [],
        eventLink: 'https://revels2026.college.edu'
    }
];

// LocalStorage helpers to persist modifications during demo
export const getStoredNotices = () => {
    try {
        const stored = localStorage.getItem('demo_notices');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title && (parsed[0]?._id || parsed[0]?.id)) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Failed to parse stored notices', e);
    }
    try {
        localStorage.setItem('demo_notices', JSON.stringify(DEFAULT_NOTICES));
    } catch (e) {
        // Quota or access error
    }
    return [...DEFAULT_NOTICES];
};

export const saveStoredNotices = (notices) => {
    try {
        localStorage.setItem('demo_notices', JSON.stringify(notices));
    } catch (e) {
        console.warn('Failed to save notices to localStorage (quota or disabled):', e);
    }
};

export const mockGetNotices = (filters = {}) => {
    let notices = getStoredNotices();
    
    if (filters.category && filters.category !== 'All') {
        notices = notices.filter(n => n.category.toLowerCase() === filters.category.toLowerCase());
    }
    
    if (filters.search) {
        const term = filters.search.toLowerCase();
        notices = notices.filter(n => 
            n.title.toLowerCase().includes(term) || 
            n.description.toLowerCase().includes(term)
        );
    }

    // Sort pinned first, then by date
    notices.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
            return new Date(b.postedDate) - new Date(a.postedDate);
        }
        return a.isPinned ? -1 : 1;
    });

    return notices;
};

export const mockGetNoticeById = (id) => {
    const notices = getStoredNotices();
    const notice = notices.find(n => 
        n._id === id || 
        n.id === id || 
        String(n._id) === String(id) || 
        String(n.id) === String(id)
    );
    if (notice) {
        notice.isRead = true;
        saveStoredNotices(notices);
        return notice;
    }
    return notices[0] || DEFAULT_NOTICES[0];
};

export const unpackFormData = async (formData) => {
    if (!formData) return {};
    let data = formData;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            data = {};
        }
    }

    if (!(data instanceof FormData)) {
        const result = { ...(typeof data === 'object' ? data : {}) };
        if (!Array.isArray(result.attachments)) {
            result.attachments = [];
        }
        return result;
    }

    const result = { attachments: [], existingAttachments: undefined };
    for (const [key, value] of data.entries()) {
        if (key === 'attachments') {
            if (value instanceof File || value instanceof Blob) {
                const dataUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result || '');
                    reader.onerror = () => resolve('');
                    reader.readAsDataURL(value);
                });
                if (dataUrl) {
                    result.attachments.push({
                        url: dataUrl,
                        fileType: (value.type && value.type.includes('pdf')) ? 'pdf' : 'image',
                        filename: value.name || 'attachment.jpg'
                    });
                }
            } else if (typeof value === 'string' && value && value !== '[object File]') {
                result.attachments.push({
                    url: value,
                    fileType: value.includes('pdf') ? 'pdf' : 'image',
                    filename: 'attachment'
                });
            }
        } else if (key === 'existingAttachments') {
            try {
                const parsed = JSON.parse(value);
                result.existingAttachments = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                result.existingAttachments = [];
            }
        } else {
            result[key] = value;
        }
    }
    return result;
};

export const mockCreateNotice = async (formData) => {
    const notices = getStoredNotices();
    const unpacked = await unpackFormData(formData);

    const title = unpacked.title || 'New Announcement';
    const description = unpacked.description || 'Notice description';
    const category = unpacked.category || 'Academic';
    const eventLink = unpacked.eventLink || '';
    const isPinned = unpacked.isPinned === 'true' || unpacked.isPinned === true;
    const attachments = unpacked.attachments || [];

    const newNotice = {
        _id: 'mock-notice-' + Date.now(),
        id: 'mock-notice-' + Date.now(),
        title,
        description,
        category,
        eventLink,
        isPinned,
        isRead: false,
        readCount: 1,
        unreadCount: 0,
        viewsCount: 1,
        postedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: { name: 'Super Admin', email: 'admin@college.edu' },
        attachments
    };

    notices.unshift(newNotice);
    saveStoredNotices(notices);
    return newNotice;
};

export const mockUpdateNotice = async (id, data) => {
    const notices = getStoredNotices();
    const index = notices.findIndex(n => 
        n._id === id || 
        n.id === id || 
        String(n._id) === String(id) || 
        String(n.id) === String(id)
    );
    if (index !== -1) {
        const unpacked = await unpackFormData(data);
        const existing = notices[index];
        
        // Base attachments: either updated existing attachments, or previous ones
        let baseAttachments = (unpacked.existingAttachments !== undefined)
            ? unpacked.existingAttachments
            : (existing.attachments || []);

        const newAttachments = unpacked.attachments || [];
        const finalAttachments = [...baseAttachments, ...newAttachments];

        notices[index] = {
            ...existing,
            ...unpacked,
            attachments: finalAttachments,
            isPinned: unpacked.isPinned === 'true' || unpacked.isPinned === true || (unpacked.isPinned === undefined ? existing.isPinned : false),
            updatedAt: new Date().toISOString()
        };
        saveStoredNotices(notices);
        return notices[index];
    }
    return null;
};

export const mockDeleteNotice = (id) => {
    let notices = getStoredNotices();
    notices = notices.filter(n => 
        n._id !== id && 
        n.id !== id && 
        String(n._id) !== String(id) && 
        String(n.id) !== String(id)
    );
    saveStoredNotices(notices);
    return true;
};

export const mockTogglePin = (id) => {
    const notices = getStoredNotices();
    const notice = notices.find(n => n._id === id || n.id === id);
    if (notice) {
        notice.isPinned = !notice.isPinned;
        saveStoredNotices(notices);
        return notice;
    }
    return null;
};

export const mockGetStats = () => {
    const notices = getStoredNotices();
    const read = notices.filter(n => n.isRead).length;
    return {
        total: Math.max(12, notices.length),
        read: read > 0 ? (8 + read) : 8,
        unread: Math.max(1, 4 - read),
        isGlobal: true
    };
};

export const mockDriveList = [
    { id: 'drive-1', _id: 'drive-1', title: 'TCS Inframind Recruitment 2026', category: 'DRIVE', isArchived: false, createdAt: '2026-09-28' },
    { id: 'drive-2', _id: 'drive-2', title: 'TechCorp Software Engineering Drive', category: 'DRIVE', isArchived: false, createdAt: '2026-09-27' },
    { id: 'drive-3', _id: 'drive-3', title: 'Infosys Specialist Programmer Hiring', category: 'DRIVE', isArchived: false, createdAt: '2026-09-25' }
];

export const mockDriveMetrics = {
    totalRegistrations: 142,
    shortListed: 38,
    attended: 120,
    departmentBreakdown: {
        'Computer Science': 65,
        'Information Technology': 42,
        'Electronics & Comm': 35
    }
};

export const mockDriveStudents = [
    { id: 's1', name: 'Rahul Sharma', email: 'rahul.s@college.edu', department: 'Computer Science', year: '4th Year', status: 'Shortlisted' },
    { id: 's2', name: 'Priya Patel', email: 'priya.p@college.edu', department: 'Information Technology', year: '4th Year', status: 'Registered' },
    { id: 's3', name: 'Aditya Verma', email: 'aditya.v@college.edu', department: 'Electronics & Comm', year: '4th Year', status: 'Shortlisted' },
    { id: 's4', name: 'Sneha Roy', email: 'sneha.r@college.edu', department: 'Computer Science', year: '4th Year', status: 'Registered' },
    { id: 's5', name: 'Karan Mehra', email: 'karan.m@college.edu', department: 'Computer Science', year: '4th Year', status: 'Attended' }
];

export const mockPlatformAnalytics = {
    totalNotices: 15,
    totalUsers: 840,
    totalReads: 2450
};
