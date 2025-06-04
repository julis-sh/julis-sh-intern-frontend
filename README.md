# Mitgliederinformationssystem – Frontend

![Logo](juli-logo.svg)

> **Modernes Admin-Frontend für das Interne Tool der Jungen Liberalen Schleswig-Holstein e. V.**

---

## 🚀 Tech-Stack

- **React 18** (mit Hooks)
- **Vite** (Build-Tool)
- **Material UI (MUI)** & **Bootstrap 5** (UI/Design)
- **React Router v6** (Routing)
- **Axios** (API-Requests)
- **JWT Auth** (Token-basiert)
- **ESLint & Prettier** (Code-Qualität)

---

## 📦 Projektstruktur

- `src/` – Quellcode (Pages, Components, API, Theme)
- `public/` – Statische Assets (Logo, Icons)
- `dist/` – Build-Output (wird automatisch generiert)

---

## 🛠️ Lokale Entwicklung

### Voraussetzungen
- **Node.js** >= 18.x (empfohlen)
- **npm** >= 9.x

### Setup
```bash
cd frontend
npm install
```

### Starten (lokal)
```bash
npm run dev
```
Die App läuft standardmäßig auf [http://localhost:3000](http://localhost:3000)

### Build für Produktion
```bash
npm run build
```
Das gebaute Frontend liegt dann im `dist/`-Ordner.

---

## ⚙️ Umgebungsvariablen

Lege eine `.env`-Datei im `frontend/`-Verzeichnis an (optional):

```
VITE_API_URL=http://localhost:4000/api
```

- **VITE_API_URL**: URL zum Backend-API-Server (Default: `/api`)

---

## 📜 Nützliche Skripte

| Befehl           | Zweck                        |
|------------------|------------------------------|
| `npm run dev`    | Lokaler Dev-Server           |
| `npm run build`  | Produktions-Build            |
| `npm run preview`| Build lokal testen           |
| `npm run lint`   | Linting mit ESLint           |
| `npm run format` | Formatierung mit Prettier    |

---

## 🖌️ Design & Branding

- **JuLi-Farben**: Gelb `#FFD600`, Blau `#0033A0`, Schwarz `#231F20`
- **Font**: Montserrat, Arial, sans-serif
- **UI**: Material UI + Bootstrap Icons

---

## 🔒 Authentifizierung

- JWT-Token wird im LocalStorage gespeichert
- Login/Logout-Flow integriert
- Geschützte Routen via React Router

---

## 🧪 Testing & Code-Qualität

- Linting: `npm run lint`
- Formatierung: `npm run format`
- (Tests können via Jest/Cypress ergänzt werden)

---

## 🐳 Deployment

- Statischer Build (`dist/`) kann auf jedem Webserver (z.B. nginx) oder via Docker bereitgestellt werden
- Für Proxy/Backend-Anbindung ggf. VITE_API_URL anpassen

---

## 👨‍💻 Entwickler:innen

- Siehe [GitHub Repo](https://github.com/Julis-SH/)
- Kontakt: [luca.kohls@julis-sh.de](mailto:luca.kohls@julis-sh.de)

---

**Mitmachen?** PRs & Issues willkommen! ✨ 