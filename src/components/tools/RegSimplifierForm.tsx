import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Trash2 } from "lucide-react";

const EXAMPLE_TEXTS = [
  {
    label: "EPA Clean Water Act",
    text: `Pursuant to Section 402 of the Clean Water Act (33 U.S.C. § 1342), any person who discharges pollutants from a point source into waters of the United States must obtain a National Pollutant Discharge Elimination System (NPDES) permit. The permittee shall comply with all conditions of this permit. Any permit noncompliance constitutes a violation of the Act and is grounds for enforcement action; for permit termination, revocation and reissuance, or modification; or for denial of a permit renewal application. The permittee shall submit Discharge Monitoring Reports (DMRs) on a monthly basis, no later than the 28th day of the following month.`,
  },
  {
    label: "OSHA Hazard Communication",
    text: `Under 29 CFR 1910.1200, employers shall develop, implement, and maintain at each workplace, a written hazard communication program which at least describes how the criteria specified in paragraphs (f), (g), and (h) of this section for labels and other forms of warning, safety data sheets, and employee information and training will be met. The employer shall ensure that each container of hazardous chemicals in the workplace is labeled, tagged or marked with either: (i) The product identifier; (ii) Signal word; (iii) Hazard statement(s); (iv) Pictogram(s); (v) Precautionary statement(s); and (vi) Name, address and telephone number of the chemical manufacturer.`,
  },
  {
    label: "State Stormwater Permit",
    text: `The permittee shall implement and maintain Best Management Practices (BMPs) to minimize the discharge of pollutants in stormwater runoff. All BMPs shall be inspected at least quarterly and within 24 hours following any storm event producing 0.5 inches or more of precipitation. The permittee shall maintain a Stormwater Pollution Prevention Plan (SWPPP) on-site and make it available for inspection upon request. Annual reports documenting BMP implementation and monitoring results shall be submitted to the Department by March 1st of each year for the preceding calendar year. Failure to submit required reports may result in penalties of up to $10,000 per day of violation.`,
  },
];

const MAX_CHARS = 15000;

interface RegSimplifierFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export function RegSimplifierForm({ onSubmit, isLoading }: RegSimplifierFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  const handleExampleClick = (exampleText: string) => {
    setText(exampleText);
  };

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="reg-text" className="text-sm font-medium text-foreground">
            Paste your regulatory text
          </label>
          <span className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
        <Textarea
          id="reg-text"
          placeholder="Paste regulatory language, permit conditions, legal requirements, or compliance documents here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] resize-y"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">Try an example:</span>
        {EXAMPLE_TEXTS.map((example) => (
          <Button
            key={example.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleExampleClick(example.text)}
            disabled={isLoading}
            className="text-xs"
          >
            <FileText className="h-3 w-3 mr-1" />
            {example.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!text.trim() || isLoading || isOverLimit}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Simplifying...
            </>
          ) : (
            "Simplify This Text"
          )}
        </Button>
        {text && !isLoading && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setText("")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
