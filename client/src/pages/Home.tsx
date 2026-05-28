import React, { useState, useEffect } from "react";
import {
  Phone,
  MapPin,
  Star,
  Compass,
  Gift,
  Plane,
  Crown,
  Check,
  MessageCircle,
  Facebook,
  Clock,
  ShieldCheck,
  Award,
  ChevronLeft,
  X,
  Users,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REVIEWS, SERVICES, ABOUT_TEXT, OWNER_NAME, OWNER_PHONE, OWNER_PHONE_DISPLAY, OWNER_WHATSAPP, OWNER_LOCATION } from "@shared/const";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// Bus images uploaded to storage
const BUS_HERO_IMG = "/manus-storage/bus-front-nature_6d1794ae.jpeg";
const BUS_SIDE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663699036625/jNBxQdxcxRHq8VPq64unqC/bus-side-nature-clean-bzkXQoheuinAbjgqqiK8ar.webp";
const BUS_INTERIOR_IMG = "/manus-storage/bus-interior_17f8298e.jpeg";
const BUS_LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663699036625/jNBxQdxcxRHq8VPq64unqC/bus-logo-enhanced-DoiD8pdJuAM3Pu5JMuuSsu.webp";
const BUS_FRONT_ANGLE_IMG = "/manus-storage/bus-front-angle_6bee6973.jpg";

