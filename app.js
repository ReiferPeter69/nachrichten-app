/**
 * NACHRICHTEN APP — Erweiterte Hauptlogik
 * Mehrere Quellen, TOP-Filterung, Kategorie-Tabs
 */

// ==========================================
// KONFIGURATION & DATEN
// ==========================================

const CATEGORIES = [
    { id: 'welt', name: 'Welt', icon: '🌍', color: '#3b82f6' },
    { id: 'tech', name: 'Technologie', icon: '💻', color: '#8b5cf6' },
    { id: 'wissenschaft', name: 'Wissenschaft', icon: '🔬', color: '#06b6d4' },
    { id: 'umwelt', name: 'Umwelt', icon: '🌱', color: '#10b981' },
    { id: 'positiv', name: 'Positives', icon: '😊', color: '#f59e0b' },
    { id: 'wirtschaft', name: 'Wirtschaft', icon: '💼', color: '#ef4444' },
    { id: 'kultur', name: 'Kultur', icon: '🎵', color: '#ec4899' },
    { id: 'sport', name: 'Sport', icon: '⚽', color: '#f97316' }
];

const RSS_SOURCES = {
    tagesschau: 'https://www.tagesschau.de/xml/rss2/',
    zdf: 'https://www.zdf.de/rss/zdf/nachrichten',
    zeit: 'https://newsfeed.zeit.de/news/index',
    spiegel: 'https://www.spiegel.de/schlagzeilen/index.rss',
    focus: 'https://www.focus.de/news/rss.xml'
};

const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];

