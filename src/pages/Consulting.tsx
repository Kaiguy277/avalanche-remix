import { Presentation, Clock, Users, Target, CheckCircle2, ArrowRight, Mail, Calendar, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import presentationImage from "@/assets/presentation.jpeg";
import glacierWorkImage from "@/assets/glacier-work.jpeg";
import ContactDialog from "@/components/ContactDialog";
import { useSearchParams } from "react-router-dom";

// --- AI Primer Data ---
const primerHighlights = [
"What AI actually is (and isn't)—cutting through the hype",
"Which AI tools are mature and which are still experimental",
"Realistic expectations for AI in your industry",
"Quick wins you can implement immediately",
"Common pitfalls and how to avoid them",
"Live demonstrations with real-world examples"];


const audiences = [
{ title: "Leadership Teams", description: "Understand AI at a strategic level without getting lost in technical details." },
{ title: "Departments & Teams", description: "Learn how AI might impact your specific workflows and where to start." },
{ title: "Organizations & Associations", description: "Perfect for conferences, annual meetings, or professional development events." }];


const primerAgenda = [
{ time: "0:00 - 0:10", title: "Welcome & Who I Am", desc: "My background, how I came to AI, and a roadmap for our session" },
{ time: "0:10 - 0:25", title: "AI Demystified", desc: "What AI actually is, what it isn't, how it works under the hood, and common misconceptions" },
{ time: "0:25 - 0:40", title: "Types of Models", desc: "Fast models vs. thinking models, context windows, and the basics of prompt engineering" },
{ time: "0:40 - 0:55", title: "Simple Tools for Any Industry", desc: "Practical wins anyone can use—integrating Granola for meetings and Comet Browser for smarter searching" },
{ time: "0:55 - 1:10", title: "AI Specific to Your Industry", desc: "Exploring specialized tools or discussing how to build custom solutions for your unique use case" },
{ time: "1:10 - 1:30", title: "Q&A & Discussion", desc: "Open floor for questions and conversation" }];


// --- Workshop Data ---
const workshopFormats = [
{
  title: "Half-Day Workshop",
  duration: "4 hours",
  price: "Starting at $999",
  description: "Focused deep-dive on a specific AI use case or tool implementation.",
  includes: ["Pre-workshop needs assessment", "Hands-on tool setup and training", "Custom workflow integration", "30-day follow-up support"]
},
{
  title: "Full-Day Workshop",
  duration: "8 hours",
  price: "Starting at $1,999",
  description: "Comprehensive AI integration covering multiple tools and workflows.",
  includes: ["Extended needs assessment", "Multiple tool implementations", "Team training and documentation", "60-day follow-up support", "Custom prompts and templates"]
}];


const sampleItinerary = [
{ time: "8:00 - 8:15", title: "Welcome & Coffee", desc: "Introductions, goals for the day, and workshop overview", audience: "Whole Team" },
{ time: "8:15 - 9:15", title: "AI Fundamentals", desc: "Types of models (fast vs. thinking), model selection, prompt engineering, context engineering, and understanding where AI excels vs. where it falls short", audience: "Whole Team" },
{ time: "9:15 - 9:45", title: "Needs Assessment Review", desc: "Review pre-workshop survey results and prioritize focus areas for your organization", audience: "Whole Team" },
{ time: "9:45 - 10:00", title: "Break", desc: "15 minutes" },
{ time: "10:00 - 10:20", title: "Hands-On: First Prompts", desc: "Breakout session—practice prompting in ChatGPT with real tasks from your work", audience: "Whole Team" },
{ time: "10:20 - 10:45", title: "The Power of Context", desc: "Load documentation into a ChatGPT Project together and see how context dramatically improves results", audience: "Whole Team" },
{ time: "10:45 - 11:00", title: "Break", desc: "15 minutes" },
{ time: "11:00 - 12:00", title: "Tool Tour: Kai's Favorites", desc: "Hands-on demos of Granola (meeting notes), Comet Browser (AI-powered search), and NanoBanana (image editing)—set up each tool and explore which ones resonate", audience: "Whole Team" },
{ time: "12:00 - 1:00", title: "Working Lunch", desc: "Continued exploration with informal Q&A", audience: "Whole Team" },
{ time: "1:00 - 2:30", title: "Technical Session 1: Field Data & Compliance Automation", desc: "Set up Claude Code in VS Code, connect to environmental data workflows. Build prompts for Phase I/II report drafting, ADEC regulatory lookups, and field sampling data QA/QC", audience: "Technical Team" },
{ time: "2:30 - 2:45", title: "Break", desc: "15 minutes" },
{ time: "2:45 - 4:00", title: "Technical Session 2: Construction & Project Documentation", desc: "Create Claude Code subagents for generating daily construction logs, drafting RFIs and change order responses, and automating equipment/materials tracking summaries", audience: "Technical Team" },
{ time: "4:00 - 4:30", title: "Wrap-Up & Next Steps", desc: "Documentation handoff, troubleshooting tips, and 60-day follow-up plan", audience: "Technical Team" }];


const workshopTopics = [
"Setting up Claude or ChatGPT for your specific workflows",
"Automating repetitive document tasks",
"Creating custom prompts and templates",
"Integrating AI into your existing tools",
"Building a note-taking and research system",
"Data analysis and visualization with AI assistance",
"Writing and editing workflows",
"Meeting summaries and action item tracking"];


const Consulting = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "workshop" ? "workshop" : "primer";

  return (
    <Layout>
      <SEO
        title="K.AI Consulting, LLC"
        description="Practical AI training and hands-on workshops for teams. Jargon-free AI Primer sessions and customized workshops from an environmental scientist who uses AI every day."
        url="https://kaiconsulting.ai/consulting" />


      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            K.AI <span className="text-primary">Consulting, LLC</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Practical AI training from a scientist who uses these tools every day. Two offerings designed to meet you where you are.
          </p>
        </div>
      </section>

      {/* Tabbed Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue={defaultTab} className="max-w-5xl mx-auto">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-12 h-14 p-1.5 bg-secondary">
              <TabsTrigger value="primer" className="gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-full">
                <Presentation className="h-5 w-5" />
                AI Primer
              </TabsTrigger>
              <TabsTrigger value="workshop" className="gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-full">
                <Wrench className="h-5 w-5" />
                Hands-On Workshop
              </TabsTrigger>
            </TabsList>

            {/* === AI PRIMER TAB === */}
            <TabsContent value="primer" className="space-y-20">
              {/* Overview */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    AI Primer
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                    A clear, jargon-free introduction to AI for teams and organizations who want to understand what's real, what's hype, and what's actually useful.
                  </p>
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
                      <span className="font-medium">Starting at $299</span>
                    </div>
                  </div>
                  <ContactDialog
                    emailSubject="AI Primer Inquiry"
                    trigger={
                    <Button size="lg" className="gap-2">
                        <Calendar className="h-5 w-5" />
                        Book This Session
                      </Button>
                    } />

                </div>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img src={presentationImage} alt="Kai presenting to an audience" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-primary/20 -z-10" />
                </div>
              </div>

              {/* What You'll Learn */}
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">What You'll Learn</h3>
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {primerHighlights.map((item) =>
                  <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Perfect For */}
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Perfect For</h3>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {audiences.map((a) =>
                  <Card key={a.title} className="border-border/50">
                      <CardContent className="pt-6">
                        <h4 className="font-display text-xl font-semibold text-foreground mb-2">{a.title}</h4>
                        <p className="text-muted-foreground text-sm">{a.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Sample Agenda */}
              <div className="max-w-3xl mx-auto">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Sample Agenda</h3>
                <div className="space-y-4">
                  {primerAgenda.map((item, i) =>
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                      <div className="text-sm font-mono text-primary whitespace-nowrap">{item.time}</div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* === WORKSHOP TAB === */}
            <TabsContent value="workshop" className="space-y-20">
              {/* Overview */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Hands-On AI Workshop
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                    Roll up your sleeves and actually build something. We'll assess your needs, select the right tools, and get them working in your real workflows.
                  </p>
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Half or full day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-medium">1-10 participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-medium">Starting at $999</span>
                    </div>
                  </div>
                  <ContactDialog
                    emailSubject="AI Workshop Inquiry"
                    trigger={
                    <Button size="lg" className="gap-2">
                        <Calendar className="h-5 w-5" />
                        Schedule a Workshop
                      </Button>
                    } />

                </div>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img src={glacierWorkImage} alt="Kai working in the field" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-xl bg-accent/20 -z-10" />
                </div>
              </div>

              {/* Workshop Options */}
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Workshop Options</h3>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {workshopFormats.map((format) =>
                  <Card key={format.title} className="border-border/50 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary">{format.duration}</span>
                          <span className="text-sm font-semibold text-foreground">{format.price}</span>
                        </div>
                        <CardTitle className="font-display text-2xl">{format.title}</CardTitle>
                        <p className="text-muted-foreground">{format.description}</p>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold text-sm text-foreground mb-3">What's Included:</h4>
                        <ul className="space-y-2">
                          {format.includes.map((item) =>
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                        )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* What We Might Work On */}
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">What We Might Work On</h3>
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {workshopTopics.map((item) =>
                  <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{item}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Itinerary */}
              <div className="max-w-3xl mx-auto">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-4">Sample Full-Day Itinerary</h3>
                <p className="text-center text-muted-foreground mb-8">Every workshop is customized, but here's what a typical full-day session looks like:</p>
                <div className="space-y-3">
                  {sampleItinerary.map((item, i) =>
                  <div
                    key={i}
                    className={`flex gap-4 p-4 rounded-xl hover:shadow-sm transition-shadow ${
                    item.audience === "Technical Team" ? "bg-primary/5 border border-primary/20" : "bg-card"}`
                    }>

                      <div className="text-sm font-mono text-primary whitespace-nowrap min-w-[100px]">{item.time}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          {item.audience &&
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.audience === "Technical Team" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`
                        }>
                              {item.audience}
                            </span>
                        }
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Make AI Work for Your Team?
          </h2>
          <p className="text-background/70 text-lg max-w-2xl mx-auto mb-8">
            Let's discuss your needs and find the right format—whether that's a quick primer or a deep-dive workshop.
          </p>
          <ContactDialog
            emailSubject="K.AI Consulting Inquiry"
            trigger={
            <Button size="lg" variant="secondary" className="gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
                <ArrowRight className="h-5 w-5" />
              </Button>
            } />

        </div>
      </section>
    </Layout>);

};

export default Consulting;