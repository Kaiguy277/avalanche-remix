import { ArrowDown } from "lucide-react";
import bannerImage from "@/assets/banner-glacier.jpeg";
import skiPortrait from "@/assets/ski-portrait.jpeg";
import ImageLightbox from "@/components/ui/image-lightbox";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={bannerImage}
          alt="Glacier landscape in Alaska"
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-3">
            <p className="text-glacier font-medium text-sm md:text-base tracking-wide uppercase mb-4 animate-fade-in">SCIENTIST · RESEARCHER · CONSULTANT · RADIO HOST

            </p>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-background mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Kai Myers
            </h1>

            <p className="text-lg md:text-xl text-background/80 mb-4 max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>Environmental scientist and glacier researcher based in Anchorage, Alaska. I study snow & ice, build AI tools for real-world problems, and host a community radio show.

            </p>
            <p className="text-base md:text-lg text-background/60 max-w-xl animate-fade-in" style={{ animationDelay: "0.3s" }}>This site is home to my research, consulting work, free tools, and radio archive.

            </p>
          </div>

          {/* Portrait */}
          <div className="hidden lg:block lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-background/10 max-w-xs ml-auto">
              <ImageLightbox src={skiPortrait} alt="Kai Myers portrait">
                <img
                  src={skiPortrait}
                  alt="Kai Myers portrait"
                  className="w-full h-full object-cover" />
              </ImageLightbox>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-background/50" />
      </div>
    </section>);

};

export default Hero;