const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://dimusic.onrender.com/api';

const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const getMediaUrl = (url = '') => {
  if (!url) return '';

  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Express-hosted media
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_URL}${url}`;
  }

  // Client public media such as /images/foo.jpg or /audio/foo.mp3
  if (url.startsWith('/')) {
    return url;
  }

  return `${BACKEND_URL}/${url}`;
};

export default getMediaUrl;
