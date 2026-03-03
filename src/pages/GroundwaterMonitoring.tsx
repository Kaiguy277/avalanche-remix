import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const GroundwaterMonitoring = () => {
  return (
    <Layout>
      <SEO
        title="Groundwater Monitoring Tool"
        description="Interactive groundwater monitoring and analysis tool for environmental professionals."
        url="https://kaiconsulting.ai/tools/groundwater-monitoring"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Groundwater Monitoring Tool
              </h1>
              <p className="text-muted-foreground">
                Interactive tool for groundwater data analysis and visualization
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <a
                href="https://samplegroundwater.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in New Tab
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Note: This is an embedded version of the tool. For the smoothest experience, try opening it in a new tab.
          </p>
        </div>

        <Card className="border-primary/30">
          <CardContent className="p-0">
            <iframe
              src="https://samplegroundwater.lovable.app/"
              className="w-full h-[calc(100vh-200px)] min-h-[600px] border-0 rounded-lg"
              title="Groundwater Monitoring Tool"
              allow="clipboard-write"
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GroundwaterMonitoring;
