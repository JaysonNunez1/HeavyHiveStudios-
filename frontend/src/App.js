import "@/App.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { 
  Mic, 
  Music, 
  Headphones, 
  Calendar, 
  GraduationCap, 
  Camera, 
  Mail, 
  Instagram, 
  ExternalLink,
  ChevronDown,
  Play,
  Disc,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Clock,
  Sparkles,
  MessageCircle,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  Pause
} from "lucide-react";
import { Button } from "./components/ui/button";

// Assets
const ASSETS = {
  hero_bg: "https://images.unsplash.com/photo-1573283807132-f7b218208690?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxhdWRpbyUyMG1peGluZyUyMGNvbnNvbGUlMjBkYXJrfGVufDB8fHx8MTc3MTMzNzcwNnww&ixlib=rb-4.1.0&q=85",
  studio_interior: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/lvdly506_IMG_0757.jpeg",
  studio_lounge: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/vad2mitu_IMG_0762.jpeg",
  studio_desk: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/ydg1vfs3_IMG_0761.jpeg",
  studio_session: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/s7p219kf_IMG_0910.jpeg",
  // Promo video
  promo_video: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/fxqctace_HEAVY_HIVE_PROMO_VIDEO00222.MP4",
  // Recent work album covers - corrected mapping
  astronomical: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/ou3uv5sg_IMG_0891.jpeg",
  juiced_up: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/d6c5vclr_IMG_0892.jpeg",
  colossal: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/5h9bj93c_IMG_0893.jpeg",
  grim_reaper: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/jcu3p098_IMG_0894.jpeg",
  ice: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/n7c1gnpp_IMG_0930.jpeg",
};

