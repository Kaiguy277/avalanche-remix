import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Loader2, ChevronDown, ChevronUp, AlertTriangle, Beaker, ClipboardList, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContextMode = "spill" | "cleanup" | "permitting" | "research";

interface RegFinderFormProps {
  onSubmit: (data: {
    projectDescription: string;
    contextMode: ContextMode;
    category?: string;
    location?: string;
    activities?: string[];
  }) => void;
  isLoading: boolean;
}

const CONTEXT_MODES = [
  {
    value: "spill" as ContextMode,
    label: "Active Spill",
    icon: AlertTriangle,
    description: "Immediate notification & response requirements",
    placeholder: "Example: Diesel spill from overturned tanker on Highway 3, approximately 500 gallons released, groundwater at 15 feet..."
  },
  {
    value: "cleanup" as ContextMode,
    label: "Site Cleanup",
    icon: Beaker,
    description: "Cleanup levels, characterization & closure",
    placeholder: "Example: Former gas station in Anchorage with known DRO contamination in soil above 10,000 mg/kg, conducting Phase II..."
  },
  {
    value: "permitting" as ContextMode,
    label: "Permitting",
    icon: ClipboardList,
    description: "Permit types, applications & timelines",
    placeholder: "Example: Planning a new fish processing facility in Kodiak with wastewater discharge to marine waters..."
  },
  {
    value: "research" as ContextMode,
    label: "Research",
    icon: BookOpen,
    description: "Comprehensive regulatory overview",
    placeholder: "Example: We're planning a new wastewater treatment facility in Fairbanks that will discharge treated effluent into a nearby stream..."
  },
];

const CATEGORIES = [
  { value: "contaminated", label: "Contaminated Site / Spill Response" },
  { value: "ust", label: "Underground Storage Tanks" },
  { value: "air", label: "Air Quality / Emissions" },
  { value: "wastewater", label: "Wastewater Discharge" },
  { value: "drinking", label: "Drinking Water Systems" },
  { value: "solidwaste", label: "Solid Waste Management" },
  { value: "waterquality", label: "Water Quality / Wetlands" },
  { value: "construction", label: "General Construction / Development" },
];

const ACTIVITIES = [
  { id: "site-characterization", label: "Site Characterization / Phase II" },
  { id: "soil-sampling", label: "Soil Sampling" },
  { id: "groundwater-monitoring", label: "Groundwater Monitoring" },
  { id: "remediation", label: "Remediation System" },
  { id: "free-product", label: "Free Product Recovery" },
  { id: "risk-closure", label: "Risk-Based Closure" },
  { id: "discharge", label: "Water/Effluent Discharge" },
  { id: "storage", label: "Chemical/Fuel Storage" },
  { id: "construction", label: "Construction Activities" },
  { id: "waste-disposal", label: "Waste Disposal" },
  { id: "air-emissions", label: "Air Emissions" },
  { id: "monitoring", label: "Long-Term Monitoring" },
];

export function RegFinderForm({ onSubmit, isLoading }: RegFinderFormProps) {
  const [projectDescription, setProjectDescription] = useState("");
  const [contextMode, setContextMode] = useState<ContextMode>("research");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const selectedMode = CONTEXT_MODES.find(m => m.value === contextMode)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDescription.trim()) return;

    onSubmit({
      projectDescription: projectDescription.trim(),
      contextMode,
      category: category || undefined,
      location: location.trim() || undefined,
      activities: activities.length > 0 ? activities : undefined,
    });
  };

  const handleActivityToggle = (activityId: string) => {
    setActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Context Mode Selector */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What are you working on?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CONTEXT_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = contextMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setContextMode(mode.value)}
                disabled={isLoading}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className="text-sm font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <selectedMode.icon className="h-3.5 w-3.5" />
          {selectedMode.description}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description" className="text-sm font-medium">
          Describe the Situation
        </Label>
        <Textarea
          id="project-description"
          placeholder={selectedMode.placeholder}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="min-h-[150px] resize-y"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Include details like location, project type, activities, and any substances involved.
        </p>
      </div>

      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="text-muted-foreground hover:text-foreground"
        >
          {showFilters ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Hide Filters
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Add Filters (Optional)
            </>
          )}
        </Button>

        {showFilters && (
          <div className="mt-4 space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Regulation Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Borough/Region)</Label>
                <Input
                  id="location"
                  placeholder="e.g., Fairbanks North Star Borough"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Activities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={activity.id}
                      checked={activities.includes(activity.id)}
                      onCheckedChange={() => handleActivityToggle(activity.id)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={activity.id}
                      className="text-sm cursor-pointer"
                    >
                      {activity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!projectDescription.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Searching Alaska DEC...
          </>
        ) : (
          <>
            <Search className="h-5 w-5 mr-2" />
            Find Applicable Regulations
          </>
        )}
      </Button>
    </form>
  );
}
