import React, { useState, useEffect, useCallback } from "react";
import {
  Phone,
  PhoneCall,
  MapPin,
  Star,
  Check,
  X,
  Menu,
  ChevronLeft,
  Clock,
  ShieldCheck,
  Award,
  Gift,
  Compass,
  Plane,
  Crown,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  REVIEWS,
  SERVICES,
  ABOUT_TEXT,
  OWNER_PHONE,
  OWNER_PHONE_DISPLAY,
  OWNER_WHATSAPP,
  OWNER_LOCATION,
} from "@shared/const";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const CURRENT_YEAR = new Date().getFullYear();

const WA_SVG_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function WhatsAppIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d={WA_SVG_PATH}/></svg>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Gift: <Gift className="h-6 w-6" aria-hidden="true" />,
  Compass: <Compass className="h-6 w-6" aria-hidden="true" />,
  Plane: <Plane className="h-6 w-6" aria-hidden="true" />,
  Crown: <Crown className="h-6 w-6" aria-hidden="true" />,
  Users: <Users className="h-6 w-6" aria-hidden="true" />,
};

const SUPABASE_IMG = (name: string) =>
  `https://nlwkksivgubcgfzqivcs.supabase.co/storage/v1/object/public/site-images/${name}`;

// Bus images — the golden bus photos must stay as-is (brand asset)
const BUS_HERO_IMG = "/manus-storage/bus-front-nature_6d1794ae.jpeg";
const BUS_SIDE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663699036625/jNBxQdxcxRHq8VPq64unqC/bus-side-nature-clean-bzkXQoheuinAbjgqqiK8ar.webp";
const BUS_INTERIOR_IMG = "/manus-storage/bus-interior_17f8298e.jpeg";
const BUS_PANORAMA_IMG = SUPABASE_IMG("bus-jerusalem-panorama.jpeg");
const BUS_LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663699036625/jNBxQdxcxRHq8VPq64unqC/bus-logo-enhanced-DoiD8pdJuAM3Pu5JMuuSsu.webp";
const BUS_FRONT_ANGLE_IMG = "/manus-storage/bus-front-angle_6bee6973.jpg";

const WA_LINK = (text: string) =>
  `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`;

const HERO_STATS = [
  { value: "56", label: "מקומות ישיבה", ariaLabel: "56 מקומות ישיבה" },
  { value: "100%", label: "עמידה בזמנים", ariaLabel: "100 אחוז עמידה בזמנים" },
  { value: "5.0", label: "דירוג לקוחות", ariaLabel: "דירוג 5 מתוך 5" },
];

const MARQUEE_DESTINATIONS = [
  "הסעות לחתונות",
  "נתב״ג",
  "ירושלים",
  "תל אביב והמרכז",
  "טיולי חברה",
  "בית שמש",
  "אירועים ושמחות",
  "הצפון",
  "ים המלח ואילת",
  "קבוצות קבועות",
];

const BUS_FEATURES = ["56 מושבים מרווחים", "מיזוג אוויר מפוצל", "מערכת מולטימדיה", "תא מטען ענק"];

const ROUTES = [
  { from: "ירושלים", to: "ראשון לציון", tag: "חתונות", popular: true },
  { from: "ירושלים", to: "גוש דן ותל אביב", tag: "אירועים", popular: true },
  { from: "ירושלים", to: "נתב״ג", tag: "טיסות", popular: true },
  { from: "ירושלים", to: "צפון הארץ", tag: "טיולים", popular: false },
  { from: "ירושלים", to: "אילת והדרום", tag: "טיולים", popular: false },
  { from: "בית שמש", to: "ירושלים", tag: "קבוצות קבועות", popular: false },
];

const FLEET = [
  {
    name: "אוטובוס 56 מקומות",
    capacity: "56",
    capacityLabel: "מקומות",
    img: BUS_HERO_IMG,
    features: ["56 כיסאות עור מרווחים", "מיזוג אוויר עוצמתי", "מערכת שמע מתקדמת", "תא מטען גדול"],
    best: "חתונות · טיולים · קבוצות גדולות · נתב״ג",
  },
  {
    name: "אוטובוס עד 60 מקומות",
    capacity: "60",
    capacityLabel: "מקומות",
    img: BUS_PANORAMA_IMG,
    features: ["רכבים נוספים לקבוצות גדולות", "תיאום עם נהגים מקצועיים", "פתרון לכל גודל אירוע", "זמינות גבוהה"],
    best: "אירועים גדולים · כנסים · סיורי קבוצות",
  },
];

const TRIP_TYPES = ["חתונה", "אירוע", "טיול", "נתב״ג", "קבוצה קבועה", "אחר"];

