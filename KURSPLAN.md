# FlugBoard – Angular Kurs: Planungsdokument

Dieses Dokument ist die verbindliche Referenz fuer alle Lektionen des Kurses.
Es definiert Layout, Struktur, Designentscheidungen und den Lernpfad.

---

## 1. Kursziel

Schülerinnen und Schüler lernen Angular anhand eines durchgehenden
Praxisprojekts: dem FlugBoard, einer Echtzeit-Fluganzeigetafel.

**Zielgruppe:** Personen mit Kenntnissen in HTML, CSS, JavaScript (ES6+),
TypeScript und HTTP-Methoden (GET, POST, PATCH, DELETE). Idealerweise wurde
vorher der React-Kurs absolviert oder eine andere SPA-Erfahrung gesammelt.

**Sprache:** Deutsch (Fachbegriffe und Code auf Englisch)

---

## 2. Begleitendes Projekt: FlugBoard

Eine Echtzeit-Fluganzeigetafel eines Flughafens, die Lektion fuer Lektion
ausgebaut wird.

### Datenmodell (TypeScript)

```typescript
type FlightType   = 'arrival' | 'departure';
type FlightStatus = 'on-time' | 'delayed' | 'boarding' | 'departed' | 'landed' | 'cancelled';

interface Flight {
  id:            number;
  flightNumber:  string;       // z.B. "OS123"
  airline:       string;       // z.B. "Austrian Airlines"
  type:          FlightType;
  scheduledTime: string;       // "HH:MM"
  expectedTime?: string;       // nur wenn verspaetet
  status:        FlightStatus;
  airport:       string;       // Herkunft (arrival) oder Ziel (departure)
  terminal:      string;       // "T1", "T2", "T3"
  gate?:         string;       // z.B. "B12"
}
```

### Backend: Deno + Hono + Drizzle + SQLite

Schlanker REST-Server (ab Lektion 2.2) unter `angular/beispiele/2.4/backend/`:

```
backend/
├── main.ts        ← Hono-Server, Port 8000
├── data.ts        ← Flug-Demodaten + Typen
├── db.ts          ← Drizzle + libSQL Client
└── deno.json      ← Deno-Konfiguration
```

Endpunkte:

- `GET    /api/flights`              → alle Fluege (mit Query-Parametern type, status, search)
- `GET    /api/flights/:id`          → einzelner Flug
- `POST   /api/flights`              → neuen Flug anlegen
- `PATCH  /api/flights/:id`          → Status aendern
- `DELETE /api/flights/:id`          → Flug loeschen

### Projektverlauf Lektion fuer Lektion

| Lektion | Was wird gebaut |
|---------|----------------|
| 1.1 | Statische Tabelle mit hartkodieren Fluegen |
| 1.2 | FlightCard, FlightList als eigene Komponenten |
| 1.3 | Suchfeld + Typfilter (ngModel, Getter) |
| 1.4 | Status-Badges mit Pipes, @for/@if |
| 2.1 | AddFlight-Formular mit Reactive Forms und Validierung |
| 2.2 | API-Anbindung per HttpClient und Service |
| 2.3 | Stream-Architektur mit RxJS, Polling, debounce |
| 2.4 | Angular Router, Reactive Forms, Fullstack-Backend |

---

## 3. Kursstruktur (8 Lektionen)

### Teil 1 – Grundlagen (1.1–1.4)

| Code | Datei | Titel | Kernkonzepte |
|---|---|---|---|
| 1.1 | `1.1-einfuehrung-setup.html` | Einstieg & Setup | Framework vs. Library, Angular CLI, Standalone, Projektstruktur |
| 1.2 | `1.2-komponenten-templates.html` | Komponenten & Templates | @Component, @Input, @Output, EventEmitter, Komposition |
| 1.3 | `1.3-datenbindung-events.html` | Datenbindung & Events | 4 Bindungstypen, FormsModule, ngModel, Getter als State |
| 1.4 | `1.4-listen-filter-pipes.html` | Listen, Filter & Pipes | @for, @if, @switch, track, TitleCasePipe, Custom Pipe |

### Teil 2 – Praxis & Fullstack (2.1–2.4)

