# NSM Impex

Premium B2B hosiery & garments manufacturer/exporter website.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- File-based product catalog (`data/catalog.json`)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin

- Dashboard: `/admin`
- Products: `/admin/products`
- Import CSV / paste: `/admin/import`

Product data is stored in `data/catalog.json` and can later be replaced with a database/CMS.

## Notes

- No cart or checkout (B2B inquiry-led)
- Specs show “Available on request” when empty
- Product images use clean placeholders until uploaded via Admin
