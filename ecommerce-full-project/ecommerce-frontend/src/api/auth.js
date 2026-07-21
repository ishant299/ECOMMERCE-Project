import api from './axios';

export const registerUser = (data) => api.post('/auth/register', data).then((r) => r.data);
export const loginUser = (data) => api.post('/auth/login', data).then((r) => r.data);
export const logoutUser = () => api.post('/auth/logout').then((r) => r.data);
export const getProfile = () => api.get('/auth/me').then((r) => r.data);
export const updateProfile = (data) => api.put('/auth/me', data).then((r) => r.data);
