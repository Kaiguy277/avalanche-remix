import { FlaskConical, Target, Zap, Shield, Mountain } from "lucide-react";

const differentiators = [
  {
    icon: FlaskConical,
    title: "Scientist First",
    description: "I'm not a tech bro—I'm an environmental scientist with a MS in progress and years of field experience. I approach AI with the same rigor I bring to research.",
  },
  {
    icon: Target,
    title: "Battle-Tested Tools",
    description: "Every tool I recommend is one I use daily for real work: grant applications, data analysis, glacier modeling, and more.",
  },
  {
    icon: Zap,
    title: "No Hype, Just Results",
    description: "I'll tell you what AI can't do just as readily as what it can. My goal is to save you time and money, not sell you dreams.",
  },
  {
    icon: Shield,
    title: "Your Context Matters",
    description: "Generic AI advice is useless. I learn your specific challenges and workflows to deliver solutions that actually fit.",
  },
  {
    icon: Mountain,
    title: "Remote Alaska Tested",
    description: "I've done science in Alaska's backcountry where there's no IT support and solutions must actually work. That mindset shapes every recommendation I make.",
  },
];

const WhyKai = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Work With Me?
          </h2>
          <p className="text-lg text-muted-foreground">
            I'm not here to dazzle you with buzzwords. I'm here to help you actually get things done.
          </p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentiators.map((item, index) => (
            <div
              key={item.title}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKai;
