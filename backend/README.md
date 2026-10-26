# Route Planner backend

Django + Django REST Framework API that plans a truck trip: 3 routes from TomTom, hourly weather from Open-Meteo at every checkpoint, a risk level per checkpoint, and a recommended route. Design and API shapes are in `../docs/`.

## Setup

```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env     # then paste your TomTom key into TOMTOM_API_KEY
python manage.py migrate
python manage.py runserver
```

Run the tests with `python manage.py test trips` (139 tests). The use cases run against in-memory fakes and the adapters against stubbed HTTP, so no key or network is needed.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health/` | Health check |
| GET | `/api/geocode/?q=` | Up to 5 place suggestions |
| POST | `/api/trips/` | Plan a trip |
| GET | `/api/trips/{id}/` | Reopen a saved trip |
| GET | `/api/trips/{id}/heatmap/` | Corridor risk for the next 49 hours (hour 0 to 48) |

Every error has a `detail` sentence: 400 invalid input, 404 unknown trip, 422 no truck route, 429 throttled or weather limit (with `Retry-After`), 502 a provider failed or a forecast value is missing, 504 timeout. Full shapes are in [`../docs/PRD.md`](../docs/PRD.md#8-api-specification).

## Notes

- **Vehicle weight vs load weight.** The `load_lb` the user enters is the cargo. For routing, `domain/vehicle_rules.py` adds a 35,000 lb tractor-trailer tare and sends the total to TomTom as `vehicleWeight`, because road restrictions apply to the whole truck. The risk rules in `domain/risk.py` use the load alone, as the brief specifies.
- **Times.** Departure is truncated to whole seconds and stored in UTC. ETAs and arrivals are returned as ISO 8601 with a `Z` suffix.
- **Caching.** Geocode results are cached for 24 h, weather for 30 min as one hourly series per 0.1° coordinate, routes for 1 h and heatmaps for 1 h per trip and clock hour, all in Django's local-memory cache.
- **Route cache granularity.** Routes are cached for an hour, keyed by origin, destination, load and the departure *hour*. Two trips planned for 08:01 and 08:59 share one TomTom response, so the second one's durations reflect traffic as of the first request. Up to an hour of traffic drift is accepted in exchange for one TomTom call per hour bucket.

## Deploy to Vercel (one project)

The repository deploys as a single Vercel project: the React build in `frontend/dist` is served as static files, and Django runs as one Python serverless function at `api/index.py`. `vercel.json` at the repository root holds the install, build and output settings and rewrites `/api/*`, `/admin*` and `/static/*` to the function; every other path falls back to `index.html`. The frontend calls `/api` on the same origin, so no `VITE_API_URL` or CORS setup is needed.

1. **Create a Postgres database.** Any Postgres works (Neon from the Vercel Marketplace is the quickest). Copy its connection string; it must include `?sslmode=require`. SQLite cannot be used on Vercel because the function's file system is read-only.
2. **Import the repository in Vercel.** Root directory is the repository root; framework preset "Other". The commands come from `vercel.json`.
3. **Set the environment variables** in the Vercel project (Production and Preview):

   | Variable | Value |
   |---|---|
   | `DJANGO_SECRET_KEY` | a fresh random key, e.g. `python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"` |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | your production domain, e.g. `route-planner.vercel.app`. The deployment's own `VERCEL_URL` is added automatically. |
   | `TOMTOM_API_KEY` | the TomTom key |
   | `DATABASE_URL` | the Postgres connection string |

4. **Run the migrations against the production database from your machine** (the function cannot run them itself):

   ```
   cd backend
   $env:DATABASE_URL = "postgres://..."      # PowerShell; use export on macOS/Linux
   python manage.py migrate
   python manage.py createsuperuser          # optional, for /admin/
   ```

5. **Deploy**, then check `https://<domain>/api/health/`, plan the Chicago to Denver preset, and open `/admin/`.

Notes:

- The function is configured with `maxDuration: 60` (Vercel's default of 10 s would cut a first plan short). With the legacy `builds` form of `vercel.json` the top-level `functions` key is not allowed, so the limit is passed as `config.functions` on the Python build entry, which `@vercel/python` reads. A first plan takes about 8 s, almost all of it TomTom computing alternatives; a cold start adds a second or two.
- Every error response carries a `detail` sentence (`trips/interfaces/api/exception_handler.py`), and the public endpoints are throttled per IP (`trips/interfaces/api/throttling.py`, rates in `settings.REST_FRAMEWORK`). Throttle counters live in the local-memory cache, so on Vercel they are per function instance.
- Django's local-memory cache is per function instance, so the route, weather and heatmap caches only help while an instance stays warm. If repeat-trip speed matters in production, point `CACHES` at Redis or the database cache; nothing else changes.
- Admin static files are served by WhiteNoise straight from the installed Django package (`WHITENOISE_USE_FINDERS`), so no `collectstatic` step is needed.
- `.vercelignore` keeps the virtualenv, the SQLite file, `node_modules` and `docs` out of the function bundle.
