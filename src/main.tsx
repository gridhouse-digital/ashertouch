import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { rateSchedule, type RateCondition } from './rateSchedule';

type Page = 'home' | 'services' | 'service-rates' | 'about' | 'areas' | 'careers' | 'contact' | 'privacy';

const pagePaths: Record<Page, string> = {
  home: '/',
  services: '/services',
  'service-rates': '/services/rates',
  about: '/about',
  areas: '/areas',
  careers: '/careers',
  contact: '/contact',
  privacy: '/privacy',
};

const CONTACT = {
  phone: '(437) 871-2988',
  phoneHref: 'tel:+14378712988',
  email: 'hello@ashertouch-hc.com',
  emailHref: 'mailto:hello@ashertouch-hc.com',
  address: '7030 Woodbine Ave, Suite 500, Markham ON L3R 6G2',
  mapsHref: 'https://maps.google.com/?q=7030%20Woodbine%20Ave%2C%20Suite%20500%2C%20Markham%20ON%20L3R%206G2',
};

const ANNOUNCEMENT_DISMISSED_KEY = 'ashertouch-announcement-dismissed';

type IconName =
  | 'home'
  | 'check'
  | 'shield'
  | 'clock'
  | 'users'
  | 'heart'
  | 'meal'
  | 'spark'
  | 'car'
  | 'leaf'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'menu'
  | 'close'
  | 'arrow';

const pageTitles: Record<Page, string> = {
  home: 'AsherTouch Homecare | Toronto Non-Medical Home Care',
  services: 'Home Care Services | AsherTouch Homecare',
  'service-rates': 'Home Care Rates 2025 | AsherTouch Homecare',
  about: 'About AsherTouch Homecare | Toronto Home Care',
  areas: 'Service Areas | AsherTouch Homecare',
  careers: 'Caregiver Careers | AsherTouch Homecare',
  contact: 'Book a Free Assessment | AsherTouch Homecare',
  privacy: 'Privacy Policy | AsherTouch Homecare',
};

const serviceAreas = [
  'Scarborough',
  'North York',
  'Etobicoke',
  'East York',
  'Downtown Toronto',
  'Mississauga',
  'Brampton',
  'Markham',
  'Richmond Hill',
  'Pickering',
  'Ajax',
  'Oshawa',
  'Hamilton',
  'Burlington',
  'Oakville',
];

const serviceAreaLocations: Array<{ name: string; coords: [number, number] }> = [
  { name: 'Downtown Toronto', coords: [43.6532, -79.3832] },
  { name: 'East York', coords: [43.6912, -79.3417] },
  { name: 'Scarborough', coords: [43.7764, -79.2318] },
  { name: 'North York', coords: [43.7615, -79.4111] },
  { name: 'Etobicoke', coords: [43.6205, -79.5132] },
  { name: 'Mississauga', coords: [43.589, -79.6441] },
  { name: 'Brampton', coords: [43.7315, -79.7624] },
  { name: 'Markham', coords: [43.8561, -79.337] },
  { name: 'Richmond Hill', coords: [43.8828, -79.4403] },
  { name: 'Pickering', coords: [43.8384, -79.0868] },
  { name: 'Ajax', coords: [43.8509, -79.0204] },
  { name: 'Oshawa', coords: [43.8971, -78.8658] },
  { name: 'Oakville', coords: [43.4675, -79.6877] },
  { name: 'Burlington', coords: [43.3255, -79.799] },
  { name: 'Hamilton', coords: [43.2557, -79.8711] },
];

const services = [
  {
    title: 'Companionship & social support',
    shortTitle: 'Companionship',
    icon: 'heart' as const,
    tone: 'blue',
    text: 'Meaningful conversation, activities, engagement, walks, hobbies, and shared routines that help address loneliness as much as practical needs.',
    bullets: ['Conversation and check-ins', 'Walks and outings', 'Games, reading, and hobbies', 'Social connection at home'],
  },
  {
    title: 'Personal care assistance',
    shortTitle: 'Personal care',
    icon: 'shield' as const,
    tone: 'green',
    text: 'Support with grooming, dressing, bathing, and morning or evening routines, delivered with dignity, privacy, and respect.',
    bullets: ['Bathing and grooming', 'Dressing support', 'Mobility reminders', 'Morning and evening routines'],
  },
  {
    title: 'Meal preparation',
    shortTitle: 'Meal preparation',
    icon: 'meal' as const,
    tone: 'orange',
    text: 'Nutritious, home-cooked meals tailored to tastes, dietary needs, and the familiar foods that make the day feel grounded.',
    bullets: ['Simple meal planning', 'Home-cooked meals', 'Dietary preferences', 'Kitchen cleanup'],
  },
  {
    title: 'Light housekeeping',
    shortTitle: 'Housekeeping',
    icon: 'spark' as const,
    tone: 'blue',
    text: 'Laundry, tidying, dishes, light cleaning, and small household tasks that help the home stay comfortable and safe.',
    bullets: ['Laundry and linens', 'Dishes and tidying', 'Light cleaning', 'Clearer daily pathways'],
  },
  {
    title: 'Errands & accompaniment',
    shortTitle: 'Errands',
    icon: 'car' as const,
    tone: 'green',
    text: 'Grocery shopping, pharmacy pickups, appointment transportation, and community outings with a trusted helper nearby.',
    bullets: ['Groceries and pharmacy', 'Appointment accompaniment', 'Community outings', 'A second pair of hands'],
  },
  {
    title: 'Respite care for family caregivers',
    shortTitle: 'Respite care',
    icon: 'leaf' as const,
    tone: 'orange',
    text: 'Reliable care coverage so family caregivers can rest, recharge, handle personal responsibilities, or take time away.',
    bullets: ['Hourly relief', 'Weekend support', 'Evening coverage', 'Caregiver rest time'],
  },
];

