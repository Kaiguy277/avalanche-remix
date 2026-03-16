import { useRef, useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingCardProps {
  className?: string;
  zoneCount?: number;
  onVideoComplete?: () => void;
}

export default function LoadingCard({ className, zoneCount = 4, onVideoComplete }: LoadingCardProps) {
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // After the first playthrough ends, signal completion and enable looping
  const handleEnded = useCallback(() => {
    if (!hasPlayedOnce) {
      setHasPlayedOnce(true);
      onVideoComplete?.();
      // Keep looping in case we're still loading
      if (videoRef.current) {
        videoRef.current.loop = true;
        videoRef.current.play();
      }
    }
  }, [hasPlayedOnce, onVideoComplete]);

  return (
    <Card className={className}>
      <CardContent className="py-6 px-6 flex flex-col items-center text-center space-y-4">
        {/* Video */}
        <div className="w-full max-w-2xl rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleEnded}
            className="w-full h-auto rounded-lg"
            src="/loading-clip.mp4"
          />
        </div>

        <p className="text-lg font-semibold text-foreground">
          Gathering conditions for {zoneCount} zone{zoneCount !== 1 ? "s" : ""}...
        </p>
      </CardContent>
    </Card>
  );
}
