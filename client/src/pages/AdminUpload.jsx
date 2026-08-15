import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { createSong } from '../services/songService';
import UploadForm from '../components/UploadForm';

const AdminUpload = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (form) => {
    await createSong(form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl mb-2">Upload</h1>
      <p className="text-sm text-[var(--text-dim)] mb-6">
        Upload an MP3 and cover image directly, or reference files you've already placed in
        <code className="mx-1 px-1.5 py-0.5 rounded bg-white/10">client/public/audio</code> /
        <code className="mx-1 px-1.5 py-0.5 rounded bg-white/10">client/public/images</code>.
      </p>

      {success && (
        <div className="flex items-center gap-2 text-sm text-teal bg-teal/10 border border-teal/30 rounded-xl px-3 py-2 mb-4">
          <CheckCircle2 size={16} /> Song added successfully.
        </div>
      )}

      <div className="glass rounded-2xl p-5">
        <UploadForm key={success} onSubmit={handleSubmit} submitLabel="Add song" />
      </div>
    </div>
  );
};

export default AdminUpload;
