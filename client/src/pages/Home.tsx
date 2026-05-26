import React, { useState } from "react";
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
  Calculator, 
  Facebook, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REVIEWS, PRICING_ESTIMATES, SERVICES, ABOUT_TEXT, MARKETING_TIPS } from "@shared/const";
import { toast } from "sonner";

export default function Home() {
  // Pricing calculator state
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("one-way");
  const [estimatedPrice, setEstimatedPrice] = useState<string | null>(null);

  // Quick feedback form state
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactNotes, setContactPhoneNotes] = useState("");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination) {
      toast.error("אנא מלאו את נקודת המוצא והיעד");
      return;
    }

    // A simple deterministic formula for demonstration
    // Since Andy is from Elazar (near Jerusalem), we calculate base rates
    const isJerusalem = pickup.includes("ירושלים") || destination.includes("ירושלים");
    const isCenter = pickup.includes("תל אביב") || destination.includes("תל אביב") || pickup.includes("מרכז") || destination.includes("מרכז");
    const isBenGurion = pickup.includes("נתב\"ג") || destination.includes("נתב\"ג") || pickup.includes("שדה תעופה") || destination.includes("שדה תעופה");

    let minPrice = 350;
    let maxPrice = 500;

    if (isBenGurion) {
      minPrice = 450;
      maxPrice = 600;
    } else if (isCenter && isJerusalem) {
      minPrice = 1200;
      maxPrice = 1600;
    } else if (isCenter) {
      minPrice = 1500;
      maxPrice = 2000;
    } else if (isJerusalem) {
      minPrice = 400;
      maxPrice = 650;
    }

    if (tripType === "round-trip") {
      minPrice = Math.round(minPrice * 1.7);
      maxPrice = Math.round(maxPrice * 1.7);
    }

    setEstimatedPrice(`₪${minPrice.toLocaleString()} - ₪${maxPrice.toLocaleString()}`);
    toast.success("הערכת המחיר חושבה בהצלחה!");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      toast.error("אנא מלאו שם ומספר טלפון");
      return;
    }
    
    // Create WhatsApp message link
    const whatsappText = encodeURIComponent(
      `שלום אנדי, הגעתי מהאתר שלך.\nשמי: ${contactName}\nטלפון: ${contactPhone}\nפרטים על הנסיעה: ${contactNotes || "ברצוני לקבל הצעת מחיר להסעה."}`
    );
    const whatsappUrl = `https://wa.me/972500000000?text=${whatsappText}`; // Placeholder phone number
    
    toast.success("פנייתך התקבלה! מעביר אותך לווטסאפ של אנדי...");
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 1500);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Gift": return <Gift className="h-8 w-8 text-amber-500" />;
      case "Compass": return <Compass className="h-8 w-8 text-amber-500" />;
      case "Plane": return <Plane className="h-8 w-8 text-amber-500" />;
      case "Crown": return <Crown className="h-8 w-8 text-amber-500" />;
      default: return <Compass className="h-8 w-8 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-amber-400 p-2.5 rounded-xl shadow-md border border-amber-500/30">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-blue-900">אנדי הסעות</span>
              <span className="block text-xs font-semibold text-amber-600 tracking-wider">שירות הסעות VIP פרטי</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-blue-900 transition-colors">עלינו</a>
            <a href="#services" className="hover:text-blue-900 transition-colors">שירותים</a>
            <a href="#pricing" className="hover:text-blue-900 transition-colors">מחירון</a>
            <a href="#reviews" className="hover:text-blue-900 transition-colors">ביקורות פייסבוק</a>
            <a href="#marketing" className="hover:text-blue-900 transition-colors">טיפים לשיווק</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:+972500000000" className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors">
              <Phone className="h-4 w-4 text-amber-600" />
              <span>חייגו עכשיו</span>
            </a>
            <a href="#contact" className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-blue-900/20 transition-all">
              הזמנת נסיעה
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663699036625/jNBxQdxcxRHq8VPq64unqC/hero_bus-D2NjZHZJ3xjY3VkBPiPMdt.webp" 
            alt="אוטובוס מפואר של אנדי" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-right">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full mb-6">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-400">הסעות פרטיות באזור ירושלים וגוש עציון</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
              הנסיעה שלכם, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">האחריות האישית שלי.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              שירות הסעות פרטי ואקסקלוסיבי במיניבוס חדיש ומפואר. נהג מקצועי, אדיב ודייקן המעניק יחס אישי וחם לכל נסיעה – חתונות, טיולים, נתב"ג ואירועים מיוחדים.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <a href="#contact" className="inline-flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all">
                <MessageCircle className="h-5 w-5 fill-slate-950" />
                <span>דברו איתי בווטסאפ</span>
              </a>
              <a href="#pricing" className="inline-flex justify-center items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-base px-8 py-4 rounded-xl border border-slate-700 transition-all">
                <Calculator className="h-5 w-5 text-amber-400" />
                <span>מחשבון עלויות מהיר</span>
              </a>
            </div>

            {/* Quick trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-800 max-w-lg">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">100%</span>
                <span className="text-xs text-slate-400 font-medium">עמידה בזמנים</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">20+</span>
                <span className="text-xs text-slate-400 font-medium">מקומות ישיבה</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">5.0</span>
                <span className="text-xs text-slate-400 font-medium">דירוג פייסבוק</span>
              </div>
            </div>
          </div>

          {/* Quick contact widget */}
          <div className="lg:col-span-5">
            <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md">
              <CardHeader className="border-b border-slate-800 pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span>קבלו הצעת מחיר מהירה</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  השאירו פרטים ואחזור אליכם עם הצעה משתלמת במיוחד תוך דקות!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-slate-300 text-xs font-bold">שם מלא</Label>
                    <Input 
                      id="name" 
                      placeholder="ישראל ישראלי" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-slate-300 text-xs font-bold">מספר טלפון</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="050-0000000" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-slate-300 text-xs font-bold">פרטי הנסיעה (תאריך, מוצא ויעד)</Label>
                    <Input 
                      id="notes" 
                      placeholder="לדוגמה: הסעה לחתונה מירושלים לתל אביב ב-15/6" 
                      value={contactNotes}
                      onChange={(e) => setContactPhoneNotes(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg mt-2 shadow-lg shadow-amber-500/10">
                    שלחו לי הודעה לווטסאפ
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
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663699036625/jNBxQdxcxRHq8VPq64unqC/andy_driver-mpfbPqNMcSSq4BLYhnPcrc.webp" 
                  alt="אנדי - הנהג שלכם" 
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

            <div className="lg:col-span-7 text-right">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-amber-500"></span>
                <span className="text-sm font-bold text-amber-600 tracking-wider uppercase">הכירו את אנדי</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mb-6">
                נהג פרטי עם לב רחב ויחס אישי
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
                    <span className="text-xs text-slate-500">מבוסס באלעזר, משרת את ירושלים, בית שמש וגוש עציון לכל הארץ</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-blue-900 text-sm">צי רכבים איכותי</span>
                    <span className="text-xs text-slate-500">מיניבוס מפואר, נקי ומתוחזק ברמה הגבוהה ביותר מדי יום</span>
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
                  <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-blue-900 transition-colors">
                    <span>לפרטים והזמנה</span>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Luxury Interior CTA */}
          <div className="mt-16 bg-blue-950 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 text-right text-white">
              <span className="text-amber-400 text-sm font-bold tracking-wider uppercase">חוויית נסיעה VIP</span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 mb-4">
                הצצה אל תוך המיניבוס המפואר
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                כדי להבטיח לכם את הנסיעה הנעימה ביותר, האוטובוס מצויד במושבי עור מפנקים ומרווחים, מערכת מיזוג אוויר עוצמתית המותאמת לאקלים הישראלי, תאורת לד כחולה ומרגיעה, ומערכת שמע מתקדמת. הכל נשמר ברמת ניקיון סטרילית ומוקפדת.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-xs font-bold">
                  <Check className="h-4 w-4 text-amber-400" />
                  <span>מושבי עור מתכווננים</span>
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
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663699036625/jNBxQdxcxRHq8VPq64unqC/bus_interior-5GwWfnuyFMotHLCCZYermf.webp" 
                alt="פנים המיניבוס של אנדי" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Calculator Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold text-amber-600 tracking-wider uppercase">מחירון שקוף והוגן</span>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mt-2 mb-4">
              כמה עולה נסיעה פרטית?
            </h2>
            <p className="text-slate-600">
              אני מאמין בשקיפות מלאה. מחירי ההסעות נקבעים בהתאם למרחק, משך הנסיעה וסוג השירות. לפניכם הערכות מחיר לנסיעות נפוצות ומחשבון מהיר.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Price Table */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span>הערכות מחיר לנסיעות נפוצות</span>
              </h3>
              
              <div className="space-y-4">
                {PRICING_ESTIMATES.map((estimate) => (
                  <div key={estimate.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-right">
                    <div>
                      <span className="block font-bold text-blue-900 text-base">{estimate.route}</span>
                      <span className="block text-xs text-slate-500 mt-1">{estimate.notes}</span>
                    </div>
                    <div className="sm:text-left flex flex-col items-start sm:items-end">
                      <span className="text-xl font-black text-amber-600">{estimate.priceRange}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">{estimate.vehicleType}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4 text-right">
                * המחירים המוצגים הם הערכה בלבד ועשויים להשתנות בהתאם לעונה, שעות הנסיעה (יום/לילה/סופ"ש) ומספר העצירות. המחירים כוללים מע"מ וביטוח מלא.
              </p>
            </div>

            {/* Interactive Calculator */}
            <div className="lg:col-span-5">
              <Card className="border-blue-100 bg-blue-50/50 shadow-xl">
                <CardHeader className="border-b border-blue-100/50 pb-6">
                  <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-amber-600" />
                    <span>מחשבון עלויות אינטראקטיבי</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    חשבו באופן מיידי את טווח המחירים המוערך לנסיעה שלכם
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleCalculate} className="space-y-4">
                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="calc-pickup" className="text-slate-700 text-xs font-bold">נקודת מוצא</Label>
                      <Input 
                        id="calc-pickup" 
                        placeholder="לדוגמה: אלעזר / אפרת / ירושלים" 
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="calc-dest" className="text-slate-700 text-xs font-bold">נקודת יעד</Label>
                      <Input 
                        id="calc-dest" 
                        placeholder='לדוגמה: נתב"ג / תל אביב / ים המלח'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="calc-type" className="text-slate-700 text-xs font-bold">סוג הנסיעה</Label>
                      <Select value={tripType} onValueChange={setTripType}>
                        <SelectTrigger id="calc-type" className="bg-white border-slate-200 text-slate-900">
                          <SelectValue placeholder="בחר סוג נסיעה" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-way">כיוון אחד (העברה)</SelectItem>
                          <SelectItem value="round-trip">הלוך ושוב (באותו יום)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg mt-2">
                      חשב עלות מוערכת
                    </Button>

                    {estimatedPrice && (
                      <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-center animate-fade-in">
                        <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">טווח מחיר מוערך</span>
                        <span className="block text-3xl font-black text-amber-600 mt-1">{estimatedPrice}</span>
                        <span className="block text-[10px] text-slate-500 mt-2">המחיר כולל מע"מ, נהג צמוד ודלק</span>
                        <a 
                          href={`https://wa.me/972500000000?text=${encodeURIComponent(`שלום אנדי, קיבלתי הערכת מחיר באתר לנסיעה מ-${pickup} ל-${destination} בסך ${estimatedPrice}. אשמח לאשר איתך זמינות.`)}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg mt-4 shadow-md transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-white" />
                          <span>אשרו איתי בווטסאפ</span>
                        </a>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Reviews Section */}
      <section id="reviews" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full mb-3">
              <Facebook className="h-4 w-4 text-blue-600 fill-blue-600" />
              <span className="text-xs font-bold text-blue-700">ביקורות חמות מפייסבוק</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mb-4">
              מה הלקוחות שלנו מספרים?
            </h2>
            <p className="text-slate-600">
              הביקורות נאספו ישירות מדף הפייסבוק המשפחתי והעסקי שלנו. הנה כמה מילים חמות מלקוחות מרוצים שנסעו איתי לאחרונה.
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

          <div className="text-center mt-12">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-amber-600 transition-colors bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm"
            >
              <Facebook className="h-4 w-4 text-blue-600 fill-blue-600" />
              <span>צפו בדף הפייסבוק שלנו לעוד המלצות</span>
            </a>
          </div>
        </div>
      </section>

      {/* Expert Advice Section (How to advertise on Facebook) */}
      <section id="marketing" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold text-amber-600 tracking-wider uppercase">מדריך מומחה מיוחד</span>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900 mt-2 mb-4">
              איך לפרסם ולהביא עוד לקוחות בפייסבוק?
            </h2>
            <p className="text-slate-600">
              כמומחה בתחום התחבורה והשיווק הדיגיטלי, ריכזתי עבור אביך כמה עצות זהב מעשיות וקלות ליישום כדי למלא את יומן העבודה שלו בנסיעות חדשות דרך פייסבוק ורשתות חברתיות.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Marketing advice cards */}
            <div className="lg:col-span-7 space-y-6">
              {MARKETING_TIPS.map((tip, index) => (
                <div key={index} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 flex items-start gap-4 text-right">
                  <div className="bg-amber-500 text-slate-950 font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-base mb-2">{tip.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Beautiful visual summary */}
            <div className="lg:col-span-5 bg-blue-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-amber-500/20 text-right">
              <Crown className="h-10 w-10 text-amber-400 mb-6" />
              <h3 className="text-xl font-bold mb-4 text-amber-400">הטיפ החשוב ביותר: "הכוח של המקומיות"</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                במגזר ההסעות הפרטיות, אנשים מחפשים מישהו מקומי שהם יכולים לסמוך עליו. מכיוון שאנדי מתגורר באלעזר, הוא נמצא במיקום אסטרטגי מצוין – קרוב מאוד לירושלים, בית שמש וגוש עציון. 
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                פרסום קבוע פעם בשבוע בקבוצות הפייסבוק של היישובים הללו, עם תמונה יפה של האוטובוס והזמנה אישית לחייג, יביא לו זרם קבוע של לקוחות קרובים שרוצים לתמוך בעסק מקומי.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Contact Section */}
      <footer id="contact" className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 text-right">
          
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-900 text-amber-400 p-2.5 rounded-xl border border-amber-500/30">
                <Crown className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-white">אנדי הסעות</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              שירותי הסעות פרטיים בבטיחות ובאמינות מוחלטת. נסיעות לאירועים, טיולים, משפחות ונתב"ג. מבוסס באלעזר, משרת את אזור ירושלים, בית שמש וגוש עציון לכל הארץ.
            </p>
            <div className="space-y-3 text-sm">
              <a href="tel:+972500000000" className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors justify-start">
                <Phone className="h-4 w-4 text-amber-500" />
                <span>050-0000000 (אנדי)</span>
              </a>
              <div className="flex items-center gap-3 text-slate-300 justify-start">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>אלעזר, גוש עציון (סמוך לירושלים)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-6">ניווט מהיר</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">עלינו</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">שירותים</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">מחירון והערכות עלות</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">ביקורות פייסבוק</a></li>
              <li><a href="#marketing" className="hover:text-white transition-colors">טיפים לשיווק</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-6">שעות פעילות והזמנות</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              זמינות מלאה לתיאום נסיעות מראש 24/6 (לא פעיל בשבת). מומלץ לשריין תאריכים מראש, במיוחד בעונת האירועים והקיץ.
            </p>
            <div className="flex gap-4 justify-start">
              <a href="tel:+972500000000" className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-colors">
                חייגו עכשיו
              </a>
              <a href="https://wa.me/972500000000" target="_blank" className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2">
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>ווטסאפ</span>
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} אנדי הסעות פרטיות. כל הזכויות שמורות. נבנה באהבה עבור אבא.</p>
        </div>
      </footer>
    </div>
  );
}
