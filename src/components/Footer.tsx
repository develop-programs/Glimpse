import { Link } from "react-router";
import { Mail, Phone, Instagram, Twitter, Facebook, Linkedin, Send, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Type definitions
interface SocialIconProps {
  icon: LucideIcon;
  label: string;
  href?: string;
}

interface FooterLink {
  to: string;
  text: string;
}

interface FooterLinkGroupProps {
  title: string;
  links: FooterLink[];
}

// Reusable components to simplify structure
const SocialIcon: React.FC<SocialIconProps> = ({ icon: Icon, label, href = "#" }) => (
  <a href={href} aria-label={label} className="text-muted-foreground hover:text-primary transition-colors">
    <Icon size={20} />
  </a>
);

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => (
  <div className="w-full sm:w-auto">
    <h4 className="text-base font-medium mb-4">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((link, i) => (
        <li key={i}>
          <Link to={link.to} className="text-muted-foreground hover:text-foreground transition-colors">
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const productLinks: FooterLink[] = [
    { to: "/features", text: "Features" },
    { to: "/pricing", text: "Pricing" },
    { to: "/contacts", text: "Contacts" },
  ];

  const resourceLinks: FooterLink[] = [
    { to: "/help", text: "Help Center" },
    { to: "/privacy", text: "Privacy" },
    { to: "/terms", text: "Terms" },
    { to: "/security", text: "Security" }
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 py-12 sm:py-16 md:py-20">
      <div className="container px-4 mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-4">
            <Link to="/" className="inline-block">
              <img src="./glimpse.webp" alt="logo" width={130} height={90} decoding="async" loading="lazy" className="max-w-[130px]" />
            </Link>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xs">
              Connecting people through high-quality, secure video meetings that are accessible to everyone, everywhere.
            </p>
            <div className="flex space-x-5 pt-1">
              <SocialIcon icon={Facebook} label="Facebook" />
              <SocialIcon icon={Twitter} label="Twitter" />
              <SocialIcon icon={Instagram} label="Instagram" />
              <SocialIcon icon={Linkedin} label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:col-span-8 lg:pl-8">
            <FooterLinkGroup title="Product" links={productLinks} />
            <FooterLinkGroup title="Resources" links={resourceLinks} />

            {/* Contact Info */}
            <div className="w-full sm:w-auto">
              <h4 className="text-base font-medium mb-4">Contact</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center space-x-2">
                  <Mail size={16} className="text-muted-foreground shrink-0" />
                  <a href="mailto:support@glimpse.app" className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base">
                    support@glimpse.app
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone size={16} className="text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-sm sm:text-base">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Newsletter - Full width on mobile */}
        <div className="w-full grid place-content-center mt-6">
          <div className="max-w-6xl mx-auto">
            <h4 className="text-base font-medium mb-3">Newsletter</h4>
            <p className="text-muted-foreground mb-3 text-sm">Stay updated with our latest features</p>
            <form className="flex flex-col space-y-2">
              <div className="flex max-w-[320px]">
                <Input
                  placeholder="Your email address"
                  type="email"
                  className="rounded-r-none border-r-0 text-sm focus-visible:ring-primary-foreground"
                  required
                />
                <Button
                  type="submit"
                  className="rounded-l-none hover:bg-primary/90 transition-colors px-3"
                >
                  <Send size={15} className="text-white" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">We respect your privacy. No spam.</p>
            </form>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-border mt-10 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs sm:text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Glimpse. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              Crafted with <span className="text-red-500">❤️</span> by <Link to="https://github.com/develop-programs" className="hover:text-primary transition-colors font-medium" target="_blank">Shreyansh Awadhiya</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
