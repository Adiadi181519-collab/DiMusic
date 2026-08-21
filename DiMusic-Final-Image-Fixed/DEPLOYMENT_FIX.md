# DiMusic final Render fix

## Required Render frontend environment variable
VITE_API_URL=https://dimusic.onrender.com/api

Redeploy the frontend after changing this value.

## Fixed
- API calls use VITE_API_URL.
- Audio paths beginning with /uploads/ load from the backend.
- Image paths beginning with /uploads/ load from the backend.
- Client public paths such as /audio/... and /images/... load from the frontend.
- Full http/https Cloudinary/S3 URLs continue to work.

## Important for uploads on Render
The current backend stores uploaded files in server/uploads. Render's normal filesystem is not permanent.
For permanent media, configure persistent storage or move uploads to Cloudinary/S3.
