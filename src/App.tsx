import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Consulting from "./pages/Consulting";
import AIPrimer from "./pages/AIPrimer";
import Workshop from "./pages/Workshop";
import About from "./pages/About";
import Research from "./pages/Research";
import RadioShow from "./pages/RadioShow";
import Tools from "./pages/Tools";
import RegSimplifier from "./pages/RegSimplifier";
import ErpimsFormatter from "./pages/ErpimsFormatter";
import GraphMaker from "./pages/GraphMaker";
import TCAnalyzer from "./pages/TCAnalyzer";
import AvalancheSummary from "./pages/AvalancheSummary";
import GroundwaterMonitoring from "./pages/GroundwaterMonitoring";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/ai-primer" element={<AIPrimer />} />
            <Route path="/workshop" element={<Workshop />} />
            <Route path="/about" element={<About />} />
            <Route path="/research" element={<Research />} />
            <Route path="/radio" element={<RadioShow />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/reg-simplifier" element={<RegSimplifier />} />
            <Route path="/tools/erpims-formatter" element={<ErpimsFormatter />} />
            <Route path="/tools/graph-maker" element={<GraphMaker />} />
            <Route path="/tools/tc-analyzer" element={<TCAnalyzer />} />
            <Route path="/tools/avalanche" element={<AvalancheSummary />} />
            <Route path="/tools/groundwater-monitoring" element={<GroundwaterMonitoring />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
