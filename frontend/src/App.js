import "@/App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  X
} from "lucide-react";
import { Button } from "./components/ui/button";

// Assets
const ASSETS = {
  hero_bg: "https://images.unsplash.com/photo-1573283807132-f7b218208690?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxhdWRpbyUyMG1peGluZyUyMGNvbnNvbGUlMjBkYXJrfGVufDB8fHx8MTc3MTMzNzcwNnww&ixlib=rb-4.1.0&q=85",
  studio_interior: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/lvdly506_IMG_0757.jpeg",
  studio_lounge: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/vad2mitu_IMG_0762.jpeg",
  studio_desk: "https://customer-assets.emergentagent.com/job_12c86c6d-cb8b-4604-b112-352b65bebaf5/artifacts/ydg1vfs3_IMG_0761.jpeg",
};

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
  { name: "Hourly", price: "$75", note: "Engineer Included" },
  { name: "3 HR Package", price: "$280", note: "Engineer Included" },
  { name: "8 HR Package", price: "$520", note: "Engineer Included", featured: true },
  { name: "12HR Lock-In", price: "$720", note: "Engineer Included" },
  { name: "Hourly", price: "$50", note: "Excluding Engineer" },
];

const mixMasterPricing = [
  { name: "1 Record Mix", price: "$90" },
  { name: "1 Record Mastering", price: "$150" },
  { name: "Mix + Mastering Package", price: "$200", featured: true },
];

const beatPricing = [
  { name: "Exclusive Leasing", price: "$250+", note: "Full ownership rights" },
];

// Navigation Component
const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navItems = ['Services', 'Pricing', 'Gallery', 'Contact'];

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
              <div className="text-gold-500 font-heading text-2xl tracking-wider">
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
              href="https://www.peerspace.com" 
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
                href="https://www.peerspace.com"
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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
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
            <span className="text-gold-500 text-glow">HEAVY</span>
            <span className="text-white">HIVE</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-gold-500 font-accent text-xl md:text-2xl tracking-[0.3em]"
          >
            STUDIOS
          </motion.p>

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
              href="https://www.peerspace.com" 
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
              className="hex-card group cursor-pointer"
              data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-500/10 group-hover:bg-gold-500 transition-colors">
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

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recording Rates */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="pricing-card p-8"
            data-testid="pricing-recording"
          >
            <div className="flex items-center gap-3 mb-6">
              <Mic className="w-6 h-6 text-gold-500" />
              <h3 className="font-heading text-2xl text-gold-500">Recording Rates</h3>
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
                href="https://www.peerspace.com" 
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
            className="pricing-card p-8"
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
              Custom beats crafted to match your unique sound and vision. Contact us to discuss your project.
            </p>
          </motion.div>
        </div>
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
    { src: ASSETS.studio_mic, alt: "Professional Recording Setup" },
    { src: ASSETS.hero_bg, alt: "Audio Mixing Console" },
  ];

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

        {/* Gallery Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`gallery-image ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              data-testid={`gallery-image-${index}`}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className={`w-full object-cover ${index === 0 ? 'h-[500px]' : 'h-[240px]'}`}
              />
            </motion.div>
          ))}
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
              <a 
                href="mailto:heavyhivestudios@gmail.com"
                className="flex items-center gap-4 text-gray-300 hover:text-gold-500 transition-colors group"
                data-testid="contact-email"
              >
                <div className="p-3 bg-gold-500/10 group-hover:bg-gold-500 transition-colors">
                  <Mail className="w-6 h-6 text-gold-500 group-hover:text-black transition-colors" />
                </div>
                <span className="text-lg">heavyhivestudios@gmail.com</span>
              </a>
              
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
                href="https://www.peerspace.com"
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
            <a 
              href="mailto:heavyhivestudios@gmail.com"
              className="text-gray-400 hover:text-gold-500 transition-colors"
              aria-label="Email"
              data-testid="footer-email"
            >
              <Mail className="w-5 h-5" />
            </a>
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
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
