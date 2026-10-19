import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowDown,
  Compass,
  Cpu,
  Bot,
  Layers,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { submitInquiry } from "./lib/supabase.ts";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// CONFIGURATION
// ==========================================
// Primary Cal.com booking link - easily configurable
export const CAL_COM_URL = "https://cal.com/yogitha-kasula-1b65l4/15min";

// ==========================================
// CUSTOM LOGO COMPONENT
// ==========================================
export const NexusLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 28,
}) => (
  <div className={`flex items-center gap-3 select-none ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="Nexus AI Monogram"
    >
      {/* Outer ambient blue glow */}
      <circle cx="16" cy="16" r="14" fill="#0099FF" fillOpacity="0.08" />
      {/* Precision geometric diamond nexus */}
      <rect
        x="6"
        y="16"
        width="14.14"
        height="14.14"
        transform="rotate(-45 6 16)"
        stroke="#0099FF"
        strokeWidth="1.5"
      />
      {/* Connected intelligent nodes */}
      <circle cx="16" cy="6" r="2.2" fill="#FFFFFF" />
      <circle cx="26" cy="16" r="2.2" fill="#0099FF" />
      <circle cx="16" cy="26" r="2.2" fill="#FFFFFF" />
      <circle cx="6" cy="16" r="2.2" fill="#0099FF" />
      <circle cx="16" cy="16" r="2" fill="#0099FF" />
    </svg>
    <div className="flex items-baseline">
      <span className="font-heading font-bold text-lg tracking-[0.16em] text-white">
        NEXUS<span className="text-[#0099FF] font-medium ml-1">AI</span>
      </span>
    </div>
  </div>
);

// ==========================================
// DESKTOP CUSTOM CURSOR COMPONENT
// ==========================================
export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [ringPos, setRingPos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    let targetX = -200;
    let targetY = -200;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest('[role="button"]') ||
          target.closest(".interactive-card"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const smoothRingFollow = () => {
      setRingPos((prev) => {
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16,
        };
      });
      animId = requestAnimationFrame(smoothRingFollow);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    animId = requestAnimationFrame(smoothRingFollow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Subtle Blue Spotlight */}
      <div
        className="fixed pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(0, 153, 255, 0.05) 0%, rgba(0, 85, 255, 0.015) 40%, rgba(0, 0, 0, 0) 70%)",
        }}
        aria-hidden="true"
      />
      {/* Center Blue Dot */}
      <div
        className="fixed pointer-events-none z-50 rounded-full bg-[#0099FF] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? "4px" : "6px",
          height: isHovered ? "4px" : "6px",
          boxShadow: "0 0 10px #0099FF",
        }}
        aria-hidden="true"
      />
      {/* Thin Blue Ring with slight delay */}
      <div
        className="fixed pointer-events-none z-50 rounded-full border border-[#0099FF]/60 -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color] duration-150 ease-out"
        style={{
          left: `${ringPos.x}px`,
          top: `${ringPos.y}px`,
          width: isHovered ? "46px" : "28px",
          height: isHovered ? "46px" : "28px",
          backgroundColor: isHovered ? "rgba(0, 153, 255, 0.08)" : "transparent",
        }}
        aria-hidden="true"
      />
    </>
  );
};

// ==========================================
// CONTINUOUS TYPEWRITER HOOK
// ==========================================
export const useContinuousTypewriter = (
  phrases: string[],
  typeSpeed = 95,
  deleteSpeed = 50,
  holdDuration = 2400
) => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing forward
          const nextLength = displayText.length + 1;
          setDisplayText(currentPhrase.substring(0, nextLength));

          if (nextLength === currentPhrase.length) {
            // Reached end of phrase, pause then start deleting
            setTimeout(() => setIsDeleting(true), holdDuration);
          }
        } else {
          // Deleting backward
          const nextLength = displayText.length - 1;
          setDisplayText(currentPhrase.substring(0, nextLength));

          if (nextLength === 0) {
            // Completely cleared, pause briefly and move to next phrase
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, phrases, typeSpeed, deleteSpeed, holdDuration]);

  return displayText;
};

// ==========================================
// CAL.COM CONSULTATION MODAL
// ==========================================
interface CalModalProps {
  isOpen: boolean;
  onClose: () => void;
  calUrl: string;
}

export const CalBookingModal: React.FC<CalModalProps> = ({ isOpen, onClose, calUrl }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a Consultation with Nexus AI"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[90vh] max-h-[760px] bg-[#0A0D12] border border-white/10 rounded-2xl flex flex-col shadow-2xl shadow-[#0099FF]/15 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0099FF]/10 border border-[#0099FF]/30 flex items-center justify-center text-[#0099FF]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base text-white">
                Book an AI Advisory Session
              </h3>
              <p className="text-xs text-neutral-400 font-light">
                30-minute discovery call with our leadership team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Cal.com iframe container */}
        <div className="flex-1 w-full bg-[#05070A] relative flex flex-col items-center justify-center">
          <iframe
            src={calUrl}
            title="Book a Consultation on Cal.com"
            className="w-full h-full border-0"
            loading="lazy"
          />

          {/* Direct link fallback */}
          <div className="absolute bottom-4 left-6 right-6 pointer-events-none flex justify-center">
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-2 text-xs text-neutral-300 hover:text-white bg-black/90 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md shadow-lg transition-colors"
            >
              <span>Open in new window</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#0099FF]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: NEXUS AI
// ==========================================
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCalOpen, setIsCalOpen] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Hero typewriter phrases - continuous loop
  const typewriterPhrases = [
    "designed simply.",
    "built for execution.",
    "engineered to scale.",
  ];
  const typedText = useContinuousTypewriter(typewriterPhrases);

  // References for GSAP ScrollTrigger
  const heroRef = useRef<HTMLDivElement>(null);
  const largeTypographyRef = useRef<HTMLDivElement>(null);
  const largeTextRef = useRef<HTMLHeadingElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);

  // Scroll detection for fixed navbar state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations with ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Large typography scroll reveal
      if (largeTextRef.current && largeTypographyRef.current) {
        gsap.fromTo(
          largeTextRef.current,
          { opacity: 0.25, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: largeTypographyRef.current,
              start: "top 80%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }

      // Services cards stagger entrance
      if (servicesRef.current) {
        gsap.from(".service-card", {
          opacity: 0,
          y: 35,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      // Approach steps stagger entrance
      if (approachRef.current) {
        gsap.from(".approach-step", {
          opacity: 0,
          y: 30,
          stagger: 0.18,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: approachRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Subtle Mouse Parallax on Hero section
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight } = currentTarget;
    const x = (clientX / clientWidth - 0.5) * 18;
    const y = (clientY / clientHeight - 0.5) * 18;
    setParallaxOffset({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  // Lead Generation Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    serviceType: "AI Strategy",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim()) {
      errors.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid business email address.";
    }
    if (!formData.company.trim()) errors.company = "Company name is required.";
    if (!formData.message.trim()) errors.message = "Please tell us about your project.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus("loading");
    setSubmitError(null);

    try {
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        serviceType: formData.serviceType,
        message: formData.message,
      });

      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        serviceType: "AI Strategy",
        message: "",
      });
      setFormErrors({});
    } catch (err: unknown) {
      console.error("Supabase submission error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to record inquiry in database. Please try again.";
      setSubmitError(message);
      setFormStatus("error");
    }
  };

  // Four exact services
  const services = [
    {
      id: "01",
      icon: <Compass className="w-6 h-6 text-[#0099FF]" />,
      title: "AI Strategy",
      description: "Find practical opportunities where AI can create business value.",
      details:
        "Comprehensive AI roadmap assessments, feasibility evaluations, ROI modeling, and governance architectures tailored to real organizational structure.",
    },
    {
      id: "02",
      icon: <Cpu className="w-6 h-6 text-[#0099FF]" />,
      title: "AI Automation",
      description: "Turn repetitive processes into intelligent workflows.",
      details:
        "End-to-end automation pipelines that replace manual bottlenecks, minimize latency, and seamlessly connect disparate enterprise systems.",
    },
    {
      id: "03",
      icon: <Bot className="w-6 h-6 text-[#0099FF]" />,
      title: "AI Agents",
      description: "Build AI systems that can reason, act and execute.",
      details:
        "Autonomous agentic systems equipped with tool use, multi-step problem solving, structured validation, and human-in-the-loop oversight.",
    },
    {
      id: "04",
      icon: <Layers className="w-6 h-6 text-[#0099FF]" />,
      title: "AI Solutions",
      description: "Design and implement AI around your real business needs.",
      details:
        "Custom model fine-tuning, retrieval-augmented generation (RAG), vector databases, and resilient software backends built for production.",
    },
  ];

  // Four approach steps
  const approachSteps = [
    {
      number: "01",
      title: "Discover",
      description: "Understand your business and identify opportunities.",
    },
    {
      number: "02",
      title: "Strategize",
      description: "Define where AI can actually create value.",
    },
    {
      number: "03",
      title: "Build",
      description: "Design and implement the right solution.",
    },
    {
      number: "04",
      title: "Scale",
      description: "Improve, automate and expand what works.",
    },
  ];

  const marqueeItems = [
    "AI STRATEGY",
    "AUTOMATION",
    "AI AGENTS",
    "GENERATIVE AI",
    "AI TRANSFORMATION",
    "INTELLIGENT SYSTEMS",
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-[#0099FF]/30 selection:text-white">
      {/* Desktop Custom Cursor with Spotlight */}
      <CustomCursor />

      {/* Subtle Atmospheric Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Ambient Blue Glows (Brand colors only: #0099FF & #0055FF) */}
      <div
        className="fixed -top-40 left-1/4 w-[650px] h-[650px] bg-[#0099FF]/8 rounded-full blur-[160px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-40 right-1/4 w-[600px] h-[600px] bg-[#0055FF]/8 rounded-full blur-[170px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ==========================================
          NAVBAR (Sticky / Fixed)
          ========================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/60"
            : "py-6 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left: Nexus AI Logo */}
          <a
            href="#"
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099FF] rounded-lg"
            aria-label="Nexus AI Home"
          >
            <NexusLogo />
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a
              href="#services"
              className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              Services
            </a>
            <a
              href="#approach"
              className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              Approach
            </a>
            <a
              href="#contact"
              className="hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
            >
              Contact
            </a>
          </nav>

          {/* Right: Book a Consultation CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsCalOpen(true)}
              className="group relative inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-white/5 border border-white/20 rounded-full hover:border-[#0099FF] hover:bg-[#0099FF]/10 hover:shadow-[0_0_24px_rgba(0,153,255,0.35)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
            >
              <span>Book a Consultation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0099FF] ml-2 group-hover:scale-125 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#0099FF] rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Animated Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pt-4 pb-6 bg-black/95 backdrop-blur-xl border-b border-white/10 animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-4 text-base font-medium text-neutral-300">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#0099FF] transition-colors"
              >
                Services
              </a>
              <a
                href="#approach"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#0099FF] transition-colors"
              >
                Approach
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#0099FF] transition-colors"
              >
                Contact
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCalOpen(true);
                }}
                className="mt-2 w-full text-center py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#0099FF] hover:bg-[#0088EE] rounded-xl transition-colors shadow-lg shadow-[#0099FF]/25"
              >
                Book a Consultation
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ==========================================
          HERO SECTION (~100vh)
          ========================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden z-10"
      >
        {/* Full Hero Futuristic Robot Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
            style={{
              filter: "contrast(1.06) brightness(0.88)",
            }}
          >
            <source src="https://www.pexels.com/download/video/8084614/" type="video/mp4" />
          </video>

          {/* Nexus Blue Light Treatment (Illuminating the robot with #0099FF blue light while preserving mechanical detail) */}
          <div
            className="absolute inset-0 bg-[#0099FF]/15 mix-blend-color pointer-events-none"
            aria-hidden="true"
          />

          {/* Subtle Readability Scrims (Robot stays clearly visible; no heavy blur or opaque blocking) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/70 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.65)_90%)] pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Hero Foreground Content with Subtle Mouse Parallax */}
        <div
          className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
          }}
        >
          {/* Kicker label */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0099FF] shadow-[0_0_8px_#0099FF]" />
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-300 font-medium">
              Enterprise AI Consulting
            </span>
          </div>

          {/* Main Heading with Continuous Typewriter Animation */}
          <h1 className="font-heading font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] text-white max-w-4xl min-h-[140px] sm:min-h-[180px] md:min-h-[220px]">
            Intelligence,
            <br />
            <span className="text-white relative">
              {typedText}
              {/* Blinking #0099FF cursor */}
              <span
                className="inline-block w-[3px] h-[0.82em] bg-[#0099FF] ml-1.5 align-baseline animate-pulse shadow-[0_0_12px_#0099FF]"
                aria-hidden="true"
              />
            </span>
          </h1>

          {/* Subtitle Copy */}
          <p className="mt-8 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed">
            AI strategy, automation and solutions for businesses ready to move forward.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsCalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0099FF] text-white font-medium text-sm tracking-wide shadow-lg shadow-[#0099FF]/25 hover:bg-[#0088EE] hover:shadow-[#0099FF]/40 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/15 hover:border-white/25 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#0099FF]"
            >
              <span>Explore Services</span>
              <ArrowDown className="w-4 h-4 text-[#0099FF]" />
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          INFINITE MARQUEE SECTION
          ========================================== */}
      <section className="relative z-10 py-5 bg-black border-y border-white/10 overflow-hidden select-none">
        <div className="animate-marquee">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-8 px-4 shrink-0">
              {marqueeItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-8">
                  <span className="font-heading text-xs sm:text-sm font-semibold tracking-[0.25em] text-neutral-400 hover:text-white transition-colors">
                    {item}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0099FF] shadow-[0_0_8px_#0099FF]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          SERVICES SECTION (#services)
          ========================================== */}
      <section
        id="services"
        ref={servicesRef}
        className="relative z-10 py-28 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#0099FF] font-semibold">
              Capabilities
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
              What we do.
            </h2>
          </div>
          <p className="text-neutral-400 text-sm md:text-base max-w-md font-light leading-relaxed">
            Delivering measurable AI engineering and enterprise implementation built around real
            organizational workflows.
          </p>
        </div>

        {/* Exactly 4 Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card interactive-card group relative p-8 md:p-10 rounded-2xl bg-[#0A0D12] border border-white/10 hover:border-[#0099FF]/40 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,153,255,0.09)] hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Subtle top edge glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0099FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#0099FF]/40 group-hover:bg-[#0099FF]/10 group-hover:scale-105 transition-all duration-300">
                    {service.icon}
                  </div>
                  <span className="font-heading text-xs font-semibold tracking-widest text-neutral-500 group-hover:text-[#0099FF] transition-colors">
                    {service.id}
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-semibold text-white mb-3 tracking-tight group-hover:text-[#0099FF] transition-colors">
                  {service.title}
                </h3>

                <p className="text-neutral-200 text-base leading-relaxed font-normal mb-3">
                  {service.description}
                </p>

                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-light">
                  {service.details}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-neutral-400 group-hover:text-white transition-colors">
                <button
                  onClick={() => setIsCalOpen(true)}
                  className="inline-flex items-center gap-2 hover:text-[#0099FF] transition-colors focus:outline-none"
                >
                  <span>Consult our specialists</span>
                  <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-[#0099FF] group-hover:translate-x-1 transition-all duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          LARGE TYPOGRAPHY STATEMENT
          ========================================== */}
      <section
        ref={largeTypographyRef}
        className="relative z-10 py-32 md:py-40 px-6 md:px-12 border-y border-white/5 bg-black/60 backdrop-blur-sm overflow-hidden"
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#0099FF] font-semibold mb-6">
            Core Philosophy
          </p>
          <h2
            ref={largeTextRef}
            className="font-heading font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight leading-[1.05] text-white"
          >
            Complex technology.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#0099FF]">
              Simple outcomes.
            </span>
          </h2>
        </div>
      </section>

      {/* ==========================================
          APPROACH SECTION (#approach)
          ========================================== */}
      <section
        id="approach"
        ref={approachRef}
        className="relative z-10 py-28 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <div className="mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#0099FF] font-semibold">
            Methodology
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
            How we work.
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-lg mt-3 font-light">
            A disciplined, four-phase delivery methodology designed to minimize technical risk and
            maximize practical business impact.
          </p>
        </div>

        {/* Desktop: Horizontal Layout with Connecting Lines */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div
            className="absolute top-6 left-12 right-12 h-px bg-gradient-to-r from-white/10 via-[#0099FF]/35 to-white/10 -z-1"
            aria-hidden="true"
          />

          {approachSteps.map((step) => (
            <div
              key={step.number}
              className="approach-step relative flex flex-col pt-2 group"
            >
              {/* Step indicator node */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#0A0D12] border border-[#0099FF]/40 flex items-center justify-center font-heading text-sm font-bold text-[#0099FF] shadow-[0_0_16px_rgba(0,153,255,0.2)] group-hover:border-[#0099FF] group-hover:scale-105 transition-all duration-300">
                  {step.number}
                </div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-white tracking-tight mb-3 group-hover:text-[#0099FF] transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile & Tablet: Vertical Timeline with Faded Background Numbers */}
        <div className="lg:hidden flex flex-col gap-10 relative pl-4 border-l border-white/10">
          {approachSteps.map((step) => (
            <div key={step.number} className="approach-step relative pl-6">
              {/* Timeline marker */}
              <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-[#0099FF] ring-4 ring-black" />

              {/* Faded Background Number */}
              <span className="absolute -top-7 right-2 font-heading font-bold text-7xl text-white/[0.04] pointer-events-none select-none">
                {step.number}
              </span>

              <span className="text-xs font-semibold text-[#0099FF] tracking-wider uppercase">
                Step {step.number}
              </span>
              <h3 className="font-heading text-2xl font-semibold text-white mt-1 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          LEAD GENERATION / CONTACT FORM (#contact)
          ========================================== */}
      <section
        id="contact"
        className="relative z-10 py-28 px-6 md:px-12 bg-black border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#0099FF] font-semibold">
              Get in touch
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
              Tell us what you're building.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-4 max-w-lg mx-auto font-light">
              Have an AI idea, challenge or process you want to improve? Tell us about it.
            </p>
          </div>

          <div className="bg-[#0A0D12] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
            {formStatus === "success" ? (
              <div className="py-16 text-center flex flex-col items-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-16 h-16 text-[#0099FF] mb-4" />
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                  Thanks — we'll be in touch soon.
                </h3>
                <p className="text-neutral-400 max-w-md text-sm mt-1">
                  Our principal consultant will review your specifications and follow up within 24
                  hours.
                </p>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="mt-8 text-xs uppercase tracking-wider font-semibold text-[#0099FF] hover:underline focus:outline-none"
                >
                  Send another inquiry &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="form-name"
                      className="block text-xs uppercase tracking-wider font-medium text-neutral-300 mb-2"
                    >
                      Name <span className="text-[#0099FF]">*</span>
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                        formErrors.name ? "border-red-500" : "border-white/10"
                      } text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-colors`}
                    />
                    {formErrors.name && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Work Email Field */}
                  <div>
                    <label
                      htmlFor="form-email"
                      className="block text-xs uppercase tracking-wider font-medium text-neutral-300 mb-2"
                    >
                      Work Email <span className="text-[#0099FF]">*</span>
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                        formErrors.email ? "border-red-500" : "border-white/10"
                      } text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-colors`}
                    />
                    {formErrors.email && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Company Field */}
                  <div>
                    <label
                      htmlFor="form-company"
                      className="block text-xs uppercase tracking-wider font-medium text-neutral-300 mb-2"
                    >
                      Company <span className="text-[#0099FF]">*</span>
                    </label>
                    <input
                      id="form-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Enterprises"
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                        formErrors.company ? "border-red-500" : "border-white/10"
                      } text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-colors`}
                    />
                    {formErrors.company && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formErrors.company}
                      </p>
                    )}
                  </div>

                  {/* Phone Field (Optional) */}
                  <div>
                    <label
                      htmlFor="form-phone"
                      className="block text-xs uppercase tracking-wider font-medium text-neutral-300 mb-2"
                    >
                      Phone <span className="text-neutral-500 lowercase">(optional)</span>
                    </label>
                    <input
                      id="form-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-colors"
                    />
                  </div>
                </div>

                {/* What are you looking for? */}
                <div>
                  <label
                    htmlFor="form-service"
                    className="block text-xs uppercase tracking-wider font-medium text-neutral-300 mb-2"
                  >
                    What are you looking for?
                  </label>
                  <select
                    id="form-service"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-colors"
                  >
                    <option value="AI Strategy">AI Strategy & Feasibility</option>
                    <option value="AI Automation">AI Workflow Automation</option>
                    <option value="AI Agents">Autonomous AI Agents</option>
                    <option value="AI Solutions">Custom AI Solutions & Infrastructure</option>
                    <option value="Enterprise Architecture">Enterprise AI Architecture</option>
                  </select>
                </div>

                {/* Message / Project details */}
                <div>
                  <label
                    htmlFor="form-message"
                    className="block text-xs uppercase tracking-wider font-medium text-neutral-300 mb-2"
                  >
                    Message / Project details <span className="text-[#0099FF]">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your objectives, data challenges, or processes you want to automate..."
                    className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                      formErrors.message ? "border-red-500" : "border-white/10"
                    } text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-colors resize-y`}
                  />
                  {formErrors.message && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.message}
                    </p>
                  )}
                </div>

                {/* Database Submission Error Alert */}
                {formStatus === "error" && submitError && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-neutral-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-200">Unable to record inquiry</p>
                      <p className="text-neutral-400 text-xs mt-0.5">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-[#0099FF] text-white font-medium text-sm tracking-wide shadow-lg shadow-[#0099FF]/20 hover:bg-[#0088EE] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
                >
                  {formStatus === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          FINAL CTA SECTION
          ========================================== */}
      <section className="relative z-10 py-32 px-6 md:px-12 bg-gradient-to-b from-black to-[#0A0D12] border-t border-white/10 overflow-hidden">
        {/* Subtle decorative blue radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-[#0099FF]/10 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white mb-6">
            Ready to make AI useful?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-2xl font-light mb-10 leading-relaxed">
            Let's find where AI can make the biggest difference in your business.
          </p>
          <button
            onClick={() => setIsCalOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0099FF] text-white font-medium text-sm tracking-wide shadow-xl shadow-[#0099FF]/30 hover:bg-[#0088EE] hover:shadow-[#0099FF]/50 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0099FF]"
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="relative z-10 py-12 px-6 md:px-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <NexusLogo size={24} />
            <p className="text-xs text-neutral-400 font-light mt-1">
              Intelligence, designed simply.
            </p>
          </div>

          {/* Footer Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-neutral-400">
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <a href="#approach" className="hover:text-white transition-colors">
              Approach
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <button
              onClick={() => setIsCalOpen(true)}
              className="text-[#0099FF] hover:text-[#0088EE] transition-colors focus:outline-none"
            >
              Book a Consultation
            </button>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-neutral-400 font-light">
            &copy; 2026 Nexus AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ==========================================
          CAL.COM BOOKING MODAL
          ========================================== */}
      <CalBookingModal
        isOpen={isCalOpen}
        onClose={() => setIsCalOpen(false)}
        calUrl={CAL_COM_URL}
      />
    </div>
  );
}
