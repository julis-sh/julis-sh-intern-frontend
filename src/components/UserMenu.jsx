import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

function getUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

function getTokenExp() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return null;
    return payload.exp * 1000; // exp ist in Sekunden
  } catch {
    return null;
  }
}

function formatTimeLeft(ms) {
  if (ms <= 0) return 'abgelaufen';
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')} min`;
}

const navLinks = [
  { name: 'Dashboard', icon: 'bi-house', href: '/' },
  { name: 'Neue Mail senden', icon: 'bi-envelope', href: '/mail' },
  { name: 'Empfänger', icon: 'bi-people', href: '/recipients', admin: true },
  { name: 'Mail-Templates', icon: 'bi-card-text', href: '/templates', admin: true },
  { name: 'Benutzer', icon: 'bi-person-badge', href: '/users', admin: true },
  { name: 'Stammdaten', icon: 'bi-database', href: '/stammdaten', admin: true },
  { name: 'Audit-Log', icon: 'bi-gear', href: '/auditlog', admin: true },
];

function SessionToast({ show, timeLeft }) {
  if (!show) return null;
  return (
    <div className="toast show admin-toast bg-warning text-dark" role="alert" aria-live="assertive" aria-atomic="true" style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 3000 }}>
      <div className="d-flex align-items-center">
        <i className="bi bi-hourglass-split me-2"></i>
        <div className="toast-body">
          Deine Session läuft in {formatTimeLeft(timeLeft)} ab. Bitte bleibe aktiv oder speichere deine Arbeit.
        </div>
      </div>
    </div>
  );
}

