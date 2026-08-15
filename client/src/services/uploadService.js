import api from './api';

export const uploadAudio = async (file, onProgress) => {
  const form = new FormData();
  form.append('audio', file);
  const { data } = await api.post('/upload/audio', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress) onProgress(Math.round((evt.loaded * 100) / evt.total));
    }
  });
  return data;
};

export const uploadImage = async (file, onProgress) => {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/upload/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress) onProgress(Math.round((evt.loaded * 100) / evt.total));
    }
  });
  return data;
};

export const getStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};