// Fallback-Nachrichten — erweitert und realistischer
const FALLBACK_NEWS = {
    welt: [
        { title: 'G7-Gipfel einigt sich auf gemeinsame Abschlusserklärung zu Klima und Sicherheit', excerpt: 'Die Staats- und Regierungschefs der G7-Staaten haben sich nach mehrtägigen Verhandlungen auf ein gemeinsames Kommuniqué verständigt. Zentrale Themen waren der Klimaschutz und die globale Sicherheitslage.', source: 'Tagesschau', time: 'Vor 2 Std.', link: 'https://www.tagesschau.de' },
        { title: 'EU beschließt Reform der Migrationspolitik', excerpt: 'Nach monatelangen Beratungen haben die EU-Mitgliedsstaaten eine Reform der gemeinsamen Migrationspolitik beschlossen. Sie sieht eine faire Verteilung und beschleunigte Verfahren vor.', source: 'ZDF', time: 'Vor 3 Std.', link: 'https://www.zdf.de' },
        { title: 'Bundeshaushalt 2026: Schwerpunkt auf Verteidigung und Bildung', excerpt: 'Die Bundesregierung hat den neuen Haushaltsplan vorgestellt. Die größten Ausgabenposten sind Verteidigung, Infrastruktur und Bildungsförderung.', source: 'Zeit', time: 'Vor 4 Std.', link: 'https://www.zeit.de' },
        { title: 'NATO erweitert ihre Ostpräsenz mit neuen Stützpunkten', excerpt: 'Das Bündnis hat den Aufbau zusätzlicher Kommandostrukturen an der Ostflanke beschlossen. Dies dient der Abschreckung und schnellen Reaktionsfähigkeit.', source: 'Spiegel', time: 'Vor 5 Std.', link: 'https://www.spiegel.de' },
        { title: 'UN-Vollversammlung verabschiedet Resolution für globale Zusammenarbeit', excerpt: 'Mit überwältigender Mehrheit von 150 Staaten wurde eine Resolution für verstärkte internationale Kooperation verabschiedet.', source: 'Focus', time: 'Vor 6 Std.', link: 'https://www.focus.de' }
    ],
    tech: [
        { title: 'EU-KI-Gesetz tritt in Kraft: Regulierung für Hochrisiko-Systeme', excerpt: 'Das neue KI-Gesetz der Europäischen Union setzt erstmals klare Grenzen für den Einsatz künstlicher Intelligenz, insbesondere bei sensiblen Anwendungen.', source: 'Tagesschau', time: 'Vor 1 Std.', link: 'https://www.tagesschau.de' },
        { title: 'Münchner Startup entwickelt Chip mit 40% weniger Stromverbrauch', excerpt: 'Ein deutsches Technologie-Startup hat einen Prozessor vorgestellt, der deutlich energieeffizienter arbeitet als bisherige Modelle.', source: 'ZDF', time: 'Vor 3 Std.', link: 'https://www.zdf.de' },
        { title: 'Open-Source-Projekte verzeichnen Rekordzuwachs', excerpt: 'Immer mehr Unternehmen und Entwickler beteiligen sich an quelloffenen Projekten. Die Anzahl neuer Repositories ist im Vergleich zum Vorjahr um 30% gestiegen.', source: 'Zeit', time: 'Vor 5 Std.', link: 'https://www.zeit.de' },
        { title: 'Microsoft schließt kritische Sicherheitslücken mit Patch-Update', excerpt: 'Das monatliche Sicherheitsupdate behebt mehrere Schwachstellen in Windows und Office-Produkten. Eine schnelle Installation wird empfohlen.', source: 'Spiegel', time: 'Vor 4 Std.', link: 'https://www.spiegel.de' },
        { title: 'Quantencomputer erreicht 1.000-Qubit-Marke', excerpt: 'Ein Forschungsteam hat einen Quantencomputer mit über 1.000 Qubits präsentiert — ein Meilenstein auf dem Weg zu praxistauglichen Quantenrechnern.', source: 'Focus', time: 'Vor 6 Std.', link: 'https://www.focus.de' }
    ],
    wissenschaft: [
        { title: 'Neuer Wirkstoff zeigt Erfolg gegen Alzheimer', excerpt: 'Ein experimenteller Wirkstoff hat in klinischen Studien erste vielversprechende Ergebnisse erzielt. Die Gedächtnisleistung der Patienten verbesserte sich signifikant.', source: 'Tagesschau', time: 'Vor 2 Std.', link: 'https://www.tagesschau.de' },
        { title: 'NASA-Rover findet organische Moleküle auf dem Mars', excerpt: 'Der Perseverance-Rover hat in alten Gesteinsschichten organische Verbindungen entdeckt. Die Funde könnten Hinweise auf früheres mikrobielles Leben geben.', source: 'ZDF', time: 'Vor 4 Std.', link: 'https://www.zdf.de' },
        { title: 'Max-Planck-Institut präsentiert verfeinerte Klimaprognosen', excerpt: 'Mit deutlich präziseren Berechnungen können Forschende nun regionale Klimaänderungen genauer vorhersagen als bisher.', source: 'Zeit', time: 'Vor 5 Std.', link: 'https://www.zeit.de' },
        { title: 'Weltraumteleskop CHEOPS fotografiert neue Exoplaneten', excerpt: 'Das europäische Teleskop hat erstmals direkt Bilder von Planeten außerhalb unseres Sonnensystems aufgenommen, die erdgroß sind.', source: 'Spiegel', time: 'Vor 7 Std.', link: 'https://www.spiegel.de' },
        { title: 'Genom seltener Heilpflanze vollständig entschlüsselt', excerpt: 'Ein internationales Team hat das Erbgut einer traditionellen Medizinpflanze sequenziert. Dies könnte die Grundlage für neue Medikamente bilden.', source: 'Focus', time: 'Vor 8 Std.', link: 'https://www.focus.de' }
    ],
    umwelt: [
        { title: 'Erneuerbare Energien decken über 60% des deutschen Stroms', excerpt: 'Im ersten Halbjahr 2026 stammte der majority des Stroms in Deutschland aus Wind, Sonne und Biomasse. Die Energiewende schreitet voran.', source: 'Tagesschau', time: 'Vor 2 Std.', link: 'https://www.tagesschau.de' },
        { title: 'Brandrich weitet größtes Naturschutzgebiet aus', excerpt: 'Ein neues großes Schutzgebiet im Osten Brandenburgs wird ausgewiesen. Es bietet über 200 bedrohten Arten einen geschützten Lebensraum.', source: 'ZDF', time: 'Vor 4 Std.', link: 'https://www.zdf.de' },
        { title: 'Erwärmung der Ozeane verlangsamt sich erstmals', excerpt: 'Neueste Messdaten deuten darauf hin, dass die Temperaturzunahme in den Weltmeeren nachlässt — ein möglicher Erfolg von Klimaschutzmaßnahmen.', source: 'Zeit', time: 'Vor 5 Std.', link: 'https://www.zeit.de' },
        { title: 'Berlin startet Millionen-Begrünungsprogramm', excerpt: 'Die Hauptstadt will bis 2030 insgesamt 10.000 neue Bäume pflanzen und Flächen entsiegeln, um das Stadtklima zu verbessern.', source: 'Spiegel', time: 'Vor 6 Std.', link: 'https://www.spiegel.de' },
        { title: 'Recycling-Quote in Deutschland erreicht Rekordwert', excerpt: 'Über 70% der Siedlungsabfälle werden in Deutschland inzwischen recycelt. Das ist der höchste Wert seit Beginn der Datenerfassung.', source: 'Focus', time: 'Vor 8 Std.', link: 'https://www.focus.de' }
    ],
    positiv: [
        { title: 'Leseförderung zahlt sich aus: Kinder lesen wieder mehr', excerpt: 'Eine aktuelle Studie belegt einen Anstieg der Lesekompetenz bei Grundschülern. Besonders Förderprogramme an Schulen zeigen messbare Erfolge.', source: 'Tagesschau', time: 'Vor 1 Std.', link: 'https://www.tagesschau.de' },
        { title: 'Senioren und Jugendliche gestalten Gemeinschaftsgarten', excerpt: 'Ein Hamburger Projekt bringt Generationen zusammen: Ältere und Jüngere schaffen gemeinsam Grünflächen und tauschen Wissen aus.', source: 'ZDF', time: 'Vor 3 Std.', link: 'https://www.zdf.de' },
        { title: 'Kinderhilfswerk verzeichnet Spendenrekord', excerpt: 'Das Deutsche Kinderhilfswerk hat über 50 Millionen Euro für Kinderprojekte in ganz Deutschland gesammelt — so viel wie noch nie.', source: 'Zeit', time: 'Vor 4 Std.', link: 'https://www.zeit.de' },
        { title: 'Bürger retten Bienen: Über 100 neue Völker angesiedelt', excerpt: 'Engagierte Imker und Naturschützer haben in einer ländlichen Region erfolgreich über hundert Bienenvölker angesiedelt.', source: 'Spiegel', time: 'Vor 5 Std.', link: 'https://www.spiegel.de' },
        { title: 'Deutsche Schüler gewinnen internationalen Wissenschaftspreis', excerpt: 'Drei Schüler aus Bayern haben bei einem globalen Wettbewerb den ersten Platz belegt. Ihr Projekt zu sauberer Energie überzeugte die Jury.', source: 'Focus', time: 'Vor 7 Std.', link: 'https://www.focus.de' }
    ],
    wirtschaft: [
        { title: 'Deutsche Exporte wachsen im ersten Quartal um 3,2%', excerpt: 'Die deutschen Ausfuhren haben zugelegt, vor allem getrieben durch steigende Nachfrage aus den asiatischen Märkten.', source: 'Tagesschau', time: 'Vor 2 Std.', link: 'https://www.tagesschau.de' },
        { title: 'EZB senkt Leitzins um 0,25 Prozentpunkte', excerpt: 'Die Europäische Zentralbank hat den Leitzins leicht reduziert, um die Konjunktur in der Eurozone anzukurbeln.', source: 'ZDF', time: 'Vor 3 Std.', link: 'https://www.zdf.de' },
        { title: 'Mittelstand plant Rekord-Investitionen in IT', excerpt: 'Über 80% der mittelständischen Unternehmen in Deutschland wollen in diesem Jahr ihre Digitalisierung vorantreiben.', source: 'Zeit', time: 'Vor 5 Std.', link: 'https://www.zeit.de' },
        { title: 'Arbeitslosenquote stabil bei 5,8 Prozent', excerpt: 'Der deutsche Arbeitsmarkt zeigt sich weiterhin robust. Die Arbeitslosigkeit bleibt auf niedrigem Niveau, Fachkräftemangel bleibt Herausforderung.', source: 'Spiegel', time: 'Vor 6 Std.', link: 'https://www.spiegel.de' },
        { title: 'Immobilienpreise stabilisieren sich in Großstädten', excerpt: 'Nach einer längeren Phase sinkender Preise gibt es erste Anzeichen für eine Bodenbildung bei Wohnimmobilien in deutschen Metropolen.', source: 'Focus', time: 'Vor 7 Std.', link: 'https://www.focus.de' }
    ],
    kultur: [
        { title: 'Berlinale eröffnet mit Fokus auf afrikanisches Kino', excerpt: 'Das internationale Filmfestival Berlin startet mit einer starken Auswahl. Schwerpunkt ist dieses Jahr die Filmproduktion afrikanischer Länder.', source: 'Tagesschau', time: 'Vor 2 Std.', link: 'https://www.tagesschau.de' },
        { title: 'Frankfurt erhält neues Museum für zeitgenössische Kunst', excerpt: 'Ein hochkarätiges Eröffnungsprogramm mit 50 internationalen Künstlerinnen und Künstlern zeigt die Breite aktueller Kunst.', source: 'ZDF', time: 'Vor 4 Std.', link: 'https://www.zdf.de' },
        { title: 'Deutscher Schriftsteller erhält renommierten Literaturpreis',excerpt: 'Ein deutscher Autor wurde für sein jüngstes Werk geehrt, das durch eindringliche Sprache und gesellschaftliche Relevanz überzeugt.', source: 'Zeit', time: 'Vor 5 Std.', link: 'https://www.zeit.de' },
        { title: 'Berliner Philharmoniker spielen vor über einer Million Zuschauern', excerpt: 'Ein kostenloses Open-Air-Konzert und der Livestream erreichten ein Millionenpublikum — ein Zeichen für die Kraft klassischer Musik.', source: 'Spiegel', time: 'Vor 6 Std.', link: 'https://www.spiegel.de' },
        { title: 'Museum gibt Kolonialkunst an Herkunftsländer zurück', excerpt: 'Eine deutsche Kultureinrichtung überreicht geraubte Kunstwerke an die Nachfahren der ursprünglichen Eigentümer — ein wichtiger Akt der Aufarbeitung.', source: 'Focus', time: 'Vor 8 Std.', link: 'https://www.focus.de' }
    ],
    sport: [
        { title: 'DFB-Team startet Vorbereitung auf die Weltmeisterschaft', excerpt: 'Die deutsche Fußball-Nationalmannschaft hat ihr Trainingslager bezogen. Der Bundestrainer sieht das Team gut gerüstet für das Turnier.', source: 'Tagesschau', time: 'Vor 1 Std.', link: 'https://www.tagesschau.de' },
        { title: 'Neuer Weltrekord im Marathon: Bestzeit um 30 Sekunden verbessert', excerpt: 'Bei einem internationalen Großstadt-Marathon wurde ein neuer Weltrekord aufgestellt. Der Sieger lief eine herausragende Zeit.', source: 'ZDF', time: 'Vor 3 Std.', link: 'https://www.zdf.de' },
        { title: 'Hamburg prüft Bewerbung für Olympische Spiele 2036', excerpt: 'Die Hansestadt hat ein vorläufiges Konzept für eine Kandidatur vorgestellt. Ein Bürgerentscheid soll folgen.', source: 'Zeit', time: 'Vor 5 Std.', link: 'https://www.zeit.de' },
        { title: 'Bundesliga-Verein investiert 20 Millionen in Jugendakademie', excerpt: 'Ein Erstligist baut sein Nachwuchszentrum massiv aus. Ziel ist es, junge Talente frühzeitig zu fördern und an den Profikader heranzuführen.', source: 'Spiegel', time: 'Vor 6 Std.', link: 'https://www.spiegel.de' },
        { title: 'Deutsche Athletin gewinnt EM-Gold', excerpt: 'Bei den Leichtathletik-Europameisterschaften hat eine deutsche Teilnehmerin die Goldmedaille in ihrer Disziplin gewonnen.', source: 'Focus', time: 'Vor 7 Std.', link: 'https://www.focus.de' }
    ]
};

// Keywords für Kategorisierung und Wichtigkeitsbewertung
const CATEGORY_KEYWORDS = {
    welt: ['regierung', 'eu', 'europa', 'bundestag', 'kanzler', 'minister', 'gipfel', 'nato', 'un', 'wahl', 'politik', 'gesetz', 'parlament', 'diplomatie', 'konflikt', 'frieden'],
    tech: ['ki', 'künstliche intelligenz', 'digital', 'computer', 'software', 'chip', 'prozessor', 'quanten', 'start up', 'internet', 'cyber', 'daten', 'microsoft', 'google', 'open source'],
    wissenschaft: ['forschung', 'studie', 'nasa', 'mars', 'universität', 'genom', 'alzheimer', 'medikament', 'teleskop', 'labor', 'wissenschaftler', 'forschungsteam', 'entdeckung'],
    umwelt: ['klima', 'nachhaltig', 'erneuerbar', 'natur', 'bienen', 'arten', 'recycling', 'strom', 'wind', 'solar', 'umwelt', 'co₂', 'treibhauseffekt'],
    positiv: ['erfolg', 'hilfe', 'spende', 'förderung', 'gewonnen', 'preis', 'verbessert', 'rekord', 'zusammen', 'gemeinde', 'ehrenamt', 'lesung', 'kind', 'juge'],
    wirtschaft: ['wirtschaft', 'export', 'arbeitslos', 'zins', 'ezb', 'markt', 'investition', 'mittelstand', 'immobilien', 'konjunktur', 'börse', 'aktien', 'handels'],
    kultur: ['kultur', 'film', 'kunst', 'museum', 'literatur', 'musik', 'festival', 'theater', 'ausstellung', 'konzert', 'premiere'],
    sport: ['sport', 'fußball', 'wm', 'olympia', 'medaille', 'rekord', 'mannschaft', 'trainer', 'bundesliga', 'meisterschaft']
};

// Default-Einstellungen
const DEFAULT_SETTINGS = {
    name: '',
    enabledCategories: CATEGORIES.map(c => c.id),
    newsCount: 5,
    darkMode: false,
    animations: true,
    refreshInterval: 15
};

let settings = { ...DEFAULT_SETTINGS };
let refreshTimer = null;
let isRefreshing = false;
let activeFilter = 'all';

// ==========================================
// INITIALISIERUNG
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    applySettings();
    renderCategoriesGrid();
    renderCategoryTabs();
    updateClock();
    setInterval(updateClock, 1000);
    loadNews();

    // Event Listener
    document.getElementById('settings-btn')?.addEventListener('click', openSettings);
    document.getElementById('close-settings')?.addEventListener('click', closeSettings);
    document.getElementById('settings-overlay')?.addEventListener('click', closeSettings);
    document.getElementById('save-settings')?.addEventListener('click', saveSettings);
    document.getElementById('reset-settings')?.addEventListener('click', resetSettings);
    document.getElementById('refresh-btn')?.addEventListener('click', () => loadNews(true));
    document.getElementById('refresh-nav')?.addEventListener('click', () => loadNews(true));
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('news-count')?.addEventListener('input', (e) => {
        document.getElementById('news-count-display').textContent = e.target.value;
    });
    document.getElementById('dark-mode-toggle')?.addEventListener('change', (e) => {
        applyThemeSetting(e.target.checked);
    });
    document.getElementById('animations-toggle')?.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-animations', e.target.checked ? 'true' : 'false');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSettings();
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            saveSettings();
        }
    });
});

// ==========================================
// UHRZEIT & BEGRÜSSUNG
// ==========================================

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Nav Clock
    const navClock = document.getElementById('nav-clock');
    if (navClock) navClock.textContent = `${hours}:${minutes}`;

    // Datum
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('date-text');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('de-DE', options);

    // Begrüßung
    updateGreeting();
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 12) {
        greeting = `Guten Morgen${settings.name ? ', ' + settings.name : ''} ☀️`;
    } else if (hour >= 12 && hour < 17) {
        greeting = `Guten Tag${settings.name ? ', ' + settings.name : ''} 🌤️`;
    } else if (hour >= 17 && hour < 22) {
        greeting = `Guten Abend${settings.name ? ', ' + settings.name : ''} 🌅`;
    } else {
        greeting = `Gute Nacht${settings.name ? ', ' + settings.name : ''} 🌙`;
    }

    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) greetingEl.textContent = greeting;
}

// ==========================================
// THEME
// ==========================================

function applyThemeSetting(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Toggle icons
    const iconLight = document.querySelector('.icon-light');
    const iconDark = document.querySelector('.icon-dark');
    if (iconLight) iconLight.style.display = isDark ? 'none' : 'block';
    if (iconDark) iconDark.style.display = isDark ? 'block' : 'none';
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyThemeSetting(!isDark);
    document.getElementById('dark-mode-toggle').checked = !isDark;
}

// ==========================================
// EINSTELLUNGEN
// ==========================================

function loadSettings() {
    try {
        const saved = localStorage.getItem('nachrichten_app_settings_v2');
        if (saved) {
            settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Einstellungen konnten nicht geladen werden:', e);
    }
}

function applySettings() {
    // Name
    const nameInput = document.getElementById('user-name');
    if (nameInput) nameInput.value = settings.name;

    // Kategorien
    settings.enabledCategories.forEach(id => {
        const checkbox = document.getElementById(`cat-${id}`);
        if (checkbox) checkbox.checked = true;
    });

    // News Count
    const countInput = document.getElementById('news-count');
    if (countInput) countInput.value = settings.newsCount;
    const countDisplay = document.getElementById('news-count-display');
    if (countDisplay) countDisplay.textContent = settings.newsCount;

    // Dark Mode
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) darkToggle.checked = settings.darkMode;
    applyThemeSetting(settings.darkMode);

    // Animations
    const animToggle = document.getElementById('animations-toggle');
    if (animToggle) animToggle.checked = settings.animations;
    document.documentElement.setAttribute('data-animations', settings.animations ? 'true' : 'false');

    // Refresh Interval
    const intervalSelect = document.getElementById('refresh-interval');
    if (intervalSelect) intervalSelect.value = settings.refreshInterval;
    setupAutoRefresh();

    // Category Tabs
    renderCategoryTabs();
}

