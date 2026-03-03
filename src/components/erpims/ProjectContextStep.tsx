import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ProjectContext } from "@/pages/ErpimsFormatter";
import { Info } from "lucide-react";
import InfoTooltip from "./InfoTooltip";

interface ProjectContextStepProps {
  context: ProjectContext;
  onChange: (context: ProjectContext) => void;
}

const ProjectContextStep = ({ context, onChange }: ProjectContextStepProps) => {
  // Keep raw text for editing, parse on blur
  const [locidsText, setLocidsText] = useState(context.locids.join(", "));

  const handleInstallationIdChange = (value: string) => {
    // AFIID is always uppercase and max 5 characters
    const sanitized = value.toUpperCase().slice(0, 5);
    onChange({ ...context, installationId: sanitized });
  };

  const parseLocids = (value: string) => {
    // Split by newlines or commas, filter empty strings
    return value
      .split(/[\n,]/)
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0);
  };

  const handleLocidsBlur = () => {
    const locids = parseLocids(locidsText);
    onChange({ ...context, locids });
  };

  return (
    <div className="space-y-6">
      {/* Installation ID */}
      <div className="space-y-2">
        <Label htmlFor="installation-id" className="text-base font-medium inline-flex items-center">
          Installation ID (AFIID)
          <InfoTooltip 
            content="The 5-character Air Force Installation Identifier assigned to your site. Found in your project documentation or ERPIMS configuration."
          />
        </Label>
        <div className="flex items-start gap-2">
          <Input
            id="installation-id"
            value={context.installationId}
            onChange={(e) => handleInstallationIdChange(e.target.value)}
            placeholder="e.g., F4AK"
            className="max-w-[200px] font-mono uppercase"
            maxLength={5}
          />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>5-character Air Force Installation ID</span>
          </div>
        </div>
        {context.installationId.length > 0 && context.installationId.length < 5 && (
          <p className="text-sm text-amber-600">
            AFIID must be exactly 5 characters ({5 - context.installationId.length} more needed)
          </p>
        )}
      </div>

      {/* Output Format */}
      <div className="space-y-3">
        <Label className="text-base font-medium inline-flex items-center">
          Output Format
          <InfoTooltip 
            content="Prime format is the standard contractor submission format. Lab format (coming soon) is for direct lab submissions."
          />
        </Label>
        <RadioGroup
          value={context.outputFormat}
          onValueChange={(value: "prime" | "lab") =>
            onChange({ ...context, outputFormat: value })
          }
          className="grid grid-cols-2 gap-4 max-w-md"
        >
          <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="prime" id="prime" />
            <Label htmlFor="prime" className="cursor-pointer flex-1">
              <div className="font-medium">Prime Format</div>
              <div className="text-sm text-muted-foreground">
                Standard contractor format
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors opacity-50">
            <RadioGroupItem value="lab" id="lab" disabled />
            <Label htmlFor="lab" className="cursor-pointer flex-1">
              <div className="font-medium">Lab Format</div>
              <div className="text-sm text-muted-foreground">
                Coming soon
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Known LOCIDs */}
      <div className="space-y-2">
        <Label htmlFor="locids" className="text-base font-medium inline-flex items-center">
          Known Location IDs (Optional)
          <InfoTooltip 
            content="Location IDs are unique identifiers for sampling locations at your site (e.g., MW-001 for monitoring wells, SB-001 for soil borings)."
          />
        </Label>
        <Textarea
          id="locids"
          value={locidsText}
          onChange={(e) => setLocidsText(e.target.value)}
          onBlur={handleLocidsBlur}
          placeholder="Enter LOCIDs, one per line or comma-separated&#10;e.g., MW-001, MW-002, SB-001"
          className="font-mono min-h-[100px]"
        />
        <p className="text-sm text-muted-foreground">
          Pre-populate valid location IDs for your site. These will be used for validation.
        </p>
        {context.locids.length > 0 && (
          <p className="text-sm text-primary">
            {context.locids.length} LOCID(s) entered
          </p>
        )}
      </div>

      {/* Info box */}
      <div className="p-4 bg-secondary/50 rounded-lg border border-border">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          About ERPIMS Data Loading
        </h4>
        <p className="text-sm text-muted-foreground">
          This tool generates SAMPLE, TEST, and RESULT fixed-width files compatible with 
          ERPToolsX Prime format. Files are formatted according to the ERPIMS 2022 Data 
          Loading Handbook specifications.
        </p>
      </div>
    </div>
  );
};

export default ProjectContextStep;