const trustItems = [
  { icon: 'home' as const, tone: 'blue', title: 'Serving Toronto', text: 'And surrounding areas' },
  { icon: 'check' as const, tone: 'green', title: 'Free in-home assessments', text: 'No pressure, no obligation' },
  { icon: 'shield' as const, tone: 'orange', title: 'Carefully screened caregivers', text: 'Background and reference checks' },
  { icon: 'clock' as const, tone: 'blue', title: 'Flexible scheduling', text: 'Days, evenings, and weekends' },
];

const whyItems = [
  ['We listen before we act', 'Every care relationship begins with a thorough in-home assessment.'],
  ['Screened caregivers you can trust', 'Vulnerable Sector checks, reference verification, and personal interviews.'],
  ['Consistent, familiar faces', 'Matches consider personality, language, routine, and comfort.'],
  ['Locally rooted in Toronto', 'A Toronto-based agency that understands the city families call home.'],
  ['Flexible care, on your terms', 'No long-term contracts required to get started.'],
];

const BASE_URL = 'https://ashertouch-hc.com';

const pageMeta: Record<Page, { title: string; description: string; path: string }> = {
  home: {
    title: 'AsherTouch Homecare | Toronto Non-Medical Home Care',
    description: 'Trusted non-medical home care for seniors in Toronto and GTA. Companionship, personal care, meal prep, housekeeping, and respite care. Book a free in-home assessment.',
    path: '/',
  },
  services: {
    title: 'Home Care Services Toronto | AsherTouch Homecare',
    description: 'Six core home care services: companionship, personal care, meal preparation, housekeeping, errands, and respite care for Toronto families. Flexible scheduling, no contracts.',
    path: '/services',
  },
  'service-rates': {
    title: 'Home Care Rates 2025 | AsherTouch Homecare Toronto',
    description:
      'AsherTouch Homecare 2025 rate schedule for Toronto and GTA: home support, personal care, 24-hour care, and live-in options. Transparent hourly pricing, billing conditions, free assessment.',
    path: '/services/rates',
  },
  about: {
    title: 'About AsherTouch Homecare | Toronto Senior Care Agency',
    description: 'AsherTouch is a Toronto-based, privately owned home care agency built on dignity and compassion. Learn about our caregiver screening and care philosophy.',
    path: '/about',
  },
  areas: {
    title: 'Service Areas | Home Care in Toronto, Markham & GTA',
    description: 'AsherTouch provides non-medical home care across Toronto, Markham, Scarborough, North York, Mississauga, Brampton, Durham, Hamilton, Burlington, Oakville, and the GTA.',
    path: '/areas',
  },
  careers: {
    title: 'Caregiver Jobs Toronto | AsherTouch Homecare Careers',
    description: 'Join AsherTouch Homecare as a caregiver in Toronto. We value compassion, reliability, and trust. Background checks and training provided.',
    path: '/careers',
  },
  contact: {
    title: 'Book a Free In-Home Assessment | AsherTouch Homecare',
    description: 'Schedule your free, no-obligation in-home care assessment in Toronto. Call (437) 871-2988 or fill out our contact form. Response within one business day.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Policy | AsherTouch Homecare',
    description: 'AsherTouch Homecare privacy policy. How we collect, use, and protect your personal information.',
    path: '/privacy',
  },
};

function SEO({ page }: { page: Page }) {
  const { title, description, path } = pageMeta[page];
  const canonical = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="AsherTouch Homecare" />
      <meta property="og:image" content={`${BASE_URL}/assets/images/caregiver-senior-tea.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeHealthCareService',
        '@id': `${BASE_URL}/#organization`,
        name: 'AsherTouch Homecare',
        url: BASE_URL,
        telephone: '+1-437-871-2988',
        email: 'hello@ashertouch-hc.com',
        description: 'Trusted non-medical home care for seniors and families across Toronto and the Greater Toronto Area.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '7030 Woodbine Ave, Suite 500',
          addressLocality: 'Markham',
          addressRegion: 'ON',
          postalCode: 'L3R 6G2',
          addressCountry: 'CA',
        },
        areaServed: serviceAreas.map((area) => ({
          '@type': 'City',
          name: area,
          containedInPlace: { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
        })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Home Care Services',
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.title,
              description: s.text,
            },
          })),
        },
        priceRange: '$$',
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '20:00',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'AsherTouch Homecare',
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

