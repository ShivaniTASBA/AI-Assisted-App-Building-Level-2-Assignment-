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
