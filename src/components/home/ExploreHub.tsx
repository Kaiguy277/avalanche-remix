import { FlaskConical, Radio, Wrench, Briefcase, ArrowRight, User, ZoomIn } from "lucide-react";
import { Link } from "react-router-dom";
import glacierResearch from "@/assets/thesis-glacier-edge.jpeg";
import radioImage from "@/assets/radio-show-logo.png";
import fieldwork from "@/assets/fieldwork-atv.png";
import presentation from "@/assets/presentation.jpeg";
import skiPortrait from "@/assets/ski-portrait.jpeg";
import ImageLightbox from "@/components/ui/image-lightbox";

interface Section {
  title: string;
  description: string;
  icon: typeof FlaskConical;
  image: string;
  path: string;
  color: string;
  span?: boolean;
}

const sections: Section[] = [
  {
    title: "K.AI Consulting, LLC",
    description:
      "Practical AI training and hands-on workshops for teams who want to cut through the hype and get real results.",
    icon: Briefcase,
    image: presentation,
    path: "/consulting",
    color: "from-earth/80 to-earth/40",
  },
  {
    title: "Tool Library",
    description: "AI tools I've built for environmental professionals — graph maker, regulatory tools, and more.",
    icon: Wrench,
    image: fieldwork,
    path: "/tools",
    color: "from-accent/80 to-accent/40",
  },
  {
    title: "Research",
    description: "NASA-funded glacier hydrology research, snow science, and environmental monitoring in Alaska.",
    icon: FlaskConical,
    image: glacierResearch,
    path: "/research",
    color: "from-primary/80 to-primary/40",
  },
  {
    title: "Radio",
    description:
      "Archive of my community radio show on KRUA 88.1 FM — Interviews, music, mountain wx & avalanche conditions.",
    icon: Radio,
    image: radioImage,
    path: "/radio",
    color: "from-radio-orange/80 to-radio-orange/40",
  },
  {
    title: "About Me",
    description:
      "Environmental scientist, glacier researcher, ski patroller, and Bristol Bay deckhand. Learn about my journey.",
    icon: User,
    image: skiPortrait,
    path: "/about",
    color: "from-foreground/80 to-foreground/40",
    span: true,
  },
];

const ExploreHub = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Explore</h2>
          <p className="text-lg text-muted-foreground">
            Science, tools, radio, and consulting — all from one Alaskan base camp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.path}
              className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                section.span ? "sm:col-span-2 aspect-[2/1]" : "aspect-[4/3]"
              }`}
            >
              {/* Background Image */}
              <img
                src={section.image}
                alt={section.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${section.color} via-foreground/60 to-transparent`} />

              {/* Zoom button */}
              <div className="absolute top-3 right-3 z-10">
                <ImageLightbox src={section.image} alt={section.title}>
                  <span className="flex items-center justify-center rounded-full bg-foreground/40 p-2 text-background hover:bg-foreground/60 transition-colors">
                    <ZoomIn className="h-4 w-4" />
                  </span>
                </ImageLightbox>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-background">
                <div className="flex items-center gap-2 mb-2">
                  <section.icon className="h-5 w-5 text-background/90" />
                  <h3 className="font-display text-2xl font-bold">{section.title}</h3>
                </div>
                <p className="text-background/80 text-sm mb-3 line-clamp-2">{section.description}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-background/90 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreHub;
