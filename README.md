# Jini's Pilates Demo

Static marketing site for Jini's Pilates Studio & Wellness Cafe (Mysuru).

## Local

```bash
python serve.py
```

Open http://127.0.0.1:8080 — the browser auto-refreshes when you save HTML, CSS, or JS changes.

## CMS

Open http://localhost:8080/cms/ (login) → `/cms/dashboard.html`

- ID: `Jinis`
- Password: `Jinis@26`

Manage Hero, About & Stats, Classes, Trainers, Cafe, Plans, Gallery (upload photos), FAQ, Contact.

## Separate pages

- Gallery (all): `/gallery/`
- Gallery categories: `/gallery/studio.html`, `classes.html`, `equipment.html`, `cafe.html`, `members.html`, `events.html`
- Classes / Trainers / Cafe / Plans / About: `/pages/`

## Deploy

Static files — deploy the repo root on Vercel.
