import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Page = 'home' | 'services' | 'about' | 'areas' | 'careers' | 'contact' | 'privacy';

const CONTACT = {
  phone: '(437) 871-2988',
  phoneHref: 'tel:+14378712988',
  email: 'hello@ashertouch-hc.com',
  emailHref: 'mailto:hello@ashertouch-hc.com',
  mapsHref: 'https://maps.google.com/?q=Toronto,ON',
};

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
    const slug = window.location.pathname.replace(/^\/+/, '').split('/')[0] || 'home';
    return (Object.keys(pageTitles).includes(slug) ? slug : 'home') as Page;
  };

  const [page, setPage] = useState<Page>(readPage);

  useEffect(() => {
    const onPop = () => setPage(readPage());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (next: Page) => {
    const url = next === 'home' ? '/' : `/${next}`;
    window.history.pushState({}, '', url);
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { page, navigate };
}

function App() {
  const { page, navigate } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = pageTitles[page];
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [page, menuOpen]);

  const nav = (next: Page) => {
    navigate(next);
    setMenuOpen(false);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header page={page} navigate={nav} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main-content">
        {page === 'home' && <HomePage navigate={nav} />}
        {page === 'services' && <ServicesPage navigate={nav} />}
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
}: {
  page: Page;
  navigate: (page: Page) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const links: Array<[Page, string]> = [
    ['home', 'Home'],
    ['services', 'Services'],
    ['about', 'About'],
    ['areas', 'Service Area'],
    ['careers', 'Careers'],
    ['contact', 'Contact'],
  ];

  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <span>Serving Toronto & the Greater Toronto Area</span>
          <span>Monday-Saturday | Evening consultations available</span>
        </div>
        <nav className="nav-shell" aria-label="Main navigation">
          <button className="logo-button" onClick={() => navigate('home')} aria-label="AsherTouch Homecare home">
            <img src="/assets/logo/ashertouch-light-mode-logo.png" alt="AsherTouch Homecare Inc." />
          </button>
          <div className="desktop-nav">
            {links.map(([target, label]) => (
              <button key={target} className={page === target ? 'active' : ''} onClick={() => navigate(target)}>
                {label}
              </button>
            ))}
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
            <button className="icon-action menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
              <Icon name="menu" />
            </button>
          </div>
        </nav>
      </header>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-head">
          <img src="/assets/logo/ashertouch-light-mode-logo.png" alt="AsherTouch Homecare Inc." />
          <button className="icon-action" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <div className="mobile-menu-links">
          {links.map(([target, label]) => (
            <button key={target} onClick={() => navigate(target)} className={page === target ? 'active' : ''}>
              {label}
            </button>
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

function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Compassionate care, <em>right at home.</em>
          </h1>
          <p>
            Trusted non-medical home care for seniors and families across Toronto. Warm, reliable, personalized support so
            your family has peace of mind and your loved one has the care they deserve.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={() => navigate('contact')}>
              Book a free assessment
              <Icon name="arrow" />
            </button>
            <button className="btn btn-outline btn-large" onClick={() => navigate('contact')}>
              <Icon name="phone" />
              Call for consultation
            </button>
          </div>
          <div className="hero-proof">
            <Proof icon="shield" tone="green" title="Screened caregivers" text="Background and reference checks" />
            <Proof icon="clock" tone="orange" title="Flexible scheduling" text="Days, evenings, weekends" />
          </div>
        </div>
        <div className="hero-media" aria-label="Caregiver and senior sharing tea in a sunny living room">
          <img src="/assets/images/caregiver-senior-tea.png" alt="Caregiver and senior sharing tea in a sunny living room" />
          <div className="care-badge">
            <span className="icon-chip green"><Icon name="check" /></span>
            <div>
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
        title={<>Proudly serving Toronto and beyond.</>}
        text="We provide home care services across Toronto and the Greater Toronto Area. Not sure if we cover your area? Give us a call and we'll do our best to help."
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
  return (
    <div className="map-embed">
      <iframe
        title="Map of Toronto, Ontario, Canada"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps?q=Toronto%2C%20ON%2C%20Canada&output=embed"
      />
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
          Call or fill out the contact form and we'll schedule a conversation at a time that works for your family. No
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
          <StoryCard number="iii" tone="orange" title="Care begins gently" text="Start with a few hours a week and adjust as your family's needs change." />
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
        <SectionHead label="What's included" title={<>Standards on every visit.</>} text="Every AsherTouch visit comes with the same expectations, so families know exactly what is included." />
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
            <h2>Every client is someone's parent, grandparent, partner, or friend.</h2>
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
        title={<>Home care across <em>Toronto & the GTA.</em></>}
        text="AsherTouch serves families across Toronto and nearby communities. Final service areas should be confirmed before production launch."
        action="Ask about your area"
        navigate={navigate}
      />
      <section className="section">
        <div className="area-layout">
          <div className="area-list large">
            {serviceAreas.map((area) => (
              <span key={area}><Icon name="pin" />{area}</span>
            ))}
          </div>
          <MapEmbed />
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

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const options = useMemo(() => ['Adult child', 'Spouse / partner', 'Other family', 'Caring for myself'], []);
  const [relationship, setRelationship] = useState(options[0]);

  if (submitted) {
    return (
      <section className="section success-section">
        <span className="icon-chip green"><Icon name="check" /></span>
        <h1>Thank you. Your request is ready for follow-up.</h1>
        <p>
          This demo does not send data yet. Connect this form to the approved CRM, email service, or form endpoint before
          production launch.
        </p>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Submit another request</button>
      </section>
    );
  }

  return (
    <>
      <PageHero
        title={<>Tell us a little about your situation.</>}
        text={`A care coordinator will reach out within one business day. Prefer to talk? Call ${CONTACT.phone} or email ${CONTACT.email}.`}
      />
      <section className="section paper contact-section">
        <div className="contact-layout">
          <form className="form-card" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <div className="stepper" aria-label="Assessment form progress">
              <span className="active">1</span><i /><span>2</span><i /><span>3</span>
            </div>
            <h2>Book your free in-home assessment</h2>
            <p>Step 1 of 3. Required fields are marked.</p>
            <div className="field-grid">
              <label>First name <input required placeholder="e.g. Maria" /></label>
              <label>Last name <input required placeholder="e.g. Reyes" /></label>
            </div>
            <div className="field-grid">
              <label>Email <input required type="email" placeholder="you@example.com" /></label>
              <label>Phone <input required type="tel" placeholder="(437) 871-2988" /></label>
            </div>
            <fieldset>
              <legend>Your relationship to the person needing care</legend>
              <div className="radio-grid">
                {options.map((option) => (
                  <button type="button" key={option} className={relationship === option ? 'selected' : ''} onClick={() => setRelationship(option)}>
                    <span />{option}
                  </button>
                ))}
              </div>
            </fieldset>
            <label>What kind of support are you looking for?
              <textarea placeholder="Tell us a little about your loved one's routines, needs, or questions." />
            </label>
            <button className="btn btn-primary btn-large" type="submit">Continue to step 2 <Icon name="arrow" /></button>
          </form>
          <aside className="contact-cards">
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
            <article className="contact-card">
              <span className="icon-chip green"><Icon name="pin" /></span>
              <small>Service area</small>
              <strong>Toronto & GTA</strong>
            </article>
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

function PageHero({ title, text, action, navigate }: { title: React.ReactNode; text: string; action?: string; navigate?: (page: Page) => void }) {
  return (
    <section className="page-hero">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
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
          <img src="/assets/logo/ashertouch-dark-mode-logo.png" alt="AsherTouch Homecare Inc." />
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
          <a href={CONTACT.mapsHref} target="_blank" rel="noreferrer"><Icon name="pin" /> Toronto, Ontario</a>
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
    <App />
  </React.StrictMode>,
);
