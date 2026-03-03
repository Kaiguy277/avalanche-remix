import { forwardRef } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics";
import ContactDialog from "@/components/ContactDialog";

const CTA = forwardRef<HTMLElement>((_, ref) => {
  const handleCtaClick = () => {
    analytics.ctaClicked('get_in_touch', 'cta_section');
  };

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
          Ready to Make AI Work for You?
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
          Let's have a conversation about your needs. No pressure, no jargon—just a straightforward discussion about how AI might (or might not) help your work.
        </p>
        <ContactDialog
          trigger={
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-base font-semibold"
              onClick={handleCtaClick}
            >
              <Mail className="h-5 w-5" />
              Get in Touch
              <ArrowRight className="h-5 w-5" />
            </Button>
          }
        />
      </div>
    </section>
  );
});

CTA.displayName = "CTA";

export default CTA;
