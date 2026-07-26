// This file is the REAL API layer that talks to your backend.
const API_URL = 'http://localhost:3001';

const api = {
    // Helper function to handle all fetch requests and add the auth token
    _fetch: async (endpoint, options = {}) => {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }
        return response.json();
    },

    // --- Authentication ---
    registerUser: (username, password, email) => api._fetch('/api/register', { method: 'POST', body: JSON.stringify({ username, password, email }) }),
    loginUser: async (username, password) => {
        const response = await api._fetch('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }
        return response;
    },
    logoutUser: () => localStorage.removeItem('authToken'),
    updatePassword: (currentPassword, newPassword) => api._fetch('/api/password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),

    // --- Data ---
    loadAllUserData: () => api._fetch('/api/moods'),
    saveMood: (moodEntry) => api._fetch('/api/moods', { method: 'POST', body: JSON.stringify(moodEntry) }),
    getProfileData: () => api._fetch('/api/profile'),
    
    // --- SCHEDULER FUNCTIONS (Corrected to use the backend API) ---
    loadSchedule: () => api._fetch('/api/schedule'),
    saveSchedule: (scheduleData) => api._fetch('/api/schedule', { method: 'POST', body: JSON.stringify(scheduleData) }),
    cancelSchedule: () => api._fetch('/api/schedule', { method: 'DELETE' }),
    sendTestEmail: (email, subject, quote) => api._fetch('/send-email', { method: 'POST', body: JSON.stringify({ to: email, subject, quote }) }),
};

window.api = api;