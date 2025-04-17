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
  <div className="lg:col-span-2 md:col-span-1">
    <h4 className="text-base font-medium mb-5">{title}</h4>
    <ul className="space-y-3">
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
    { to: "/integrations", text: "Integrations" },
    { to: "/updates", text: "Updates" }
  ];

  const resourceLinks: FooterLink[] = [
    { to: "/help", text: "Help Center" },
    { to: "/privacy", text: "Privacy" },
    { to: "/terms", text: "Terms" },
    { to: "/security", text: "Security" }
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Company Info */}
          <div className="space-y-5 lg:col-span-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="./glimpse.webp" alt="logo" width={150} height={100} decoding="async" loading="lazy" />
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Connecting people through high-quality, secure video meetings that are accessible to everyone, everywhere.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={Facebook} label="Facebook" />
              <SocialIcon icon={Twitter} label="Twitter" />
              <SocialIcon icon={Instagram} label="Instagram" />
              <SocialIcon icon={Linkedin} label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <FooterLinkGroup title="Product" links={productLinks} />
          <FooterLinkGroup title="Resources" links={resourceLinks} />

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-medium mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-muted-foreground" />
                <a href="mailto:support@glimpse.app" className="text-muted-foreground hover:text-foreground transition-colors">
                  support@glimpse.app
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-medium mb-5">Newsletter</h4>
            <p className="text-muted-foreground mb-3 text-sm">Stay updated with our latest features and news</p>
            <form className="flex flex-col space-y-3">
              <div className="flex">
                <Input
                  placeholder="Your email address"
                  type="email"
                  className="rounded-r-none border-r-0 focus-visible:ring-primary-foreground"
                  required
                />
                <Button
                  type="submit"
                  className="rounded-l-none hover:bg-primary/90 transition-colors"
                >
                  <Send size={16} className="text-white" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">We respect your privacy. No spam.</p>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Glimpse. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Crafted with <span className="text-red-500">❤️</span> by <Link to="https://github.com/develop-programs" className="hover:text-primary transition-colors font-medium" target="_blank">Shreyansh Awadhiya</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
