# Jini's Pilates Demo

Static marketing site for Jini's Pilates Studio & Wellness Cafe (Mysuru).

## Local

```bash
python -m http.server 8080
```

Open http://localhost:8080

## CMS

Open http://localhost:8080/cms/ (login) → `/cms/dashboard.html`

- ID: `JINIS`
- Password: `Jinni@7654`

Edit Hero, About, Classes, Trainers, Cafe, FAQ, Contact → **Save changes** → refresh homepage. Content is stored in the browser (`localStorage`).

## Deploy

Static files — deploy the repo root on Vercel.
