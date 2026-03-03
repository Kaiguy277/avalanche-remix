import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import ExploreHub from "@/components/home/ExploreHub";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Kai Myers | Scientist, Builder, Radio Host"
        description="Environmental scientist and glacier researcher based in Girdwood, Alaska. Research, AI tools, community radio, and consulting."
        url="https://kaiconsulting.ai"
      />
      <Hero />
      <ExploreHub />
    </Layout>
  );
};

export default Index;
