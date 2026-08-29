# Claudio Asaro — Online STEM Tutoring

Premium one-page landing site for private online STEM tutoring. Built with Next.js, TypeScript and Tailwind CSS. Ready for Vercel.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Deploy (default Next.js settings are fine).
4. Update `SITE.url` in `src/lib/constants.ts` to your production domain.

## Edit content

Almost everything editable lives in **`src/lib/constants.ts`**:

- Pricing (`PRICING.amount`)
- Contact / booking links (`CONTACT`)
- Subjects, FAQ, testimonials, results, credentials
- Lesson languages (`LANGUAGES`)

### Booking CTAs

- If `CONTACT.bookingUrl` is set → all “Book” buttons open that URL.
- Otherwise → a contact modal opens (ready to wire to Formspree / Resend / EmailJS).

### Images

Place assets in `public/images/`:

| File | Use |
|------|-----|
| `claudio-hero.jpg` | Hero portrait |
| `claudio-about.jpg` | About section |
| `certificate-gostudent.png` | Credentials gallery |
| `result-1.jpg` … | Student result screenshots (anonymize first) |
| `certificate-placeholder-*.jpg` | Extra credentials |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