export default function UserMenu() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false); // Desktop Collapse-State
  const [timeLeft, setTimeLeft] = React.useState(null);
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    function update() {
      const exp = getTokenExp();
      if (exp) setTimeLeft(exp - Date.now());
      else setTimeLeft(null);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sliding Expiration: Token bei Aktivität erneuern
  React.useEffect(() => {
    const renewToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Nur erneuern, wenn ein Token existiert!
      try {
        const res = await api.post('/auth/renew');
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
      } catch {}
    };
    // Bei jedem API-Call (außer /auth/renew) Token erneuern
    const interceptor = api.interceptors.response.use(
      response => {
        if (!response.config.url.endsWith('/auth/renew')) {
          renewToken();
        }
        return response;
      },
      error => Promise.reject(error)
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  React.useEffect(() => {
    if (timeLeft !== null && timeLeft <= 2 * 60 * 1000 && timeLeft > 0) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [timeLeft]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Hamburger-Button für mobile
  const Hamburger = (
    <button
      className="btn d-md-none position-fixed top-0 start-0 m-2"
      style={{ zIndex: 2001, background: '#ffc700', color: '#181a1b', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
      onClick={() => setOpen(true)}
      aria-label="Menü öffnen"
    >
      <i className="bi bi-list fs-2" style={{ color: '#181a1b' }}></i>
    </button>
  );

  // Offcanvas für mobile (eigene Animation & Overlay)
  const Offcanvas = (
    <>
      {/* Overlay */}
      <div
        className={`offcanvas-backdrop${open ? ' show' : ''}`}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(24,26,27,0.85)', zIndex: open ? 2001 : -1,
          opacity: open ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: open ? 'auto' : 'none'
        }}
        onClick={() => setOpen(false)}
      />
      {/* Offcanvas-Panel */}
      <div
        className="offcanvas-custom"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100vh', width: 240,
          background: '#181a1b', zIndex: 2002,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s', boxShadow: '2px 0 16px rgba(0,0,0,0.3)'
        }}
        tabIndex="-1"
      >
        <div className="offcanvas-header d-flex align-items-center p-3">
          <img src={`${import.meta.env.BASE_URL}juli-logo.svg`} alt="Logo" style={{ width: 48, height: 48 }} className="me-2" />
          <button type="button" className="btn-close btn-close-white ms-auto" aria-label="Schließen" onClick={() => setOpen(false)}></button>
        </div>
        <div className="offcanvas-body d-flex flex-column p-0">
          <nav className="flex-grow-1">
            {/* Adminbereich-Link nur für Admins */}
            {user.role === 'admin' && (
              <a
                href="/admin"
                className={`nav-link d-flex align-items-center gap-2 px-3 py-2${location.pathname.startsWith('/admin') ? ' active' : ''}`}
                style={{ textDecoration: 'none', color: '#c00', fontWeight: 600 }}
                onClick={() => setOpen(false)}
              >
                <i className="bi bi-shield-lock" style={{ color: '#c00' }}></i>
                Adminbereich
              </a>
            )}
            {navLinks.filter(l => !l.admin || user.role === 'admin').map(link => (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link d-flex align-items-center gap-2 px-3 py-2${location.pathname === link.href ? ' active' : ''}`}
                style={{ textDecoration: 'none' }}
                onClick={() => setOpen(false)}
              >
                <i className={`bi ${link.icon}`}></i>
                {link.name}
              </a>
            ))}
          </nav>
          <div className="mt-auto d-flex flex-column align-items-center p-3">
            <span className="avatar bg-accent rounded-circle d-inline-flex justify-content-center align-items-center text-dark fw-bold mb-2" style={{width:36, height:36}}>
              {(user.displayName ? user.displayName[0] : user.email[0]).toUpperCase()}
            </span>
            <div className="small text-white-50 mb-2">{user.displayName || user.email}</div>
            <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>Abmelden</button>
          </div>
        </div>
      </div>
    </>
  );

  // Sidebar für Desktop (einklappbar)
  const Sidebar = (
    <aside
      className={`admin-sidebar position-fixed top-0 start-0 vh-100 d-none d-md-flex flex-column p-3 align-items-center${collapsed ? ' sidebar-collapsed' : ''}`}
      style={{ width: collapsed ? 60 : 240, zIndex: 1040, transition: 'width 0.2s' }}
    >
      <div className="w-100 d-flex justify-content-between align-items-center mb-3">
        <img
          src={`${import.meta.env.BASE_URL}juli-logo.svg`}
          alt="Logo"
          style={{ width: collapsed ? 36 : 100, height: collapsed ? 36 : 100, transition: 'width 0.2s, height 0.2s' }}
          className="mb-2 mx-auto"
        />
        <button
          className="btn btn-outline-light btn-sm ms-2"
          style={{ minWidth: 32, minHeight: 32 }}
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`}></i>
        </button>
      </div>
      <nav className="flex-grow-1 w-100">
        {/* Adminbereich-Link nur für Admins */}
        {user.role === 'admin' && (
          <a
            href="/admin"
            className={`nav-link d-flex align-items-center${collapsed ? ' justify-content-center px-0' : ' gap-2 px-3'} py-2${location.pathname.startsWith('/admin') ? ' active' : ''}`}
            style={{ textDecoration: 'none', whiteSpace: 'nowrap', color: '#c00', fontWeight: 600 }}
            title={collapsed ? 'Adminbereich' : undefined}
          >
            <i className="bi bi-shield-lock fs-5" style={{ color: '#c00' }}></i>
            {!collapsed && 'Adminbereich'}
          </a>
        )}
        {navLinks.filter(l => !l.admin || user.role === 'admin').map(link => (
          <a
            key={link.name}
            href={link.href}
            className={`nav-link d-flex align-items-center${collapsed ? ' justify-content-center px-0' : ' gap-2 px-3'} py-2${location.pathname === link.href ? ' active' : ''}`}
            style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
            title={collapsed ? link.name : undefined}
          >
            <i className={`bi ${link.icon} fs-5`}></i>
            {!collapsed && link.name}
          </a>
        ))}
      </nav>
      <div className="mt-auto d-flex flex-column align-items-center w-100">
        <div className="mb-2">
          <span className="avatar bg-accent rounded-circle d-inline-flex justify-content-center align-items-center text-dark fw-bold" style={{width:36, height:36}}>
            {(user.displayName ? user.displayName[0] : user.email[0]).toUpperCase()}
          </span>
        </div>
        {!collapsed && <div className="small text-white-50 mb-2">{user.displayName || user.email}</div>}
        {!collapsed && timeLeft !== null && (
          <div className="small text-warning mb-2">Session: {formatTimeLeft(timeLeft)}</div>
        )}
        <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout} title="Abmelden">
          <i className="bi bi-box-arrow-right"></i>{!collapsed && ' Abmelden'}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {Hamburger}
      {Offcanvas}
      {Sidebar}
      <SessionToast show={showToast} timeLeft={timeLeft} />
    </>
  );
} 