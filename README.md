# Route Planner: weather-aware truck routing

**Live app:** _link to be added_
**Walkthrough (Loom):** _link to be added_

Enter an origin, a destination, a departure time and the load weight. The app returns three truck routes from TomTom, places a checkpoint every 10, 25 or 50 miles, works out when the truck will reach each one, looks up the Open-Meteo forecast for that hour, scores every checkpoint with the wind, rain, snow and load rules from the brief, and recommends the safest route while keeping travel time in view. A heatmap with a 0 to 48 hour slider shows how risk along the whole corridor changes over the next two days.

![Screenshot: three routes on the map with risk-colored checkpoints, route cards and the heatmap slider](docs/screenshot.png)
_Screenshot to be added at `docs/screenshot.png`._

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19, TypeScript, Vite, MUI, TanStack Query, Axios, Zustand, React Select, MapLibre GL |
| Backend | Python 3.12, Django 6, Django REST Framework, httpx |
| Routing and geocoding | TomTom Routing and Search APIs (truck mode) |
| Weather | Open-Meteo forecast API (free, no key) |
| Database | Postgres in production, SQLite locally |
| Hosting | One Vercel project: static frontend plus Django as a Python serverless function |

## How it works

**Routes.** One TomTom request in truck mode with the vehicle weight and departure time asks for two alternatives. If fewer than three distinct routes come back, the backend adds a via-point 30 to 80 km to the side of the route midpoint and routes again, two via-points at a time in parallel, dropping near-duplicates (within 1% on both distance and time).

**Checkpoints.** Each route's geometry is walked with haversine distance, scaled to TomTom's official length. A checkpoint is placed at the origin, every N miles, and at the destination. Each checkpoint owns the stretch of road since the previous one, which is what the route metrics add up.

**ETA.** Departure plus the travel time to that point, interpolated from TomTom's own cumulative time data along the route (its instruction points), not from an average speed. All times are computed in UTC and shown in the viewer's local time.

**Weather hour rule.** Open-Meteo's rain and snowfall values are totals for the preceding hour, so a checkpoint at 14:20 reads the value stamped 15:00. Wind is an instant value, so it uses the nearest hour. One batched request covers every checkpoint on all three routes.

**Risk rules.** Each checkpoint gets the worst of its wind, rain and snow levels:

| Condition | Low | Moderate | High | Severe | No Travel |
|---|---|---|---|---|---|
| Wind (mph) | < 25 | 25 to < 35 | 35 to < 45 | 45 to < 55 | ≥ 55 |
| Rain (in/hr) | < 0.10 | 0.10 to < 0.25 | 0.25 to < 0.50 | 0.50 to 1.00 | > 1.00 |
| Snow (in/hr) | < 0.5 | 0.5 to < 1.0 | 1.0 to < 2.0 | 2.0 to 3.0 | > 3.0 |

**Load rules**, applied on top: wind of 55 mph or more is No Travel for any load; 45 to 54 mph with a load over 30,000 lb is No Travel; 35 to 44 mph with a load over 40,000 lb is Severe. Every checkpoint carries a reason such as `Wind 47.0 mph + 38,000 lb load → No Travel`.

**Ranking.** Routes are sorted by fewest No Travel miles, then fewest Severe miles, then fewest High miles, then lowest distance-weighted average risk, then shortest travel time. The first route wins and the reason sentence names the deciding comparison. If every route crosses No Travel weather, the best route is still shown and the trip is flagged unsafe for that departure time.

**Heatmap.** A grid of points every 25 km along all three routes plus 30 km to each side, snapped to 0.5° cells, scored for each of the next 49 hours with the same rules and the trip's load. The browser loads it once; the slider only changes which hour colors the layer, so dragging it never calls the API.

## Assumptions and trade-offs

