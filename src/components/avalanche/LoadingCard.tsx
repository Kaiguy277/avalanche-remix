import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SAFETY_TIPS = [
  "Check your beacon, shovel, and probe before every tour.",
  "Dig hand pits on each aspect to assess snow stability.",
  "When in doubt, don't go out.",
  "Travel one at a time through avalanche terrain.",
  "Observe recent wind loading and identify areas of wind slab.",
  "Check the weather forecast—rapid warming increases instability.",
  "Have a communication plan with your partners.",
  "Know where your safe zones and escape routes are.",
  "Trust your instincts—if something feels off, reassess.",
  "Watch for signs of recent avalanche activity in your zone.",
];

interface LoadingCardProps {
  className?: string;
  zoneCount?: number;
}

function getWaitTimeMessage(zoneCount: number): { time: string; note: string } {
  if (zoneCount <= 3) {
    return {
      time: "~10 seconds",
      note: "Quick fetch for a focused selection",
    };
  } else if (zoneCount <= 6) {
    return {
      time: "10–15 seconds",
      note: "A few zones to gather",
    };
  } else if (zoneCount <= 10) {
    return {
      time: "15–25 seconds",
      note: "Patience pays off for broader coverage",
    };
  } else {
    return {
      time: "25–40 seconds",
      note: "Full state coverage takes a moment—worth the wait",
    };
  }
}

export default function LoadingCard({ className, zoneCount = 4 }: LoadingCardProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const waitInfo = getWaitTimeMessage(zoneCount);

  // Rotate tips every 4 seconds
  useEffect(() => {
    const tipRotation = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % SAFETY_TIPS.length);
    }, 4000);

    return () => clearInterval(tipRotation);
  }, []);

  return (
    <Card className={className}>
      <CardContent className="py-6 px-6 flex flex-col items-center text-center space-y-4">
        {/* Video */}
        <div className="w-full max-w-sm rounded-lg overflow-hidden">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-auto rounded-lg"
            src="/loading-clip.mp4"
          />
        </div>

        {/* Status message */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">
            Gathering Conditions...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              <span className="font-medium text-foreground">{waitInfo.time}</span>
              {" "}for {zoneCount} zone{zoneCount !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-muted-foreground italic">
            {waitInfo.note}
          </p>
        </div>

        {/* Rotating tip */}
        <div className="bg-muted/50 rounded-lg p-4 max-w-md border border-border/50">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Safety Tip
          </p>
          <p className="text-sm text-foreground font-medium transition-opacity duration-300">
            {SAFETY_TIPS[currentTipIndex]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
