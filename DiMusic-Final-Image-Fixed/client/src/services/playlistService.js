import api from './api';

export const getPlaylists = async () => {
  const { data } = await api.get('/playlists');
  return data;
};

export const getPlaylist = async (id) => {
  const { data } = await api.get(`/playlists/${id}`);
  return data;
};

export const createPlaylist = async (payload) => {
  const { data } = await api.post('/playlists', payload);
  return data;
};

export const updatePlaylist = async (id, payload) => {
  const { data } = await api.put(`/playlists/${id}`, payload);
  return data;
};

export const deletePlaylist = async (id) => {
  const { data } = await api.delete(`/playlists/${id}`);
  return data;
};