export default function Home() {
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: (data) => {
      toast.success("פרטיך התקבלו! אבי יחזור אליך בהקדם.");
      setShowBookingModal(false);
      resetForm();
      // Open WhatsApp for owner notification
      setTimeout(() => {
        window.open(data.whatsappUrl, "_blank");
      }, 800);
    },
    onError: () => {
      toast.error("אירעה שגיאה. נסה שוב או התקשר ישירות.");
    },
  });

  const resetForm = () => {
    setBookingName("");
    setBookingPhone("");
    setBookingDate("");
    setBookingNotes("");
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim()) {
      toast.error("אנא הזן שם מלא");
      return;
    }
    if (!bookingPhone.trim() || bookingPhone.trim().length < 9) {
      toast.error("אנא הזן מספר טלפון תקין");
      return;
    }
    createBooking.mutate({
      name: bookingName.trim(),
      phone: bookingPhone.trim(),
      tripDate: bookingDate || undefined,
      notes: bookingNotes || undefined,
    });
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Gift": return <Gift className="h-8 w-8 text-amber-500" />;
      case "Compass": return <Compass className="h-8 w-8 text-amber-500" />;
      case "Plane": return <Plane className="h-8 w-8 text-amber-500" />;
      case "Crown": return <Crown className="h-8 w-8 text-amber-500" />;
      case "Users": return <Users className="h-8 w-8 text-amber-500" />;
      default: return <Compass className="h-8 w-8 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans" dir="rtl">

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl overflow-hidden border border-amber-500/30 w-10 h-10">
                <img src={BUS_LOGO_IMG} alt="אבי ורדי הסעות" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-black text-blue-900">הזמנת נסיעה</h2>
                <p className="text-xs text-slate-500">אבי יחזור אליך בהקדם</p>
              </div>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="b-name" className="text-slate-700 text-xs font-bold">
                  שם מלא <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="b-name"
                  placeholder="ישראל ישראלי"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="border-slate-200 focus:border-amber-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-phone" className="text-slate-700 text-xs font-bold">
                  מספר טלפון <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="b-phone"
                  type="tel"
                  placeholder="050-0000000"
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  className="border-slate-200 focus:border-amber-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-date" className="text-slate-700 text-xs font-bold">
                  תאריך הנסיעה <span className="text-slate-400 font-normal">(אופציונלי)</span>
                </Label>
                <Input
                  id="b-date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="border-slate-200 focus:border-amber-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-notes" className="text-slate-700 text-xs font-bold">
                  פרטים נוספים <span className="text-slate-400 font-normal">(אופציונלי)</span>
                </Label>
                <Input
                  id="b-notes"
                  placeholder="מוצא, יעד, מספר נוסעים..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="border-slate-200 focus:border-amber-500"
                />
              </div>
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl mt-2 shadow-lg shadow-amber-500/20 active:scale-[0.97] transition-all"
              >
                {createBooking.isPending ? "שולח..." : "שלח פרטים לאבי"}
              </Button>
              <p className="text-[10px] text-slate-400 text-center">
                לאחר השליחה, אבי יחזור אליך בהקדם האפשרי
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl shadow-md overflow-hidden border border-amber-500/30 w-12 h-12">
              <img src={BUS_LOGO_IMG} alt="אבי ורדי הסעות" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-blue-900">אבי ורדי הסעות</span>
              <span className="block text-xs font-semibold text-amber-600 tracking-wider">שירות הסעות פרטי</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-blue-900 transition-colors">עלינו</a>
            <a href="#services" className="hover:text-blue-900 transition-colors">שירותים</a>
            <a href="#reviews" className="hover:text-blue-900 transition-colors">ביקורות</a>
            <a
              href={`https://wa.me/${OWNER_WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-green-600 hover:text-green-700 transition-colors font-semibold"
              aria-label="שלח וואצאפ לאבי"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>וואצאפ</span>
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a href={`tel:${OWNER_PHONE}`} className="hidden sm:flex flex-col items-center gap-0.5 text-sm font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors">
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-amber-600" />
                <span>חייגו ישירות</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 leading-none">{OWNER_PHONE_DISPLAY}</span>
            </a>
            <a
              href={`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent('שלום אבי, אשמח לקבל פרטים לגבי הסעה.')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-blue-900/20 transition-all active:scale-[0.97]"
              aria-label="הזמנת נסיעה דרך וואצאפ"
            >
              הזמנת נסיעה
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={BUS_HERO_IMG}
            alt="האוטובוס של אבי ורדי"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-right">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full mb-6">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-400">הסעות פרטיות באזור ירושלים ומרכז הארץ</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
              הנסיעה שלכם, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">האחריות האישית שלי.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              שירות הסעות פרטי ואקסקלוסיבי באוטובוס מפואר עם 56 מקומות. נהג מקצועי, אדיב ודייקן המעניק יחס אישי וחם לכל נסיעה – חתונות, טיולים, נתב"ג ואירועים מיוחדים.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <a
                href={`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent('שלום אבי, אשמח לקבל פרטים לגבי הסעה.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.97] hover:-translate-y-0.5"
                aria-label="הזמינו נסיעה דרך וואצאפ"
              >
                <MessageCircle className="h-5 w-5" />
                <span>הזמינו נסיעה עכשיו</span>
              </a>
              <a
                href={`tel:${OWNER_PHONE}`}
                className="inline-flex justify-center items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-base px-8 py-4 rounded-xl border border-slate-700 transition-all hover:-translate-y-0.5"
              >
                <Phone className="h-5 w-5 text-amber-400" />
                <span>חייגו ישירות</span>
              </a>
            </div>

            {/* Quick trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-800 max-w-lg">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">100%</span>
                <span className="text-xs text-slate-400 font-medium">עמידה בזמנים</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">56</span>
                <span className="text-xs text-slate-400 font-medium">מקומות ישיבה</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">5.0</span>
                <span className="text-xs text-slate-400 font-medium">דירוג לקוחות</span>
              </div>
            </div>
            </div>

            {/* Phone number under call button */}
            <p className="text-slate-400 text-xs mt-2"> <span className="text-amber-400 font-bold">{OWNER_PHONE_DISPLAY}</span></p>

          {/* Quick contact widget */}
          <div className="lg:col-span-5">
            <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md">
              <CardHeader className="border-b border-slate-800 pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span>השאירו פרטים ואחזור אליכם</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  מלאו שם וטלפון ואבי יחזור אליכם עם הצעה משתלמת תוך דקות!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-name" className="text-slate-300 text-xs font-bold">שם מלא *</Label>
                    <Input
                      id="hero-name"
                      placeholder="ישראל ישראלי"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-phone" className="text-slate-300 text-xs font-bold">מספר טלפון *</Label>
                    <Input
                      id="hero-phone"
                      type="tel"
                      placeholder="050-0000000"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="hero-notes" className="text-slate-300 text-xs font-bold">פרטי הנסיעה (אופציונלי)</Label>
                    <Input
                      id="hero-notes"
                      placeholder="לדוגמה: הסעה לחתונה מירושלים לתל אביב ב-15/6"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createBooking.isPending}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg mt-2 shadow-lg shadow-amber-500/10 active:scale-[0.97] transition-all"
                  >
                    {createBooking.isPending ? "שולח..." : "שלחו לי הודעה"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative flex flex-col gap-5">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={BUS_SIDE_IMG}
                    alt="האוטובוס של אבי ורדי"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Overlay Badge */}
                <div className="absolute bottom-6 right-6 bg-blue-900 text-white px-6 py-3.5 rounded-xl shadow-lg border border-amber-500/30 flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-amber-400" />
                  <div>
                    <span className="block text-sm font-bold text-amber-400">אמינות ובטיחות</span>
                    <span className="block text-xs text-slate-300">ברישיון משרד התחבורה</span>
                  </div>
                </div>
              </div>
              {/* Second bus photo below the main image */}
              <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-slate-100 hover:shadow-2xl transition-shadow duration-300 hover-lift">
                <img
                  src={BUS_FRONT_ANGLE_IMG}
                  alt="האוטובוס של אבי ורדי - מרסדס איריזר"
                  className="w-full h-52 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 text-right">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-amber-500"></span>
                <span className="text-sm font-bold text-amber-600 tracking-wider uppercase">הכירו את אבי</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mb-6">
                נהג פרטי מקצוען ובעל יחס אישי
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-base">
                {ABOUT_TEXT.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-blue-900 text-sm">מיקום ונגישות</span>
                    <span className="text-xs text-slate-500">{OWNER_LOCATION}, משרת את ירושלים, בית שמש וכל הארץ</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-blue-900 text-sm">אוטובוס מפואר</span>
                    <span className="text-xs text-slate-500">56 מקומות ישיבה, נקי ומתוחזק ברמה הגבוהה ביותר</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold text-amber-600 tracking-wider uppercase">השירותים שלנו</span>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mt-2 mb-4">
              פתרונות נסיעה לכל מטרה
            </h2>
            <p className="text-slate-600">
              אני מספק מגוון רחב של שירותי הסעות פרטיים בהתאמה אישית מלאה לצרכים שלכם, עם דגש על נוחות, בטיחות ושירות ללא פשרות.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <Card key={service.id} className="border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-right flex flex-col justify-between">
                <CardHeader className="pb-4">
                  <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-amber-100/50">
                    {renderIcon(service.icon)}
                  </div>
                  <CardTitle className="text-lg font-bold text-blue-900 mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-slate-600 text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-blue-900 transition-colors"
                  >
                    <span>לפרטים והזמנה</span>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bus Interior CTA */}
          <div className="mt-16 bg-blue-950 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 text-right text-white">
              <span className="text-amber-400 text-sm font-bold tracking-wider uppercase">חוויית נסיעה VIP</span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 mb-4">
                הצצה אל תוך האוטובוס המפואר
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                כדי להבטיח לכם את הנסיעה הנעימה ביותר, האוטובוס מצויד ב-56 מושבים מפנקים ומרווחים, מערכת מיזוג אוויר עוצמתית, תאורה נעימה, ומערכת שמע מתקדמת. הכל נשמר ברמת ניקיון סטרילית ומוקפדת.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-xs font-bold">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span>56 מושבים מתכווננים</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-xs font-bold">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span>מיזוג אוויר מפוצל</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-xs font-bold">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span>מערכת מולטימדיה</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 h-64 lg:h-full min-h-[320px]">
              <img
                src={BUS_INTERIOR_IMG}
                alt="פנים האוטובוס של אבי ורדי"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full mb-3">
              <Facebook className="h-4 w-4 text-blue-600 fill-blue-600" />
              <span className="text-xs font-bold text-blue-700">ביקורות מלקוחות מרוצים</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mb-4">
              מה הלקוחות שלנו מספרים?
            </h2>
            <p className="text-slate-600">
              לקוחות מרוצים שנסעו עם אבי ורדי ומספרים על החוויה שלהם.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REVIEWS.map((review) => (
              <Card key={review.id} className="border-slate-100 bg-white shadow-md hover:shadow-lg transition-shadow text-right">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-lg border border-blue-200">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-bold text-blue-900 text-sm">{review.name}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-slate-600 text-sm leading-relaxed italic relative">
                    <span className="absolute -top-4 -right-2 text-4xl text-blue-100 font-serif">"</span>
                    <p className="relative z-10 pr-4">{review.text}</p>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Contact Section */}
      <footer id="contact" className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 text-right">

          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl overflow-hidden border border-amber-500/30 w-12 h-12">
                <img src={BUS_LOGO_IMG} alt="אבי ורדי הסעות" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-black text-white">אבי ורדי הסעות</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              שירותי הסעות פרטיים בבטיחות ובאמינות מוחלטת. נסיעות לאירועים, טיולים, קבוצות ונתב"ג. מבוסס במבשרת ציון, משרת את אזור ירושלים ובית שמש לכל הארץ.
            </p>
            <div className="space-y-3 text-sm">
              <a href={`tel:${OWNER_PHONE}`} className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors justify-start">
                <Phone className="h-4 w-4 text-amber-500" />
                <span>{OWNER_PHONE_DISPLAY} (אבי)</span>
              </a>
              <div className="flex items-center gap-3 text-slate-300 justify-start">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>{OWNER_LOCATION}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-6">ניווט מהיר</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">עלינו</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">שירותים</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">ביקורות</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-6">שעות פעילות והזמנות</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              זמינות מלאה לתיאום נסיעות מראש 24/6 (לא פעיל בשבת). מומלץ לשריין תאריכים מראש, במיוחד בעונת האירועים והקיץ.
            </p>
            <div className="flex gap-4 justify-start">
              <a href={`tel:${OWNER_PHONE}`} className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-colors">
                חייגו עכשיו
              </a>
              <a href={`https://wa.me/${OWNER_WHATSAPP}`} target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>ווטסאפ</span>
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} אבי ורדי הסעות. כל הזכויות שמורות.</p>
        </div>
      </footer>

      {/* Floating Action Buttons - WhatsApp & Call */}
      <div
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-3"
        role="complementary"
        aria-label="כפתורי יצירת קשר מהיר"
      >
        {/* WhatsApp floating button */}
        <a
          href={`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent('שלום אבי, אשמח לקבל פרטים לגבי הסעה.')}`}
          target="_blank"
          rel="noreferrer"
          aria-label="שלח וואצאפ לאבי ורדי"
          className="group flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg shadow-green-500/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 float-pulse"
          style={{ padding: '14px' }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current flex-shrink-0" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-[6rem] transition-all duration-300 text-sm font-bold whitespace-nowrap">וואצאפ</span>
        </a>

        {/* Phone floating button */}
        <a
          href={`tel:${OWNER_PHONE}`}
          aria-label={`חייג לאבי ורדי ${OWNER_PHONE_DISPLAY}`}
          className="group flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-lg shadow-blue-900/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          style={{ padding: '14px' }}
        >
          <PhoneCall className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[8rem] transition-all duration-300 text-sm font-bold whitespace-nowrap">{OWNER_PHONE_DISPLAY}</span>
        </a>
      </div>
    </div>
  );
}