function renderCategoriesGrid() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map(cat => `
        <label class="category-checkbox" style="--cat-color: ${cat.color}">
            <input type="checkbox" id="cat-${cat.id}" value="${cat.id}">
            <span class="check-visual">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </span>
            <span class="cat-label">
                <span class="cat-icon">${cat.icon}</span>
                ${cat.name}
            </span>
        </label>
    `).join('');
}

function renderCategoryTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    if (!tabsContainer) return;

    const activeCats = CATEGORIES.filter(c => settings.enabledCategories.includes(c.id));

    let html = `<button class="tab-btn ${activeFilter === 'all' ? 'active' : ''}" data-category="all">
        <span class="tab-icon">📋</span> Alle
    </button>`;

    activeCats.forEach(cat => {
        html += `<button class="tab-btn ${activeFilter === cat.id ? 'active' : ''}" data-category="${cat.id}">
            <span class="tab-icon">${cat.icon}</span> ${cat.name}
        </button>`;
    });

    tabsContainer.innerHTML = html;

    // Event-Listener für Tab-Klicks
    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            activeFilter = category;

            // Active-State aktualisieren
            tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // News filtern
            renderFilteredNews();
        });
    });
}

function openSettings() {
    document.getElementById('settings-panel')?.classList.add('active');
    document.getElementById('settings-overlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSettings() {
    document.getElementById('settings-panel')?.classList.remove('active');
    document.getElementById('settings-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
}

function saveSettings() {
    settings.name = document.getElementById('user-name')?.value.trim() || '';

    settings.enabledCategories = CATEGORIES
        .filter(cat => document.getElementById(`cat-${cat.id}`)?.checked)
        .map(cat => cat.id);

    settings.newsCount = parseInt(document.getElementById('news-count')?.value || 5);
    settings.darkMode = document.getElementById('dark-mode-toggle')?.checked || false;
    settings.animations = document.getElementById('animations-toggle')?.checked !== false;
    settings.refreshInterval = parseInt(document.getElementById('refresh-interval')?.value || 15);

    // Speichern
    try {
        localStorage.setItem('nachrichten_app_settings_v2', JSON.stringify(settings));
    } catch (e) {
        console.warn('Einstellungen konnten nicht gespeichert werden:', e);
    }

    applySettings();
    closeSettings();
    loadNews(true);
    showToast('Einstellungen gespeichert ✓');
}

function resetSettings() {
    settings = { ...DEFAULT_SETTINGS };
    try {
        localStorage.removeItem('nachrichten_app_settings_v2');
    } catch (e) {
        console.warn('Einstellungen konnten nicht zurückgesetzt werden:', e);
    }
    applySettings();
    showToast('Einstellungen zurückgesetzt ↺');
}

// ==========================================
// AUTO-REFRESH
// ==========================================

function setupAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }

    if (settings.refreshInterval > 0) {
        refreshTimer = setInterval(() => {
            loadNews(false);
        }, settings.refreshInterval * 60 * 1000);
    }
}

// ==========================================
// NACHRICHTEN LADEN (Multi-Source)
// ==========================================

async function loadNews(isManual = false) {
    if (isRefreshing) return;

    if (isManual) {
        isRefreshing = true;
        const btn = document.getElementById('refresh-nav');
        if (btn) {
            btn.querySelector('svg')?.classList.add('spinning');
        }
    }

    try {
        let newsData = {};

        // Versuche RSS Feeds von ALLEN Quellen parallel zu laden
        const allNews = await loadAllRSSFeeds();

        if (allNews.length > 0) {
            // Kategorisiere die Nachrichten
            newsData = categorizeNews(allNews);
        } else {
            // Fallback wenn keine RSS Feeds verfügbar
            newsData = getFallbackNews();
        }

        // Speichere geladene Nachrichten für Filterung
        window.allNewsData = newsData;

        renderNews(newsData);

    } catch (e) {
        console.warn('Fehler beim Laden der Nachrichten:', e);
        const newsData = getFallbackNews();
        window.allNewsData = newsData;
        renderNews(newsData);
    } finally {
        // Ladebildschirm ausblenden
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('hidden');

        const app = document.getElementById('app');
        if (app) app.classList.remove('hidden');

        if (isManual) {
            isRefreshing = false;
            const btn = document.getElementById('refresh-nav');
            if (btn) {
                btn.querySelector('svg')?.classList.remove('spinning');
            }
        }
    }
}

