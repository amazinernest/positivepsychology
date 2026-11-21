# PoPAN website — Positive Psychology Association of Nigeria

A static website in plain HTML5, CSS3 and vanilla JavaScript. No build step, no frameworks, no dependencies. Open `index.html` or serve the folder with any web server (e.g. `python3 -m http.server`).

## Structure
```
index.html  about.html  addresses.html  constitution.html  leadership.html
membership.html  members.html  programmes.html  news-events.html
conference-2023.html  resources.html  contact.html  404.html
css/style.css          design tokens, layout, components (one file, sectioned)
js/nav.js              mobile menu, dropdowns, header state
js/ui.js               scroll reveal, back-to-top, in-page contents, tabs
js/forms.js            form validation + delivery (see below)
js/directory.js        member register search
assets/img|fonts|docs  logo variants, self-hosted fonts, constitution (.docx), 2023 flyer
sitemap.xml robots.txt
```
The header and footer are repeated in each HTML file; when changing navigation, update every page.

## Items to confirm before launch
1. **Domain.** `canonical`, Open Graph URLs and `sitemap.xml` use `https://popannetwork.org/`, taken from the 2023 conference flyer. Find-and-replace it if the live domain differs.
2. **Forms need a delivery route.** The site has no server. By default, a validated form opens a ready-to-send Gmail compose window (new tab) addressed to `positivepopan@gmail.com`. To send directly instead, add `data-endpoint="https://…"` to the `<form>` (Formspree, Netlify Forms, or your own API); `forms.js` then POSTs JSON via fetch.
3. **Member register** (`members.html`) lists the 129 names from the consolidated list, verbatim, and is set to `noindex`. Confirm members consent to a public listing, or delete the page and its links.
4. **Logo.** The supplied logo had a crackle texture behind it. A transparent version was produced from it without changing the artwork (`assets/img/logo-*.png`); the untouched original is `logo-original.jpg`. Please supply the vector/original artwork when available. The logo is designed for light backgrounds.
5. **Content gaps (left honestly empty):** no upcoming events, publications, divisions/branches, fee schedule, application form, social media accounts, or photographs were supplied.

## Payments, dues and gallery (data files)

- **Fees and bank details**: `payments.html` and `membership.html` (registration N3,000, annual renewal N2,000, Ecobank 2080047143).
- **Dues column** on the member register: edit `data/dues.js`. Key = number on the register, value = latest year paid, e.g. `"12": 2026`. Empty = dash for everyone.
- **Conference photos**: upload images to `assets/img/gallery/2023/` or `/2025/`, then list them in `data/gallery.js`. Sections stay hidden until photos are listed.
- **Limits of a static site**: payments are not verified and certificates are not generated automatically. The forms open a prepared Gmail message; the Secretariat confirms payment, updates `data/dues.js` and issues certificates. Automating this needs a payment gateway (e.g. Paystack or Flutterwave) and a small backend or form service (`data-endpoint` is supported in `js/forms.js`).
