import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Mountain, Cpu, BarChart3, Calendar, Award, Snowflake, ThermometerSun } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

import glacierToe from "@/assets/thesis-glacier-toe.jpeg";
import glacierEdge from "@/assets/thesis-glacier-edge.jpeg";
import pitPortrait from "@/assets/thesis-pit-portrait.jpeg";
import snowCoring from "@/assets/thesis-snow-coring.jpeg";
import snowCoring2 from "@/assets/thesis-snow-coring-2.jpeg";
import wxStation from "@/assets/thesis-wx-station.jpeg";
import heloView from "@/assets/thesis-helo-view.jpeg";

// Simulated discharge data based on poster Figure 4 - peak mid-century, decline after
const dischargeData = [
  { year: 2020, discharge: 95, min: 85, max: 105 },
  { year: 2030, discharge: 115, min: 100, max: 130 },
  { year: 2040, discharge: 130, min: 110, max: 150 },
  { year: 2050, discharge: 140, min: 115, max: 165 },
  { year: 2060, discharge: 135, min: 110, max: 160 },
  { year: 2070, discharge: 125, min: 100, max: 150 },
  { year: 2080, discharge: 115, min: 90, max: 140 },
  { year: 2090, discharge: 108, min: 85, max: 130 },
  { year: 2100, discharge: 102, min: 80, max: 125 },
];

// Simulated glacier area data based on poster Figure 5 - ~50% loss by 2100
const glacierAreaData = [
  { year: 2020, area: 100, min: 98, max: 102 },
  { year: 2030, area: 95, min: 90, max: 100 },
  { year: 2040, area: 88, min: 80, max: 96 },
  { year: 2050, area: 78, min: 68, max: 88 },
  { year: 2060, area: 68, min: 55, max: 81 },
  { year: 2070, area: 60, min: 45, max: 75 },
  { year: 2080, area: 54, min: 38, max: 70 },
  { year: 2090, area: 50, min: 32, max: 68 },
  { year: 2100, area: 48, min: 28, max: 68 },
];

const researchApproach = [
  {
    icon: Cpu,
    title: "PyGEM Simulations",
    description: "16,760 model simulations using ACCESS-CM2 SSP245 climate forcing to explore parameter space."
  },
  {
    icon: Mountain,
    title: "Parameter Sweep",
    description: "Temperature bias (-10.0 to -5.0°C), precipitation factor (2.0 to 8.0), degree-day factor (0.002 to 0.015 m/°C/d)."
  },
  {
    icon: BarChart3,
    title: "Top Performers",
    description: "41 best-performing parameter sets selected for the preliminary forecast based on calibration results."
  }
];

const galleryImages = [
  {
    src: snowCoring2,
    alt: "Snow coring on Dixon Glacier",
    caption: "Using a snow corer with 6 meters of extensions to measure the density of accumulated snow over the winter season."
  },
  {
    src: wxStation,
    alt: "Weather station installation",
    caption: "Weather station and helicopter on Dixon Glacier during field data collection."
  },
  {
    src: heloView,
    alt: "Aerial view of glacier",
    caption: "Helicopter view of the nunatak and surrounding glacier terrain."
  },
  {
    src: glacierToe,
    alt: "Glacier terminus",
    caption: "View of Dixon Glacier's terminus showing the ice-rock interface."
  }
];

const fieldData = [
  { location: "Accumulation Stake", elevation: "1293 m", y2023: "0.37", y2024: "1.46", y2025: "1.87" },
  { location: "ELA Stake", elevation: "1078 m", y2023: "0.10", y2024: "0.10", y2025: "1.08" },
  { location: "Ablation Wire", elevation: "804 m", y2023: "-4.5", y2024: "-2.63", y2025: "—" }
];

const findings = [
  {
    title: "Peak Water Timing",
    description: "Preliminary forecast shows peak discharge around the middle of this century."
  },
  {
    title: "Sustained Discharge",
    description: "Annual discharge remaining above 1×10⁸ m³ by 2100, indicating sufficient meltwater for hydropower."
  },
  {
    title: "Glacier Area Loss",
    description: "Dixon Glacier will lose approximately half its surface area by 2100, with the rate of loss increasing around mid-century."
  }
];

const funding = [
  "NASA Alaska Space Grant Program",
  "National Institutes for Water Resources (NIWR)",
  "Alaska Pacific University, Institute of Culture and Environment"
];

