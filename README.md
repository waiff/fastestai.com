# fastestai.com

A single-page, zero-dependency asset portal for the **fastestAI.com** domain.
Static HTML, CSS and vanilla JavaScript — no build step, no framework, no runtime.

## Structure

```
.
├── index.html                  # The page (Tailwind via CDN, inline critical CSS)
├── 404.html                    # Any stray path returns to /
├── assets/
│   ├── app.js                  # Assembles the contact mailto: at runtime
│   └── favicon.svg             # Forward-sheared 'F' mark
├── .htaccess                   # HTTPS + canonical host, 404, caching, headers
├── robots.txt
└── sitemap.xml
```

## Local preview

Open `index.html` directly, or serve it so relative paths behave exactly as in production:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deployment

Hosted on Hostinger, deployed via **hPanel → Website → GIT**. Hostinger checks
this repository out into `public_html`; there is no build stage.

Setup:

1. In hPanel → GIT, add this repository and set the branch to `main` and the
   directory to `public_html`.
2. Deploy. Hostinger pulls the tree on demand, or automatically if you add the
   webhook it offers to the repository.
3. Point the domain's DNS at Hostinger (their nameservers, or the `A` record
   from hPanel → Hosting → Details).
4. Issue the SSL certificate in hPanel → Security → SSL, then confirm
   `https://fastestai.com` serves before uncommenting the HSTS line in
   `.htaccess`.

### `.git` in the web root

hPanel Git deployment checks out the **whole repository**, `.git` included, into
the document root. Left alone that publishes the full source history at
`/.git/`, which any scanner will find. `.htaccess` refuses every dot-segment
path before any other rule runs:

```apache
RewriteRule (^|/)\.(?!well-known/) - [F,L]
```

`.well-known/` is exempted so certificate validation still works. A `FilesMatch`
block would not be enough on its own — it does not match directories, and `.git`
is a directory.

Verify after the first deploy:

```bash
curl -sI https://fastestai.com/.git/config   # expect 403
curl -sI https://fastestai.com/              # expect 200
```

### What `.htaccess` covers

GitHub Pages did these implicitly; shared hosting does not.

| Concern | Handling |
|---|---|
| HTTPS | 301 to `https://fastestai.com`, checking `X-Forwarded-Proto` (Hostinger proxies TLS) |
| Canonical host | `www` → apex, matching `<link rel="canonical">` |
| 404 | `ErrorDocument 404 /404.html` |
| Compression | `mod_deflate` for html, css, js, svg, xml |
| Caching | 10 min html, 1 day css/js, 7 days svg — assets are not fingerprinted |
| Headers | `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, CSP |

The CSP is enumerated from what the page actually loads — inline script/style,
`self`, `cdn.tailwindcss.com`, `fonts.googleapis.com`, `fonts.gstatic.com` —
with `connect-src` and `form-action` closed. Adding any new external resource
means updating that header.

## Notes

- **Contact address.** The email never appears in the served markup. `assets/app.js`
  reassembles it from three `data-*` fragments and upgrades the anchor to a real
  `mailto:` link with a prefilled subject. With JavaScript disabled, the obfuscated
  form (`… [at] … [dot] …`) remains readable to a human.
- **Motion.** The reveal animation is applied only when JavaScript is present and is
  fully suppressed under `prefers-reduced-motion: reduce`.
- **Contrast.** Body and footer copy use `#A1A1AA` on `#0A0A0A` — roughly 7.7:1,
  clearing WCAG AA and AAA for body text.