function Icon({ name }: { name: IconName }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (name) {
    case 'home':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m3 11 9-8 9 8" /><path {...common} d="M5 10v10h14V10" /><path {...common} d="M10 20v-6h4v6" /></svg>;
    case 'check':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m5 12 4 4L19 6" /></svg>;
    case 'shield':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 3 20 7v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4Z" /><path {...common} d="m9 12 2 2 4-5" /></svg>;
    case 'clock':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="M12 8v5l3 2" /></svg>;
    case 'users':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="9" cy="9" r="3" /><circle {...common} cx="17" cy="10" r="2.5" /><path {...common} d="M3 20c1-4 4-6 7-6s6 2 7 6" /><path {...common} d="M14 15c2.5.3 4.5 1.8 5.5 5" /></svg>;
    case 'heart':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M20 8.5c0 5-8 10.5-8 10.5S4 13.5 4 8.5A4.4 4.4 0 0 1 12 6a4.4 4.4 0 0 1 8 2.5Z" /></svg>;
    case 'meal':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M4 11h16" /><path {...common} d="M6 11a6 6 0 0 1 12 0" /><path {...common} d="M7 15h10" /><path {...common} d="M9 19h6" /><path {...common} d="M12 5V3" /></svg>;
    case 'spark':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z" /></svg>;
    case 'car':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m5 12 2-5h10l2 5" /><path {...common} d="M4 12h16v6H4z" /><circle {...common} cx="7" cy="18" r="1.5" /><circle {...common} cx="17" cy="18" r="1.5" /></svg>;
    case 'leaf':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M5 19C6 8 15 4 21 4c0 7-4 15-14 15H5Z" /><path {...common} d="M5 19c4-5 8-8 13-11" /></svg>;
    case 'phone':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M22 16.5v3a2 2 0 0 1-2.2 2 19 19 0 0 1-17.3-17.3A2 2 0 0 1 4.5 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L8 10a13 13 0 0 0 6 6l1.5-1.4a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z" /></svg>;
    case 'mail':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><path {...common} d="m4 7 8 6 8-6" /></svg>;
    case 'pin':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 21s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Z" /><circle {...common} cx="12" cy="9" r="2.5" /></svg>;
    case 'menu':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'close':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m6 6 12 12M18 6 6 18" /></svg>;
    case 'arrow':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M5 12h14M13 6l6 6-6 6" /></svg>;
  }
}

