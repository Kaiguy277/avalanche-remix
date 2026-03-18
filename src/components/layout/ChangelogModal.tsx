import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface ChangelogEntry {
  date: string;
  version?: string;
  title: string;
  items: string[];
}

const changelog: ChangelogEntry[] = [
  {
    date: "March 18, 2026",
    title: "Improved Forecast Caching",
    items: [
      "Added afternoon forecast refresh (1 PM AKST) to catch late-published forecasts",
      "Parallel batch processing for faster daily caching — all 92 zones now reliably cached",
      "Video intro plays fully before results appear, even with cached data",
    ],
  },
  {
    date: "March 15, 2026",
    title: "Nationwide Expansion",
    items: [
      "Added 28 avalanche centers covering all US regions",
      "Colorado, Utah, Pacific Northwest, Idaho, Montana, Wyoming, and more",
      "Proactive daily caching for fast page loads",
    ],
  },
  {
    date: "March 10, 2026",
    title: "Weather Station Integration",
    items: [
      "Real-time SNOTEL and Synoptic weather observations",
      "Temperature sparklines for 24-hour trends",
      "Curated station selection per zone for representative coverage",
    ],
  },
  {
    date: "March 5, 2026",
    title: "Initial Launch",
    items: [
      "AI-synthesized avalanche forecast summaries",
      "Side-by-side zone comparison for Alaska centers",
      "NWS weather forecast integration",
    ],
  },
];

const ChangelogModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">What's New</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">What's New</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          {changelog.map((entry, i) => (
            <div key={i} className="relative pl-4 border-l-2 border-primary/30">
              <p className="text-xs text-muted-foreground font-medium">{entry.date}</p>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">{entry.title}</h3>
              <ul className="mt-1.5 space-y-1">
                {entry.items.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground leading-snug">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangelogModal;
