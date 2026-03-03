-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Lab templates are publicly readable" ON public.erpims_lab_templates;

-- Create new policy that only allows authenticated users to read
CREATE POLICY "Lab templates are readable by authenticated users"
ON public.erpims_lab_templates
FOR SELECT
TO authenticated
USING (true);