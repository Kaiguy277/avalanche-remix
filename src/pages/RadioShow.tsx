import { useEffect } from "react";
import { Instagram, Radio, ExternalLink, Mail, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import EpisodePlayer from "@/components/radio/EpisodePlayer";
import { analytics } from "@/lib/analytics";
import SEO from "@/components/SEO";
import radioShowLogo from "@/assets/radio-show-logo.png";
import radioAtMic from "@/assets/radio-at-mic.jpg";
import ContactDialog from "@/components/ContactDialog";

const RadioShow = () => {
  useEffect(() => {
    analytics.pageView("Radio Show");
  }, []);

  const handleInstagramClick = () => {
    analytics.externalLinkClicked("https://www.instagram.com/waitwaitdontmaulme/", "Instagram");
  };

  const handleKRUAClick = () => {
    analytics.externalLinkClicked("https://www.kruaradio.org", "KRUA Website");
  };

  return (
    <Layout>
      <SEO
        title="Wait Wait... Don't Maul Me"
        description="A variety radio show on KRUA 88.1 FM Anchorage. Thursdays 8-9 PM. Music, interviews, mountain weather, and avalanche forecasts with Kai Asher the Potato Smasher."
        url="https://kaiconsulting.ai/radio"
      />
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--radio-orange)) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, hsl(var(--radio-orange)) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 md:pt-16 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <img
                src={radioShowLogo}
                alt="Wait Wait... Don't Maul Me - Bear with headphones and microphone"
                className="w-40 h-40 md:w-52 md:h-52 mx-auto rounded-2xl shadow-2xl"
              />
            </div>

            {/* Title */}
            <h1
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-background mb-4 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Wait Wait...
              <span className="block text-radio-orange">Don't Maul Me</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl md:text-2xl text-background/80 mb-6 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              A Variety Show on KRUA 88.1 FM Anchorage
            </p>

            {/* Schedule Badge */}
            <div
              className="inline-flex items-center gap-2 bg-radio-orange/20 border border-radio-orange/30 rounded-full px-6 py-3 mb-8 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Radio className="h-5 w-5 text-radio-orange" />
              <span className="text-background font-medium">Thursdays 8-9 PM</span>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                asChild
                size="lg"
                className="gap-2 bg-radio-orange hover:bg-radio-orange/90 text-white"
                onClick={handleInstagramClick}
              >
                <a href="https://www.instagram.com/waitwaitdontmaulme/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  Follow on Instagram
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 border-radio-orange text-radio-orange hover:bg-radio-orange/10"
                onClick={handleKRUAClick}
              >
                <a href="https://www.kruaradio.org" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  Visit KRUA
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
              About the Show
            </h2>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="relative">
                <img
                  src={radioAtMic}
                  alt="Kai at the microphone in the KRUA studio"
                  className="rounded-xl shadow-xl w-full object-cover aspect-[4/5]"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Hosted by <strong className="text-foreground">Kai Asher the Potato Smasher</strong>,
                  <strong className="text-foreground"> Wait Wait... Don't Maul Me</strong> is a variety show that brings
                  you the best of Alaskan community radio. Each week, tune in for a mix of great music, engaging
                  interviews with local personalities, and informative segments covering everything from mountain
                  weather and avalanche conditions to community events.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Broadcasting live from UAA's KRUA 88.1 FM, the show celebrates the unique spirit of Alaska and the
                  diverse community that calls it home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Want to be Featured Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-radio-orange/10 rounded-full mb-6">
              <Mic className="h-8 w-8 text-radio-orange" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Want to Be Featured?</h2>
            <p className="text-muted-foreground mb-8">
              Have a story to share, an event to promote, or music you'd like played on the show? We'd love to hear from
              you!
            </p>
            <ContactDialog
              emailSubject="Wait Wait... Don't Maul Me - Feature Request"
              trigger={
                <Button size="lg" className="gap-2 bg-radio-orange hover:bg-radio-orange/90 text-white">
                  <Mail className="h-5 w-5" />
                  Get in Touch
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Episode Archive Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
              Episode Archive
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Listen to past episodes and catch up on what you missed.
            </p>

            <EpisodePlayer
              title="Episode 8: Avalanches with Eeva"
              date="February 26, 2026"
              driveFileId="1TpZ8Rg57G5lps2oP3DEUuCQgSJvn-gcC"
              description={
                <>
                  Featuring an interview with Eeva Latosuo, avalanche educator and researcher, about the
                  thirteen avalanche fatalities across North America in the last couple weeks, including a
                  single avalanche that killed nine people in California, marking the deadliest avalanche
                  in the US in forty-five years.
                </>
              }
            />

            <EpisodePlayer
              title="Episode 7: Alaska Search and Rescue Dogs with Erin Boklage"
              date="February 19, 2026"
              driveFileId="1mxXZD_8q8cXFX9oBmaJnisgcGUt2ZIOD"
              description={
                <>
                  Featuring an interview with Erin Boklage from Alaska Search and Rescue Dogs. We talk about K9 SAR
                  disciplines, training, and how the community can get involved, then we open up the phones and take
                  questions.
                </>
              }
            />

            <EpisodePlayer
              title="Episode 6: Skiku with Ryan"
              date="February 12, 2026"
              driveFileId="1tssftUNXVGyWuxSnk9E9t4P39ujeRgMh"
              description={
                <>
                  Featuring an interview with Ryan Terry, the program and development director at Skiku, an organization
                  that helps bring the joys of nordic skiing to school children in remote communities around Alaska.
                  We'll follow that with a mountain weather and avalanche conditions update, and close with some music
                  by Molly Tuttle.
                </>
              }
            />

            <EpisodePlayer
              title="Episode 5: Friday Night Stem with Navid"
              date="February 5, 2026"
              driveFileId="1T5vnCulghgiv3R__aDSHpA2JlnNiKn_Z"
              description={
                <>
                  Featuring an interview with Na'vid Khizri, president of Friday Night STEM, the monthly event that
                  brings local scientists to the East Tudo Kaladis to share their research in accessable 15 minute
                  talks. We also look at an avalanche condition and mountain weather update, hear some of the hosts hot
                  takes about degrees vs radians, and close with some music from Molly Tuttle.
                </>
              }
            />

            <EpisodePlayer
              title="Episode 4: Protest and Call to Action Songs"
              date="January 29, 2026"
              driveFileId="1Zuz6xipfBxeYWBpUMSSTKez4Ua0VCZZD"
              description={
                <>
                  This week we listen to protest and call to action songs to honor the lives of Renee Good and Alex
                  Pretti.
                </>
              }
            />

            <EpisodePlayer
              title="Episode 3: Arctic Entries with Scott"
              date="January 22, 2026"
              driveFileId="1yqeyjSqLT8T37yi-KdEtQDgqopD5OLLy"
              description={
                <>
                  Featuring an interview with Scott Owens, member of the Arctic Entries Storyboard. We talk about the
                  Arctic Entries organization, storytelling in Anchorage, and listen to a few stories, then get a
                  mountain weather and avalanche conditions update, and close with some bands featured in the Anchorage
                  Folk Fest, which is running through next weekend.
                </>
              }
            />

            <EpisodePlayer
              title="Episode 2: Power Lifting with Rob, Rayne, and Tay"
              date="January 15, 2026"
              driveFileId="1pUw7RXxyPARdkjmhFQ3ALTd8dFU3DNRQ"
              description={
                <>
                  Featuring an interview with Coach Rob Schmidt and other members of the Anchorage Barbell power lifting
                  team, plus current mountain weather and avalanche forecast ahead of this atmospheric river event, and
                  some Grateful Dead to honor Bob Weir who died this past weekend.
                </>
              }
            />

            <EpisodePlayer
              title="Episode 1: Mutual Aid Network of Anchorage with Anders"
              date="January 8, 2026"
              driveFileId="1AIUyOtHGdp8YeyETrVZ6MvwmIVz4-G74"
              description={
                <>
                  Featuring an interview with Anders, a community organizer with the Mutual Aid Network of Anchorage
                  (MANA), plus current mountain weather and avalanche conditions, and music from Yusuf/Cat Stevens.
                  Learn more about MANA at{" "}
                  <a
                    href="https://wearemana.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-radio-orange hover:underline"
                  >
                    wearemana.org
                  </a>
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* How to Listen Section */}
      <section className="py-20 bg-gradient-to-br from-radio-orange/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">How to Listen</h2>

            <div className="bg-card border border-border rounded-xl p-8 md:p-10 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Radio className="h-10 w-10 text-radio-orange" />
                <span className="text-4xl font-display font-bold text-foreground">88.1 FM</span>
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                Tune in every <strong className="text-foreground">Thursday from 8-9 PM</strong> on KRUA 88.1 FM in
                Anchorage, Alaska. Can't listen live? Check out the episode archive above or stream online at KRUA's
                website.
              </p>

              <Button
                asChild
                size="lg"
                className="gap-2 bg-radio-orange hover:bg-radio-orange/90 text-white"
                onClick={handleKRUAClick}
              >
                <a href="https://www.kruaradio.org" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  Stream on KRUA Website
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RadioShow;