- **Boundary values.** The brief's ranges share edge values (0.25 in/hr appears in both Moderate and High). Each edge belongs to the higher level, except the Severe to No Travel edge for rain and snow, which the brief writes as "> 1.00" and "> 3.0" and is kept exclusive. Loads of exactly 30,000 or 40,000 lb do not trigger the load rules ("greater than").
- **Sustained wind, not gusts.** Classification uses Open-Meteo's sustained 10 m wind. Gusts are fetched and shown in the checkpoint tooltip for context.
- **Vehicle weight for TomTom only.** The load the user enters is the cargo. For routing, a 35,000 lb tractor-trailer tare is added and the total is sent to TomTom as the vehicle weight, because road restrictions apply to the whole truck. The risk rules use the load alone, as the brief specifies.
- **No Travel ranks above Severe.** The brief ranks Severe miles first; No Travel is worse, so it was added as the first key.
- **Heatmap hour 0 is now**, not the departure time, as the brief defines the slider. The trip's own checkpoints already cover the departure.
- **First plan takes 6 to 9 seconds for a 1,000 mile trip.** Almost all of it is TomTom computing route alternatives (one route takes about 2.5 s, three about 6 s). Repeating a trip within the hour takes well under a second from cache. Shorter trips are faster in proportion.
- **Missing forecast values are an error, not calm weather.** If Open-Meteo returns no wind, rain or snow value for a checkpoint hour, the plan fails with a 502 and a message, rather than scoring that stretch Low. Gusts are informational and may be absent.
- **Risk is classified on the raw forecast value.** Rounding happens only for display, so 24.96 mph is Low even though the popup shows 25.0 mph.
- **Public endpoints are rate-limited per IP** (10 plans a minute and 150 a day; 60 a minute for geocoding and trip reads) so one client cannot exhaust the TomTom and Open-Meteo allowances. Over the limit the API answers 429 with a `Retry-After` header.
- **Caches are in memory and not shared on Vercel.** Routes (1 h), weather (30 min) and heatmaps (1 h) live in Django's local-memory cache, which is per function instance. They help while an instance stays warm; switching to Redis or the database cache is a settings change.
- **Open-Meteo free tier.** It allows 600 location-calls per minute and counts every coordinate in a request. One plan with its heatmap uses about 350, so a second trip to a different corridor inside the same minute will see the heatmap report the limit and retry on its own after a minute. The grid size was chosen to keep one trip well under the limit.
- **Route cache granularity.** Routes are cached by departure hour, so two trips planned for 08:01 and 08:59 share one TomTom response and up to an hour of traffic drift in the durations.

## Local setup

Backend:

```
cd backend
python -m venv venv
venv\Scripts\activate            # source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
copy .env.example .env           # then fill in TOMTOM_API_KEY and DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver
```

Frontend, in a second terminal:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` to Django on port 8000. The base map is OpenFreeMap's free "positron" style, so no map key is needed; `VITE_MAP_STYLE` and `VITE_API_URL` are optional overrides (see [frontend/README.md](frontend/README.md)). `DEBUG=True` in `.env` is for local use only; with `DATABASE_URL` unset the backend uses the SQLite file.

## Tests

```
cd backend
python manage.py test trips
```

139 tests, organised by layer, cover the threshold edges and load limits (including exactly 30,000 and 40,000 lb), checkpoint sampling and ETA interpolation, the forecast hour rule and missing-value handling, the ranking order and unsafe flag, the heatmap grid and scoring, routing's fallback and cache, the Open-Meteo rate-limit handling, per-IP throttling, and the trip and heatmap endpoints end to end with fake routing and weather, the TomTom and Open-Meteo adapters with HTTP stubbed, and the rule that keeps framework code out of the domain. Every error carries a `detail` message. No network or API key is needed.

Frontend type check and lint:

```
cd frontend
npm run build
npx eslint src
```

## Deployment

The repository deploys as a single Vercel project. `vercel.json` builds the Vite app with `@vercel/static-build` and runs Django through `api/index.py` with `@vercel/python` with a 60 s `maxDuration` (a first plan takes about 8 s); its routes send `/api`, `/admin` and `/static` to the function and everything else to the frontend build. Environment variables on Vercel: `DJANGO_SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `TOMTOM_API_KEY` and `DATABASE_URL` for Postgres. Migrations are run from a developer machine against `DATABASE_URL`. Step-by-step instructions and operational notes are in [backend/README.md](backend/README.md#deploy-to-vercel-one-project).

Design documents live in `docs/`: the PRD, architecture, plan and task list, plus a per-feature spec, architecture, plan outcome and runbook for the heatmap under `docs/features/heatmap/`.

## Future scope

Not built. The full list, with the platform items, is in [PRD section 15](docs/PRD.md#15-future-scope).

- **Share the weather fetch between checkpoints and the heatmap.** Today they sample the corridor on two grids and two time windows and rarely hit each other's cache. One canonical fetch window per coordinate, with the heatmap grid seeded from the checkpoint cells, would cut Open-Meteo usage per trip by roughly half and allow a finer heatmap.
- **A shared cache.** Redis or the database cache so repeat trips and warm weather survive across function instances.
- **Faster first plan.** Request TomTom's alternatives with `traffic=false` (about 1 s saved, at the cost of traffic-aware ETAs), or show the direct route as soon as it arrives and stream the alternatives in.
- **Heatmap extras.** A play button, a truck marker moving along the recommended route with the slider, and a metric switch between risk, wind, rain and snow.
- **Shareable trip links.** Trips are already saved by UUID and reopenable through the API; the UI needs a route for `/trips/{id}`.
- **Rest breaks in ETAs and a time trade-off in the ranking.** ETAs are pure driving time, and the ranking is strict weather-first.
- **Tests and CI for the frontend**, and a workflow that runs the backend tests, type check and lint on every push.
