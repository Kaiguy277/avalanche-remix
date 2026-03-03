import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { analytics } from "@/lib/analytics";
import ContactDialog from "@/components/ContactDialog";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Consulting", path: "/consulting" },
    { name: "About", path: "/about" },
    { name: "Research", path: "/research" },
    { name: "Radio", path: "/radio" },
    { name: "Tools", path: "/tools" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (linkName: string, path: string) => {
    analytics.navigationClicked(path, 'header');
  };

  const handleCtaClick = () => {
    analytics.ctaClicked('get_in_touch', 'header');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" onClick={() => handleNavClick('Home', '/')}>
            <img src={logo} alt="K.AI Consulting" className="h-10 md:h-12 w-auto" />
            <span className="hidden sm:block font-display text-lg font-semibold text-foreground">
              K.AI Consulting
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => handleNavClick(link.name, link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <ContactDialog
              trigger={
                <Button size="sm" className="gap-2" onClick={handleCtaClick}>
                  <Mail className="h-4 w-4" />
                  Get in Touch
                </Button>
              }
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => { setIsOpen(false); handleNavClick(link.name, link.path); }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <ContactDialog
                trigger={
                  <button
                    onClick={handleCtaClick}
                    className="mt-2 w-full flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    <Mail className="h-4 w-4" />
                    Get in Touch
                  </button>
                }
              />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
