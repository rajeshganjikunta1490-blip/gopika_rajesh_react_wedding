import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, Heart, Sparkles, Navigation, QrCode, Flower2, Music2 } from 'lucide-react';

const slides = [
  { src: '/assets/invitation-front.png', alt: 'Pallas invitation front cover', seconds: 10 },
  { src: '/assets/wedding-details.png', alt: 'English wedding invitation', seconds: 10 },
  { src: '/assets/telugu-invitation.jpeg', alt: 'Telugu wedding invitation', seconds: 10 },
  { src: '/assets/nati-charami.png', alt: 'Nati Charami wedding vows', seconds: 10 },
  { src: '/assets/venue-qr-back.png', alt: 'Venue QR invitation', seconds: 10 },
];

function Countdown() {
  const target = new Date('2026-11-15T21:28:00+05:30').getTime();
  const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);
  const values = [
    ['Days', Math.floor(remaining / 86400000)],
    ['Hours', Math.floor((remaining / 3600000) % 24)],
    ['Minutes', Math.floor((remaining / 60000) % 60)],
    ['Seconds', Math.floor((remaining / 1000) % 60)],
  ];
  return <div className="countdown" aria-label="Countdown to the wedding">{values.map(([label, value]) => <div className="time-card" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}

function App() {
  const galleryRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const audioRef = useRef(null);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    const node = galleryRef.current;
    if (!node) return;
    const id = setInterval(() => {
      const next = (activeSlide + 1) % slides.length;
      node.scrollTo({ left: next * node.clientWidth, behavior: 'smooth' });
      setActiveSlide(next);
    }, 10000);
    return () => clearInterval(id);
  }, [activeSlide]);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) return undefined;

    let disposed = false;
    node.volume = 0.55;
    node.loop = true;
    node.preload = 'auto';

    // Start immediately, then retry when the audio is ready or the page becomes active.
    // Browsers may still block audible autoplay until a visitor gesture; JavaScript cannot override that policy.
    const tryPlay = () => {
      if (disposed || !node || !node.paused) return;
      const result = node.play();
      if (result && typeof result.then === 'function') {
        result.then(() => {
          if (!disposed) {
            setMusicStarted(true);
            window.removeEventListener('pointerdown', onFirstInteraction);
            window.removeEventListener('click', onFirstInteraction);
            window.removeEventListener('keydown', onFirstInteraction);
            window.removeEventListener('touchstart', onFirstInteraction);
            window.removeEventListener('scroll', onFirstInteraction);
            window.removeEventListener('wheel', onFirstInteraction);
          }
        }).catch(() => {
          if (!disposed) setMusicStarted(false);
        });
      }
    };
    const onCanPlay = () => tryPlay();
    const onPageShow = () => tryPlay();
    const onFirstInteraction = () => tryPlay();

    // Multiple immediate/ready-state attempts help when the network has not loaded the MP3 yet.
    tryPlay();
    if (node.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      node.addEventListener('canplay', onCanPlay);
      node.addEventListener('loadeddata', onCanPlay);
    }
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('focus', onPageShow);
    document.addEventListener('visibilitychange', onPageShow);
    // Fallback for browsers that reject autoplay with sound: start at the first allowed gesture.
    // Keep retrying after user gestures until playback succeeds. A scroll event may not
    // count as media activation in every browser, so don't remove the other fallbacks
    // merely because an earlier scroll attempt was blocked.
    window.addEventListener('pointerdown', onFirstInteraction, { passive: true });
    window.addEventListener('click', onFirstInteraction, { passive: true });
    window.addEventListener('keydown', onFirstInteraction);
    window.addEventListener('touchstart', onFirstInteraction, { passive: true });
    window.addEventListener('scroll', onFirstInteraction, { passive: true });
    window.addEventListener('wheel', onFirstInteraction, { passive: true });

    return () => {
      disposed = true;
      node.removeEventListener('canplay', onCanPlay);
      node.removeEventListener('loadeddata', onCanPlay);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('focus', onPageShow);
      document.removeEventListener('visibilitychange', onPageShow);
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('wheel', onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const node = galleryRef.current;
    if (!node) return;
    const onScroll = () => {
      const idx = Math.round(node.scrollLeft / node.clientWidth);
      setActiveSlide(Math.max(0, Math.min(slides.length - 1, idx)));
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goToSlide = (idx) => {
    galleryRef.current?.scrollTo({ left: idx * (galleryRef.current?.clientWidth || 0), behavior: 'smooth' });
    setActiveSlide(idx);
  };

  return <>
    <audio ref={audioRef} src="/assets/telugu-romantic.mp3" loop preload="auto" autoPlay />
    <div className="ambient ambient-one" aria-hidden="true" /><div className="ambient ambient-two" aria-hidden="true" />
    <header className="topbar">
      <a className="wordmark" href="#home"><span className="mark ganesha-mark" aria-hidden="true">ॐ</span><span>Gopika Weds Rajesh</span></a>
      <nav><a href="#invitation">Invitation</a><a href="#details">Wedding details</a><a href="#venue">Venue</a></nav>
      <a className="nav-cta" href="#venue">Find the venue <ArrowUpRight size={15}/></a>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-content">
        <div className="hero-ganesha-art" aria-hidden="true">ॐ</div>
        <div className="ganesha">॥ శ్రీ గణేశాయ నమః ॥</div>
        <p className="hero-telugu-title">పల్లా వారి పెళ్లి వేడుకకు ఆహ్వానం</p>
        <p className="hero-intro">YOU ARE CORDIALLY INVITED TO THE WEDDING OF</p>
        <h1><span>Gopika Lakshmi Priya</span><i>with</i><span>Rajesh Kumar</span></h1>
        <div className="hero-divider"><span>✥</span></div>
        <div className="hero-date-line"><span><CalendarDays size={17}/> Sunday, 15 November 2026</span><i></i><span><Clock3 size={17}/> 9:28 PM (IST)</span></div>
        <div className="hero-lagnam">✧ &nbsp; MITHUNA LAGNAM &nbsp; ✧</div>
        <Countdown />
        <a className="primary-cta" href="#invitation"><span aria-hidden="true">♙</span> View Invitation <ArrowDown size={16}/></a>
        </div>
        <div className="hero-side-note">A DAY TO REMEMBER · 15.11.2026</div>
      </section>

      <section className="invitation-section section-pad" id="invitation">
        <div className="section-heading reveal">
          <span className="eyebrow">THE DETAILS, BEAUTIFULLY TOLD</span>
          <h2>Our Wedding <em>Invitation</em></h2>
          <p>Every little detail, lovingly prepared for you.</p>
        </div>
        <div className="gallery-shell reveal">
          <div className="gallery-topline"><span>THE INVITATION SUITE</span><span>{String(activeSlide + 1).padStart(2,'0')} <i>/</i> 05</span></div>
          <div className="gallery-viewport" ref={galleryRef}>
            {slides.map((slide, idx) => <button className="gallery-slide" key={slide.src} onClick={() => setLightbox(idx)} aria-label={`Enlarge ${slide.alt}`}><img src={slide.src} alt={slide.alt}/><span className="zoom-hint">View full invitation <ArrowUpRight size={14}/></span></button>)}
          </div>
          <div className="gallery-controls">
            <div className="gallery-manual-controls">
              <button className="slide-arrow" onClick={() => goToSlide((activeSlide - 1 + slides.length) % slides.length)} aria-label="Previous invitation"><ArrowLeft size={17}/><span>Previous</span></button>
              <div className="gallery-dots">{slides.map((slide, idx) => <button key={slide.src} className={idx === activeSlide ? 'dot active' : 'dot'} onClick={() => goToSlide(idx)} aria-label={`Go to image ${idx + 1}`} />)}</div>
              <button className="slide-arrow" onClick={() => goToSlide((activeSlide + 1) % slides.length)} aria-label="Next invitation"><span>Next</span><ArrowRight size={17}/></button>
            </div>
            <span className="auto-note"><span className="pulse-dot"/> Auto-advances every 10 seconds</span>
          </div>
        </div>
      </section>

      <section className="details-section section-pad" id="details">
        <div className="section-heading reveal"><span className="eyebrow">SAVE THE DATE</span><h2>A celebration of <em>love &amp; tradition</em></h2><p>We would be honoured to celebrate this special day with you.</p></div>
        <div className="details-grid">
          <article className="info-card reveal"><span className="info-icon"><CalendarDays/></span><span className="info-label">THE DAY</span><h3>Sunday</h3><p>15 November 2026</p><span className="card-rule"/></article>
          <article className="info-card reveal"><span className="info-icon"><Clock3/></span><span className="info-label">THE MUHURTHAM</span><h3>9:28 PM</h3><p>Mithuna Lagnam</p><span className="card-rule"/></article>
          <article className="info-card reveal"><span className="info-icon"><Flower2/></span><span className="info-label">THE OCCASION</span><h3>Gopika Weds Rajesh</h3><p>A union blessed by tradition</p><span className="card-rule"/></article>
        </div>
      </section>

      <section className="venue-section section-pad" id="venue">
        <div className="section-heading reveal"><span className="eyebrow">WE'LL SAVE YOU A SEAT</span><h2>Meet us at <em>the mandapam</em></h2><p>Your presence will make our day complete.</p></div>
        <div className="venue-layout reveal">
          <div className="venue-card">
            <div className="venue-icon"><MapPin size={22}/></div>
            <span className="info-label">THE WEDDING VENUE</span>
            <h3>Sri Bramaramba Mallikarjuna Swamy<br/>Kalyana Mandapam</h3>
            <p>Pillar No. 685, near JNTU Metro Station<br/>Kukatpally, Hyderabad</p>
            <div className="venue-meta"><span><CalendarDays size={15}/> 15 November 2026</span><span><Clock3 size={15}/> 9:28 PM</span></div>
            <a className="venue-primary" href="https://www.google.com/maps/search/?api=1&query=Sri+Bramaramba+Mallikarjuna+Swamy+Kalyana+Mandapam+Kukatpally+Hyderabad" target="_blank" rel="noreferrer"><Navigation size={17}/> Get Directions <ArrowUpRight size={16}/></a>
            <button className="venue-secondary" onClick={() => setLightbox(4)}><QrCode size={17}/> View Venue QR <ArrowUpRight size={16}/></button>
          </div>
          <div className="venue-art">
            <div className="venue-art-glow"/>
            <img src="/assets/venue-qr-back.png" alt="Wedding invitation with venue QR code" onClick={() => setLightbox(4)}/>
            <div className="qr-caption"><QrCode size={15}/> SCAN FOR THE VENUE <span>Easy to find, easy to celebrate</span></div>
          </div>
        </div>
      </section>
      <section className="closing-section">
        <div className="closing-ornament">✧</div><Heart size={24} fill="currentColor"/>
        <p>With love and blessings,</p><h2>We can't wait to celebrate <em>with you.</em></h2>
        <span>GOPIKA LAKSHMI PRIYA &nbsp; · &nbsp; RAJESH KUMAR</span>
      </section>
    </main>
    <footer><div className="footer-monogram">G<span>♡</span>R</div><p>Made with love for our beginning.</p><span>15 · 11 · 2026</span></footer>

    <div className={`music-status ${musicStarted ? 'playing' : ''}`} aria-label={musicStarted ? 'Wedding music playing' : 'Wedding music will start when allowed'}><Music2 size={14}/><span>{musicStarted ? 'A little music, a lot of love' : 'Wedding melody'}</span><i/></div>
    {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Full invitation viewer" onClick={() => setLightbox(null)}>
      <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close image">×</button>
      <button className="lightbox-arrow lightbox-prev" onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + slides.length) % slides.length); }} aria-label="Previous full invitation"><ArrowLeft size={24}/></button>
      <img src={slides[lightbox].src} alt={slides[lightbox].alt} onClick={e => e.stopPropagation()}/>
      <button className="lightbox-arrow lightbox-next" onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % slides.length); }} aria-label="Next full invitation"><ArrowRight size={24}/></button>
      <div className="lightbox-count">{String(lightbox + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
    </div>}
  </>;
}

export default App;
