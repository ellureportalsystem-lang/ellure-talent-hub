import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram, Send, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", query: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">Reach Out</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6">Get in Touch</h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              We'd love to hear from you. Let's discuss how we can help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="container pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a 
            href="https://www.google.com/maps/place/Ellure+Consultting+Services/@18.503615,73.903043,14z/data=!4m6!3m5!1s0x3bc2c1c02ef704c1:0xe911db1b479e2e0a!8m2!3d18.5036152!4d73.9030428!16s%2Fg%2F11h88175wm"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="overflow-hidden card-hover cursor-pointer">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.264833726844!2d73.90044017519742!3d18.50361518256973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1c02ef704c1%3A0xe911db1b479e2e0a!2sEllure%20Consultting%20Services!5e0!3m2!1sen!2sin!4v1701680000000!5m2!1sen!2sin"
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg pointer-events-none"
                title="Ellure Consulting Services Location"
              />
            </Card>
          </a>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Click on the map to open in Google Maps
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 card-hover">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    className="transition-all duration-300 focus:shadow-md"
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
                    className="transition-all duration-300 focus:shadow-md"
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
                    className="transition-all duration-300 focus:shadow-md"
                  />
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
                    className="transition-all duration-300 focus:shadow-md"
                  />
                </div>
                <Button type="submit" className="w-full btn-hover" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 card-hover">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: "Office Address",
                      content: "H657 Parmar Nagar, Opp Vishal Mega Mart,\nWanowrie, Pune – 411013",
                      color: "primary"
                    },
                    {
                      icon: Phone,
                      title: "Phone Number",
                      content: "7517383196",
                      href: "tel:+917517383196",
                      color: "secondary"
                    },
                    {
                      icon: Mail,
                      title: "Email Address",
                      content: "ayessha03@ellure-consulttingservices.com",
                      href: "mailto:ayessha03@ellure-consulttingservices.com",
                      color: "success"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className={`h-12 w-12 rounded-xl bg-${item.color}/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-${item.color}/20`}>
                        <item.icon className={`h-6 w-6 text-${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        {item.href ? (
                          <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-line">{item.content}</p>
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
              <Card className="p-8 card-hover">
                <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
                <p className="text-muted-foreground mb-6">
                  Follow us on social media for the latest updates and opportunities.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Linkedin, href: "https://www.linkedin.com/company/ellure-consulting-services", label: "LinkedIn" },
                    { icon: Facebook, href: "https://www.facebook.com/ellureconsulting", label: "Facebook" },
                    { icon: Instagram, href: "https://www.instagram.com/ellureconsulting", label: "Instagram" },
                    { icon: MessageCircle, href: "https://wa.me/917517383196", label: "WhatsApp", isWhatsApp: true },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                        item.isWhatsApp 
                          ? "bg-green-500/10 hover:bg-green-500 hover:text-white" 
                          : "bg-primary/10 hover:bg-primary hover:text-primary-foreground"
                      }`}
                      aria-label={item.label}
                    >
                      <item.icon className={`h-6 w-6 ${item.isWhatsApp ? "text-green-600" : "text-primary"}`} />
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
              <Card className="p-8 bg-gradient-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-10" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Business Hours</h2>
                  </div>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-medium">9:00 AM - 2:00 PM</span>
                    </p>
                    <p className="flex justify-between">
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

      <Footer />
    </div>
  );
};

export default Contact;
