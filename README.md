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

## What’s in the first three notes

- `blog/california-restaurant-insurance-market.html` — the fall 2026 market
- `blog/liquor-liability-type-41-type-47.html` — Type 41 and Type 47
- `blog/new-restaurant-insurance-california.html` — what a new restaurant needs