const NAV_LINKS = [
  { href: "#about", label: "הכירו את אבי" },
  { href: "#services", label: "שירותים" },
  { href: "#routes", label: "מסלולים" },
  { href: "#fleet", label: "הצי" },
  { href: "#reviews", label: "ביקורות" },
];

function SectionKicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-px w-10 ${dark ? "bg-gold" : "bg-gold-deep"}`} aria-hidden="true"></span>
      <span className={`text-sm font-bold tracking-widest ${dark ? "text-gold" : "text-gold-deep"}`}>{children}</span>
    </div>
  );
}

export default function Home() {
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Booking form
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingOrigin, setBookingOrigin] = useState("");
  const [bookingDestination, setBookingDestination] = useState("");
  const [bookingPassengers, setBookingPassengers] = useState("");
  const [bookingTripType, setBookingTripType] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("פרטיך התקבלו! אבי יחזור אליך בהקדם.");
      resetForm();
    },
    onError: () => {
      toast.error("אירעה שגיאה. נסו שוב או התקשרו ישירות.");
    },
  });

  const resetForm = () => {
    setBookingName("");
    setBookingPhone("");
    setBookingEmail("");
    setBookingDate("");
    setBookingOrigin("");
    setBookingDestination("");
    setBookingPassengers("");
    setBookingTripType("");
    setBookingNotes("");
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingName.trim().length < 2) {
      toast.error("אנא הזינו שם מלא");
      return;
    }
    if (!bookingPhone.trim() || bookingPhone.trim().length < 9) {
      toast.error("אנא הזינו מספר טלפון תקין");
      return;
    }
    const composedNotes = [
      bookingTripType && `סוג נסיעה: ${bookingTripType}`,
      bookingOrigin.trim() && `מוצא: ${bookingOrigin.trim()}`,
      bookingDestination.trim() && `יעד: ${bookingDestination.trim()}`,
      bookingPassengers && `נוסעים: ${bookingPassengers}`,
      bookingNotes.trim(),
    ].filter(Boolean).join(" | ");

    createBooking.mutate({
      name: bookingName.trim(),
      phone: bookingPhone.trim(),
      email: bookingEmail.trim() || undefined,
      tripDate: bookingDate || undefined,
      notes: composedNotes || undefined,
    });
  };

  const renderIcon = useCallback((iconName: string) =>
    ICON_MAP[iconName] ?? ICON_MAP.Compass, []);

  useEffect(() => {
    if (!showAccessibilityModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAccessibilityModal(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showAccessibilityModal]);

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink" dir="rtl">

      {/* Skip to main content - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[200] focus:bg-gold focus:text-ink-deep focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        דלג לתוכן הראשי
      </a>

      {/* Accessibility Modal */}
      {showAccessibilityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-deep/70 backdrop-blur-sm"
            onClick={() => setShowAccessibilityModal(false)}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-lg bg-cream rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 text-right"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-modal-title"
          >
            <button
              onClick={() => setShowAccessibilityModal(false)}
              className="absolute top-4 left-4 text-stone-400 hover:text-ink transition-colors cursor-pointer rounded"
              aria-label="סגור הצהרת נגישות"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <h2 id="accessibility-modal-title" className="font-display text-xl font-bold text-ink mb-4">הצהרת נגישות</h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>אתר זה שואף לעמוד בדרישות תקן הנגישות הישראלי (WCAG 2.1 רמה AA) ולהנגיש את התכנים לכלל המשתמשים, לרבות אלו שעושים שימוש בטכנולוגיות עזר לנגישות.</p>
              <p>האתר מתוחזק בשפה העברית (כיוון ימין לשמאל), ניתן לנווט באמצעות מקלדת, כל התמונות כוללות תיאור חלופי (alt), וכל הטפסים מסומנים כראוי.</p>
              <p>
                אם נתקלתם בבעיית נגישות, נא צרו קשר בטלפון{" "}
                <a href={`tel:${OWNER_PHONE}`} className="text-gold-deep underline font-bold">{OWNER_PHONE_DISPLAY}</a>
                {" "}או בוואצאפ ונשתדל לסייע בהקדם האפשרי.
              </p>
            </div>
            <button
              onClick={() => setShowAccessibilityModal(false)}
              className="mt-6 w-full bg-ink hover:bg-ink-deep text-cream font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {/* Top utility strip */}
      <div className="bg-ink-deep text-cream/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span className="hidden sm:inline">{OWNER_LOCATION}</span>
              <span className="sm:hidden">מבשרת ציון</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>זמינות לתיאום 24/6</span>
            </span>
          </div>
          <a href={`tel:${OWNER_PHONE}`} className="flex items-center gap-1.5 font-bold text-gold-soft hover:text-gold transition-colors" aria-label={`חייגו לאבי ורדי ${OWNER_PHONE_DISPLAY}`}>
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span dir="ltr">{OWNER_PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>

      {/* Header / Navigation */}
      <header role="banner" className="sticky top-0 z-50 w-full border-b border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <a href="#main-content" className="flex items-center gap-3 shrink-0">
            <div className="rounded-lg overflow-hidden border border-gold/40 w-11 h-11 shadow-sm">
              <img src={BUS_LOGO_IMG} alt="לוגו אבי ורדי הסעות" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <span className="block font-display text-2xl font-black text-ink">אבי ורדי</span>
              <span className="block text-[11px] font-bold text-gold-deep tracking-[0.2em]">הסעות פרטיות</span>
            </div>
          </a>

          <nav aria-label="ניווט ראשי" className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-ink transition-colors rounded px-1">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#booking"
              className="hidden sm:inline-flex items-center gap-2 bg-ink hover:bg-ink-deep text-cream font-bold text-sm px-5 py-2.5 rounded-lg shadow-md transition-all active:scale-[0.97]"
            >
              <span>הזמנת נסיעה</span>
              <ChevronLeft className="h-4 w-4 text-gold" aria-hidden="true" />
            </a>
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg border border-ink/15 text-ink cursor-pointer"
              aria-label={mobileNavOpen ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileNavOpen && (
          <nav aria-label="ניווט נייד" className="lg:hidden border-t border-ink/10 bg-cream px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="block py-2.5 px-2 rounded-lg font-medium text-ink hover:bg-cream-dark transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#booking"
                  onClick={() => setMobileNavOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 bg-ink text-cream font-bold py-3 rounded-lg"
                >
                  <span>הזמנת נסיעה</span>
                  <ChevronLeft className="h-4 w-4 text-gold" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main id="main-content">

        {/* Hero */}
        <section aria-label="ראשי - שירות הסעות אבי ורדי" className="relative overflow-hidden bg-cream">
          {/* Decorative dotted route line */}
          <svg
            className="absolute inset-x-0 top-10 w-full h-64 text-ink/15 pointer-events-none hidden lg:block"
            viewBox="0 0 1200 200"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M-20 170 C 250 40, 480 220, 720 90 S 1100 30, 1230 110" stroke="currentColor" strokeWidth="2" className="route-dashed" />
            <circle cx="240" cy="103" r="5" fill="#d4a226" />
            <circle cx="720" cy="90" r="5" fill="#d4a226" />
            <circle cx="1080" cy="55" r="5" fill="#d4a226" />
          </svg>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Text — right side */}
            <div className="lg:col-span-6 text-right">
              <div className="inline-flex items-center gap-2 border border-gold/50 bg-gold/10 px-4 py-1.5 rounded-full mb-7">
                <Star className="h-3.5 w-3.5 text-gold-deep fill-gold" aria-hidden="true" />
                <span className="text-xs font-bold text-gold-deep">הסעות פרטיות · ירושלים והמרכז · לכל הארץ</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-ink leading-[1.05] mb-7">
                אתם חוגגים.
                <br />
                <span className="text-gold-deep">אני נוהג.</span>
              </h1>

              <p className="text-lg text-stone-600 max-w-xl mb-9 leading-relaxed">
                אני אבי ורדי — נהג פרטי עם אוטובוס מפואר של 56 מקומות. בלי מוקדים, בלי חברות ענק:
                אתם מדברים ישירות עם הנהג שיגיע אליכם בזמן, לחתונה, לטיול או לטיסה.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <a
                  href="#booking"
                  className="inline-flex justify-center items-center gap-2 bg-gold hover:bg-gold-soft text-ink-deep font-extrabold text-base px-8 py-4 rounded-lg shadow-lg shadow-gold/25 transition-all active:scale-[0.97] hover:-translate-y-0.5"
                >
                  <span>הזמינו נסיעה</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={WA_LINK("שלום אבי, אשמח לקבל פרטים לגבי הסעה.")}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="שלחו וואצאפ לאבי ורדי"
                  className="inline-flex justify-center items-center gap-2 bg-transparent hover:bg-ink hover:text-cream text-ink font-bold text-base px-8 py-4 rounded-lg border-2 border-ink transition-all hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>דברו איתי בוואצאפ</span>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-ink/10 max-w-md" role="list" aria-label="נתוני אמון">
                {HERO_STATS.map(({ value, label, ariaLabel }) => (
                  <div key={label} className="flex flex-col" role="listitem">
                    <span className="font-display text-3xl font-black text-ink" aria-label={ariaLabel}>{value}</span>
                    <span className="text-xs text-stone-500 font-medium mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image — left side */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-gold/40 pointer-events-none" aria-hidden="true"></div>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src={BUS_HERO_IMG}
                  alt="האוטובוס המוזהב של אבי ורדי — 56 מקומות, הסעות מירושלים"
                  className="w-full h-[340px] sm:h-[420px] lg:h-[520px] object-cover"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/60 via-transparent to-transparent" aria-hidden="true"></div>
                <div className="absolute bottom-5 right-5 left-5 flex items-end justify-between gap-3">
                  <div className="bg-cream/95 backdrop-blur rounded-xl px-5 py-3 shadow-lg">
                    <span className="block font-display text-lg font-black text-ink leading-tight">האוטובוס המוזהב</span>
                    <span className="block text-xs font-bold text-gold-deep">56 מקומות · מפואר וממוזג</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-ink-deep/80 backdrop-blur text-cream rounded-xl px-4 py-3">
                    <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                    <span className="text-xs font-bold">רישיון משרד התחבורה</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Destinations marquee */}
        <div className="bg-ink text-cream border-y border-gold/20 py-3.5 overflow-hidden" aria-hidden="true">
          <div className="marquee-track flex w-max gap-0">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center shrink-0">
                {MARQUEE_DESTINATIONS.map((dest) => (
                  <span key={`${copy}-${dest}`} className="flex items-center text-sm font-bold tracking-wide whitespace-nowrap">
                    <span className="px-5">{dest}</span>
                    <span className="text-gold">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <span className="sr-only">יעדים נפוצים: {MARQUEE_DESTINATIONS.join(", ")}</span>
        </div>

        {/* About */}
        <section id="about" aria-labelledby="about-heading" className="py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              <div className="lg:col-span-7 text-right order-2 lg:order-1">
                <SectionKicker>הכירו את אבי</SectionKicker>
                <h2 id="about-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink mt-4 mb-7 leading-tight">
                  נהג אחד. אוטובוס אחד.
                  <br />
                  <span className="text-gold-deep">סטנדרט אחר לגמרי.</span>
                </h2>
                <div className="space-y-5 text-stone-600 leading-relaxed text-base">
                  {ABOUT_TEXT.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mt-9 pt-8 border-t border-ink/10">
                  <div className="flex items-start gap-3">
                    <div className="bg-gold/15 p-2.5 rounded-lg text-gold-deep shrink-0">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block font-bold text-ink text-sm">מיקום וזמינות</span>
                      <span className="text-sm text-stone-500">{OWNER_LOCATION} — משרת את ירושלים, בית שמש וכל הארץ</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-gold/15 p-2.5 rounded-lg text-gold-deep shrink-0">
                      <Award className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block font-bold text-ink text-sm">אוטובוס מפואר</span>
                      <span className="text-sm text-stone-500">56 מקומות ישיבה, נקי ומתוחזק ברמה הגבוהה ביותר</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={BUS_SIDE_IMG}
                      alt="האוטובוס של אבי ורדי מהצד — שירות הסעות ירושלים"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-5 grid grid-cols-[1fr_auto] gap-5 items-stretch">
                    <div className="rounded-2xl overflow-hidden shadow-lg hover-lift">
                      <img
                        src={BUS_FRONT_ANGLE_IMG}
                        alt="האוטובוס של אבי ורדי — מבט קדמי"
                        className="w-full h-44 object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="bg-ink text-cream rounded-2xl px-5 py-4 flex flex-col items-center justify-center text-center shadow-lg">
                      <ShieldCheck className="h-7 w-7 text-gold mb-2" aria-hidden="true" />
                      <span className="text-xs font-bold text-gold leading-tight">אמינות<br />ובטיחות</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Services — numbered editorial list */}
        <section id="services" aria-labelledby="services-heading" className="py-20 md:py-24 bg-cream-dark border-y border-ink/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-14 text-right">
              <SectionKicker>השירותים שלי</SectionKicker>
              <h2 id="services-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink mt-4 mb-5 leading-tight">
                לאן שצריך, מתי שצריך
              </h2>
              <p className="text-stone-600 leading-relaxed">
                הסעות לחתונות, טיולים, נתב״ג ואירועים — מירושלים והסביבה, בהתאמה אישית מלאה,
                עם דגש על נוחות, בטיחות ושירות ללא פשרות.
              </p>
            </div>

            <ul className="border-t border-ink/10">
              {SERVICES.map((service, i) => (
                <li key={service.id} className="border-b border-ink/10">
                  <div className="group grid grid-cols-[auto_auto_1fr] lg:grid-cols-[80px_56px_1fr_auto] items-start lg:items-center gap-x-5 gap-y-3 py-7 px-2 sm:px-4 hover:bg-white/70 rounded-lg transition-colors">
                    <span className="font-display text-2xl lg:text-3xl font-black text-gold/80 leading-none pt-1 lg:pt-0" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="bg-ink text-gold rounded-xl w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shrink-0">
                      {renderIcon(service.icon)}
                    </span>
                    <div className="col-span-3 lg:col-span-1 text-right">
                      <h3 className="font-display text-xl font-black text-ink mb-1.5">{service.title}</h3>
                      <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">{service.description}</p>
                    </div>
                    <a
                      href="#booking"
                      className="col-span-3 lg:col-span-1 justify-self-start lg:justify-self-end inline-flex items-center gap-1.5 text-sm font-bold text-gold-deep hover:text-ink transition-colors rounded"
                      aria-label={`הזמנה — ${service.title}`}
                    >
                      <span>לפרטים והזמנה</span>
                      <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bus interior showcase */}
            <div className="mt-16 bg-ink rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 text-right text-cream flex flex-col justify-center">
                <SectionKicker dark>חוויית נסיעה VIP</SectionKicker>
                <h3 className="font-display text-2xl sm:text-3xl font-black mt-3 mb-4">
                  הצצה אל תוך האוטובוס המפואר
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-7">
                  כדי להבטיח לכם את הנסיעה הנעימה ביותר, האוטובוס מצויד ב-56 מושבים מפנקים ומרווחים,
                  מערכת מיזוג אוויר עוצמתית, תאורה נעימה ומערכת שמע מתקדמת.
                  הכל נשמר ברמת ניקיון מוקפדת — לפני כל נסיעה.
                </p>
                <div className="flex flex-wrap gap-3">
                  {BUS_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-2 rounded-lg text-xs font-bold text-gold-soft">
                      <Check className="h-4 w-4 text-gold" aria-hidden="true" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 h-64 lg:h-auto min-h-[320px]">
                <img
                  src={BUS_INTERIOR_IMG}
                  alt="פנים האוטובוס של אבי ורדי — 56 מושבים מרווחים וממוזגים"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Routes — departure board */}
        <section id="routes" aria-labelledby="routes-heading" className="py-20 md:py-24 bg-ink text-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 text-right">
              <div>
                <SectionKicker dark>לוח מסלולים</SectionKicker>
                <h2 id="routes-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-cream mt-4 leading-tight">
                  מירושלים לכל הארץ
                </h2>
              </div>
              <p className="text-stone-400 max-w-md text-sm leading-relaxed">
                המסלולים המבוקשים ביותר — וכל מסלול אחר בתיאום אישי. המחיר נקבע לפי מרחק, שעות והמתנה.
              </p>
            </div>

            <div className="border border-cream/15 rounded-2xl overflow-hidden divide-y divide-cream/10 bg-ink-deep/40">
              {ROUTES.map((route) => (
                <div
                  key={`${route.from}-${route.to}`}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-center gap-3 sm:gap-6 px-5 sm:px-8 py-5 hover:bg-cream/5 transition-colors"
                >
                  <div className="flex items-center gap-3 text-right">
                    <span className="font-display text-xl sm:text-2xl font-black text-cream">{route.from}</span>
                    <svg className="w-10 h-3 text-gold shrink-0" viewBox="0 0 40 12" fill="none" aria-hidden="true">
                      <path d="M38 6 H6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" strokeLinecap="round" />
                      <path d="M9 2 L4 6 L9 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-display text-xl sm:text-2xl font-black text-cream">{route.to}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold border border-gold/40 text-gold-soft px-3 py-1 rounded-full">{route.tag}</span>
                    {route.popular && (
                      <span className="text-[11px] font-black bg-gold text-ink-deep px-2.5 py-1 rounded-full">מבוקש</span>
                    )}
                  </div>
                  <a
                    href={WA_LINK(`שלום אבי, אשמח להצעת מחיר להסעה ${route.from} - ${route.to}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="justify-self-start sm:justify-self-end inline-flex items-center gap-1.5 text-sm font-bold text-stone-300 hover:text-gold transition-colors rounded"
                    aria-label={`הצעת מחיר למסלול ${route.from} ${route.to}`}
                  >
                    <span>הצעת מחיר</span>
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_LINK("שלום אבי, אשמח להצעת מחיר להסעה.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-soft text-ink-deep font-extrabold px-7 py-3.5 rounded-lg shadow-lg shadow-gold/20 transition-all active:scale-[0.97]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>קבלו הצעת מחיר למסלול שלכם</span>
              </a>
              <span className="text-stone-400 text-sm">או חייגו: <a href={`tel:${OWNER_PHONE}`} className="font-bold text-cream hover:text-gold transition-colors" dir="ltr">{OWNER_PHONE_DISPLAY}</a></span>
            </div>
          </div>
        </section>

        {/* Fleet */}
        <section id="fleet" aria-labelledby="fleet-heading" className="py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-14 text-right">
              <SectionKicker>הצי שלנו</SectionKicker>
              <h2 id="fleet-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink mt-4 mb-5 leading-tight">
                הרכב המתאים לכל קבוצה
              </h2>
              <p className="text-stone-600 leading-relaxed">
                בין אם מדובר בחתונה גדולה או אירוע משפחתי — יש פתרון מדויק לגודל שלכם.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {FLEET.map((vehicle) => (
                <article key={vehicle.name} className="border border-ink/10 rounded-2xl overflow-hidden bg-cream hover-lift">
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img
                      src={vehicle.img}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/70 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-4 right-4 bg-gold text-ink-deep rounded-xl px-4 py-2 text-center shadow-lg">
                      <span className="block font-display text-2xl font-black leading-none">{vehicle.capacity}</span>
                      <span className="block text-[10px] font-bold">{vehicle.capacityLabel}</span>
                    </div>
                  </div>
                  <div className="p-7 text-right">
                    <h3 className="font-display text-2xl font-black text-ink mb-5">{vehicle.name}</h3>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
                      {vehicle.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-stone-600">
                          <Check className="h-4 w-4 text-gold-deep shrink-0" aria-hidden="true" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gold-deep font-bold mb-6 pb-6 border-b border-ink/10">{vehicle.best}</p>
                    <a
                      href="#booking"
                      className="flex w-full items-center justify-center gap-2 bg-ink hover:bg-ink-deep text-cream font-bold py-3.5 rounded-lg transition-colors"
                    >
                      <span>הזמינו את {vehicle.name}</span>
                      <ChevronLeft className="h-4 w-4 text-gold" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" aria-labelledby="reviews-heading" className="py-20 md:py-24 bg-cream border-t border-ink/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="flex justify-center"><SectionKicker>לקוחות מספרים</SectionKicker></div>
              <h2 id="reviews-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink mt-4 mb-4 leading-tight">
                האורחים האישיים שלי בדרך
              </h2>
              <div className="inline-flex items-center gap-1.5" aria-label="דירוג 5 מתוך 5 כוכבים" role="img">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gold fill-gold" aria-hidden="true" />
                ))}
                <span className="text-sm font-bold text-stone-500 mr-2">5.0 ממוצע ביקורות</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {REVIEWS.map((review, i) => (
                <figure
                  key={review.id}
                  className={`bg-white border border-ink/10 rounded-2xl p-7 shadow-sm hover-lift text-right ${i % 2 === 1 ? "md:translate-y-6" : ""}`}
                >
                  <span className="font-display block text-6xl leading-none text-gold/60 select-none" aria-hidden="true">”</span>
                  <blockquote className="text-stone-700 text-sm sm:text-base leading-relaxed -mt-4 mb-6">
                    {review.text}
                  </blockquote>
                  <figcaption className="flex items-center justify-between pt-5 border-t border-ink/10">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-full bg-ink text-gold font-display font-black text-lg flex items-center justify-center" aria-hidden="true">
                        {review.name.charAt(0)}
                      </span>
                      <div>
                        <span className="block font-bold text-ink text-sm">{review.name}</span>
                        <span className="block text-[11px] text-stone-400 mt-0.5">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5" aria-label={`דירוג ${review.rating} מתוך 5 כוכבים`} role="img">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 text-gold fill-gold" aria-hidden="true" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Booking — boarding pass */}
        <section id="booking" aria-labelledby="booking-heading" className="py-20 md:py-24 bg-ink relative overflow-hidden">
          <svg
            className="absolute inset-x-0 bottom-6 w-full h-40 text-cream/10 pointer-events-none"
            viewBox="0 0 1200 120"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M-20 90 C 300 20, 700 130, 1230 50" stroke="currentColor" strokeWidth="2" className="route-dashed" />
          </svg>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex justify-center"><SectionKicker dark>הזמנת נסיעה</SectionKicker></div>
              <h2 id="booking-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-cream mt-4 mb-4 leading-tight">
                כרטיס הנסיעה שלכם מתחיל כאן
              </h2>
              <p className="text-stone-400 text-sm sm:text-base">
                מלאו פרטים ואבי יחזור אליכם אישית עם הצעת מחיר — בלי מוקדים ובלי המתנה.
              </p>
            </div>

            {/* Boarding pass card */}
            <div className="bg-cream rounded-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-[1fr_300px] overflow-hidden relative">

              {/* Main form */}
              <form onSubmit={handleBookingSubmit} className="p-7 sm:p-10 text-right">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="block font-display text-2xl font-black text-ink">כרטיס הזמנה</span>
                    <span className="block text-xs font-bold text-gold-deep tracking-widest mt-1">אבי ורדי · הסעות פרטיות</span>
                  </div>
                  <div className="hidden sm:block rounded-lg overflow-hidden border border-gold/40 w-12 h-12">
                    <img src={BUS_LOGO_IMG} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                  </div>
                </div>

                <fieldset className="mb-6">
                  <legend className="text-xs font-bold text-stone-500 mb-2.5">סוג הנסיעה</legend>
                  <div className="flex flex-wrap gap-2">
                    {TRIP_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setBookingTripType(bookingTripType === type ? "" : type)}
                        aria-pressed={bookingTripType === type}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                          bookingTripType === type
                            ? "bg-ink text-cream border-ink"
                            : "bg-white text-stone-600 border-stone-300 hover:border-ink"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="b-name" className="text-stone-600 text-xs font-bold">
                      שם מלא <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="b-name"
                      placeholder="ישראל ישראלי"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="bg-white border-stone-300"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-phone" className="text-stone-600 text-xs font-bold">
                      טלפון <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="b-phone"
                      type="tel"
                      placeholder="050-0000000"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="bg-white border-stone-300"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-origin" className="text-stone-600 text-xs font-bold">נקודת יציאה</Label>
                    <Input
                      id="b-origin"
                      placeholder="לדוגמה: ירושלים"
                      value={bookingOrigin}
                      onChange={(e) => setBookingOrigin(e.target.value)}
                      className="bg-white border-stone-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-destination" className="text-stone-600 text-xs font-bold">יעד</Label>
                    <Input
                      id="b-destination"
                      placeholder="לדוגמה: תל אביב"
                      value={bookingDestination}
                      onChange={(e) => setBookingDestination(e.target.value)}
                      className="bg-white border-stone-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-date" className="text-stone-600 text-xs font-bold">תאריך הנסיעה</Label>
                    <Input
                      id="b-date"
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-white border-stone-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-passengers" className="text-stone-600 text-xs font-bold">מספר נוסעים</Label>
                    <Input
                      id="b-passengers"
                      type="number"
                      min={1}
                      max={120}
                      placeholder="לדוגמה: 50"
                      value={bookingPassengers}
                      onChange={(e) => setBookingPassengers(e.target.value)}
                      className="bg-white border-stone-300"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="b-email" className="text-stone-600 text-xs font-bold">
                      מייל <span className="text-stone-400 font-normal">(אופציונלי)</span>
                    </Label>
                    <Input
                      id="b-email"
                      type="email"
                      placeholder="your@email.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="bg-white border-stone-300"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="b-notes" className="text-stone-600 text-xs font-bold">
                      פרטים נוספים <span className="text-stone-400 font-normal">(אופציונלי)</span>
                    </Label>
                    <Input
                      id="b-notes"
                      placeholder="שעות, עצירות בדרך, בקשות מיוחדות..."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="bg-white border-stone-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createBooking.isPending}
                  className="w-full mt-7 bg-gold hover:bg-gold-soft disabled:opacity-60 text-ink-deep font-extrabold text-base py-4 rounded-lg shadow-lg shadow-gold/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {createBooking.isPending ? "שולח..." : "שלחו את הכרטיס לאבי"}
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-3">
                  לאחר השליחה אבי יחזור אליכם אישית בהקדם האפשרי
                </p>
              </form>

              {/* Stub — perforated side */}
              <aside className="relative bg-cream-dark p-7 sm:p-10 lg:p-8 flex flex-col justify-center gap-6 text-right border-t lg:border-t-0 border-dashed border-stone-300 lg:border-none" aria-label="יצירת קשר ישירה">
                {/* vertical perforation + notches (desktop) */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-px perforation-v" aria-hidden="true"></div>
                <div className="hidden lg:block absolute -top-3 right-0 translate-x-1/2 w-6 h-6 rounded-full bg-ink" aria-hidden="true"></div>
                <div className="hidden lg:block absolute -bottom-3 right-0 translate-x-1/2 w-6 h-6 rounded-full bg-ink" aria-hidden="true"></div>

                <div>
                  <span className="block text-xs font-bold text-stone-500 tracking-widest mb-1">מעדיפים לדבר?</span>
                  <span className="block font-display text-xl font-black text-ink">דברו ישירות עם אבי</span>
                </div>

                <a href={`tel:${OWNER_PHONE}`} className="flex items-center gap-3 group" aria-label={`חייגו לאבי ורדי ${OWNER_PHONE_DISPLAY}`}>
                  <span className="bg-ink text-gold rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs text-stone-500">חיוג ישיר</span>
                    <span className="block font-black text-ink group-hover:text-gold-deep transition-colors" dir="ltr">{OWNER_PHONE_DISPLAY}</span>
                  </span>
                </a>

                <a
                  href={WA_LINK("שלום אבי, אשמח לקבל פרטים לגבי הסעה.")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fbd5a] text-white font-bold text-sm py-3 rounded-lg shadow-md transition-colors"
                  aria-label="שלחו וואצאפ לאבי ורדי"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>שלחו וואצאפ</span>
                </a>

                <div className="pt-5 border-t border-stone-300/70 space-y-2 text-xs text-stone-500">
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-gold-deep shrink-0" aria-hidden="true" />
                    <span>זמינות לתיאום 24/6 (לא פעיל בשבת)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gold-deep shrink-0" aria-hidden="true" />
                    <span>{OWNER_LOCATION}</span>
                  </p>
                </div>
              </aside>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="contact" role="contentinfo" className="bg-ink-deep text-cream pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 text-right">

          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg overflow-hidden border border-gold/40 w-12 h-12">
                <img src={BUS_LOGO_IMG} alt="לוגו אבי ורדי הסעות" className="w-full h-full object-cover" />
              </div>
              <div className="leading-tight">
                <span className="block font-display text-2xl font-black text-cream">אבי ורדי</span>
                <span className="block text-[11px] font-bold text-gold tracking-[0.2em]">הסעות פרטיות</span>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-7 max-w-sm">
              שירותי הסעות פרטיים בבטיחות ובאמינות מוחלטת. נסיעות לאירועים, טיולים, קבוצות ונתב״ג.
              מבוסס במבשרת ציון, משרת את אזור ירושלים ובית שמש לכל הארץ.
            </p>
            <div className="space-y-3 text-sm">
              <a href={`tel:${OWNER_PHONE}`} aria-label={`חייגו לאבי ורדי ${OWNER_PHONE_DISPLAY}`} className="flex items-center gap-3 text-stone-300 hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                <span dir="ltr">{OWNER_PHONE_DISPLAY}</span>
                <span>(אבי)</span>
              </a>
              <a href="https://maps.google.com/?q=מבשרת+ציון" target="_blank" rel="noreferrer" aria-label="פתח במפות גוגל" className="flex items-center gap-3 text-stone-300 hover:text-gold transition-colors">
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                <span>{OWNER_LOCATION}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <nav aria-label="ניווט מהיר">
              <h4 className="text-gold font-bold text-sm tracking-widest mb-6">ניווט מהיר</h4>
              <ul className="space-y-3 text-sm text-stone-400">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-cream transition-colors rounded">{link.label}</a>
                  </li>
                ))}
                <li><a href="#booking" className="hover:text-cream transition-colors rounded">הזמנת נסיעה</a></li>
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-gold font-bold text-sm tracking-widest mb-6">שעות פעילות והזמנות</h4>
            <p className="text-stone-400 text-sm leading-relaxed mb-7">
              זמינות מלאה לתיאום נסיעות מראש 24/6 (לא פעיל בשבת).
              מומלץ לשריין תאריכים מראש, במיוחד בעונת האירועים והקיץ.
            </p>
            <div className="flex gap-4">
              <a href={`tel:${OWNER_PHONE}`} aria-label={`חייגו לאבי ורדי ${OWNER_PHONE_DISPLAY}`} className="bg-cream text-ink-deep hover:bg-gold font-bold text-sm px-6 py-3 rounded-lg shadow-lg transition-colors">
                חייגו עכשיו
              </a>
              <a href={WA_LINK("שלום אבי, אשמח לקבל פרטים לגבי הסעה.")} target="_blank" rel="noreferrer" aria-label="שלחו וואצאפ לאבי ורדי" className="bg-[#25D366] hover:bg-[#1fbd5a] text-white font-bold text-sm px-6 py-3 rounded-lg shadow-lg transition-colors flex items-center gap-2">
                <WhatsAppIcon className="h-4 w-4" />
                <span>ווטסאפ</span>
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {CURRENT_YEAR} אבי ורדי הסעות. כל הזכויות שמורות.</p>
          <button
            onClick={() => setShowAccessibilityModal(true)}
            className="underline hover:text-stone-300 transition-colors cursor-pointer rounded"
          >
            הצהרת נגישות
          </button>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-3"
        role="complementary"
        aria-label="כפתורי יצירת קשר מהיר"
      >
        <a
          href={WA_LINK("שלום אבי, אשמח לקבל פרטים לגבי הסעה.")}
          target="_blank"
          rel="noreferrer"
          aria-label="שלח וואצאפ לאבי ורדי"
          className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#1fbd5a] text-white rounded-full shadow-lg shadow-[#25D366]/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 float-pulse p-3.5"
        >
          <WhatsAppIcon className="h-6 w-6 shrink-0" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[6rem] transition-all duration-300 text-sm font-bold whitespace-nowrap">וואצאפ</span>
        </a>
        <a
          href={`tel:${OWNER_PHONE}`}
          aria-label={`חייג לאבי ורדי ${OWNER_PHONE_DISPLAY}`}
          className="group flex items-center gap-2 bg-ink hover:bg-ink-deep text-gold rounded-full shadow-lg shadow-ink/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 p-3.5"
        >
          <PhoneCall className="h-6 w-6 shrink-0" aria-hidden="true" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[8rem] transition-all duration-300 text-sm font-bold whitespace-nowrap" dir="ltr">{OWNER_PHONE_DISPLAY}</span>
        </a>
      </div>
    </div>
  );
}
