import axios from 'axios';
const base = import.meta.env.VITE_BACKEND_URL || 'https://slotswapper-backend-kdov.onrender.com';
export const api = axios.create({ baseURL: `${base}/api` });

export const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });
