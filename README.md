# Weather Intelligence App 🌤️🧠

A robust, production-ready, client-side Single Page Application (SPA) designed to deliver real-time conditions, multi-variable 7-day extended forecasts, rule-based weather intelligence suggestions, and interactive trending metrics.

Built with **React 19**, **TypeScript**, and **Tailwind CSS**, this app integrates directly with the public, high-performance [Open-Meteo APIs](https://open-meteo.com/) purely on the client side—meaning **no secret API keys, proxy servers, or database connections are needed**.

---

## 🚀 Key Features

1. **Dual API Orchestration & Service Layer**:
   * **Geocoding API**: Translates user-input query strings (e.g., "Kyoto") into high-precision GPS coordinates (`latitude`, `longitude`).
   * **Forecast API**: Fetches real-time localized climatology and comprehensive 7-day weather matrices (wind vectors, precipitation accumulation, and max/min temperatures).

2. **Horizontal Search Panel with Client Caching**:
   * Instant query validation and error alert displays.
   * Quick-access presets for popular global destinations.
   * Persistent search history backed by browser-local storage (`localStorage`).

3. **Polished Current Weather Dashboard**:
   * Multi-variable telemetry displaying current temperature (formatted dynamically based on custom user metric toggle), localized timezone metadata, current wind velocity, compass coordinates, and precipitation indicators.

4. **Weather Intelligence Panel**:
   * Dynamic, rule-based recommendation engine offering custom tailored advice on clothing (wardrobe recommendations) and outdoor feasibility.
   * Custom triggers for extreme weather states (severe thunder warnings, high wind advisories, cold stress, and optimal heat index states).

5. **7-Day Outlooks & Visual Weekly Trends**:
   * Interactive chart (built using `recharts`) showing temperature gradients or daily precipitation.
   * Day-by-day meteorological grid cards detailing maximum and minimum ranges.

---

## 🛠️ Tech Stack & Dependencies

* **Framework & Tooling**: [Vite](https://vitejs.dev/) & [TypeScript](https://www.typescriptlang.org/)
* **View Engine**: [React 19](https://react.dev/)
* **Styling & Layout**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Component Animations**: [Motion](https://motion.dev/) (`motion/react`)
* **Vector Icons**: [Lucide React](https://lucide.dev/)
* **Visual Analytics & Charting**: [Recharts](https://recharts.org/)

---

## 📂 Source Code Structure

```bash
├── index.html                  # Standard entry HTML document
├── package.json                # Project dependencies, scripts, and target setups
├── vite.config.ts              # Vite configurations with aliased paths
├── tsconfig.json               # TypeScript strict rules and configurations
└── src/
    ├── main.tsx                # StrictMode application mount
    ├── App.tsx                 # Core controller orchestrating states, fetching and grids
    ├── index.css               # Global tailwind directive import
    ├── types.ts                # Strict geocoding & daily meteorological declarations
    ├── utils/
    │   └── weatherMapping.ts   # Weather condition codes matching Lucide icons & gradients
    └── components/
        ├── SearchFilter.tsx    # Compact horizontal search, history panel & presets
        ├── CurrentWeather.tsx  # Dynamic dashboard with unit toggle (°C/°F)
        ├── IntelligencePanel.tsx # Rule-based advisory recommendations
        ├── WeatherTrendChart.tsx # Recharts temperature & rain visual analytics
        └── ForecastGrid.tsx    # 7-Day weather outlook matrix cards
```

---

## 📦 Getting Started & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Lint Source Code & Types
```bash
npm run lint
```

### 4. Build Production Bundle
Outputs optimized, static assets into `dist/` ready to serve via Cloudflare Pages, Netlify, or Vercel:
```bash
npm run build
```

---

## 🌐 Deploying to Cloudflare Pages via GitHub

Follow these step-by-step instructions to export this repository from Google AI Studio and set up CI/CD deployment on **Cloudflare Pages**.

### Step 1: Export from Google AI Studio to GitHub
1. Open the **Settings** menu inside Google AI Studio (top-right gear icon or the project integration panel).
2. Select **Export to GitHub** or **Connect to GitHub**.
3. Authorize Google AI Studio to access your GitHub account.
4. Choose **Create a new repository** or connect to an existing repository, then click **Export/Push**.
5. Your files (including `package.json`, `index.html`, `vite.config.ts`, and the `src/` directory) are now synced to your GitHub repository!

### Step 2: Configure Cloudflare Pages
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** in the left sidebar menu.
3. Click the **Create** button (often labeled **Create application** or **Create Page**).
4. Select the **Pages** tab (ensure you are on Pages, not Workers).
5. Click **Connect to Git** to link your GitHub account.
6. Select the repository you just exported from Google AI Studio.

### Step 3: Configure Build & Deployment Settings
Configure the build parameters exactly as shown below:
* **Framework Preset**: Select **React** or **Vite** (both work perfectly; choosing **React (Vite)** or **Vite** is ideal).
* **Build Command**: `npm run build`
* **Build Output Directory**: `dist` (This is where Vite compiles static HTML, CSS, and JS files).
* **Root Directory**: `/` (Leave as default unless using a monorepo structure).

### Step 4: Deploy
1. Click **Save and Deploy**.
2. Cloudflare Pages will spin up a build container, install dependencies, compile your application using `npm run build`, and deploy the contents of the `dist` directory.
3. Once the build succeeds, Cloudflare will provide a **Visit Site** button with a public, secure `.pages.dev` URL (e.g., `https://weather-intelligence-app.pages.dev`). Any future pushes to your GitHub repository will automatically trigger fresh, live deployments!
