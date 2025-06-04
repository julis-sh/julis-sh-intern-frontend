import React from 'react';
import { useNavigate } from 'react-router-dom';
import RequireAdmin from '../components/RequireAdmin';
import '../adminpanel.css';

const cards = [
  {
    title: 'Benutzerverwaltung',
    desc: 'Nutzer anlegen, bearbeiten und löschen',
    link: '/admin/users',
    icon: 'bi-people',
  },
  {
    title: 'Audit-Log',
    desc: 'Alle sicherheitsrelevanten Aktionen im Überblick',
    link: '/admin/auditlog',
    icon: 'bi-clipboard-data',
  },
  {
    title: 'Datei-Galerie',
    desc: 'Dateien hochladen, ansehen, herunterladen und löschen',
    link: '/admin/files',
    icon: 'bi-folder2-open',
  },
  {
    title: 'Onboarding & Hilfe',
    desc: 'Guides, FAQ und Hilfestellungen für neue Nutzer',
    link: '/admin/onboarding',
    icon: 'bi-info-circle',
  },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  return (
    <RequireAdmin>
      <div className="container-xl mt-4">
        <h2 className="text-white mb-4">Admin-Dashboard</h2>
        <div className="row g-4">
          {cards.map(card => (
            <div className="col-12 col-md-6 col-lg-3" key={card.link}>
              <div className="card bg-dark text-white rounded-3 h-100 p-3" style={{ cursor: 'pointer' }} onClick={() => navigate(card.link)}>
                <div className="d-flex align-items-center mb-3">
                  <i className={`bi ${card.icon} me-3 fs-2 text-accent`}></i>
                  <div>
                    <h5 className="mb-1">{card.title}</h5>
                    <div className="text-secondary small">{card.desc}</div>
                  </div>
                </div>
                <div className="mt-auto text-end">
                  <button className="btn btn-primary btn-sm">Öffnen</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RequireAdmin>
  );
} 