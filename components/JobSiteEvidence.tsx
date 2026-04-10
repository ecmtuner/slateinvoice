'use client';
import { useState, useEffect, useRef } from 'react';

interface Photo { id: string; url: string; }

interface JobSiteEvidenceProps {
  invoiceId: string;
  userPlan: string;
}

const glassCard = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
};

const upgradeCard = {
  background: 'rgba(251,191,36,0.06)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(251,191,36,0.25)',
  borderRadius: '16px',
};

export default function JobSiteEvidence({ invoiceId, userPlan }: JobSiteEvidenceProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [captureLoading, setCaptureLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Load existing photos and location
  useEffect(() => {
    if (userPlan !== 'business') return;
    fetch(`/api/invoices/${invoiceId}/photos`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPhotos(data); });

    // Load existing location from invoice
    fetch(`/api/invoices/${invoiceId}`)
      .then(r => r.json())
      .then(inv => {
        if (inv.locationLat && inv.locationAddress) {
          setLocation({ lat: inv.locationLat, lng: inv.locationLng, address: inv.locationAddress });
        }
      });
  }, [invoiceId, userPlan]);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setCaptureLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          // Reverse geocode via Nominatim
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'User-Agent': 'SlateInvoice/1.0' } }
          );
          const geoData = await geo.json();
          const address = geoData.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

          // Save to DB
          await fetch(`/api/invoices/${invoiceId}/location`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng, address }),
          });
          setLocation({ lat, lng, address });
        } catch {
          setError('Could not reverse geocode location');
        }
        setCaptureLoading(false);
      },
      (err) => {
        setError('Location access denied: ' + err.message);
        setCaptureLoading(false);
      }
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (photos.length + files.length > 10) {
      setError(`Can only upload ${10 - photos.length} more photo(s)`);
      return;
    }
    setError('');
    setUploadingCount(files.length);

    for (const file of files) {
      try {
        // Upload to Cloudinary (unsigned)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'slateinvoice_photos');
        const cloudRes = await fetch('https://api.cloudinary.com/v1_1/ddiz0qiek/image/upload', {
          method: 'POST',
          body: formData,
        });
        const cloudData = await cloudRes.json();
        if (!cloudData.secure_url) throw new Error('Cloudinary upload failed');

        // Save to DB
        const dbRes = await fetch(`/api/invoices/${invoiceId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cloudData.secure_url }),
        });
        const dbData = await dbRes.json();
        if (dbData.id) {
          setPhotos(prev => [...prev, { id: dbData.id, url: dbData.url }]);
        }
      } catch (err) {
        setError('Failed to upload one or more photos');
      }
      setUploadingCount(prev => prev - 1);
    }

    // Reset file input
    if (fileRef.current) fileRef.current.value = '';
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Remove this photo?')) return;
    await fetch(`/api/invoices/${invoiceId}/photos/${photoId}`, { method: 'DELETE' });
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const hasEvidence = !!(location || photos.length > 0);

  // Upgrade CTA for non-business users
  if (userPlan !== 'business') {
    return (
      <div className="p-5" style={upgradeCard}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Chargeback Protection</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(251,191,36,0.2)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.4)' }}>
                Business Plan
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Add GPS location + job site photos to protect against payment disputes.
              Evidence is shown on the pay page to build client trust.
            </p>
            <a href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#FCD34D' }}>
              Upgrade to Business →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5" style={glassCard}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider"
            style={{ background: 'linear-gradient(90deg, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            📍 Job Site Evidence
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.4)' }}>
            Business Plan
          </span>
        </div>
        {hasEvidence && (
          <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.3)' }}>
            ✓ Chargeback Protected
          </span>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2.5 rounded-xl text-xs"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
          {error}
        </div>
      )}

      {/* Location section */}
      <div className="mb-4">
        <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>📍 Location:</p>
        {location ? (
          <div className="flex items-start gap-2">
            <div className="flex-1 p-2.5 rounded-xl text-xs" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#86EFAC' }}>
              <span className="font-medium">✓ </span>{location.address}
            </div>
            <a href={`https://maps.google.com/?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer"
              className="text-xs px-2 py-2.5 rounded-xl transition-all flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              🗺️
            </a>
            <button onClick={() => setLocation(null)}
              className="text-xs px-2 py-2.5 rounded-xl transition-all flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.6)', border: '1px solid rgba(239,68,68,0.2)' }}>
              ×
            </button>
          </div>
        ) : (
          <button onClick={captureLocation} disabled={captureLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#C4B5FD' }}>
            {captureLoading ? '⏳ Getting location...' : '📍 Capture My Location'}
          </button>
        )}
      </div>

      {/* Photos section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>📸 Job Photos ({photos.length}/10):</p>
          {photos.length < 10 && (
            <button onClick={() => fileRef.current?.click()}
              disabled={uploadingCount > 0}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-60"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#C4B5FD' }}>
              {uploadingCount > 0 ? `Uploading ${uploadingCount}...` : '+ Add Photos'}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
            {photos.map(photo => (
              <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="Job site"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setLightboxUrl(photo.url)}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePhoto(photo.id); }}
                    className="text-white text-lg font-bold leading-none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {photos.length === 0 && uploadingCount === 0 && (
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No photos yet. Add up to 10 job site photos.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={() => setLightboxUrl(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Job site photo"
            className="max-w-full max-h-full rounded-2xl object-contain"
            style={{ maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold leading-none"
            onClick={() => setLightboxUrl(null)}
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
