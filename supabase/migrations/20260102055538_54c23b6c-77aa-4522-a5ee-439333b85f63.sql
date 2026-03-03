-- ERPIMS Valid Value Lists (VVLs) Tables

-- PARLABEL: Parameter/Analyte codes (4,292+ codes)
CREATE TABLE public.erpims_parlabel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cas_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ANMCODE: Analytical Method codes (1,175+ codes)
CREATE TABLE public.erpims_anmcode (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- MATRIX: Sample matrix codes (88 codes)
CREATE TABLE public.erpims_matrix (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- UNITS: Unit of measure codes (295 codes)
CREATE TABLE public.erpims_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- PARVQ: Parameter Value Qualifier codes (=, ND, TR, etc.)
CREATE TABLE public.erpims_parvq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(5) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- SACODE: Sample type codes
CREATE TABLE public.erpims_sacode (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lab templates for saved column mappings
CREATE TABLE public.erpims_lab_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_name TEXT NOT NULL,
  column_mappings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.erpims_parlabel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erpims_anmcode ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erpims_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erpims_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erpims_parvq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erpims_sacode ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erpims_lab_templates ENABLE ROW LEVEL SECURITY;

-- VVL tables are publicly readable (reference data)
CREATE POLICY "VVL tables are publicly readable" ON public.erpims_parlabel FOR SELECT USING (true);
CREATE POLICY "VVL tables are publicly readable" ON public.erpims_anmcode FOR SELECT USING (true);
CREATE POLICY "VVL tables are publicly readable" ON public.erpims_matrix FOR SELECT USING (true);
CREATE POLICY "VVL tables are publicly readable" ON public.erpims_units FOR SELECT USING (true);
CREATE POLICY "VVL tables are publicly readable" ON public.erpims_parvq FOR SELECT USING (true);
CREATE POLICY "VVL tables are publicly readable" ON public.erpims_sacode FOR SELECT USING (true);
CREATE POLICY "Lab templates are publicly readable" ON public.erpims_lab_templates FOR SELECT USING (true);

-- Create indexes for fast lookups
CREATE INDEX idx_parlabel_code ON public.erpims_parlabel(code);
CREATE INDEX idx_parlabel_name ON public.erpims_parlabel(name);
CREATE INDEX idx_anmcode_code ON public.erpims_anmcode(code);
CREATE INDEX idx_matrix_code ON public.erpims_matrix(code);
CREATE INDEX idx_units_code ON public.erpims_units(code);
CREATE INDEX idx_parvq_code ON public.erpims_parvq(code);
CREATE INDEX idx_sacode_code ON public.erpims_sacode(code);

-- Seed common PARVQ codes (these are standard across all ERPIMS installations)
INSERT INTO public.erpims_parvq (code, name, description) VALUES
  ('=', 'Detected', 'Result was detected at or above the reporting limit'),
  ('ND', 'Not Detected', 'Result was not detected above the method detection limit'),
  ('TR', 'Trace', 'Result was detected between MDL and RL'),
  ('J', 'Estimated', 'Result is estimated'),
  ('U', 'Undetected', 'Analyte was analyzed for but not detected'),
  ('UJ', 'Undetected Estimated', 'MDL is estimated'),
  ('R', 'Rejected', 'Data rejected due to quality concerns'),
  ('NR', 'Not Reported', 'Result not reported');

-- Seed common MATRIX codes
INSERT INTO public.erpims_matrix (code, name) VALUES
  ('GW', 'Groundwater'),
  ('SO', 'Soil'),
  ('SE', 'Sediment'),
  ('SW', 'Surface Water'),
  ('WG', 'Waste - Groundwater'),
  ('WS', 'Waste - Soil'),
  ('SV', 'Soil Vapor'),
  ('IA', 'Indoor Air'),
  ('AA', 'Ambient Air'),
  ('WW', 'Wastewater'),
  ('DW', 'Drinking Water'),
  ('OT', 'Other');

-- Seed common SACODE (sample type) codes
INSERT INTO public.erpims_sacode (code, name, description) VALUES
  ('N', 'Normal', 'Normal field sample'),
  ('FD', 'Field Duplicate', 'Field duplicate sample'),
  ('TB', 'Trip Blank', 'Trip blank sample'),
  ('FB', 'Field Blank', 'Field blank sample'),
  ('EB', 'Equipment Blank', 'Equipment rinsate blank'),
  ('MS', 'Matrix Spike', 'Matrix spike sample'),
  ('MSD', 'Matrix Spike Duplicate', 'Matrix spike duplicate sample'),
  ('LCS', 'Lab Control Sample', 'Laboratory control sample'),
  ('MB', 'Method Blank', 'Method blank');

-- Seed common UNITS codes
INSERT INTO public.erpims_units (code, name) VALUES
  ('UG/L', 'Micrograms per Liter'),
  ('MG/L', 'Milligrams per Liter'),
  ('MG/KG', 'Milligrams per Kilogram'),
  ('UG/KG', 'Micrograms per Kilogram'),
  ('NG/L', 'Nanograms per Liter'),
  ('PG/L', 'Picograms per Liter'),
  ('PPM', 'Parts per Million'),
  ('PPB', 'Parts per Billion'),
  ('PCT', 'Percent'),
  ('PCI/L', 'Picocuries per Liter'),
  ('PCI/G', 'Picocuries per Gram'),
  ('CFU/100ML', 'Colony Forming Units per 100mL'),
  ('MPN/100ML', 'Most Probable Number per 100mL'),
  ('S.U.', 'Standard Units'),
  ('NTU', 'Nephelometric Turbidity Units'),
  ('UMHO/CM', 'Micromhos per Centimeter'),
  ('US/CM', 'Microsiemens per Centimeter'),
  ('DEG C', 'Degrees Celsius'),
  ('DEG F', 'Degrees Fahrenheit'),
  ('FT', 'Feet'),
  ('IN', 'Inches'),
  ('M', 'Meters'),
  ('CM', 'Centimeters');