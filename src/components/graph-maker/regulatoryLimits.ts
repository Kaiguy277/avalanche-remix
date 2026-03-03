export interface RegulatoryLimit {
  id: string;
  name: string;
  value: number;
  unit: string;
  regulation: string;
  color: string;
}

export interface RegulatoryCategory {
  id: string;
  name: string;
  limits: RegulatoryLimit[];
}

export const regulatoryLimits: RegulatoryCategory[] = [
  {
    id: "groundwater",
    name: "Groundwater (18 AAC 75 Table C)",
    limits: [
      { id: "gro_gw", name: "GRO", value: 2.2, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#ef4444" },
      { id: "dro_gw", name: "DRO", value: 1.5, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#f97316" },
      { id: "rro_gw", name: "RRO", value: 1.1, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#eab308" },
      { id: "arsenic_gw", name: "Arsenic", value: 0.010, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#8b5cf6" },
      { id: "lead_gw", name: "Lead", value: 0.015, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#6366f1" },
      { id: "benzene_gw", name: "Benzene", value: 0.0046, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#ec4899" },
      { id: "toluene_gw", name: "Toluene", value: 1.0, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#14b8a6" },
      { id: "ethylbenzene_gw", name: "Ethylbenzene", value: 0.7, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#06b6d4" },
      { id: "xylenes_gw", name: "Xylenes", value: 10.0, unit: "mg/L", regulation: "18 AAC 75 Table C", color: "#0ea5e9" },
    ],
  },
  {
    id: "soil_under40",
    name: "Soil Under 40\" Precipitation (18 AAC 75 Table B1)",
    limits: [
      { id: "arsenic_soil", name: "Arsenic", value: 0.2, unit: "mg/kg", regulation: "18 AAC 75 Table B1", color: "#8b5cf6" },
      { id: "lead_soil", name: "Lead", value: 400, unit: "mg/kg", regulation: "18 AAC 75 Table B1", color: "#6366f1" },
      { id: "benzene_soil", name: "Benzene", value: 0.022, unit: "mg/kg", regulation: "18 AAC 75 Table B1", color: "#ec4899" },
      { id: "dro_soil", name: "DRO", value: 250, unit: "mg/kg", regulation: "18 AAC 75 Table B1", color: "#f97316" },
      { id: "gro_soil", name: "GRO", value: 300, unit: "mg/kg", regulation: "18 AAC 75 Table B1", color: "#ef4444" },
      { id: "rro_soil", name: "RRO", value: 11000, unit: "mg/kg", regulation: "18 AAC 75 Table B1", color: "#eab308" },
    ],
  },
  {
    id: "surface_water",
    name: "Surface Water (18 AAC 70)",
    limits: [
      { id: "tah_sw", name: "TAH", value: 0.010, unit: "mg/L", regulation: "18 AAC 70", color: "#ef4444" },
      { id: "taqh_sw", name: "TAqH", value: 0.015, unit: "mg/L", regulation: "18 AAC 70", color: "#f97316" },
      { id: "arsenic_sw", name: "Arsenic (chronic)", value: 0.150, unit: "mg/L", regulation: "18 AAC 70", color: "#8b5cf6" },
      { id: "lead_sw", name: "Lead (chronic)", value: 0.0025, unit: "mg/L", regulation: "18 AAC 70", color: "#6366f1" },
    ],
  },
];

export const getAllLimits = (): RegulatoryLimit[] => {
  return regulatoryLimits.flatMap(category => category.limits);
};

export const getLimitById = (id: string): RegulatoryLimit | undefined => {
  return getAllLimits().find(limit => limit.id === id);
};
