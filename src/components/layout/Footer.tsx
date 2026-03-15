import { forwardRef } from "react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer ref={ref} className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-background/60 text-sm text-center">
          © {currentYear} Avalanche Summary Tool. Data from the National Avalanche Center, NOAA/NWS, and the Synoptic weather station network.
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
