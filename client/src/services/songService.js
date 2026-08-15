import api from './api';

export const getSongs = async (params = {}) => {
  const { data } = await api.get('/songs', { params });
  return data;
};

export const getSong = async (id) => {
  const { data } = await api.get(`/songs/${id}`);
  return data;
};

export const createSong = async (payload) => {
  const { data } = await api.post('/songs', payload);
  return data;
};

export const updateSong = async (id, payload) => {
  const { data } = await api.put(`/songs/${id}`, payload);
  return data;
};

export const deleteSong = async (id) => {
  const { data } = await api.delete(`/songs/${id}`);
  return data;
};

export const registerPlay = async (id) => {
  const { data } = await api.patch(`/songs/${id}/play`);
  return data;
};