async function loadAllRSSFeeds() {
    const allNews = [];
    const sourceMap = {
        tagesschau: RSS_SOURCES.tagesschau,
        zdf: RSS_SOURCES.zdf,
        zeit: RSS_SOURCES.zeit,
        spiegel: RSS_SOURCES.spiegel,
        focus: RSS_SOURCES.focus
    };
    const sourceNames = {
        tagesschau: 'Tagesschau',
        zdf: 'ZDF',
        zeit: 'Zeit',
        spiegel: 'Spiegel',
        focus: 'Focus'
    };

    // Lade ALLE Quellen parallel
    const fetchPromises = Object.entries(sourceMap).map(async ([sourceKey, sourceUrl]) => {
        let rssText = null;

        // Versuche verschiedene Proxys
        for (const proxy of CORS_PROXIES) {
            try {
                const response = await fetch(proxy + encodeURIComponent(sourceUrl), {
                    signal: AbortSignal.timeout(6000)
                });
                if (response.ok) {
                    rssText = await response.text();
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (!rssText) return [];

        // Parse
        const parser = new DOMParser();
        const xml = parser.parseFromString(rssText, 'text/xml');
        const items = xml.querySelectorAll('item');

        if (!items || items.length === 0) return [];

        const sourceName = sourceNames[sourceKey];

        return Array.from(items).map(item => {
            const title = cleanText(item.querySelector('title')?.textContent || '');
            const description = cleanText(item.querySelector('description')?.textContent || '');
            const link = item.querySelector('link')?.textContent || '#';
            const pubDate = item.querySelector('pubDate')?.textContent || '';

            let timeAgo = formatTime(pubDate);

            return {
                title: title || 'Kein Titel',
                excerpt: description.substring(0, 220) + (description.length > 220 ? '...' : ''),
                source: sourceName,
                time: timeAgo || 'Heute',
                link: link,
                importance: calculateImportance(title, description)
            };
        });
    });

    // Warte auf alle Quellen
    try {
        const results = await Promise.allSettled(fetchPromises);

        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value.length > 0) {
                allNews.push(...result.value);
            }
        });
    } catch (e) {
        console.warn('Fehler beim parallelen Laden der Feeds:', e);
    }

    // Sortiere nach Wichtigkeit und nehme die Top-Nachrichten
    allNews.sort((a, b) => b.importance - a.importance);

    // Maximal 40 Nachrichten insgesamt (nur die wichtigsten)
    return allNews.slice(0, 40);
}

function cleanText(text) {
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function formatTime(pubDate) {
    if (!pubDate) return '';
    try {
        const date = new Date(pubDate);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 5) return 'Gerade eben';
        if (diffMins < 60) return `Vor ${diffMins} Min.`;
        if (diffHrs < 24) return `Vor ${diffHrs} Std.`;
        if (diffDays === 1) return 'Gestern';
        if (diffDays < 7) return `Vor ${diffDays} Tagen`;
        return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
    } catch {
        return '';
    }
}

function calculateImportance(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    let score = 0;

    // Schlagwörter für hohe Relevanz
    const importanceWords = ['entscheidung', 'gesetz', 'krise', 'krieg', 'wahl', 'gipfel', 'beschließt', 'einigt', 'vertrag', 'reform', 'wichtig', 'bedeutend', 'erneut', 'erstmals', 'rekord', 'ende', 'start', 'neu'];

    importanceWords.forEach(word => {
        if (text.includes(word)) score += 3;
    });

    // Länge als Indikator für Substanz
    if (title.length > 40) score += 1;
    if (description.length > 100) score += 1;

    return score;
}

function categorizeNews(newsArray) {
    const newsData = {};
    const count = settings.newsCount;

    // Initialisiere Kategorien
    settings.enabledCategories.forEach(catId => {
        newsData[catId] = [];
    });

    // Verteile Nachrichten auf Kategorien basierend auf Keywords
    newsArray.forEach(news => {
        const text = (news.title + ' ' + news.excerpt).toLowerCase();
        let bestCategory = null;
        let bestScore = 0;

        settings.enabledCategories.forEach(catId => {
            const keywords = CATEGORY_KEYWORDS[catId] || [];
            let score = 0;

            keywords.forEach(keyword => {
                if (text.includes(keyword)) {
                    score += keyword.includes(' ') ? 3 : 2; // Mehrere Wörter = stärker
                }
            });

            if (score > bestScore) {
                bestScore = score;
                bestCategory = catId;
            }
        });

        // Falls keine Kategorie passt, versuche es mit "Welt" als Default
        if (!bestCategory && newsData['welt']) {
            bestCategory = 'welt';
        }

        if (bestCategory && newsData[bestCategory]) {
            // Prüfe Duplikate
            const isDuplicate = newsData[bestCategory].some(existing =>
                existing.title.toLowerCase().includes(news.title.toLowerCase().substring(0, 30)) ||
                news.title.toLowerCase().includes(existing.title.toLowerCase().substring(0, 30))
            );

            if (!isDuplicate) {
                newsData[bestCategory].push(news);
            }
        }
    });

    // Begrenze pro Kategorie
    settings.enabledCategories.forEach(catId => {
        if (newsData[catId]) {
            newsData[catId] = newsData[catId].slice(0, count);
        }
    });

    // Fallback-Nachrichten für leere Kategorien verwenden
    settings.enabledCategories.forEach(catId => {
        if (newsData[catId] && newsData[catId].length === 0) {
            const fallback = FALLBACK_NEWS[catId];
            if (fallback && fallback.length > 0) {
                // Mische Fallback mit existierenden Nachrichten (falls vorhanden)
                const shuffled = [...fallback].sort(() => Math.random() - 0.5);
                newsData[catId] = shuffled.slice(0, count);
            }
        }
    });

    return newsData;
}

