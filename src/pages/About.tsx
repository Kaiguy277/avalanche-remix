import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import ContactDialog from "@/components/ContactDialog";
import skiPortrait from "@/assets/ski-portrait.jpeg";
import fieldworkImage from "@/assets/fieldwork-atv.png";
import glacierLandscape from "@/assets/glacier-landscape.jpeg";
import fieldwork2 from "@/assets/fieldwork-2.jpeg";
import timelineGlacierResearch from "@/assets/timeline-glacier-research.jpg";
import timelineResconHelicopter from "@/assets/timeline-rescon-helicopter.jpg";
import timelineEnviroSampling from "@/assets/timeline-enviro-sampling.jpg";
import timelineSkiPatrol from "@/assets/timeline-ski-patrol.jpg";
import timelineBristolBay from "@/assets/timeline-bristol-bay.jpg";
import timelineGraduation from "@/assets/timeline-graduation.jpg";

const timeline = [
  {
    year: "2023-Present",
    title: "MS Environmental Science",
    description:
      "Alaska Pacific University. Thesis: Modeling the Hydrology of Dixon Glacier using PyGEM and DETIM. Project funded by NASA Alaska Space Grant, USGS EDMAP Grant Program, and National Institutes for Water Resources. Expected graduation Summer 2026.",
    image: timelineGlacierResearch,
  },
  {
    year: "2023-2024",
    title: "Environmental Scientist",
    description:
      "RESCON Alaska. Performed remedial investigations for remote contaminated sites, integrated modern tools into company workflows, and operated heavy equipment in the field.",
    image: timelineResconHelicopter,
    vertical: true,
  },
  {
    year: "2022",
    title: "Environmental Technician",
    description:
      "Washington State Dept of Agriculture. Measured flow and collected surface water samples, developed rating curves, and reported data to EPA systems.",
    image: timelineEnviroSampling,
  },
  {
    year: "2019-2021",
    title: "Professional Ski Patrol",
    description:
      "Solitude Mountain Resort. Mitigated avalanche hazard using explosives and ski cutting, provided medical care, rescue, and extraction to injured guests, and served as patrol union organizer.",
    image: timelineSkiPatrol,
  },
  {
    year: "2018-2019",
    title: "Bristol Bay Deckhand",
    description:
      "Commercial fishing vessel. Set nets and maintained hydraulics, pumps, and motors during multi-week expeditions at sea.",
    image: timelineBristolBay,
  },
  {
    year: "2018",
    title: "Bachelor of Arts and Sciences",
    description:
      "Quest University Canada. Concentration in Environmental Science. Undergrad thesis modeled the effect of snowpack hardness delta on lateral flow during rain-on-snow events.",
    image: timelineGraduation,
  },
];

const About = () => {
  return (
    <Layout>
      <SEO
        title="About Kai"
        description="Environmental scientist, glacier researcher, and AI consultant. NASA-funded researcher bringing practical AI tools to Alaska professionals."
        url="https://kaiconsulting.ai/about"
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Hi, I'm <span className="text-primary">Kai</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                I'm an environmental scientist, glacier researcher, and cautious AI enthusiast.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                While working on my NASA-funded master's thesis at Alaska Pacific University, I found myself wrestling
                with complex glacier models written in an pld programming language I didn't fully understand. I was
                initially drawn to AI for one simple reason: the ability to use plain language for scripting and
                problem-solving.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                This led me to Claude Code and using agentic AI for many of my day-to-day tasks. I found that while AI
                fell short in many areas, it was a game-changer for my productivity, and the writing is on the wall for
                the next five to ten years.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                I began using AI tools in two ways: as an <strong>efficiency technology</strong>, allowing me to do my
                work faster and better, and as an <strong>opportunity technology</strong>, allowing me to complete
                projects I wouldn't have had the technical ability to attempt before. These include the tools in my Tool
                Library as well as{" "}
                <a
                  href="https://canary.cards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Canary Cards
                </a>
                a platform for sending postcards to elected representatives.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                I started sharing what I'd learned with friends and colleagues, and K.AI Consulting was born.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                My varied background, which includes research science, practical environmental consulting at
                contaminated sites, professional ski patrol, and commercial fishing in Bristol Bay, gives me a
                perspective that most AI advisors lack. I see applications for AI outside the Silicon Valley tech
                bubble, for the "last mile" use cases up here in Alaska where the real work gets done.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img src={skiPortrait} alt="Kai portrait in ski gear" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-2xl bg-primary/20 -z-10" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-accent/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">My Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-6 md:gap-10 items-start ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="w-full md:w-2/5 shrink-0">
                    <div
                      className={`${item.vertical ? "aspect-[3/4]" : "aspect-[4/3]"} rounded-xl overflow-hidden shadow-lg group`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex gap-4 w-full md:w-3/5">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary shrink-0" />
                      {index < timeline.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                    </div>
                    <div className="pb-4">
                      <span className="text-sm font-medium text-primary">{item.year}</span>
                      <h3 className="font-display text-xl font-semibold text-foreground mt-1">{item.title}</h3>
                      <p className="text-muted-foreground mt-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            In the Field
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={fieldworkImage}
                alt="Fieldwork on ATV"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden md:col-span-2">
              <img
                src={glacierLandscape}
                alt="Glacier landscape"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden col-span-2 md:col-span-2">
              <img
                src={fieldwork2}
                alt="Environmental fieldwork"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={skiPortrait}
                alt="Mountain portrait"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">My Approach</h2>
            <p className="text-background/80 text-lg mb-4">
              I believe AI should be a tool, not a personality. It should save you time, reduce friction, and help you
              do better work, not create more complexity or replace your judgment.
            </p>
            <p className="text-background/80 text-lg mb-8">
              When we work together, I'll always be honest about what AI can and can't do. I'll never oversell
              capabilities or push tools you don't need. My goal is to find the smallest set of changes that will have
              the biggest impact on your work.
            </p>
            <ContactDialog
              trigger={
                <Button size="lg" variant="secondary" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Let's Talk
                  <ArrowRight className="h-5 w-5" />
                </Button>
              }
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