| Code | Datei | Titel | Kernkonzepte |
|---|---|---|---|
| 2.1 | `2.1-formulare-validierung.html` | Formulare & Validierung | Template-Driven vs. Reactive Forms, FormBuilder, Validators, Custom Validators |
| 2.2 | `2.2-services-http.html` | Services & HTTP | DI, @Injectable, inject(), HttpClient, Observable-Einstieg |
| 2.3 | `2.3-observables-rxjs.html` | Observables & RxJS | Observable vs Promise, Subject, BehaviorSubject, Operatoren, Stream-Architektur |
| 2.4 | `2.4-fullstack-flugboard.html` | Fullstack FlugBoard | Angular Router, Lazy Loading, Reactive Forms, Deno+Hono+Drizzle+SQLite |

---

## 4. Dateistruktur

```
angular/                            ← Kurs-Root
├── index.html                      ← Kursübersicht / Startseite
├── KURSPLAN.md                     ← dieses Dokument
├── assets/
│   └── kurs.css                    ← einheitliches Stylesheet (identisch mit React-Kurs, aber Angular-Rot)
├── 1.1-einfuehrung-setup.html
├── 1.2-komponenten-templates.html
├── 1.3-datenbindung-events.html
├── 1.4-listen-filter-pipes.html
├── 2.1-formulare-validierung.html
├── 2.2-services-http.html
├── 2.3-observables-rxjs.html
├── 2.4-fullstack-flugboard.html
└── beispiele/
    ├── 1.1/                        ← ng new flugboard (statisch)
    ├── 1.2/                        ← + FlightCard + AirportHeader + @Output
    ├── 1.3/                        ← + Suchfeld + Filter (ngModel, Getter)
    ├── 1.4/                        ← + Pipes + @for/@if/@switch
    ├── 2.1/                        ← + AddFlight-Formular (Reactive Forms)
    ├── 2.2/                        ← + HttpClient + Service (ngOnInit)
    ├── 2.3/                        ← + RxJS Streams (BehaviorSubject, Polling)
    └── 2.4/                        ← Vollstaendiges Fullstack-Projekt
        ├── src/                    ← Angular Frontend (Router, Forms, Services)
        └── backend/                ← Deno + Hono + Drizzle + SQLite
```

---

## 5. HTML-Template-Struktur (jede Lektion)

Jede Lektion folgt **exakt** der Struktur des React-Kurses:

```
1. lesson-header       → Lektionsnummer, Titel, Tags (Teil/Dauer)
2. section-lernziele   → Lernziele als lernziele-list
3. section (Theorie)   → Erklärungen, Code-Beispiele, Callouts, Tabellen
4. section-projekt     → Projektschritt mit .projekt-box
5. section-fehler      → Häufige Fehler mit .fehler-item
6. section-aufgaben    → 3 Pflicht + 1 Bonus-Aufgabe (aufgaben-list)
7. lesson-nav          → Zurück / Weiter Navigation
```

---

## 6. Design-Entscheidungen

- **Farbschema:** Identisch mit React-Kurs (dunkel, GitHub-aenlich)
- **Hintergrund:** `#0d1117`
- **Angular-Akzent:** `#dd0031` (Angular-Rot, statt React-Cyan)
- **CSS:** `angular/assets/kurs.css` – adaptierter React-Kurs-CSS
- **Beispielprojekte:** Dunkles Design mit denselben CSS-Variablen wie React-Beispiele
- **Code:** highlight.js `atom-one-dark` via CDN
- **Schrift:** System-Font-Stack
- **Responsive:** Hamburger-Menue unter 900px
- **Dark/Light Theme Toggle:** Identisch mit React-Kurs

---

## 7. GitHub Pages Setup

Identisch mit React-Kurs. Alle Links sind relativ.

```bash
# Lokaler Test
python3 -m http.server 8080
# → http://localhost:8080/angular/index.html
```

---

## 8. Code-Stil (für alle Beispiele)

- TypeScript in allen `.ts`-Dateien
- Angular 17+ Standalone API
- Neue Control-Flow-Syntax (@for, @if, @switch)
- inject() statt Constructor-Injection
- 2 Leerzeichen Einrückung
- Einfache Anführungszeichen für Strings
- Semicolons am Zeilenende
- Props-Typen als `interface` (nicht `type`)
- Arrow Functions für Callbacks
- `const` / `let` statt `var`

---

*Zuletzt aktualisiert: Oktober 2026*
