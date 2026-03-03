import { useState, ReactNode } from "react";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics";

interface EpisodePlayerProps {
  title: string;
  date: string;
  driveFileId: string;
  description?: ReactNode;
}

const EpisodePlayer = ({ title, date, driveFileId, description }: EpisodePlayerProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Google Drive preview URL for audio - uses the iframe embed
  const embedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveFileId}`;
  const viewUrl = `https://drive.google.com/file/d/${driveFileId}/view`;

  const handlePlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      analytics.track('episode_played', { episode_title: title });
    }
  };

  const handleDownload = () => {
    analytics.track('episode_downloaded', { episode_title: title });
    window.open(downloadUrl, '_blank');
  };

  const handleOpenInDrive = () => {
    analytics.track('episode_opened_in_drive', { episode_title: title });
    window.open(viewUrl, '_blank');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
      {/* Episode Info */}
      <div className="mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{date}</p>
        {description && (
          <div className="text-sm text-muted-foreground mt-3 leading-relaxed">{description}</div>
        )}
      </div>

      {/* Google Drive Embedded Player */}
      <div className="rounded-lg overflow-hidden bg-muted" onClick={handlePlay}>
        <iframe
          src={embedUrl}
          width="100%"
          height="80"
          allow="autoplay"
          className="border-0"
          title={`Audio player for ${title}`}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-5 mt-5 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2 border-radio-orange text-radio-orange hover:bg-radio-orange/10"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenInDrive}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Open in Google Drive
        </Button>
      </div>
    </div>
  );
};

export default EpisodePlayer;
