# Sam Johnson site

The apartment pages are the main site. Restaurant and bar insurance lives at `restaurants.html`. The notes for restaurant owners live in `blog/`.

## Adding a note

The notes are plain HTML. There is no build step.

1. Copy `blog/_template.html` to `blog/your-slug.html`. Use lowercase and hyphens. Do not start the filename with an underscore. GitHub Pages hides underscore files, which is why the template is named that way and is not a public page.
2. Replace every `TODO` in the copy: title, meta description, canonical URL, Open Graph and Twitter tags, the dates, the BlogPosting JSON-LD, the headline, and the body. Link sources by name in the paragraph. If you cannot source a number, leave it out.
3. Add the new note at the top of the list in `blog/index.html`, and add a matching `blogPost` entry in the Blog JSON-LD in that file’s `<head>`.
4. Add a `<url>` for the new page in `sitemap.xml`, with a `<lastmod>` of the day you publish.
5. Styles live in `blog/notes.css`, shared with `restaurants.html`: paper background, Fraunces, the red rule. You should not need a new stylesheet for an ordinary note.

Write the way the restaurant page sounds. First person, for an owner, specific to the San Gabriel Valley. No testimonials, no review incentives, and no claim that Sam or SMMA can guarantee a price. Keep the closing line that this is general information, not advice, and that coverage depends on the policy.

The phone number printed on the page is always `626-799-7813`. Copy the `tel:` and `sms:` hrefs from `restaurants.html` unchanged. They route to his cell and are not the number visitors should read. Do not typeset the digits from those hrefs anywhere on a page.

## SGV Eats

`sgv-eats/` is the food page: a daily spotlight and a monthly "New in the SGV" roundup. It uses the same paper, Fraunces, and red as the notes, and it is not an insurance pitch. One soft line about Sam per page.

A daily spotlight follows the comment at the top of `sgv-eats/_spotlight_template.html`: new file under `sgv-eats/spotlight/`, move the current feature into the archive on `sgv-eats/index.html`, put the new restaurant in the feature slot, and add the URL to `sitemap.xml`. The template is underscore-prefixed so GitHub Pages does not publish it.

A new month follows the comment at the top of `sgv-eats/openings/index.html`.

## What’s in the first three notes

- `blog/california-restaurant-insurance-market.html` — the fall 2026 market
- `blog/liquor-liability-type-41-type-47.html` — Type 41 and Type 47
- `blog/new-restaurant-insurance-california.html` — what a new restaurant needs

## City pages, the opening checklist, and text-first buttons

- `restaurant-insurance/` holds one page per city (Monrovia, Arcadia, Pasadena, Duarte, Sierra Madre, Azusa, Glendora, Rancho Cucamonga) and a hub at `restaurant-insurance/index.html`. The older `city/*.html` pages are the apartment pages; do not mix them up.
- Each city page has its own angle and a "Who signs off" list: the health agency (LA County Environmental Health, Pasadena's own Public Health Department, or San Bernardino County EHS for Rancho Cucamonga), the fire authority, the ABC district office, and the city. Every fact is cited in the page's Sources list. If an office moves or a rule changes, fix the fact and the source together.
- `restaurant-opening-checklist.html` is the opening checklist. Checkmarks are saved only in the visitor's browser (localStorage). The "Text Sam where you're stuck" button fills in the first unchecked items.
- Buttons are text-first: "Text Sam" comes before "Call Sam", including the sticky bar on phones. `sms:` links carry a prefilled body, for example `Hi Sam, I own [restaurant] in [city] and have a question about my insurance.` Keep the bracketed placeholders so the owner fills them in.
- The standing offer is the free dec page check: "Text me a photo of your current dec page and I'll tell you what's missing." It appears as `aside.dec` (styled in `blog/notes.css`) on the city pages, the checklist, and every note, and as `#dec` on `restaurants.html`.
- `policy-checkup.html` is the in-browser dec-page checkup. The file is read on the visitor's device. Do not add a form, analytics call, or upload endpoint for it. Link it from the restaurant nav as "Policy checkup."
- The same phone rule applies: the page shows 626-799-7813, and the hrefs stay exactly as they are.

