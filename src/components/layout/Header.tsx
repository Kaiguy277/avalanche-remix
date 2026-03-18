import { Link } from "react-router-dom";
import { Mountain } from "lucide-react";
import ChangelogModal from "./ChangelogModal";
import FeedbackButton from "./FeedbackButton";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <Mountain className="h-7 w-7 text-primary" />
            <span className="font-display text-lg font-semibold text-foreground">
              Avalanche Summary
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ChangelogModal />
            <FeedbackButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