const Research = () => {
  return (
    <Layout>
      <SEO
        title="Meltwater to Megawatts"
        description="NASA-funded glacier research modeling Dixon Glacier's peak water timing for Alaska hydropower. Using PyGEM simulations to forecast 60 MW energy potential."
        url="https://kaiconsulting.ai/research"
        
      />
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${glacierToe})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-forest/80 via-forest/60 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
            Meltwater to Megawatts
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Preliminary Forecast of Peak Flow Timing for Dixon Glacier Using Python Glacier Evolution Model (PyGEM) for Energy Applications
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                The Project
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  This project used PyGEM to determine when Dixon Glacier will achieve peak water. Continued mass loss from Dixon Glacier will initially drive meltwater discharge upward until a maximum peak water is reached, after which flow will decline as the glacier's capacity to supply runoff diminishes.
                </p>
                <p>
                  Timing of peak flow is a consideration when determining whether to divert Dixon discharge to nearby Bradley Lake for a potential <strong className="text-foreground">60 MW of hydropower production</strong> as part of the State of Alaska's effort to avert a looming energy crisis.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={glacierEdge} 
                alt="Edge of Dixon Glacier" 
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PyGEM Methods Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Modeling Approach
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              PyGEM simulates glacier dynamics by calculating monthly mass balance change across 8m elevation bins using degree-day melt, precipitation-driven accumulation, refreezing, and frontal ablation, then annually updating geometry by distributing mass balance across bins. Glacier retreat is simulated when the size of an elevation bin becomes 0.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {researchApproach.map((item, index) => (
              <div 
                key={index}
                className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Field Data Collection Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <img 
                src={pitPortrait} 
                alt="Kai Myers measuring snow cores on Dixon Glacier" 
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[3/4]"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Field Data Collection
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                This study used snow pits, snow cores, and steam drills to measure winter point balance, and ablation stakes and wires to measure summer point balance across three elevations from 2023-2025.
              </p>

              {/* Data Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Location</th>
                      <th className="text-left p-4 font-semibold text-foreground">Elevation</th>
                      <th className="text-center p-4 font-semibold text-foreground">2023</th>
                      <th className="text-center p-4 font-semibold text-foreground">2024</th>
                      <th className="text-center p-4 font-semibold text-foreground">2025</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldData.map((row, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-4 text-foreground">{row.location}</td>
                        <td className="p-4 text-muted-foreground">{row.elevation}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.y2023}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.y2024}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.y2025}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Note: The 2025 ablation wire in the ablation zone had been removed by an unknown third party so we do not have data for that period. Values in meters water equivalent (m w.e.).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fieldwork Gallery */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12">
            Fieldwork Gallery
          </h2>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg"
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full aspect-[4/3] object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  style={{ objectPosition: index === 0 ? 'center 60%' : 'center center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm leading-relaxed">
                      {image.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preliminary Results Section with Charts */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Preliminary Findings</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              PyGEM Simulation Results
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Preliminary forecasts from the 41 best-performing parameter sets under SSP245 climate scenario.
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Discharge Chart */}
            <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                Forecast Annual Discharge
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Peak discharge projected around mid-century, remaining above 1×10⁸ m³ by 2100.
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dischargeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dischargeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="year" 
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                    />
                    <YAxis 
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                      label={{ value: 'Discharge (×10⁶ m³)', angle: -90, position: 'insideLeft', className: 'fill-muted-foreground text-xs' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="max" 
                      stroke="none"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="min" 
                      stroke="none"
                      fill="white"
                      fillOpacity={1}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="discharge" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Glacier Area Chart */}
            <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                Forecast Glacier Area Change
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Approximately 50% surface area loss by 2100, with rate increasing mid-century.
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={glacierAreaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--glacier))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--glacier))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="year" 
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                    />
                    <YAxis 
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 110]}
                      label={{ value: 'Area (% of 2020)', angle: -90, position: 'insideLeft', className: 'fill-muted-foreground text-xs' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="max" 
                      stroke="none"
                      fill="hsl(var(--glacier))"
                      fillOpacity={0.1}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="min" 
                      stroke="none"
                      fill="white"
                      fillOpacity={1}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="area" 
                      stroke="hsl(var(--glacier))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--glacier))', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--glacier))' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Key Findings Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {findings.map((finding, index) => (
              <div 
                key={index}
                className="bg-card p-8 rounded-2xl shadow-lg border border-border text-center"
              >
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {finding.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {finding.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-glacier/10 border border-glacier/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-foreground leading-relaxed text-center">
              <strong>Important Note:</strong> These results are highly preliminary and require comprehensive validation before operational application. Significant uncertainty exists in both the specific timing of peak water and the magnitude of discharge due to parameter variability and climate scenario selection.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8 text-center">
              Conclusion & Next Steps
            </h2>
            
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our preliminary analysis of Dixon Glacier under the SSP245 climate scenario reveals promising water availability for the proposed diversion project. The discharge projections show that Dixon Glacier will reach peak flow sometime mid-century, with substantial water production during the initial decline phase.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                While glacier area will decrease by approximately 50% by 2100, the sustained discharge levels during the critical implementation timeframe indicate sufficient meltwater to support the proposed hydropower expansion.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Snowflake className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Rigorous Calibration</h4>
                  <p className="text-sm text-muted-foreground">Implementing more rigorous calibration process for improved accuracy.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Mountain className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Historical Data</h4>
                  <p className="text-sm text-muted-foreground">Incorporating historical observed snow line elevation data.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <ThermometerSun className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Multi-Variable Validation</h4>
                  <p className="text-sm text-muted-foreground">Validation alongside discharge measurements for reliability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-display font-semibold text-foreground">
              Funding & Acknowledgments
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {funding.map((source, index) => (
              <span 
                key={index}
                className="bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground"
              >
                {source}
              </span>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Research conducted with Dr. Jason Geck
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-forest text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Interested in This Research?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            I'm always happy to discuss glacier hydrology, PyGEM modeling, or the broader implications of climate change on Alaska's energy future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a 
              href="mailto:kaimyers@alaskapacific.edu"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <span>kaimyers@alaskapacific.edu</span>
            </a>
            <span className="hidden sm:inline text-white/40">•</span>
            <a 
              href="tel:916-955-8064"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <span>(916) 955-8064</span>
            </a>
          </div>
          <Link 
            to="/about"
            className="inline-flex items-center gap-2 bg-white text-forest px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Research;
