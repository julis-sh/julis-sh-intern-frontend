import React from 'react';
import RequireAdmin from '../components/RequireAdmin';
import api from '../api';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function Toast({ show, message, type, onClose }) {
  if (!show) return null;
  return (
    <div className={`toast show admin-toast bg-${type === 'success' ? 'success' : 'danger'} text-white`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default function FilesPage() {
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });
  const fileInput = React.useRef();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/upload');
      setFiles(res.data);
    } catch {
      setToast({ show: true, message: 'Fehler beim Laden der Dateien.', type: 'danger' });
    }
    setLoading(false);
  };

  React.useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setToast({ show: true, message: 'Datei erfolgreich hochgeladen.', type: 'success' });
      fetchFiles();
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Fehler beim Upload.', type: 'danger' });
    }
    setUploading(false);
    setProgress(0);
  };

  const handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Datei wirklich löschen?')) return;
    try {
      await api.delete(`/upload/${filename}`);
      setToast({ show: true, message: 'Datei gelöscht.', type: 'success' });
      setFiles(files => files.filter(f => f.filename !== filename));
    } catch {
      setToast({ show: true, message: 'Fehler beim Löschen.', type: 'danger' });
    }
  };

  const handleDownload = (filename, originalname) => {
    api.get(`/upload/${filename}`, { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', originalname);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };

  return (
    <RequireAdmin>
      <div className="container-xl mt-4">
        <h2 className="text-white mb-3">Datei-Galerie</h2>
        <div
          className="mb-4 p-4 rounded-3 border border-accent bg-dark text-center"
          style={{ borderStyle: 'dashed', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInput.current?.click()}
        >
          <input type="file" ref={fileInput} style={{ display: 'none' }} disabled={uploading}
            onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} />
          <div className="fs-5 mb-2"><i className="bi bi-cloud-arrow-up me-2"></i>Datei hierher ziehen oder klicken zum Hochladen</div>
          {uploading && <div className="progress mt-2" style={{ height: 8 }}><div className="progress-bar bg-accent" style={{ width: progress + '%' }}></div></div>}
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Lädt...</span></div>
          </div>
        ) : files.length === 0 ? (
          <div className="alert alert-secondary">Noch keine Dateien vorhanden.</div>
        ) : (
          <div className="row g-4">
            {files.map(file => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={file.filename}>
                <div className="card bg-dark text-white rounded-3 h-100 p-3 d-flex flex-column">
                  <div className="mb-2 text-center" style={{ minHeight: 120 }}>
                    {file.mimetype.startsWith('image/') ? (
                      <img src={`/uploads/${file.filename}`} alt={file.originalname} style={{ maxWidth: '100%', maxHeight: 100, borderRadius: 8 }} />
                    ) : (
                      <i className="bi bi-file-earmark-text fs-1 text-accent"></i>
                    )}
                  </div>
                  <div className="mb-1 fw-bold" style={{ wordBreak: 'break-all' }}>{file.originalname}</div>
                  <div className="small text-secondary mb-1">{formatSize(file.size)} • {file.uploader}</div>
                  <div className="small text-secondary mb-2">{new Date(file.createdAt).toLocaleString('de-DE')}</div>
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-outline-light btn-sm flex-fill" onClick={() => handleDownload(file.filename, file.originalname)}><i className="bi bi-download"></i></button>
                    <button className="btn btn-outline-danger btn-sm flex-fill" onClick={() => handleDelete(file.filename)}><i className="bi bi-trash"></i></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      </div>
    </RequireAdmin>
  );
} 