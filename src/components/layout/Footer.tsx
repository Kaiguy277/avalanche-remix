import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();
  return <footer ref={ref} className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="K.AI Consulting" className="h-10 w-auto brightness-0 invert" />
              <span className="font-display text-xl font-semibold">K.AI Consulting</span>
            </Link>
            <p className="text-background/70 max-w-md mb-6">
              Practical AI consulting for real-world professionals. Cut through the hype and get results that matter.
            </p>
            <div className="flex items-center gap-2 text-background/70">
              <MapPin className="h-4 w-4" />
              <span>Alaska & Remote</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/ai-primer" className="text-background/70 hover:text-background transition-colors">
                AI Primer
              </Link>
              <Link to="/workshop" className="text-background/70 hover:text-background transition-colors">
                Hands-On Workshop
              </Link>
              <Link to="/radio" className="text-background/70 hover:text-background transition-colors">
                Radio Show
              </Link>
              <Link to="/tools" className="text-background/70 hover:text-background transition-colors">Tool Library</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:kaimyers@alaskapacific.edu" className="inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Mail className="h-4 w-4" />
                kaimyers@alaskapacific.edu
              </a>
              <a href="tel:916-955-8064" className="inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Phone className="h-4 w-4" />
                (916) 955-8064
              </a>
              <a href="https://www.linkedin.com/in/kai-myers-26a875b6/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {currentYear} K.AI Consulting LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/about" className="text-background/60 hover:text-background transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>;
});
Footer.displayName = "Footer";
export default Footer;