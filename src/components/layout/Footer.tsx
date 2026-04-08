import { forwardRef } from "react";
import { SynopticLogo, BeadedCloudLogo } from "./SponsorLogos";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer ref={ref} className="bg-foreground text-background">
      {/* Sponsor / Data Partner Banner */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-background/40 mb-5">
            Made possible in part by
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <a
              href="https://synopticdata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center transition-opacity hover:opacity-100 opacity-80"
            >
              <SynopticLogo className="h-9 sm:h-10 w-auto text-background" />
            </a>
            <div className="hidden sm:block h-8 w-px bg-background/15" />
            <a
              href="https://beadedcloud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center transition-opacity hover:opacity-100 opacity-80"
            >
              <BeadedCloudLogo className="h-8 sm:h-9 w-auto text-background" />
            </a>
          </div>
          <p className="text-center text-background/35 text-xs mt-5 max-w-md mx-auto leading-relaxed">
            If your organization finds this tool useful and would like to help
            cover weather station data costs,{" "}
            <a
              href="mailto:kaimyers@alaskapacific.edu?subject=Supporting%20Avalanche%20Summary%20Tool"
              className="text-background/50 underline hover:text-background/75 transition-colors"
            >
              please reach out
            </a>
            .
          </p>
        </div>
      </div>

      {/* About + Copyright */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-sm font-semibold text-background/80 mb-2">About</h3>
          <p className="text-background/60 text-sm leading-relaxed">
            Built by Kai Myers, a former ski patroller and current graduate student with a deep appreciation for snowpack and the people who venture into the mountains. This tool was created to make it easier to compare avalanche forecasts, weather observations, and conditions across multiple regions at a glance. If you have questions, feedback, or ideas, feel free to reach out at{" "}
            <a href="mailto:kaimyers@alaskapacific.edu" className="text-background/80 underline hover:text-background transition-colors">kaimyers@alaskapacific.edu</a>.
          </p>
          <p className="text-background/60 text-sm leading-relaxed mt-2">
            Looking for web development, data analytics, or custom AI tools? Check out{" "}
            <a href="https://kaiconsulting.ai" target="_blank" rel="noopener noreferrer" className="text-background/80 underline hover:text-background transition-colors">kaiconsulting.ai</a>.
          </p>
        </div>
        <p className="text-background/40 text-xs text-center">
          © {currentYear} Avalanche Summary Tool. Data from the National Avalanche Center, NOAA/NWS,{" "}
          <a href="https://synopticdata.com" target="_blank" rel="noopener noreferrer" className="text-background/55 hover:text-background/80 transition-colors">Synoptic</a>, and{" "}
          <a href="https://beadedcloud.com" target="_blank" rel="noopener noreferrer" className="text-background/55 hover:text-background/80 transition-colors">Beaded Cloud</a>.
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