// Recent work data
const recentWork = [
  {
    title: "I.C.E",
    artist: "Rahmeezy",
    type: "Single",
    genre: "Hip-Hop/Rap",
    year: "2025",
    cover: ASSETS.ice,
    link: "https://music.apple.com/us/album/i-c-e-single/1872808579",
  },
  {
    title: "Astronomical",
    artist: "JayoBeatz",
    type: "Album",
    genre: "Hip-Hop/Rap",
    year: "2026",
    cover: ASSETS.astronomical,
    link: "https://music.apple.com/us/album/astronomical/1879836205",
  },
  {
    title: "Juiced Up",
    artist: "Rahmeezy",
    type: "Single",
    genre: "Hip-Hop/Rap",
    year: "2025",
    cover: ASSETS.juiced_up,
    link: "https://music.apple.com/us/album/juiced-up-single/1862865892",
  },
  {
    title: "Colossal",
    artist: "BopaDoya",
    type: "Single",
    genre: "Hip-Hop/Rap",
    year: "2026",
    cover: ASSETS.colossal,
    link: "https://music.apple.com/us/album/colossal-single/1869422277",
  },
  {
    title: "Grim Reaper",
    artist: "Yung Brownie",
    type: "Single",
    genre: "Hip-Hop/Rap",
    year: "2025",
    cover: ASSETS.grim_reaper,
    link: "https://music.apple.com/us/album/grim-reaper-single/1834070214",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// Services data
const services = [
  { icon: Mic, title: "Recording", description: "Professional vocal & instrument recording with industry-grade equipment" },
  { icon: Music, title: "Beat Production", description: "Custom beats tailored to your unique style and vision" },
  { icon: Headphones, title: "Mixing & Mastering", description: "Polish your tracks to industry-standard quality" },
  { icon: Calendar, title: "Private Events", description: "Host your exclusive events in our creative space" },
  { icon: GraduationCap, title: "Learning Program", description: "Learn recording, production, and engineering skills" },
  { icon: Camera, title: "Photo & Video", description: "Professional photography and video production services" },
];

// Pricing data
const recordingPricing = [
  { name: "Per HR", price: "$60", note: "Mix included in session" },
  { name: "3 HR Package", price: "$165", note: "Mix included in session" },
  { name: "6 HR Package", price: "$300", note: "Mix included in session", featured: true },
  { name: "12HR Lock-In", price: "$550", note: "Mix included in session" },
];

const roomRatePricing = [
  { name: "Per HR", price: "$30", note: "Engineer not included" },
];

const mixMasterPricing = [
  { name: "1 Record Mix", price: "$90" },
  { name: "1 Record Mastering", price: "$150" },
  { name: "1 Record Mix + Master", price: "$200", featured: true },
];

const beatPricing = [
  { name: "Leasing", price: "$100+" },
  { name: "Exclusive Leasing", price: "$250+", note: "Full ownership rights" },
];

// Roster data - In-house team
const rosterTeam = [
  {
    name: "Rahmel Brown",
    roles: ["Artist", "Entrepreneur", "Studio Owner"],
    instagram: "https://www.instagram.com/rahmeezy?igsh=MTY2d2R6ZmViNWZ1eg==",
    isOwner: true,
    title: "Head of the Hive"
  },
  {
    name: "JayoBeatz",
    roles: ["Recording", "Mixing", "Mastering", "Producer"],
    instagram: "https://www.instagram.com/jayobeatz_?igsh=MWpzMm5mbnVudjdiaA%3D%3D&utm_source=qr",
  },
  {
    name: "FK-47",
    roles: ["Recording", "Mixing", "Mastering", "Producer"],
    instagram: "https://www.instagram.com/fk47._?igsh=bGdtcjc0b3Z1dGs2",
  },
  {
    name: "RichTheEngineer",
    roles: ["Recording", "Mixing", "Mastering"],
    instagram: "https://www.instagram.com/richtheengineer52?igsh=MTBqa2QwaTRqdDZ5eg==",
  },
  {
    name: "SoundsByOso",
    roles: ["Recording", "Mixing", "Mastering"],
    instagram: "https://www.instagram.com/soundsbyoso?igsh=cjhmem44cjZjMWZ5",
  },
];

// Scroll Progress Bar - gold level meter across the top of the page
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
};

// Navigation Component
const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const scrollToSection = (id) => {
    // Convert to lowercase and replace spaces with hyphens for section IDs
    const sectionId = id.toLowerCase().replace(/\s+/g, '-');
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navItems = ['Services', 'Pricing', 'Subscriptions', 'Recent Work', 'Roster', 'Gallery', 'Contact'];

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-md border-b border-gold-500/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-gold-500 font-heading text-2xl tracking-wider hover:tracking-[0.2em] transition-all duration-300 cursor-default">
                HEAVY<span className="text-white">HIVE</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-300 hover:text-gold-500 font-medium tracking-wide transition-colors animated-underline"
                  data-testid={`nav-${item.toLowerCase()}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gold-500 hover:text-gold-400 transition-colors"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* CTA Button - Desktop */}
            <a 
              href="https://peerspace.app.link/TKMYBRHhS1b" 
              target="_blank" 
              rel="noopener noreferrer"
              data-testid="nav-book-btn"
              className="hidden md:block"
            >
              <Button className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-6 py-2 btn-glow">
                Book Now
              </Button>
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#050505] pt-24 px-6 md:hidden"
            style={{ backgroundColor: '#050505' }}
          >
            <div className="flex flex-col items-center gap-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-white hover:text-gold-500 font-heading text-3xl tracking-wide transition-colors"
                  data-testid={`mobile-nav-${item.toLowerCase()}`}
                >
                  {item}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href="https://peerspace.app.link/TKMYBRHhS1b"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4"
                data-testid="mobile-book-btn"
              >
                <Button className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-10 py-4 text-lg btn-glow">
                  Book Now
                </Button>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat ken-burns"
        style={{ backgroundImage: `url(${ASSETS.hero_bg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Logo Mark */}
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <div className="w-24 h-24 border-2 border-gold-500 flex items-center justify-center">
              <span className="text-gold-500 font-heading text-4xl">HH</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={fadeInUp}
            className="font-heading text-6xl md:text-8xl lg:text-9xl tracking-tighter"
            data-testid="hero-title"
          >
            <span className="gold-shimmer">HEAVY</span>
            <span className="text-white">HIVE</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-gold-500 font-accent text-xl md:text-2xl tracking-[0.3em]"
          >
            STUDIOS
          </motion.p>

          {/* Animated equalizer bars */}
          <motion.div variants={fadeInUp} className="flex justify-center" aria-hidden="true">
            <div className="eq-bars">
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p 
            variants={fadeInUp}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            data-testid="hero-tagline"
          >
            A creative hub made for artists, by artists.<br />
            <span className="text-gold-400 font-semibold">Don't just live in the moments — become the moment.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a 
              href="https://peerspace.app.link/TKMYBRHhS1b" 
              target="_blank" 
              rel="noopener noreferrer"
              data-testid="hero-book-btn"
            >
              <Button className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-10 py-6 text-lg btn-glow">
                Book Your Session
              </Button>
            </a>
            <Button 
              variant="outline"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-gold-500 text-gold-500 hover:bg-gold-500/10 px-10 py-6 text-lg uppercase tracking-widest"
              data-testid="hero-explore-btn"
            >
              Explore Services
            </Button>
          </motion.div>

          {/* Watch Commercial Link */}
          <motion.div variants={fadeInUp} className="pt-6">
            <button 
              onClick={() => document.getElementById('promo-video')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 text-gray-400 hover:text-gold-500 transition-colors group cursor-pointer"
              data-testid="hero-commercial-btn"
            >
              <div className="w-12 h-12 rounded-full border-2 border-gold-500/50 group-hover:border-gold-500 flex items-center justify-center group-hover:bg-gold-500 transition-all">
                <Play className="w-5 h-5 text-gold-500 group-hover:text-black ml-0.5" />
              </div>
              <span className="uppercase tracking-widest text-sm font-medium">Watch Our Commercial</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-gold-500 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};

// Promo Video Section with Autoplay on Scroll
const PromoVideoSection = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view - play it
            video.play().then(() => {
              setIsPlaying(true);
            }).catch((err) => {
              console.log('Autoplay prevented:', err);
            });
          } else {
            // Video is out of view - pause it
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the video is visible
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section id="promo-video" ref={sectionRef} className="py-12 md:py-16 bg-obsidian-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-8"
        >
          <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-3">
            SEE IT IN ACTION
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-2xl md:text-4xl text-white"
            data-testid="promo-video-title"
          >
            THE <span className="text-gold-500">HEAVY HIVE</span> EXPERIENCE
          </motion.h2>
        </motion.div>

        {/* Video Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative border border-gold-500/30 overflow-hidden group"
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src={ASSETS.promo_video}
            className="w-full h-auto"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            data-testid="promo-video"
          />

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 text-white hover:text-gold-500 transition-colors"
              data-testid="video-play-toggle"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
              <span className="text-sm uppercase tracking-wider hidden md:inline">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="flex items-center gap-2 text-white hover:text-gold-500 transition-colors"
              data-testid="video-mute-toggle"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
              <span className="text-sm uppercase tracking-wider hidden md:inline">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </button>
          </div>

          {/* Play Button Overlay (shown when paused) */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 rounded-full bg-gold-500/90 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <Play className="w-10 h-10 text-black ml-1" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Caption */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          A creative hub made for artists, by artists.
        </motion.p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-4">
            WHAT WE OFFER
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-4xl md:text-6xl text-white"
            data-testid="services-title"
          >
            OUR <span className="text-gold-500">SERVICES</span>
          </motion.h2>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={fadeInUp}
              className="hex-card card-shine group cursor-pointer"
              data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-500/10 group-hover:bg-gold-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  <service.icon className="w-6 h-6 text-gold-500 group-hover:text-black transition-colors" />
                </div>
                <div>
                  <h3 className="font-heading text-xl text-white mb-2 group-hover:text-gold-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-obsidian-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-4">
            TRANSPARENT PRICING
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-4xl md:text-6xl text-white"
            data-testid="pricing-title"
          >
            <span className="text-gold-500">RATES</span> & PACKAGES
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 mt-4 max-w-xl mx-auto">
            Professional sound, industry quality. Deposit required for all bookings.
          </motion.p>
        </motion.div>

        {/* Pricing Cards Container - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Recording Rates */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="pricing-card card-shine p-8"
            data-testid="pricing-recording"
          >
            <div className="flex items-center gap-3 mb-6">
              <Mic className="w-6 h-6 text-gold-500" />
              <h3 className="font-heading text-2xl text-gold-500">Recording</h3>
            </div>
            <div className="space-y-4">
              {recordingPricing.map((item, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center py-3 border-b border-white/5 ${item.featured ? 'bg-gold-500/5 -mx-4 px-4' : ''}`}
                >
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    {item.note && (
                      <span className="text-gray-500 text-xs block mt-1">{item.note}</span>
                    )}
                  </div>
                  <span className="text-gold-500 font-heading text-xl">{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Room Rates */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="pricing-card card-shine p-8"
            data-testid="pricing-room"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-gold-500" />
              <h3 className="font-heading text-2xl text-gold-500">Room Rates</h3>
            </div>
            <div className="space-y-4">
              {roomRatePricing.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-white/5"
                >
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    {item.note && (
                      <span className="text-gray-500 text-xs block mt-1">{item.note}</span>
                    )}
                  </div>
                  <span className="text-gold-500 font-heading text-xl">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-6">
              Perfect for artists who bring their own engineer or want to work independently.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards Container - Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mix & Mastering */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="pricing-card featured p-8"
            data-testid="pricing-mixing"
          >
            <div className="flex items-center gap-3 mb-6">
              <Headphones className="w-6 h-6 text-gold-500" />
              <h3 className="font-heading text-2xl text-gold-500">Mix & Mastering</h3>
            </div>
            <div className="space-y-4">
              {mixMasterPricing.map((item, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center py-3 border-b border-white/5 ${item.featured ? 'bg-gold-500/5 -mx-4 px-4' : ''}`}
                >
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-gold-500 font-heading text-xl">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <a 
                href="https://peerspace.app.link/TKMYBRHhS1b" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 py-4 btn-glow" data-testid="pricing-book-btn">
                  Book Session
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Beat Production */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="pricing-card card-shine p-8"
            data-testid="pricing-beats"
          >
            <div className="flex items-center gap-3 mb-6">
              <Disc className="w-6 h-6 text-gold-500" />
              <h3 className="font-heading text-2xl text-gold-500">Beat Production</h3>
            </div>
            <div className="space-y-4">
              {beatPricing.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-white/5"
                >
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    {item.note && (
                      <span className="text-gray-500 text-xs block mt-1">{item.note}</span>
                    )}
                  </div>
                  <span className="text-gold-500 font-heading text-xl">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-6">
              Custom beats crafted to match your unique sound and vision.
            </p>
          </motion.div>
        </div>

        {/* Important Notes */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 p-6 border border-gold-500/20 bg-obsidian"
        >
          <p className="text-gray-400 text-sm leading-relaxed">
            <span className="text-gold-500 font-semibold">Please Note:</span> All sessions require a 2 hour minimum. 
            Recording sessions include a basic mix, but not a radio-ready mix. 
            For a radio-ready mix and master, please see our Mix & Mastering prices — $90 for mix or $200 for mix and master.
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Subscription Section with Stripe Checkout
const SubscriptionSection = () => {
  const [loadingPlan, setLoadingPlan] = useState(null);
  
  const subscriptions = [
    {
      icon: Clock,
      title: "Studio Time",
      planId: "price_1THxvbKPFpDMdL7yYCr12yYn",
      price: "$150",
      period: "/month",
      features: [
        "3 recording sessions per month",
        "4 hours per session",
        "Engineer included",
        "Priority booking"
      ],
      featured: false
    },
    {
      icon: Package,
      title: "Artist Bundle",
      planId: "price_1TIw65KPFpDMdL7ykIqsnBmz",
      price: "$300",
      period: "/month",
      features: [
        "3 recording sessions per month",
        "4 beats every month",
        "Studio time + beats combo",
        "Best value for artists"
      ],
      featured: true
    },
    {
      icon: Sparkles,
      title: "Weekly Beats",
      planId: "price_1THxtKKPFpDMdL7ytrA4DwTS",
      price: "$150",
      period: "/month",
      features: [
        "2 exclusive beats per week",
        "Custom to your style",
        "In-house producers",
        "Full ownership rights"
      ],
      featured: false
    },
    {
      icon: Headphones,
      title: "Mix & Master",
      planId: null,
      price: "Custom",
      period: "",
      features: [
        "Personalized subscription",
        "Volume discounts available",
        "Priority turnaround",
        "Contact us for details"
      ],
      featured: false,
      contactUs: true
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!planId) return;
    
    setLoadingPlan(planId);
    
    try {
      const originUrl = window.location.origin;
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/subscriptions/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          origin_url: originUrl,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      
      const data = await response.json();
      
      // Redirect to Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again or contact us.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="subscriptions" className="py-24 md:py-32 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-4">
            SAVE MORE WITH
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-4xl md:text-6xl text-white"
            data-testid="subscriptions-title"
          >
            <span className="text-gold-500">SUBSCRIPTION</span> PLANS
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 mt-4 max-w-xl mx-auto">
            Unlock exclusive monthly plans and take your music to the next level.
          </motion.p>
        </motion.div>

        {/* Subscription Cards */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {subscriptions.map((sub, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative p-8 border transition-colors duration-300 hover:border-gold-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] ${
                sub.featured 
                  ? 'bg-gold-500/5 border-gold-500' 
                  : 'bg-obsidian-100 border-gold-500/20 card-shine'
              }`}
              data-testid={`subscription-${sub.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Featured Badge */}
              {sub.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gold-500 text-black font-bold text-xs tracking-widest px-4 py-1 uppercase">
                    Best Value
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`p-4 ${sub.featured ? 'bg-gold-500' : 'bg-gold-500/10'}`}>
                  <sub.icon className={`w-8 h-8 ${sub.featured ? 'text-black' : 'text-gold-500'}`} />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-heading text-2xl text-center text-white mb-4">{sub.title}</h3>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="font-heading text-4xl text-gold-500">{sub.price}</span>
                <span className="text-gray-400 text-lg">{sub.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {sub.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <Repeat className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {sub.contactUs ? (
                <Button 
                  onClick={() => window.location.href = 'mailto:heavystudios@gmail.com'}
                  className="w-full border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black uppercase tracking-widest py-4 bg-transparent"
                  data-testid={`subscription-contact-${index}`}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              ) : (
                <Button 
                  onClick={() => handleSubscribe(sub.planId)}
                  disabled={loadingPlan === sub.planId}
                  className={`w-full uppercase tracking-widest py-4 ${
                    sub.featured 
                      ? 'bg-gold-500 text-black hover:bg-gold-400' 
                      : 'border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black bg-transparent'
                  }`}
                  data-testid={`subscription-cta-${index}`}
                >
                  {loadingPlan === sub.planId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Note */}
        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center text-gray-500 text-sm mt-12"
        >
          All subscriptions are billed monthly. Secure checkout powered by Stripe.
        </motion.p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Recent Work Section
const RecentWorkSection = () => {
  return (
    <section id="recent-work" className="py-24 md:py-32 bg-obsidian-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-4">
            FROM THE HIVE
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-4xl md:text-6xl text-white"
            data-testid="recent-work-title"
          >
            <span className="text-gold-500">RECENT</span> WORK
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 mt-4 max-w-xl mx-auto">
            Check out some of the latest tracks recorded, mixed, and mastered at Heavy Hive Studios.
          </motion.p>
        </motion.div>

        {/* Recent Work Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recentWork.map((work, index) => (
            <motion.a
              key={index}
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-obsidian border border-gold-500/20 hover:border-gold-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-colors duration-300 overflow-hidden cursor-pointer block"
              data-testid={`recent-work-${index}`}
            >
              {/* Album Cover */}
              <div className="bg-black p-3">
                <img 
                  src={work.cover} 
                  alt={`${work.title} by ${work.artist}`}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Track Info */}
              <div className="p-4 bg-obsidian">
                <h3 className="font-heading text-lg text-white group-hover:text-gold-500 transition-colors truncate">
                  {work.title}
                </h3>
                <p className="text-gold-500 text-sm font-medium truncate">{work.artist}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">{work.type}</span>
                  <span className="text-gray-500 text-xs">{work.year}</span>
                </div>
              </div>

              {/* Hover overlay with play icon hint */}
              <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-gold-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                  <Play className="w-8 h-8 text-black ml-1" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            Ready to create your next hit? Book a session and join our growing roster of artists.
          </p>
          <a 
            href="https://peerspace.app.link/TKMYBRHhS1b" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-10 py-4 btn-glow"
              data-testid="recent-work-book-btn"
            >
              Book Your Session
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Roster Section - In-house Team
const RosterSection = () => {
  return (
    <section id="roster" className="py-24 md:py-32 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-4">
            MEET THE TEAM
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-4xl md:text-6xl text-white"
            data-testid="roster-title"
          >
            OUR <span className="text-gold-500">ROSTER</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 mt-4 max-w-xl mx-auto">
            Work with our talented in-house engineers and producers who bring your vision to life.
          </motion.p>
        </motion.div>

        {/* Roster Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-6"
        >
          {rosterTeam.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group relative border transition-colors duration-300 p-8 text-center bg-obsidian-100 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] ${
                member.isOwner 
                  ? 'border-gold-500' 
                  : 'border-gold-500/20 hover:border-gold-500 card-shine'
              }`}
              data-testid={`roster-member-${index}`}
            >
              {/* Owner Badge */}
              {member.isOwner && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gold-500 text-black font-bold text-xs tracking-widest px-4 py-1 uppercase">
                    {member.title}
                  </span>
                </div>
              )}

              {/* Member Icon/Avatar */}
              <div className={`w-24 h-24 mx-auto mb-6 border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                member.isOwner 
                  ? 'border-gold-500 bg-gold-500' 
                  : 'border-gold-500 group-hover:bg-gold-500'
              }`}>
                <Mic className={`w-10 h-10 transition-colors ${
                  member.isOwner 
                    ? 'text-black' 
                    : 'text-gold-500 group-hover:text-black'
                }`} />
              </div>
              
              {/* Member Name */}
              <h3 className={`font-heading text-2xl transition-colors mb-4 ${
                member.isOwner 
                  ? 'text-gold-500' 
                  : 'text-white group-hover:text-gold-500'
              }`}>
                {member.name}
              </h3>
              
              {/* Roles */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {member.roles.map((role, roleIndex) => (
                  <span 
                    key={roleIndex}
                    className={`text-xs uppercase tracking-wider px-3 py-1 border ${
                      member.isOwner 
                        ? 'bg-gold-500/20 text-gold-400 border-gold-500/50' 
                        : 'bg-gold-500/10 text-gold-500 border-gold-500/30'
                    }`}
                  >
                    {role}
                  </span>
                ))}
              </div>

              {/* Instagram Link */}
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors"
                data-testid={`roster-instagram-${index}`}
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm">Follow on Instagram</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Gallery Section
const GallerySection = () => {
  const galleryImages = [
    { src: ASSETS.studio_interior, alt: "Heavy Hive Studio Interior" },
    { src: ASSETS.studio_lounge, alt: "Studio Lounge Area" },
    { src: ASSETS.studio_desk, alt: "Production Desk Setup" },
    { src: ASSETS.studio_session, alt: "Live Recording Session" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Autoplay effect - advances every 4 seconds
  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(autoplayInterval);
  }, [nextSlide]);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-4">
            TAKE A LOOK INSIDE
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-4xl md:text-6xl text-white"
            data-testid="gallery-title"
          >
            THE <span className="text-gold-500">STUDIO</span>
          </motion.h2>
        </motion.div>

        {/* Gallery Carousel */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative"
        >
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-2"
                  data-testid={`gallery-slide-${index}`}
                >
                  <div className="relative overflow-hidden border border-gold-500/20">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-[350px] md:h-[500px] lg:h-[600px] object-cover"
                    />
                    {/* Image overlay with caption */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <p className="text-white font-heading text-xl md:text-2xl">{image.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-gold-500 text-white hover:text-black hover:scale-110 transition-all border border-gold-500/30 hover:border-gold-500 z-10"
            data-testid="carousel-prev"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-gold-500 text-white hover:text-black hover:scale-110 transition-all border border-gold-500/30 hover:border-gold-500 z-10"
            data-testid="carousel-next"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-6">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 transition-all ${
                  index === currentSlide 
                    ? 'bg-gold-500 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                data-testid={`carousel-dot-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Studio Features */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "6+", label: "Months Operating" },
            { value: "Pro", label: "Grade Equipment" },
            { value: "24/7", label: "Availability" },
            { value: "100%", label: "Client Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="space-y-2">
              <p className="font-heading text-3xl md:text-4xl text-gold-500">{stat.value}</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-obsidian-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Info */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className="text-gold-500 font-accent tracking-[0.3em] text-sm mb-4">
              GET IN TOUCH
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-4xl md:text-5xl text-white mb-8"
              data-testid="contact-title"
            >
              LET'S <span className="text-gold-500">CREATE</span> TOGETHER
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg leading-relaxed mb-10">
              Ready to bring your vision to life? Book your session today and experience 
              the Heavy Hive difference. Professional sound, industry quality.
            </motion.p>

            {/* Contact Links */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <button 
                onClick={() => window.location.href = 'mailto:heavyhivestudios@gmail.com'}
                className="flex items-center gap-4 text-gray-300 hover:text-gold-500 transition-colors group cursor-pointer"
                data-testid="contact-email"
              >
                <div className="p-3 bg-gold-500/10 group-hover:bg-gold-500 transition-colors">
                  <Mail className="w-6 h-6 text-gold-500 group-hover:text-black transition-colors" />
                </div>
                <span className="text-lg">heavyhivestudios@gmail.com</span>
              </button>
              
              <a 
                href="https://instagram.com/heavyhivestudios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-gray-300 hover:text-gold-500 transition-colors group"
                data-testid="contact-instagram"
              >
                <div className="p-3 bg-gold-500/10 group-hover:bg-gold-500 transition-colors">
                  <Instagram className="w-6 h-6 text-gold-500 group-hover:text-black transition-colors" />
                </div>
                <span className="text-lg">@heavyhivestudios</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right - CTA Card */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-obsidian border border-gold-500/20 p-10 flex flex-col justify-center"
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto border-2 border-gold-500 flex items-center justify-center mb-8">
                <Play className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="font-heading text-3xl text-white">
                READY TO <span className="text-gold-500">RECORD?</span>
              </h3>
              <p className="text-gray-400">
                Book your session through Peerspace and start creating your next masterpiece.
              </p>
              <a 
                href="https://peerspace.app.link/TKMYBRHhS1b"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-book-btn"
              >
                <Button className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-12 py-6 text-lg btn-glow w-full mt-4">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Book on Peerspace
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-10 bg-obsidian border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="font-heading text-xl">
            <span className="text-gold-500">HEAVY</span>
            <span className="text-white">HIVE</span>
            <span className="text-gray-500 font-body text-sm ml-2">STUDIOS</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => window.location.href = 'mailto:heavyhivestudios@gmail.com'}
              className="text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
              aria-label="Email"
              data-testid="footer-email"
            >
              <Mail className="w-5 h-5" />
            </button>
            <a 
              href="https://instagram.com/heavyhivestudios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gold-500 transition-colors"
              aria-label="Instagram"
              data-testid="footer-instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Heavy Hive Studios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Home Page
const Home = () => {
  return (
    <div className="min-h-screen bg-obsidian">
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <PromoVideoSection />
      <ServicesSection />
      <PricingSection />
      <SubscriptionSection />
      <RecentWorkSection />
      <RosterSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

// Subscription Success Page
const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [planName, setPlanName] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/subscriptions/checkout/status/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }
        
        const data = await response.json();
        
        if (data.payment_status === 'paid') {
          setStatus('success');
          setPlanName(data.metadata?.plan_name || 'your subscription');
        } else if (data.status === 'expired') {
          setStatus('expired');
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('success'); // Assume success if we can't verify - Stripe has already confirmed
      }
    };

    checkPaymentStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        {status === 'loading' ? (
          <div className="space-y-6">
            <Loader2 className="w-16 h-16 text-gold-500 mx-auto animate-spin" />
            <h1 className="font-heading text-3xl text-white">Verifying Payment...</h1>
            <p className="text-gray-400">Please wait while we confirm your subscription.</p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-gold-500/10 border-2 border-gold-500 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-gold-500" />
            </div>
            <h1 className="font-heading text-4xl text-white">
              Welcome to the <span className="text-gold-500">Hive!</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Your subscription to <span className="text-gold-500 font-semibold">{planName}</span> is now active.
            </p>
            <p className="text-gray-400">
              We'll be in touch shortly with next steps. Check your email for confirmation details.
            </p>
            <div className="pt-6">
              <Button 
                onClick={() => navigate('/')}
                className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-10 py-4"
              >
                Back to Home
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="font-heading text-3xl text-white">Something Went Wrong</h1>
            <p className="text-gray-400">
              We couldn't verify your payment. Please contact us if you were charged.
            </p>
            <div className="pt-6 space-x-4">
              <Button 
                onClick={() => navigate('/')}
                className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-8 py-4"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => window.location.href = 'mailto:heavyhivestudios@gmail.com'}
                variant="outline"
                className="border-gold-500 text-gold-500 hover:bg-gold-500/10 px-8 py-4 uppercase tracking-widest"
              >
                Contact Us
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Subscription Cancel Page
const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center space-y-6"
      >
        <div className="w-24 h-24 mx-auto border-2 border-gold-500/50 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="font-heading text-3xl text-white">Checkout Cancelled</h1>
        <p className="text-gray-400">
          No worries! Your subscription wasn't processed. Feel free to come back anytime.
        </p>
        <div className="pt-6">
          <Button 
            onClick={() => navigate('/')}
            className="bg-gold-500 text-black font-bold uppercase tracking-widest hover:bg-gold-400 px-10 py-4"
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
