import API from './api';

export const authService = {
  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },
};

export const facilityService = {
  getFacilities: async (params) => {
    const res = await API.get('/facilities', { params });
    return res.data;
  },
  getFacilityById: async (id) => {
    const res = await API.get(`/facilities/${id}`);
    return res.data;
  },
  createFacility: async (data) => {
    const res = await API.post('/facilities', data);
    return res.data;
  },
  updateFacility: async (id, data) => {
    const res = await API.put(`/facilities/${id}`, data);
    return res.data;
  },
  deleteFacility: async (id) => {
    const res = await API.delete(`/facilities/${id}`);
    return res.data;
  },
};

export const standardService = {
  getStandards: async (params) => {
    const res = await API.get('/standards', { params });
    return res.data;
  },
  createStandard: async (data) => {
    const res = await API.post('/standards', data);
    return res.data;
  },
  updateStandard: async (id, data) => {
    const res = await API.put(`/standards/${id}`, data);
    return res.data;
  },
  deleteStandard: async (id) => {
    const res = await API.delete(`/standards/${id}`);
    return res.data;
  },
};

export const inspectionService = {
  getInspections: async (params) => {
    const res = await API.get('/inspections', { params });
    return res.data;
  },
  getInspectionById: async (id) => {
    const res = await API.get(`/inspections/${id}`);
    return res.data;
  },
  createInspection: async (formData) => {
    const res = await API.post('/inspections', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteInspection: async (id) => {
    const res = await API.delete(`/inspections/${id}`);
    return res.data;
  },
};

export const violationService = {
  getViolations: async (params) => {
    const res = await API.get('/violations', { params });
    return res.data;
  },
  getViolationById: async (id) => {
    const res = await API.get(`/violations/${id}`);
    return res.data;
  },
  createViolation: async (data) => {
    const res = await API.post('/violations', data);
    return res.data;
  },
  updateViolation: async (id, data) => {
    const res = await API.put(`/violations/${id}`, data);
    return res.data;
  },
  deleteViolation: async (id) => {
    const res = await API.delete(`/violations/${id}`);
    return res.data;
  },
};

export const actionService = {
  getCorrectiveActions: async (params) => {
    const res = await API.get('/corrective-actions', { params });
    return res.data;
  },
  getActionById: async (id) => {
    const res = await API.get(`/corrective-actions/${id}`);
    return res.data;
  },
  createCorrectiveAction: async (data) => {
    const res = await API.post('/corrective-actions', data);
    return res.data;
  },
  updateCorrectiveAction: async (id, formData) => {
    const res = await API.put(`/corrective-actions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export const analyticsService = {
  getDashboardAnalytics: async () => {
    const res = await API.get('/analytics/dashboard');
    return res.data;
  },
};

export const reportService = {
  getInspectionReport: async (id) => {
    const res = await API.get(`/reports/inspection/${id}`);
    return res.data;
  },
};

export const notificationService = {
  getNotifications: async () => {
    const res = await API.get('/notifications');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await API.put(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await API.put('/notifications/read-all');
    return res.data;
  },
};

export const userService = {
  getUsers: async () => {
    const res = await API.get('/users');
    return res.data;
  },
  createUser: async (data) => {
    const res = await API.post('/users', data);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await API.put(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await API.delete(`/users/${id}`);
    return res.data;
  },
};
