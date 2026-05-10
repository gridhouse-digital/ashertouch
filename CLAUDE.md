# AsherTouch Website Project

This is the website project for **AsherTouch Homecare**, a Toronto-based non-medical home care agency serving seniors and families across Toronto and the Greater Toronto Area.

All website code, components, build tooling, and `.claude/` configuration live inside this folder. Client strategy, brand notes, and content planning live one level up in `client-notes/` and `research/`.

## Website Priorities

- Professional home care agency design
- Warm and trustworthy messaging
- Clear services
- Mobile-first layout
- Fast loading
- Accessible UI (WCAG AA as a baseline)
- SEO-friendly structure
- Strong contact and lead-capture flow
- Clear free in-home assessment CTA
- Easy navigation for families, seniors, caregivers, referral partners, and potential employees
- Local Toronto/GTA relevance

## Primary Website Goal

The primary goal is to get families to **book a free in-home assessment**.

## Secondary Goals

- Encourage phone calls
- Encourage contact form submissions
- Explain services clearly
- Build trust
- Support caregiver recruitment
- Improve local SEO for Toronto/GTA home care searches

## Suggested Pages

- Home
- About AsherTouch
- Services
- Companionship Care
- Personal Care
- Respite Care
- Service Areas
- Careers / Become a Caregiver
- Contact / Book Free Assessment
- Privacy Policy

## Homepage Sections

Use this structure (mirrors `client-notes/content-notes.md`):

1. Hero
2. Trust bar
3. Who we are
4. Services
5. Why AsherTouch
6. Social proof / testimonials
7. Service areas
8. Closing CTA
9. Footer

## Development Standards

- Use clean, maintainable code.
- Keep components reusable.
- Use semantic HTML.
- Prioritize accessibility (keyboard navigation, focus states, alt text, sufficient contrast).
- Use responsive design (mobile-first).
- Keep design modern, calm, warm, and trustworthy.
- Do not hardcode sensitive information.
- Keep client-specific content easy to update (centralize copy and config where practical).
- Use clear file and component names.
- Avoid unnecessary complexity.
- Do not add dependencies unless needed.
- Do not expose API keys, form secrets, or private client data in the repo or client-side code.

## Content Rules

Use language that is:

- Warm
- Clear
- Professional
- Trust-building
- Easy to understand
- Suitable for families seeking care for loved ones

Avoid language that is:

- Too corporate
- Too vague
- Overpromising
- Legally risky
- Full of unsupported healthcare claims
- Too clinical
- Too cold

## Local SEO Notes

Include location-aware wording naturally throughout titles, headings, body copy, and metadata. **Do not keyword-stuff.**

Service-area keywords to weave in naturally:

- Home care Toronto
- Senior care Toronto
- Non-medical home care Toronto
- Home care Scarborough
- Senior care North York
- Home care Etobicoke
- Respite care Toronto
- Companion care Toronto

Plan for individual service-area landing pages over time once core content ships. Use proper title tags, meta descriptions, structured data (e.g., LocalBusiness), and clean URL slugs.

## Placeholder Rules

The following must remain placeholders until confirmed by the client:

- Phone number
- Email address
- Business address
- Testimonials
- Licenses
- Certifications
- Insurance claims
- Awards
- Staff photos
- Founder story
- Final service areas
- Final business hours

If a value isn't confirmed, mark it clearly (for example: `[Phone Number Needed]`) so it cannot accidentally ship to production.
