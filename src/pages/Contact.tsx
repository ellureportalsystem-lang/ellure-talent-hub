import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram, Send, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { cn } from "@/lib/utils";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", query: "" });
  };

  return (
    <MarketingSaasShell>
      <MarketingPageHero
        className="marketing-page-hero--contact"
        align="left"
        imageFit="contain"
        imageSrc="/c1.png"
        title={
          <>
            <span className="gold-text">Get in Touch</span>
          </>
        }
        subtitle={
          <>
            We&apos;d love to hear from you. Let&apos;s discuss how we can <span className="gold-text">help</span>.
          </>
        }
      />

      <section className="marketing-section">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="card-hover border-2 border-border p-5 shadow-md transition-all duration-300 hover:border-primary/60 hover:shadow-xl sm:p-8">
                <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      className="h-11 text-base transition-all duration-300 focus:shadow-md lg:h-10 lg:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                      className="h-11 text-base transition-all duration-300 focus:shadow-md lg:h-10 lg:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="h-11 text-base transition-all duration-300 focus:shadow-md lg:h-10 lg:text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="query">Your Message *</Label>
                  <Textarea
                    id="query"
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    required
                    className="min-h-[140px] text-base transition-all duration-300 focus:shadow-md lg:text-sm"
                  />
                </div>
                <Button type="submit" className="btn-hover h-12 min-h-[48px] w-full active:scale-[0.98] lg:h-10" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              <a
                href="https://www.google.com/maps/place/Ellure+Consulting+Services/@18.503615,73.903043,14z/data=!4m6!3m5!1s0x3bc2c1c02ef704c1:0xe911db1b479e2e0a!8m2!3d18.5036152!4d73.9030428!16s%2Fg%2F11h88175wm"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="card-hover cursor-pointer overflow-hidden border-2 border-border shadow-md transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.264833726844!2d73.90044017519742!3d18.50361518256973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1c02ef704c1%3A0xe911db1b479e2e0a!2sEllure%20Consultting%20Services!5e0!3m2!1sen!2sin!4v1701680000000!5m2!1sen!2sin"
                    width="100%"
                    className="pointer-events-none block w-full rounded-lg h-40 sm:h-44"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ellure Consulting Services Location"
                  />
                </Card>
              </a>
              <p className="mt-2 text-sm text-muted-foreground">Click the map to open in Google Maps</p>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="card-hover border-2 border-border p-8 shadow-md transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">Contact Information</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: "Office Address",
                      content: "H657 Parmar Nagar, Opp Vishal Mega Mart,\nWanowrie, Pune – 411013",
                      iconClass: "bg-primary/10 text-primary group-hover:bg-primary/20",
                    },
                    {
                      icon: Phone,
                      title: "Phone Number",
                      content: "7517383196",
                      href: "tel:+917517383196",
                      iconClass: "bg-secondary/10 text-secondary group-hover:bg-secondary/20",
                    },
                    {
                      icon: Mail,
                      title: "Email Address",
                      content: "ayessha03@ellure-consulttingservices.com",
                      href: "mailto:ayessha03@ellure-consulttingservices.com",
                      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20",
                    },
                  ].map((item) => (
                    <div key={item.title} className="group flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                          item.iconClass
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">{item.title}</h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-muted-foreground transition-colors duration-300 hover:text-primary"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="whitespace-pre-line text-muted-foreground">{item.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-hover border-2 border-border p-8 shadow-md transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
                <h2 className="mb-6 text-2xl font-bold">Connect With Us</h2>
                <p className="mb-6 text-muted-foreground">
                  Follow us on social media for the latest updates and opportunities.
                </p>
                <div className="flex gap-4">
                  {[
                    {
                      icon: Linkedin,
                      href: "https://www.linkedin.com/company/ellure-consulting-services",
                      label: "LinkedIn",
                    },
                    { icon: Facebook, href: "https://www.facebook.com/ellureconsulting", label: "Facebook" },
                    { icon: Instagram, href: "https://www.instagram.com/ellureconsulting", label: "Instagram" },
                    { icon: MessageCircle, href: "https://wa.me/917517383196", label: "WhatsApp", isWhatsApp: true },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`touch-target flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 active:scale-95 hover:scale-110 hover:shadow-lg lg:h-12 lg:w-12 ${
                        item.isWhatsApp
                          ? "bg-secondary/10 hover:bg-secondary hover:text-secondary-foreground"
                          : "bg-primary/10 hover:bg-primary hover:text-primary-foreground"
                      }`}
                      aria-label={item.label}
                    >
                      <item.icon className={`h-6 w-6 ${item.isWhatsApp ? "text-secondary" : "text-primary"}`} />
                    </a>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-hover relative overflow-hidden border-2 border-border shadow-md transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
                <div
                  className="absolute inset-0 bg-cover bg-no-repeat bg-[center_35%]"
                  style={{ backgroundImage: "url(/c2.png)" }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">Business Hours</h2>
                  </div>
                  <div className="space-y-2">
                    <p className="flex justify-between text-white">
                      <span>Monday - Friday:</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex justify-between text-white">
                      <span>Saturday:</span>
                      <span className="font-medium">9:00 AM - 2:00 PM</span>
                    </p>
                    <p className="flex justify-between text-white">
                      <span>Sunday:</span>
                      <span className="font-medium">Closed</span>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketingSaasShell>
  );
};

export default Contact;