function useRoute() {
  const readPage = (): Page => {
    const parts = window.location.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
    if (parts[0] === 'services' && parts[1] === 'rates') return 'service-rates';
    const slug = parts[0] || 'home';
    return (slug in pagePaths ? slug : 'home') as Page;
  };

  const [page, setPage] = useState<Page>(readPage);

  useEffect(() => {
    const onPop = () => setPage(readPage());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (next: Page) => {
    window.history.pushState({}, '', pagePaths[next]);
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { page, navigate };
}

function isNavActive(current: Page, target: Page) {
  if (current === target) return true;
  return target === 'services' && (current === 'service-rates' || current === 'areas');
}

function App() {
  const { page, navigate } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuToggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen, closeMenu]);

  const nav = (next: Page) => {
    navigate(next);
    setMenuOpen(false);
  };

  return (
    <>
      <SEO page={page} />
      <StructuredData />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header page={page} navigate={nav} menuOpen={menuOpen} setMenuOpen={setMenuOpen} menuToggleRef={menuToggleRef} closeMenu={closeMenu} />
      <main id="main-content">
        {page === 'home' && <HomePage navigate={nav} />}
        {page === 'services' && <ServicesPage navigate={nav} />}
        {page === 'service-rates' && <ServiceRatesPage navigate={nav} />}
        {page === 'about' && <AboutPage navigate={nav} />}
        {page === 'areas' && <AreasPage navigate={nav} />}
        {page === 'careers' && <CareersPage navigate={nav} />}
        {page === 'contact' && <ContactPage />}
        {page === 'privacy' && <PrivacyPage navigate={nav} />}
      </main>
      <Footer navigate={nav} />
    </>
  );
}

function Header({
  page,
  navigate,
  menuOpen,
  setMenuOpen,
  menuToggleRef,
  closeMenu,
}: {
  page: Page;
  navigate: (page: Page) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  menuToggleRef: React.RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
}) {
  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.sessionStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY) !== 'true';
  });

  const links: Array<[Page, string]> = [
    ['home', 'Home'],
    ['about', 'About'],
    ['services', 'Services'],
    ['careers', 'Careers'],
    ['contact', 'Contact'],
  ];
  const serviceDropdownLinks: Array<[Page, string]> = [['areas', 'Service Areas']];

  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const dismissAnnouncement = () => {
    window.sessionStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, 'true');
    setShowAnnouncement(false);
  };

  useEffect(() => {
    if (menuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl?.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl?.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        {showAnnouncement && (
          <div className="announcement-bar" role="region" aria-label="New client discount announcement">
            <p>
              <strong>New client offer:</strong> Save 10% on home care services.
            </p>
            <button className="announcement-link" onClick={() => navigate('contact')}>
              Book your free assessment
              <Icon name="arrow" />
            </button>
            <button className="announcement-close" onClick={dismissAnnouncement} aria-label="Dismiss announcement">
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className="topbar">
          <span>Serving Toronto & the Greater Toronto Area</span>
          <span>Monday-Saturday | Evening consultations available</span>
        </div>
        <nav className="nav-shell" aria-label="Main navigation">
          <button className="logo-button" onClick={() => navigate('home')} aria-label="AsherTouch Homecare home">
            <img src="/assets/logo/ashertouch-light-mode-logo.png" width="350" height="120" alt="" />
          </button>
          <div className="desktop-nav" role="menubar">
            {links.map(([target, label]) =>
              target === 'services' ? (
                <div className="nav-dropdown" key={target}>
                  <button
                    role="menuitem"
                    className={isNavActive(page, target) ? 'active' : ''}
                    aria-current={isNavActive(page, target) ? 'page' : undefined}
                    aria-haspopup="menu"
                    onClick={() => navigate(target)}
                  >
                    {label}
                  </button>
                  <div className="nav-dropdown-menu" role="menu" aria-label="Services menu">
                    {serviceDropdownLinks.map(([dropdownTarget, dropdownLabel]) => (
                      <button
                        key={dropdownTarget}
                        role="menuitem"
                        className={isNavActive(page, dropdownTarget) ? 'active' : ''}
                        aria-current={isNavActive(page, dropdownTarget) ? 'page' : undefined}
                        onClick={() => navigate(dropdownTarget)}
                      >
                        {dropdownLabel}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={target}
                  role="menuitem"
                  className={isNavActive(page, target) ? 'active' : ''}
                  aria-current={isNavActive(page, target) ? 'page' : undefined}
                  onClick={() => navigate(target)}
                >
                  {label}
                </button>
              )
            )}
          </div>
          <div className="nav-actions">
            <a className="btn btn-outline compact" href={CONTACT.phoneHref} aria-label={`Call ${CONTACT.phone}`}>
              <Icon name="phone" />
              Call
            </a>
            <button className="btn btn-primary compact" onClick={() => navigate('contact')}>
              Free assessment
              <Icon name="arrow" />
            </button>
            <button
              ref={menuToggleRef}
              className="icon-action menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Icon name="menu" />
            </button>
          </div>
        </nav>
      </header>
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal={menuOpen ? 'true' : undefined}
        aria-label="Mobile navigation menu"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-head">
          <button type="button" className="logo-button mobile-menu-logo-button" onClick={() => navigate('home')} aria-label="AsherTouch Homecare home">
            <img src="/assets/logo/ashertouch-light-mode-logo.png" width="350" height="120" alt="" />
          </button>
          <button ref={closeButtonRef} className="icon-action" onClick={closeMenu} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <div className="mobile-menu-links" role="menu">
          {links.map(([target, label]) => (
            <React.Fragment key={target}>
              <button
                role="menuitem"
                onClick={() => navigate(target)}
                className={isNavActive(page, target) ? 'active' : ''}
                aria-current={isNavActive(page, target) ? 'page' : undefined}
              >
                {label}
              </button>
              {target === 'services' &&
                serviceDropdownLinks.map(([dropdownTarget, dropdownLabel]) => (
                  <button
                    key={dropdownTarget}
                    role="menuitem"
                    onClick={() => navigate(dropdownTarget)}
                    className={`mobile-sub-link ${isNavActive(page, dropdownTarget) ? 'active' : ''}`}
                    aria-current={isNavActive(page, dropdownTarget) ? 'page' : undefined}
                  >
                    {dropdownLabel}
                  </button>
                ))}
            </React.Fragment>
          ))}
        </div>
        <button className="btn btn-primary mobile-menu-cta" onClick={() => navigate('contact')}>
          Book a free in-home assessment
          <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}

const JOTFORM_AGENT_ID = '019e43a10d0b7b74a9f3b75bd0df905b92c6';
const JOTFORM_AGENT_ROOT_ID = `JotformAgent-${JOTFORM_AGENT_ID}`;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

async function waitForJotformRoot() {
  for (let i = 0; i < 20; i += 1) {
    const root = document.getElementById(JOTFORM_AGENT_ROOT_ID);
    if (root) return root;
    await wait(150);
  }
  return null;
}

function triggerClick(element: HTMLElement) {
  ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach((type) => {
    element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
  });
  element.click();
}

function clickVisibleElement(elements: Element[]) {
  const element = elements.find((candidate): candidate is HTMLElement => {
    if (!(candidate instanceof HTMLElement)) return false;
    const rect = candidate.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  if (element) triggerClick(element);
  return Boolean(element);
}

function openJotformLauncher(root: HTMLElement | null) {
  if (!root) return false;

  // Target the avatar button inside the launcher
  const toggle = root.querySelector<HTMLElement>('.ai-agent-chat-avatar');
  if (toggle) {
    triggerClick(toggle);
    return true;
  }

  // Fallback: any visible clickable element inside the root
  return clickVisibleElement(
    ['.ai-agent-chat-avatar-container', '[role="button"]', 'button']
      .flatMap((sel) => Array.from(root.querySelectorAll(sel)))
  );
}


function getJotformFrame() {
  return document.querySelector<HTMLIFrameElement>(`iframe[src*="${JOTFORM_AGENT_ID}"]`);
}

async function promptCallbackChatbot() {
  const root = await waitForJotformRoot();
  const alreadyOpen = root?.querySelector('.ai-agent-chat-window-open, .ai-agent-chat-open, [class*="chat-open"]');

  if (!alreadyOpen) {
    openJotformLauncher(root);
    await wait(800);
  }

  const frame = getJotformFrame();
  frame?.contentWindow?.postMessage(
    { action: 'postAgentEmbedSendMessage', payload: 'Requesting a call back' },
    '*'
  );
}

function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Compassionate care, <em>right at home.</em>
          </h1>
          <p>
            Trusted non-medical home care for seniors and families across the Greater Toronto Area (GTA). Warm, reliable,
            personalized support so your family has peace of mind and your loved one has the care they deserve.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={() => navigate('contact')}>
              Book a free assessment
              <Icon name="arrow" />
            </button>
            <button className="btn btn-outline btn-large" onClick={promptCallbackChatbot}>
              <Icon name="phone" />
              Request a call back
            </button>
          </div>
          <div className="hero-proof">
            <Proof icon="shield" tone="green" title="Screened caregivers" text="Background and reference checks" />
            <Proof icon="clock" tone="orange" title="Flexible scheduling" text="Days, evenings, weekends" />
          </div>
        </div>
        <div className="hero-media" aria-label="Caregiver and senior sharing tea in a sunny living room">
          <picture>
            <source
              type="image/avif"
              srcSet="/assets/images/caregiver-senior-tea-480.avif 480w, /assets/images/caregiver-senior-tea-768.avif 768w, /assets/images/caregiver-senior-tea-1086.avif 1086w"
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1180px) calc(100vw - 96px), 46vw"
            />
            <source
              type="image/webp"
              srcSet="/assets/images/caregiver-senior-tea-480.webp 480w, /assets/images/caregiver-senior-tea-768.webp 768w, /assets/images/caregiver-senior-tea-1086.webp 1086w"
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1180px) calc(100vw - 96px), 46vw"
            />
            <img
              src="/assets/images/caregiver-senior-tea.jpg"
              alt="Caregiver and senior sharing tea in a sunny living room"
              width="1448"
              height="1086"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="care-badge">
            <span className="icon-chip green"><Icon name="check" /></span>
            <div>
              <span className="care-badge-kicker">In-home care promise</span>
              <strong>Age with dignity at home</strong>
              <small>Personally screened caregivers</small>
            </div>
          </div>
        </div>
      </section>
      <TrustBar />
      <WhoWeAre navigate={navigate} />
      <ServicesOverview navigate={navigate} />
      <WhySection />
      <Testimonials />
      <ServiceAreaSection navigate={navigate} />
      <ClosingCta navigate={navigate} />
    </>
  );
}

function Proof({ icon, tone, title, text }: { icon: IconName; tone: string; title: string; text: string }) {
  return (
    <div className="proof">
      <span className={`icon-chip ${tone}`}><Icon name={icon} /></span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <section className="trust-bar" aria-label="AsherTouch trust signals">
      {trustItems.map((item) => (
        <Proof key={item.title} {...item} />
      ))}
    </section>
  );
}

function SectionHead({ label, title, text, center = false }: { label: string; title: React.ReactNode; text?: string; center?: boolean }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`}>
      <div>
        <span className="section-label">{label}</span>
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}

function WhoWeAre({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="section">
      <SectionHead
        label="Who we are"
        title={<>Care that feels <em>like family.</em></>}
        text="AsherTouch is a Toronto-based, privately owned home care agency built on a simple belief: every person deserves to age with dignity in the comfort and familiarity of home."
      />
      <div className="story-grid">
        <StoryCard number="i" tone="blue" title="Privately owned in Toronto" text="Local, accessible, and familiar with the city's communities, cultures, and families." />
        <StoryCard number="ii" tone="orange" title="Chosen for compassion" text="Caregivers are selected for skill and for the patience and warmth they bring into the home." />
        <StoryCard number="iii" tone="green" title="Built around routines" text="Care adapts to preferences, personality, schedule, and what the family actually needs." />
      </div>
      <button className="text-button" onClick={() => navigate('about')}>Read more about AsherTouch <Icon name="arrow" /></button>
    </section>
  );
}

function StoryCard({ number, tone, title, text }: { number: string; tone: string; title: string; text: string }) {
  return (
    <article className="story-card">
      <span className={`ordinal ${tone}`}>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function ServicesOverview({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="section paper">
      <SectionHead
        label="How we can help"
        title={<>Six ways life gets lighter.</>}
        text="Our non-medical home care services support the routines, small joys, and practical needs that make home feel safe and familiar."
      />
      <div className="service-grid">
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} compact />
        ))}
      </div>
      <div className="center-action">
        <button className="btn btn-outline" onClick={() => navigate('services')}>
          Learn more about services
          <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}

function ServiceCard({ service, compact = false }: { service: (typeof services)[number]; compact?: boolean }) {
  return (
    <article className={`service-card ${compact ? 'compact-card' : ''}`}>
      <span className={`icon-chip ${service.tone}`}><Icon name={service.icon} /></span>
      <div>
        <h3>{compact ? service.shortTitle : service.title}</h3>
        <p>{service.text}</p>
        {!compact && (
          <ul>
            {service.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function WhySection() {
  return (
    <section className="section">
      <div className="why-layout">
        <div>
          <span className="section-label">Why AsherTouch</span>
          <h2>
            Why Toronto families choose <em>AsherTouch.</em>
          </h2>
          <p className="lede">
            Every care relationship begins with listening, then a thoughtful match, clear expectations, and flexible
            support on the family's terms.
          </p>
          <p className="signature">Where dignity meets care.</p>
        </div>
        <div className="check-list">
          {whyItems.map(([title, text]) => (
            <div className="check-row" key={title}>
              <span className="small-check"><Icon name="check" /></span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section paper">
      <SectionHead
        label="In their own words"
        title={<>Families trust AsherTouch.</>}
        text="Stories from the Toronto and GTA families we serve. Sample format shown until approved testimonials arrive."
        center
      />
      <div className="testimonial-grid">
        {['Family member', 'Adult daughter', 'Client family'].map((name, index) => (
          <article className="testimonial-card" key={name}>
            <div className="quote-mark">"</div>
            <p>
              {index === 0
                ? 'From the first call, I felt like someone actually listened to what my mother needed.'
                : 'A real testimonial from a real Toronto family will live here once approved.'}
            </p>
            <strong>{name}</strong>
            <small>Toronto - sample format</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceAreaSection({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="section">
      <SectionHead
        label="Service area"
        title={<>Proudly serving the Greater Toronto Area</>}
        text="We provide home care services across the Greater Toronto Area. Not sure if we cover your area? Give us a call and we'll do our best to help"
      />
      <div className="area-layout">
        <div className="area-list">
          {serviceAreas.map((area) => (
            <span key={area}><Icon name="check" />{area}</span>
          ))}
        </div>
        <MapEmbed />
      </div>
      <button className="text-button" onClick={() => navigate('areas')}>View service area details <Icon name="arrow" /></button>
    </section>
  );
}

function MapEmbed() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import('leaflet').Map | null = null;
    let cancelled = false;

    async function initMap() {
      const L = await import('leaflet');
      if (!mapRef.current || cancelled) return;

      map = L.map(mapRef.current, {
        center: [43.68, -79.45],
        zoom: 9,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'service-area-marker',
        html: '<span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
      });

      const bounds = L.latLngBounds([]);
      serviceAreaLocations.forEach(({ name, coords }) => {
        L.marker(coords, { icon: markerIcon, title: name })
          .addTo(map!)
          .bindPopup(`<strong>${name}</strong><br />AsherTouch service area`);
        bounds.extend(coords);
      });

      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 10 });
      window.setTimeout(() => map?.invalidateSize(), 0);
    }

    initMap();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div className="map-embed">
      <div ref={mapRef} className="service-map" aria-label="Interactive map of AsherTouch service areas across Toronto and the GTA" />
    </div>
  );
}

function ClosingCta({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="cta-band">
      <div>
        <span className="section-label">Ready to take the next step?</span>
        <h2>
          Start with a free, no-obligation <em>in-home assessment.</em>
        </h2>
        <p>
          Call or fill out the contact form and we'll schedule a conversation at a time that works for you and your family. No
          paperwork, no pressure, just a conversation.
        </p>
      </div>
      <div className="cta-actions">
        <button className="btn btn-accent btn-large" onClick={() => navigate('contact')}>Book your free assessment today <Icon name="arrow" /></button>
        <a className="btn btn-dark-outline btn-large" href={CONTACT.phoneHref}><Icon name="phone" /> {CONTACT.phone}</a>
      </div>
    </section>
  );
}

function ServicesPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <PageHero
        title={<>Care that meets your family <em>where it is.</em></>}
        text="Non-medical home care designed around real days, real homes, and real routines. Start with what matters today and adjust as life changes."
        action="Book a free assessment"
        navigate={navigate}
      />
      <section className="section paper">
        <SectionHead label="How it works" title={<>Three small steps, then we begin.</>} text="Most families start with a conversation, a careful match, and a gentle first visit." center />
        <div className="story-grid">
          <StoryCard number="i" tone="orange" title="Free in-home assessment" text="A care coordinator listens, meets your loved one, and helps you understand the options." />
          <StoryCard number="ii" tone="orange" title="Caregiver matching" text="Personality, language, routine, and comfort matter before care enters the home." />
          <StoryCard number="iii" tone="orange" title="Care begins at your pace" text="Start with as few or as many hours as you prefer and adjust as your family's needs change." />
        </div>
      </section>
      <section className="section">
        <SectionHead label="Six core services" title={<>Mix and match. Start with what matters most.</>} text="The same trusted caregiver can help across whatever the day brings." />
        <div className="detail-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>
      <section className="section paper">
        <SectionHead label="What's included" title={<>Standards on every care.</>} text="Every AsherTouch care comes with the same expectations, so families know exactly what is included." />
        <div className="included-grid">
          {[
            'Vulnerable Sector background check',
            'Reference verification',
            'Consistent caregiver matching',
            'Flexible scheduling',
            'Care coordinator support',
            'No long-term contract required',
            'Cultural and language matching where possible',
            'Transparent hourly-based pricing',
          ].map((item) => (
            <span key={item}><Icon name="check" />{item}</span>
          ))}
        </div>
      </section>
      <div className="center-action">
        <button className="text-button" onClick={() => navigate('service-rates')}>
          View our 2025 rate schedule <Icon name="arrow" />
        </button>
      </div>
      <ClosingCta navigate={navigate} />
    </>
  );
}

function RateConditionText({ condition }: { condition: RateCondition }) {
  if ('text' in condition) {
    return <>{condition.text}</>;
  }
  return (
    <>
      {condition.before}
      <strong>{condition.emphasis}</strong>
      {condition.after}
    </>
  );
}

function ServiceRatesPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <section className="section rate-schedule-back">
        <button className="text-button" onClick={() => navigate('services')}>
          ← Back to services
        </button>
      </section>
      <PageHero
        label={rateSchedule.effectiveLabel}
        title={
          <>
            Our Services & <em>Rates</em>
          </>
        }
        text={rateSchedule.intro}
        action="Book a free assessment"
        navigate={navigate}
      />
      <section className="section rate-schedule">
        <div className="rate-schedule-table" aria-label="Service rates">
          <div className="rate-schedule-header" aria-hidden="true">
            <span>Service</span>
            <span>Rate</span>
          </div>
          {rateSchedule.services.map((service) => (
            <article key={service.name} className="rate-schedule-row">
              <div className="rate-schedule-copy">
                <span className={`rate-schedule-category ${service.categoryTone}`}>
                  <span className="rate-schedule-dot" aria-hidden="true" />
                  {service.category}
                </span>
                <h2 className="rate-schedule-name">{service.name}</h2>
                <p className="rate-schedule-desc">{service.description}</p>
              </div>
              <div className="rate-schedule-rate">
                <div className="rate-amount">{service.amount}</div>
                <div className="rate-unit">{service.unit}</div>
                <div className={`rate-exempt ${service.exemptTone}`}>{service.exempt}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section paper rate-schedule">
        <SectionHead label="Billing conditions" title={<>What to expect on your invoice.</>} />
        <div className="rate-schedule-conditions">
          {rateSchedule.conditions.map((condition) => (
            <div key={condition.label} className="rate-condition-row">
              <span className="rate-cond-label">{condition.label}</span>
              <span className="rate-cond-text">
                <RateConditionText condition={condition} />
              </span>
            </div>
          ))}
        </div>
        <p className="rate-schedule-note">All rates in CAD · Toronto &amp; the GTA</p>
      </section>
      <ClosingCta navigate={navigate} />
    </>
  );
}

function AboutPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <PageHero
        title={<>A Toronto care team built on <em>dignity.</em></>}
        text="AsherTouch Homecare is a privately owned agency serving seniors and families who want reliable support without losing the comfort of home."
        action="Book an assessment"
        navigate={navigate}
      />
      <section className="section">
        <div className="about-layout">
          <div>
            <span className="section-label">Our belief</span>
            <h2>Every client is someone's loved one, and we never forget that</h2>
          </div>
          <div className="copy-stack">
            <p>
              That belief shapes how AsherTouch presents care: warm, careful, practical, and personal. Caregivers are
              chosen not just for their skills, but for their compassion.
            </p>
            <p>
              Whether a family needs a few hours of help each week or daily support, care plans should fit the person's
              routines, preferences, and personality, not a one-size-fits-all schedule.
            </p>
          </div>
        </div>
      </section>
      <WhySection />
      <ClosingCta navigate={navigate} />
    </>
  );
}

function AreasPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <PageHero
        title={<>Home care across <em>Toronto & The GTA.</em></>}
        text="AsherTouch supports seniors and families across Toronto, Markham, Durham, Peel, Halton, Hamilton, and nearby communities. If you are not sure whether we cover your neighbourhood, start with a quick call."
        action="Ask about your area"
        navigate={navigate}
      />
      <section className="section">
        <SectionHead
          label="Where we serve"
          title={<>Flexible home care across familiar GTA communities.</>}
          text="Care needs do not always fit clean city boundaries. We confirm availability during the free assessment and match care based on your location, schedule, and support needs."
        />
        <div className="area-layout">
          <div className="area-list large">
            {serviceAreas.map((area) => (
              <span key={area}><Icon name="pin" />{area}</span>
            ))}
          </div>
          <MapEmbed />
        </div>
      </section>
      <section className="section paper">
        <SectionHead
          label="Care available by area"
          title={<>The same core services, close to home.</>}
          text="Families across our service area can ask about companionship, personal care, meal support, light housekeeping, errands, and respite care."
        />
        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} compact />
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHead
          label="Service area questions"
          title={<>Not sure if your neighbourhood is covered?</>}
          text="These are the most common questions families ask before booking an assessment."
        />
        <div className="story-grid">
          <StoryCard
            number="i"
            tone="blue"
            title="Can you help outside Toronto?"
            text="Yes, AsherTouch lists service coverage across Toronto and surrounding GTA communities. Call to confirm caregiver availability for your exact address."
          />
          <StoryCard
            number="ii"
            tone="green"
            title="Do services vary by location?"
            text="The core non-medical services are consistent, but scheduling depends on caregiver availability, visit length, travel distance, and the care plan."
          />
          <StoryCard
            number="iii"
            tone="orange"
            title="What happens during the assessment?"
            text="A care coordinator learns about routines, location, timing, family preferences, and the type of support needed before recommending next steps."
          />
        </div>
      </section>
      <ClosingCta navigate={navigate} />
    </>
  );
}

function CareersPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <PageHero
        title={<>Bring warmth into someone's <em>home.</em></>}
        text="AsherTouch is preparing a caregiver recruitment path for compassionate people who take dignity, reliability, and trust seriously."
        action="Contact us"
        navigate={navigate}
      />
      <section className="section paper">
        <SectionHead label="Caregiver standards" title={<>What matters to us.</>} text="Hiring details should be finalized with the client before launch." />
        <div className="story-grid">
          <StoryCard number="i" tone="blue" title="Compassion" text="The ability to be patient, respectful, and present in someone's home." />
          <StoryCard number="ii" tone="green" title="Reliability" text="Families need caregivers who show up prepared, on time, and ready to help." />
          <StoryCard number="iii" tone="orange" title="Trust" text="Background checks, references, and interviews are part of the standard." />
        </div>
      </section>
      <ClosingCta navigate={navigate} />
    </>
  );
}

function JotformEmbed() {
  useEffect(() => {
    const scriptId = 'jotform-embed-handler';
    const formSelector = "iframe[id='JotFormIFrame-261394827910059']";
    const jotformOrigin = 'https://form.jotform.com/';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    const initializeEmbed = () => {
      const handler = (window as Window & {
        jotformEmbedHandler?: (selector: string, origin: string) => void;
      }).jotformEmbedHandler;

      handler?.(formSelector, jotformOrigin);
    };

    if (existingScript) {
      initializeEmbed();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    script.onload = initializeEmbed;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="form-card jotform-card">
      <iframe
        id="JotFormIFrame-261394827910059"
        title="Contact Us Form"
        onLoad={() => window.parent.scrollTo(0, 0)}
        allowTransparency
        allow="geolocation; microphone; camera; fullscreen; payment"
        src="https://form.jotform.com/261394827910059"
        frameBorder="0"
        className="jotform-iframe"
        scrolling="no"
      />
    </div>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        title={<>Tell us a little about your situation.</>}
        text={`A care coordinator will reach out within one business day. Prefer to talk? Call ${CONTACT.phone} or email ${CONTACT.email}.`}
      />
      <section className="section paper contact-section">
        <div className="contact-layout">
          <JotformEmbed />
          <aside className="contact-cards" aria-label="Contact information">
            <a className="contact-card" href={CONTACT.phoneHref}>
              <span className="icon-chip blue"><Icon name="phone" /></span>
              <small>Phone</small>
              <strong>{CONTACT.phone}</strong>
            </a>
            <a className="contact-card" href={CONTACT.emailHref}>
              <span className="icon-chip orange"><Icon name="mail" /></span>
              <small>Email</small>
              <strong>{CONTACT.email}</strong>
            </a>
            <a className="contact-card" href={CONTACT.mapsHref} target="_blank" rel="noreferrer">
              <span className="icon-chip green"><Icon name="pin" /></span>
              <small>Office address</small>
              <strong>{CONTACT.address}</strong>
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}

function PrivacyPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="section legal">
      <span className="section-label">Privacy</span>
      <h1>Privacy policy placeholder</h1>
      <p>
        This page is a production placeholder. Final privacy language should be reviewed and approved before the website
        launches.
      </p>
      <button className="btn btn-outline" onClick={() => navigate('contact')}>Contact AsherTouch <Icon name="arrow" /></button>
    </section>
  );
}

function PageHero({
  label,
  title,
  text,
  action,
  navigate,
}: {
  label?: string;
  title: React.ReactNode;
  text: string;
  action?: string;
  navigate?: (page: Page) => void;
}) {
  return (
    <section className="page-hero">
      <div>
        {label && <span className="section-label">{label}</span>}
        <h1>{title}</h1>
        <p className={label ? 'page-hero-lede' : undefined}>{text}</p>
        {action && navigate && <button className="btn btn-primary btn-large" onClick={() => navigate('contact')}>{action}<Icon name="arrow" /></button>}
      </div>
    </section>
  );
}

function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <img src="/assets/logo/ashertouch-dark-mode-logo.png" width="350" height="120" alt="AsherTouch Homecare Inc." />
          <p>Compassionate non-medical home care for seniors and families across Toronto and the Greater Toronto Area.</p>
          <p className="signature">Where dignity meets care.</p>
        </div>
        <div>
          <h3>Services</h3>
          {services.slice(0, 5).map((service) => <button key={service.title} onClick={() => navigate('services')}>{service.shortTitle}</button>)}
        </div>
        <div>
          <h3>Company</h3>
          <button onClick={() => navigate('about')}>About</button>
          <button onClick={() => navigate('areas')}>Service area</button>
          <button onClick={() => navigate('careers')}>Careers</button>
          <button onClick={() => navigate('privacy')}>Privacy</button>
        </div>
        <div>
          <h3>Get in touch</h3>
          <a href={CONTACT.phoneHref}><Icon name="phone" /> {CONTACT.phone}</a>
          <a href={CONTACT.emailHref}><Icon name="mail" /> {CONTACT.email}</a>
          <a href={CONTACT.mapsHref} target="_blank" rel="noreferrer"><Icon name="pin" /> {CONTACT.address}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>(c) 2026 AsherTouch Homecare</span>
        <span>Toronto, Ontario</span>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
