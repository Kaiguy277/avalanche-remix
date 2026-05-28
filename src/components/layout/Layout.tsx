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
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2 text-center">
            <Snowflake className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">On hold for the summer.</span>{" "}
              <span className="text-muted-foreground">See you next winter!</span>
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
