import { MessageSquare } from "lucide-react";

const FeedbackButton = () => {
  return (
    <a
      href="mailto:kaimyers@alaskapacific.edu?subject=Avalanche%20Summary%20Feedback"
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <MessageSquare className="h-4 w-4" />
      <span className="hidden sm:inline">Feedback</span>
    </a>
  );
};

export default FeedbackButton;
