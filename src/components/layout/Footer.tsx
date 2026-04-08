import { forwardRef } from "react";
import { Activity } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer ref={ref} className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

        {/* Synoptic Data Attribution */}
        <div className="border-t border-background/10 pt-5">
          <div className="max-w-md mx-auto text-center space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <Activity className="h-4 w-4 text-blue-400/80" />
              <p className="text-background/70 text-sm">
                Weather station data made possible by{" "}
                <a
                  href="https://synopticdata.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-background/90 hover:text-background transition-colors"
                >
                  Synoptic Data
                </a>
                , PBC
              </p>
            </div>
            <p className="text-background/40 text-xs leading-relaxed">
              If your organization finds this tool useful and would like to help
              support weather station data costs,{" "}
              <a
                href="mailto:kaimyers@alaskapacific.edu?subject=Supporting%20Avalanche%20Summary%20Tool"
                className="text-background/55 underline hover:text-background/80 transition-colors"
              >
                please reach out
              </a>
              .
            </p>
          </div>
        </div>

        <p className="text-background/40 text-xs text-center">
          © {currentYear} Avalanche Summary Tool. Data from the National Avalanche Center, NOAA/NWS, and{" "}
          <a href="https://synopticdata.com" target="_blank" rel="noopener noreferrer" className="text-background/55 hover:text-background/80 transition-colors">Synoptic Data</a>.
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
