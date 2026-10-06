# Mount Edge Hotel — Bug, Security & SEO Audit (October 2026)

## Bugs found and fixed

1. **Two different websites in one repo.** The home page and `gallery.html` used the current design. `/rooms`, `/facilities`, `/about`, `/contact`, `/booking`, `/terms` and `/gallery` used an older design whose CSS classes (`.hamburger`, `.page-hero`, `.welcome-split`, `.pricing-card`, `.gallery-masonry`, `.scroll-top`…) no longer exist in `style.css`, so those pages rendered unstyled. **Fix:** rebuilt all six subpages in the current design, same URLs.
2. **Duplicate galleries.** `/gallery/` used Unsplash stock photos (a pool, a lobby, Horton Plains) presented as the hotel. **Fix:** `/gallery/` now redirects to `/gallery.html`, which uses real photos only.
3. **Stock photos on room pages.** Rooms/About/Facilities showed Unsplash images as if they were your rooms. **Fix:** removed; real hotel photos used.
4. **Broken link.** Booking page linked to `terms.html#cancellation` (404). **Fix:** `/terms/#cancellation`.
5. **JS crash on subpages.** `main.js` did `$('#year').textContent` on a missing element, which halted the script. **Fix:** null-safe.
6. **Booking summary had no logic.** The HTML expected a live price estimate, but no JS existed, and forms hard-redirected to Formspree. **Fix:** new `forms.js` with a live estimate (room × meal plan × nights) and inline success/error messages.
7. **Inconsistent navigation** between home, gallery and subpages. **Fix:** one nav and footer everywhere, plus a "Book online" link.
8. **Leaked text / unverifiable claims** on About (`4.5★ Average Rating-->`, "Happy Guests" with no number, "20 rooms", "Est. 2025"). **Fix:** removed.
9. **Accessibility.** No focus trap in dialogs, Escape didn't close the lightbox, no focus return. **Fix:** added.
10. **Heavy images.** `Logo.png` 2.2 MB, hero 1 MB, logo 666 KB. **Fix:** hero 94 KB, logo 105 KB, duplicate `Logo.png` removed. Total site is about 1 MB.
11. **Contact map** used a placeholder embed. **Fix:** same address-based embed as the homepage.

## Security

- **No Content-Security-Policy.** Added a strict CSP: own files, Google Fonts, Google Maps and Formspree only; no inline scripts; `object-src 'none'`; `form-action` limited to Formspree.
- External links now use `rel="noopener noreferrer"`; referrer policy set to `strict-origin-when-cross-origin`.
- **Form spam:** honeypot field, `maxlength` limits, client-side validation. Also enable domain restriction / reCAPTCHA in the Formspree dashboard.
- URL parameter for room preselection is now whitelisted (`Single`, `Double`, `Triple`) — no reflected input.
- **Privacy policy was inaccurate** (claimed payment info collected and no third parties, but forms go through Formspree). Rewritten.
- Removed remote hotlinks (Unsplash) — privacy and availability.
- **Hosting limit:** GitHub Pages cannot set HTTP headers (HSTS, X-Frame-Options). Put the domain behind Cloudflare (free) and enable "Always use HTTPS" + HSTS if you want these.
- The Formspree form ID is visible in the HTML. That is normal; restrict allowed domains to `mountedgehotel.com` in Formspree.

## SEO

- Unique `<title>`, meta description, canonical URL, Open Graph and Twitter card on every page; 1200×630 share image.
- Structured data: `Hotel` (address, phone, check-in/out, price range) on the home page; `BreadcrumbList` on subpages; `ImageGallery` on the gallery.
- `sitemap.xml`, `robots.txt`, custom `404.html` (noindex), `.nojekyll`.
- One `<h1>` per page, descriptive alt text, image width/height set (no layout shift), hero image preloaded.
- Local keywords ("Blackpool, Nuwara Eliya", rates, facilities, directions) on indexable pages.
- **Still to do by you:** verify a Google Business Profile, submit the sitemap in Search Console, keep name/address/phone identical everywhere.

## Please confirm before launch (I did not invent these)

1. **Rates.** Home page lists room-only rates; subpages list all meal plans (taken from your old Rooms page).
2. **Facilities** (airport transfers, laundry, extra beds, luggage storage) came from your old Facilities page — delete any you don't offer.
3. **Logo** has dark text on a dark header. A white/gold version would look much better.
4. **Formspree** form `xpqkbzkg` is reused for both contact and booking; subject lines distinguish them.

## Deploy

Replace the contents of the `NOG999/MountEdgeHotel` repo with this folder (keep `CNAME`), then submit `https://mountedgehotel.com/sitemap.xml` in Search Console.
