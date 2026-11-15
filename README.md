# ClimatePoets

A NASA Earth observation, data-sonification and climate-poetry platform. Independent project; not affiliated with or endorsed by NASA.

## Deploying the full application (Vercel recommended)
1. Create a GitHub repository and upload **all files in this folder** to the repository root, including `api/`, `assets/`, and `sql/`.
2. Import the repository into [Vercel](https://vercel.com/). Select **Other** framework, root directory `./`; there is no build command and no output directory to set. Vercel serves the static root files and `/api/*.js` serverless endpoints.
3. Test `/api/nasa-data?lat=2.2499&lon=32.8998&year=2025` on the deployed site. Historical NASA POWER data should load through NASA's public API. This endpoint requires no API key, but does require Vercel serverless runtime and outbound internet.
4. To enable real AI text and artwork, configure `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel **Environment Variables**; the models default to `gpt-4.1-mini` and `gpt-image-1`. AI calls incur costs; an Upstash Redis account is required for enforced per-IP daily quotas (8 poems and 3 images per day). AI requests remain disabled without rate limiting. Redeploy after adding variables. Never embed the key in browser code.
5. To enable public community submissions: create a [Supabase](https://supabase.com/) project, run `sql/supabase.sql`, and configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as private Vercel environment variables. The gallery shows only posts with `status='published'`.
6. For abuse protection, set up a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) widget, configure `TURNSTILE_SECRET` privately in Vercel, and enter your **public** site key into `app.js` as documented below. Public submissions will be unavailable until Turnstile is configured. Approve posts by changing `status` to `published` in Supabase Table Editor.

## Turnstile setup
In `index.html`, replace `<div id="turnstile" class="turnstile-box"></div>` with `<div class="cf-turnstile" data-sitekey="YOUR_PUBLIC_SITE_KEY"></div>`, and add `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>` before `</body>`. This script can load from Cloudflare over HTTPS. A public site key can appear in browser code; `TURNSTILE_SECRET` must not.

## What works without accounts or credentials
- Website, navigation, landing page and climate science references.
- Audio sonification engine, once a NASA dataset has been loaded.
- Image-to-pixel sonification of a locally uploaded image.
- Poetry editing, browser-based draft storage, speech synthesis and TXT downloads.
- The NASA POWER endpoint on Vercel without an API key.

## What requires server configuration
- AI-authored climate poetry (OpenAI paid API and Upstash Redis rate limiter).
- AI-generated image art (OpenAI paid API and Upstash Redis rate limiter).
- Public community gallery and moderated submissions (Supabase and Turnstile).

## Accuracy and ethical considerations
- NASA POWER represents gridded historical climate/weather-related observations, not a live weather forecast. Daily T2M temperature is averaged by month, and PRECTOTCORR daily precipitation is totaled by month.
- Audio values are derived mathematically; the sound is not an audio recording of Earth or space.
- Poetry is an artistic expression, not a scientific forecast. Human reviewers should verify AI text before sharing.
- Public submissions require consent and human moderation; do not publish private contributor email addresses.
- No NASA trademark, official partnership or endorsement is claimed.

## Operational hardening before public launch
The package implements a functional full-stack MVP, not a fully operated production service. Per-IP daily quotas via Upstash are implemented, but an authenticated AI usage policy, abuse monitoring and budget ceilings should still be added for wide public use; otherwise attackers may still cause costs from different IPs. Keep all environment variables secret. Consider user accounts, image and audio storage, moderation workflows, privacy policy, accessibility testing and monitoring for public-scale use.
