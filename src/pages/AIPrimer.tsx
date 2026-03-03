import { Presentation, Clock, Users, Target, CheckCircle2, ArrowRight, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import presentationImage from "@/assets/presentation.jpeg";
import ContactDialog from "@/components/ContactDialog";

const highlights = [
  "What AI actually is (and isn't)—cutting through the hype",
  "Which AI tools are mature and which are still experimental",
  "Realistic expectations for AI in your industry",
  "Quick wins you can implement immediately",
  "Common pitfalls and how to avoid them",
  "Live demonstrations with real-world examples",
];

const audiences = [
  {
    title: "Leadership Teams",
    description: "Understand AI at a strategic level without getting lost in technical details.",
  },
  {
    title: "Departments & Teams",
    description: "Learn how AI might impact your specific workflows and where to start.",
  },
  {
    title: "Organizations & Associations",
    description: "Perfect for conferences, annual meetings, or professional development events.",
  },
];

const AIPrimer = () => {
  return (
    <Layout>
      <SEO
        title="AI Primer"
        description="A jargon-free introduction to AI for teams and organizations. Learn what's real, what's hype, and what's actually useful. 60-90 minute sessions starting at $500."
        url="https://kaiconsulting.ai/ai-primer"
        
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Presentation className="h-4 w-4" />
                <span className="text-sm font-medium">Service</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                AI <span className="text-primary">Primer</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                A clear, jargon-free introduction to AI for teams and organizations who want to understand what's real, what's hype, and what's actually useful.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">60-90 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Any group size</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-medium">Starting at $500</span>
                </div>
              </div>

              <ContactDialog
                emailSubject="AI Primer Inquiry"
                trigger={
                  <Button size="lg" className="gap-2">
                    <Calendar className="h-5 w-5" />
                    Book This Session
                  </Button>
                }
              />
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={presentationImage}
                  alt="Kai presenting to an audience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-primary/20 -z-10" />
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-accent/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              What You'll Learn
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {audiences.map((audience) => (
              <Card key={audience.title} className="border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Agenda */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Sample Agenda
            </h2>
            <div className="space-y-4">
              {[
                { time: "0:00 - 0:10", title: "Welcome & Who I Am", desc: "My background, how I came to AI, and a roadmap for our session" },
                { time: "0:10 - 0:25", title: "AI Demystified", desc: "What AI actually is, what it isn't, how it works under the hood, and common misconceptions" },
                { time: "0:25 - 0:40", title: "Types of Models", desc: "Fast models vs. thinking models, context windows, and the basics of prompt engineering" },
                { time: "0:40 - 0:55", title: "Simple Tools for Any Industry", desc: "Practical wins anyone can use—integrating Granola for meetings and Comet Browser for smarter searching" },
                { time: "0:55 - 1:10", title: "AI Specific to Your Industry", desc: "Exploring specialized tools or discussing how to build custom solutions for your unique use case" },
                { time: "1:10 - 1:30", title: "Q&A & Discussion", desc: "Open floor for questions and conversation" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="text-sm font-mono text-primary whitespace-nowrap">
                    {item.time}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Demystify AI for Your Team?
          </h2>
          <p className="text-background/70 text-lg max-w-2xl mx-auto mb-8">
            Let's discuss your specific needs and customize a session that resonates with your audience.
          </p>
          <ContactDialog
            emailSubject="AI Primer Inquiry"
            trigger={
              <Button size="lg" variant="secondary" className="gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
                <ArrowRight className="h-5 w-5" />
              </Button>
            }
          />
        </div>
      </section>
    </Layout>
  );
};

export default AIPrimer;