function getFallbackNews() {
    const newsData = {};

    settings.enabledCategories.forEach(catId => {
        const fallbackSource = FALLBACK_NEWS[catId];
        if (fallbackSource) {
            newsData[catId] = fallbackSource.slice(0, settings.newsCount);
        } else {
            newsData[catId] = [];
        }
    });

    return newsData;
}

// ==========================================
// NACHRICHTEN ANZEIGEN
// ==========================================

function renderNews(newsData) {
    const container = document.getElementById('news-container');
    if (!container) return;

    let totalNews = 0;
    let activeCategories = 0;
    let html = '';

    const enabledCategories = CATEGORIES.filter(c => settings.enabledCategories.includes(c.id));

    if (enabledCategories.length === 0) {
        html = `
            <div class="no-news">
                <div class="no-news-icon">📭</div>
                <h3>Keine Kategorien aktiv</h3>
                <p>Bitte aktiviere mindestens eine Kategorie in den Einstellungen.</p>
            </div>
        `;
    } else {
        enabledCategories.forEach((category, index) => {
            const news = newsData[category.id] || [];
            if (news.length === 0) return;

            totalNews += news.length;
            activeCategories++;

            html += `
                <div class="category-section" data-category="${category.id}" style="animation-delay: ${index * 0.08}s">
                    <div class="category-header" style="--category-color: ${category.color}">
                        <span class="category-icon">${category.icon}</span>
                        <h2 class="category-title">${category.name}</h2>
                        <span class="category-count">${news.length}</span>
                    </div>
                    <div class="news-grid">
                        ${news.map(item => `
                            <article class="news-card" style="--card-accent: ${category.color}">
                                <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                                    <span class="news-source-badge" style="background: ${category.color}">${item.source}</span>
                                    <h3 class="news-title">${item.title}</h3>
                                    <p class="news-excerpt">${item.excerpt}</p>
                                </a>
                                <div class="news-meta">
                                    <span class="news-source">${category.icon} ${category.name}</span>
                                    <span class="news-time">${item.time}</span>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        if (totalNews === 0) {
            html = `
                <div class="no-news">
                    <div class="no-news-icon">🔍</div>
                    <h3>Keine Nachrichten gefunden</h3>
                    <p>Versuche eine andere Quelle zu wählen oder aktualisiere die Nachrichten.</p>
                </div>
            `;
        }
    }

    container.innerHTML = html;
    updateStats(totalNews, activeCategories);
}

function renderFilteredNews() {
    if (!window.allNewsData) return;

    if (activeFilter === 'all') {
        renderNews(window.allNewsData);
    } else {
        const filteredData = {};
        if (window.allNewsData[activeFilter]) {
            filteredData[activeFilter] = window.allNewsData[activeFilter];
        }
        renderNews(filteredData);
    }
}

function updateStats(totalNews, activeCategories) {
    const totalCount = document.getElementById('total-news-count');
    if (totalCount) totalCount.textContent = totalNews;

    const catCount = document.getElementById('categories-count');
    if (catCount) catCount.textContent = activeCategories;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) lastUpdate.textContent = timeStr;
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message) {
    // Vorhandene Toast entfernen
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Entferne nach 2.5s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

// ==========================================
// SPINNING ANIMATION für Refresh
// ==========================================

// Füge CSS für den Spinner hinzu
const style = document.createElement('style');
style.textContent = `
    @keyframes spin-icon {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spinning {
        animation: spin-icon 1s linear infinite;
    }
`;
document.head.appendChild(style);