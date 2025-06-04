import React from 'react';
import RequireAdmin from '../components/RequireAdmin';

const steps = [
  {
    title: 'Willkommen im Mitgliederinfo-Adminbereich!',
    content: <>
      <p>Hier verwaltest du Nutzer, Dateien, Audit-Logs und vieles mehr. Dieses Onboarding führt dich durch die wichtigsten Funktionen.</p>
    </>,
  },
  {
    title: 'Benutzerverwaltung',
    content: <>
      <p>Lege neue Nutzer an, ändere Rollen oder setze Passwörter zurück. <br />Gehe zu <b>Admin-Dashboard → Benutzerverwaltung</b>.</p>
    </>,
  },
  {
    title: 'Datei-Galerie',
    content: <>
      <p>Lade Dateien hoch, sieh dir Bilder an, lade Dokumente herunter oder lösche nicht mehr benötigte Dateien. <br />Gehe zu <b>Admin-Dashboard → Datei-Galerie</b>.</p>
    </>,
  },
  {
    title: 'Audit-Log',
    content: <>
      <p>Behalte alle sicherheitsrelevanten Aktionen im Blick. <br />Gehe zu <b>Admin-Dashboard → Audit-Log</b>.</p>
    </>,
  },
  {
    title: 'Hilfe & FAQ',
    content: <>
      <p>Antworten auf häufige Fragen findest du weiter unten. Bei Problemen wende dich an den technischen Support.</p>
    </>,
  },
];

const faqs = [
  {
    q: 'Wie kann ich einen neuen Nutzer anlegen?',
    a: 'Im Admin-Dashboard unter "Benutzerverwaltung" auf "Neuer Benutzer" klicken und das Formular ausfüllen.',
  },
  {
    q: 'Wie ändere ich meine E-Mail oder mein Passwort?',
    a: 'Admins können dies in der Benutzerverwaltung für jeden Nutzer anpassen.',
  },
  {
    q: 'Wie kann ich Dateien löschen?',
    a: 'In der Datei-Galerie auf das Papierkorb-Symbol neben der Datei klicken.',
  },
  {
    q: 'Wer sieht das Audit-Log?',
    a: 'Nur Admins haben Zugriff auf das Audit-Log.',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = React.useState(0);
  return (
    <RequireAdmin>
      <div className="container-xl mt-4">
        <h2 className="text-white mb-3">Onboarding & Hilfe</h2>
        <div className="card bg-dark text-white rounded-3 p-4 mb-4">
          <h4 className="mb-3">Schritt {step + 1} von {steps.length}: {steps[step].title}</h4>
          <div className="mb-3">{steps[step].content}</div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-light" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>Zurück</button>
            {step < steps.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}>Weiter</button>
            ) : (
              <button className="btn btn-success" onClick={() => setStep(0)}>Nochmal von vorn</button>
            )}
          </div>
        </div>
        <div className="card bg-dark text-white rounded-3 p-4 mb-4">
          <h4 className="mb-3">FAQ & Hilfe</h4>
          {faqs.map((faq, i) => (
            <div key={i} className="mb-3">
              <div className="fw-bold text-accent">{faq.q}</div>
              <div>{faq.a}</div>
            </div>
          ))}
        </div>
        <div className="card bg-dark text-white rounded-3 p-4">
          <h4 className="mb-3">Quicklinks</h4>
          <ul className="mb-0">
            <li><a href="/admin/users" className="text-accent">Benutzerverwaltung</a></li>
            <li><a href="/admin/files" className="text-accent">Datei-Galerie</a></li>
            <li><a href="/admin/auditlog" className="text-accent">Audit-Log</a></li>
          </ul>
        </div>
      </div>
    </RequireAdmin>
  );
} 