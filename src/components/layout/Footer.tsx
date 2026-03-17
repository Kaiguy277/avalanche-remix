import { forwardRef } from "react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer ref={ref} className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-sm font-semibold text-background/80 mb-2">About This Dashboard</h3>
          <p className="text-background/60 text-sm leading-relaxed">
            A daily conditions dashboard for Chugach Powder Guides operations, aggregating avalanche forecasts, mountain weather, and live station observations for the Chugach Range and surrounding areas.
          </p>
          <p className="text-background/60 text-sm leading-relaxed mt-2">
            Built by{" "}
            <a href="https://kaiconsulting.ai" target="_blank" rel="noopener noreferrer" className="text-background/80 underline hover:text-background transition-colors">K.AI Consulting</a>.
          </p>
        </div>
        <p className="text-background/60 text-sm text-center">
          © {currentYear} Chugach Powder Guides. Data from the National Avalanche Center, NOAA/NWS, and the Synoptic weather station network. Dashboard by K.AI Consulting.
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
