# 📰 Nachrichten-App

Deine persönliche Morgen-Nachrichten-App — faktenbasiert, kein Clickbait.

## Features

- **Multi-Source RSS** — Lädt Nachrichten von Tagesschau, ZDF, Zeit, Spiegel & Focus
- **8 Kategorien** — Welt, Technologie, Wissenschaft, Umwelt, Positives, Wirtschaft, Kultur, Sport
- **Kategorie-Filter** — Schnelles Filtern über Tabs
- **Dark Mode** — Angenehm für die Augen
- **Auto-Refresh** — Alle 5/15/30/60 Minuten
- **Einstellungen** — Name, Kategorien, Anzahl, Design

## Live Demo

Die App ist kostenlos auf Netlify verfügbar:

👉 [https://nachrichten-app.netlify.app](https://nachrichten-app.netlify.app)

## Installation

### Netlify Deploy (Empfohlen — Kostenlos)

1. Bei [Netlify](https://app.netlify.com) anmelden
2. **"Add new site"** → **"Import an existing project"**
3. **GitHub** auswählen → `nachrichten-app` Repository verbinden
4. Build settings:
   - **Build command:** leer lassen (keine)
   - **Publish directory:** `.` (Root)
5. Auf **"Deploy site"** klicken

### Lokal öffnen

Einfach `index.html` im Browser öffnen — kein Build nötig!

## Technologien

- HTML5, CSS3, Vanilla JavaScript
- RSS Feeds (Tagesschau, ZDF, Zeit, Spiegel, Focus)
- CORS Proxys für Browser-Zugriff
- LocalStorage für Einstellungen

## Lizenz

MIT — Kostenlos für alle