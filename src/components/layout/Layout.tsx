import { ReactNode } from "react";
import { Snowflake } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <div className="bg-gradient-to-b from-primary/15 via-primary/5 to-transparent border-b border-primary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/15 flex items-center justify-center">
              <Snowflake className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              On hold for the summer
            </h2>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl">
              The Avalanche Summary tool is taking a break until snow returns. See you next winter!
            </p>
          </div>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
