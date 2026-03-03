import { GraduationCap, Award, Building2, Mountain } from "lucide-react";
import helicopterImage from "@/assets/helicopter.jpeg";

const credentials = [
  {
    icon: GraduationCap,
    label: "MS Environmental Science",
    sublabel: "Alaska Pacific University (in progress)",
  },
  {
    icon: Award,
    label: "Qualified Environmental Professional",
    sublabel: "As defined by Alaska DEC",
  },
  {
    icon: Building2,
    label: "Graduate Research Funding",
    sublabel: "NASA, USGS, NIWR, Alaska Energy Authority",
  },
  {
    icon: Mountain,
    label: "Alaska Field Operations",
    sublabel: "Remote science in challenging conditions",
  },
];

const Credibility = () => {
  return (
    <section className="py-20 md:py-28 bg-foreground text-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={helicopterImage}
                alt="Kai in helicopter during mountain rescue work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl bg-primary/20 -z-10" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-accent/20 -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Real Credentials.{" "}
              <span className="text-glacier">Real Experience.</span>
            </h2>
            <p className="text-background/70 text-lg mb-8">
              I bring a unique combination of scientific rigor and practical tech experience. Whether I'm analyzing glacier meltwater data or helping a team adopt AI tools, I approach every problem with the same systematic methodology.
            </p>

            {/* Credentials Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {credentials.map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/5 hover:bg-background/10 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <cred.icon className="h-5 w-5 text-glacier" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{cred.label}</p>
                    <p className="text-background/60 text-xs">{cred.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credibility;
