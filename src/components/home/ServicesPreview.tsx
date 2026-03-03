import { Presentation, Users, ArrowRight, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Presentation,
    title: "AI Primer",
    description: "A clear, jargon-free introduction to AI for teams who want to understand what's real, what's hype, and what's actually useful for their work.",
    duration: "60-90 minutes",
    price: "Starting at $499",
    path: "/ai-primer",
    features: ["Demystify AI concepts", "Realistic expectations", "Quick wins to implement"],
  },
  {
    icon: Users,
    title: "Hands-On AI Workshop",
    description: "Roll up your sleeves and actually build something. A practical workshop where we assess your needs, select the right tools, and get them working.",
    duration: "Half-day or full-day",
    price: "Starting at $999",
    path: "/workshop",
    features: ["Needs assessment", "Tool selection & setup", "Follow-up support"],
  },
];

const ServicesPreview = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How I Can Help
          </h2>
          <p className="text-lg text-muted-foreground">
            Two focused offerings designed to meet you where you are—whether you're just curious about AI or ready to implement it today.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-primary">
                    <DollarSign className="h-4 w-4" />
                    {service.price}
                  </div>
                </div>

                {/* CTA */}
                <Button asChild className="w-full gap-2 group-hover:gap-3 transition-all">
                  <Link to={service.path}>
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
