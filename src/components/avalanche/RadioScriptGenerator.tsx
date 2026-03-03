import { useState } from "react";
import { Radio, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";
import type {
  AvalancheSummary,
  AvalancheZone,
  AvalancheProblem,
  DangerRating,
} from "@/lib/api/avalanche";

interface RadioScriptGeneratorProps {
  summary: AvalancheSummary;
}

function formatDateForScript(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatDangerRating(rating: DangerRating): string {
  const labels: Record<DangerRating, string> = {
    LOW: "LOW",
    MODERATE: "MODERATE",
    CONSIDERABLE: "CONSIDERABLE",
    HIGH: "HIGH",
    EXTREME: "EXTREME",
    NO_RATING: "No Rating",
  };
  return labels[rating] || rating;
}

function getSizeDescription(size: number): string {
  if (size <= 1) return "Small";
  if (size <= 1.5) return "Small to Large";
  if (size <= 2) return "Large";
  if (size <= 2.5) return "Large to Very Large";
  if (size <= 3) return "Very Large";
  if (size <= 3.5) return "Very Large to Historic";
  return "Historic";
}

function formatSizeForSpeech(size: { min: number; max: number } | null): string {
  if (!size) return "";
  if (size.min === size.max) {
    return `D${size.min} ${getSizeDescription(size.min)}`;
  }
  return `D${size.min} to D${size.max}, ${getSizeDescription(size.min)} to ${getSizeDescription(size.max)}`;
}

function formatProblemNaturally(problem: AvalancheProblem, isFirst: boolean): string {
  let sentence = "";
  
  // Build natural sentence structure
  if (isFirst) {
    sentence = `The primary concern is ${problem.name}`;
  } else {
    sentence = `We are also watching ${problem.name}`;
  }
  
  // Add likelihood naturally
  if (problem.likelihood) {
    const likelihood = problem.likelihood.toLowerCase();
    if (likelihood.includes("likely")) {
      sentence += ` that ${likelihood.includes("very") ? "are very likely" : "are likely"} to trigger`;
    } else if (likelihood.includes("possible")) {
      sentence += ` that could possibly trigger`;
    } else {
      sentence += ` that are ${likelihood}`;
    }
  }
  
  // Add size naturally
  if (problem.size) {
    sentence += `, with potential sizes reaching ${formatSizeForSpeech(problem.size)}`;
  }
  
  sentence += ".";
  
  // Add discussion if meaningful and not too long
  if (problem.discussion && problem.discussion.length < 200) {
    sentence += ` ${problem.discussion}`;
  }
  
  return sentence;
}

function getElevationDangerNatural(zone: AvalancheZone): string {
  const todayForecast = zone.forecast?.[0];
  if (!todayForecast) return "Danger rating is not available";
  
  const { alpine, treeline, belowTreeline } = todayForecast.danger;
  
  // All same rating
  if (alpine === treeline && treeline === belowTreeline) {
    if (alpine === "NO_RATING") {
      return "There is no current danger rating";
    }
    return `Danger is ${formatDangerRating(alpine)} across all elevations`;
  }
  
  // Alpine and treeline same, below different
  if (alpine === treeline && treeline !== belowTreeline) {
    return `Danger is ${formatDangerRating(alpine)} in the alpine and at treeline, dropping to ${formatDangerRating(belowTreeline)} below treeline`;
  }
  
  // All different - natural flow
  return `Danger is ${formatDangerRating(alpine)} in the alpine, ${formatDangerRating(treeline)} at treeline, and ${formatDangerRating(belowTreeline)} below treeline`;
}

function buildWeatherNarrative(summary: AvalancheSummary): string {
  // Collect unique weather info
  const snowInfo: string[] = [];
  const windInfo: string[] = [];
  const tempInfo: string[] = [];
  
  for (const zone of summary.zones) {
    if (zone.weather) {
      if (zone.weather.snow && zone.weather.snow !== "N/A") {
        const normalized = zone.weather.snow.trim();
        if (!snowInfo.some(s => s.toLowerCase() === normalized.toLowerCase())) {
          snowInfo.push(normalized);
        }
      }
      if (zone.weather.wind && zone.weather.wind !== "N/A") {
        const normalized = zone.weather.wind.trim();
        if (!windInfo.some(w => w.toLowerCase() === normalized.toLowerCase())) {
          windInfo.push(normalized);
        }
      }
      if (zone.weather.temps && zone.weather.temps !== "N/A") {
        const normalized = zone.weather.temps.trim();
        if (!tempInfo.some(t => t.toLowerCase() === normalized.toLowerCase())) {
          tempInfo.push(normalized);
        }
      }
    }
  }
  
  const sentences: string[] = [];
  
  if (snowInfo.length > 0) {
    sentences.push(snowInfo.join(" "));
  }
  
  if (windInfo.length > 0) {
    sentences.push(windInfo.join(" "));
  }
  
  if (tempInfo.length > 0) {
    sentences.push(tempInfo.join(" "));
  }
  
  if (sentences.length === 0) {
    // Fallback to weatherHighlights but clean it up
    return summary.weatherHighlights || "Check CNFAIC.org or HPAvalanche.org for current weather conditions.";
  }
  
  return sentences.join(" ");
}

function getShortZoneName(name: string): string {
  // Simplify zone names for speech
  if (name.toLowerCase().includes("turnagain")) return "Turnagain Pass";
  if (name.toLowerCase().includes("summit")) return "Summit Lake";
  if (name.toLowerCase().includes("seward")) return "Seward and Lost Lake";
  if (name.toLowerCase().includes("chugach state")) return "Chugach State Park";
  if (name.toLowerCase().includes("hatcher")) return "Hatcher Pass";
  return name.split("(")[0].trim(); // Remove parenthetical
}

function groupZonesByDanger(zones: AvalancheZone[]): Map<string, AvalancheZone[]> {
  const groups = new Map<string, AvalancheZone[]>();
  
  for (const zone of zones) {
    const todayForecast = zone.forecast?.[0];
    if (!todayForecast) continue;
    
    const { alpine, treeline, belowTreeline } = todayForecast.danger;
    // Create a key based on danger pattern
    const key = `${alpine}-${treeline}-${belowTreeline}`;
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(zone);
  }
  
  return groups;
}

function generateRadioScript(summary: AvalancheSummary): string {
  const currentDate = formatDateForScript(new Date());
  const lines: string[] = [];
  
  // Opening - match the example style
  lines.push(`Good evening, Southcentral Alaska. This is Wait Wait... Don't Maul Me, and I am Kai Asher, the Potato Smasher, here on KRUA 88.1 FM Anchorage.`);
  lines.push("");
  
  // Big Picture - use quickTake but make it flow
  lines.push("[THE BIG PICTURE]");
  lines.push("");
  lines.push(summary.quickTake);
  lines.push("");
  
  // Mountain Weather - consolidated narrative
  lines.push("[MOUNTAIN WEATHER]");
  lines.push("");
  lines.push(buildWeatherNarrative(summary));
  lines.push("");
  
  // Regional Breakdown - natural speech, group similar zones
  lines.push("[CURRENT CONDITIONS & RATINGS]");
  lines.push("");
  
  // Check if zones share similar conditions to consolidate
  const dangerGroups = groupZonesByDanger(summary.zones);
  
  // If multiple zones share exact same danger ratings and similar problems, consolidate them
  if (dangerGroups.size < summary.zones.length) {
    // Some zones can be grouped
    for (const [_, groupZones] of dangerGroups) {
      if (groupZones.length > 1) {
        // Check if problems are similar enough to consolidate
        const problemTypes = new Set<string>();
        groupZones.forEach(z => z.problems?.forEach(p => problemTypes.add(p.name)));
        
        if (problemTypes.size <= 2) {
          // Consolidate these zones
          const zoneNames = groupZones.map(z => getShortZoneName(z.name)).join(", ");
          const firstZone = groupZones[0];
          
          lines.push(`Across ${zoneNames}, ${getElevationDangerNatural(firstZone).toLowerCase()}.`);
          
          // Combine problems from all zones, deduplicated
          const seenProblems = new Set<string>();
          let problemIndex = 0;
          for (const zone of groupZones) {
            for (const problem of zone.problems || []) {
              if (!seenProblems.has(problem.name)) {
                seenProblems.add(problem.name);
                lines.push(formatProblemNaturally(problem, problemIndex === 0));
                problemIndex++;
              }
            }
          }
          lines.push("");
          continue;
        }
      }
      
      // Handle individually if can't consolidate
      for (const zone of groupZones) {
        writeZoneSection(zone, lines);
      }
    }
  } else {
    // All zones have different conditions, write each one
    for (const zone of summary.zones) {
      writeZoneSection(zone, lines);
    }
  }
  
  // Bottom Line - use as closing summary
  lines.push("[THE BOTTOM LINE]");
  lines.push("");
  if (summary.bottomLine) {
    lines.push(summary.bottomLine);
  } else {
    lines.push("Exercise caution in avalanche terrain and check forecasts before heading out.");
  }
  lines.push("");
  
  // Closing - match the example tone
  lines.push("[CLOSING]");
  lines.push("");
  lines.push("Check for final morning updates at CNFAIC.org or HPAvalanche.org. Stay safe, watch your partner, and we will see you on the trails.");
  lines.push("");
  lines.push(`This has been the Wait Wait... Don't Maul Me Mountain Weather and Avalanche Report for Thursday, ${currentDate}.`);
  
  return lines.join("\n");
}

function writeZoneSection(zone: AvalancheZone, lines: string[]): void {
  const shortName = getShortZoneName(zone.name);
  
  // Check if forecast is expired
  const isExpired = zone.freshness?.status === "expired";
  
  if (isExpired) {
    lines.push(`Moving to ${shortName}, the forecast here is expired. ${zone.keyMessage || "Check the avalanche center website for updates."}`);
    lines.push("");
    return;
  }
  
  // Natural transition phrases
  const transitions = ["Starting with", "Moving to", "Over in", "In", "At"];
  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  
  lines.push(`${transition} ${shortName}, ${getElevationDangerNatural(zone).toLowerCase()}.`);
  
  // Problems - written naturally
  if (zone.problems && zone.problems.length > 0) {
    zone.problems.forEach((problem, index) => {
      lines.push(formatProblemNaturally(problem, index === 0));
    });
  }
  
  // Key message or travel advice - pick one, don't repeat both if similar
  if (zone.travelAdvice && zone.travelAdvice.length < 200) {
    lines.push(zone.travelAdvice);
  } else if (zone.keyMessage && zone.keyMessage.length < 200) {
    lines.push(zone.keyMessage);
  }
  
  lines.push("");
}

export default function RadioScriptGenerator({ summary }: RadioScriptGeneratorProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const script = generateRadioScript(summary);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      analytics.toolUsed("Avalanche Summary", "radio_script_copied");
      toast({
        title: "Script copied!",
        description: "The radio script has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };
  
  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      analytics.toolUsed("Avalanche Summary", "radio_script_opened");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Radio className="h-4 w-4" />
          Generate Radio Script
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Radio className="h-5 w-5 text-primary" />
            Radio Script: Wait Wait... Don't Maul Me
          </DialogTitle>
          <DialogDescription>
            Avalanche report script for KRUA 88.1 FM Anchorage
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end mb-2">
          <Button onClick={handleCopy} variant="secondary" size="sm" className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Script
              </>
            )}
          </Button>
        </div>
        
        <ScrollArea className="h-[60vh] rounded-md border p-4 bg-muted/30">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
            {script}
          </pre>
        </ScrollArea>
        
        <p className="text-xs text-muted-foreground mt-2">
          Review and edit as needed before broadcast. Data sourced from CNFAIC and Hatcher Pass Avalanche Center.
        </p>
      </DialogContent>
    </Dialog>
  );
}
