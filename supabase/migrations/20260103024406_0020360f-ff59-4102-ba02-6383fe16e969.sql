-- Deny all INSERT operations on erpims_lab_templates (no authentication system exists)
CREATE POLICY "No direct inserts to lab templates"
ON public.erpims_lab_templates
FOR INSERT
TO public
WITH CHECK (false);

-- Deny all UPDATE operations on erpims_lab_templates
CREATE POLICY "No direct updates to lab templates"
ON public.erpims_lab_templates
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

-- Deny all DELETE operations on erpims_lab_templates
CREATE POLICY "No direct deletes from lab templates"
ON public.erpims_lab_templates
FOR DELETE
TO public
USING (false);