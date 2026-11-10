
-- ============================================================
-- ADSROW: TERMS ACCEPTANCE UPDATE PERMISSIONS
-- Migration: 202611100001_terms_acceptances_update.sql
--
-- Purpose:
-- Allow authenticated users to retry their own acceptance
-- upserts without accessing another user's records.
-- ============================================================

BEGIN;

-- Verify that the base table exists.
DO $$
BEGIN
    IF to_regclass('public.terms_acceptances') IS NULL THEN
        RAISE EXCEPTION
            'public.terms_acceptances does not exist. Run the original acceptance table migration first.';
    END IF;
END;
$$;

-- Remove any existing policy with the same name.
DROP POLICY IF EXISTS
"Users can update their own terms acceptance"
ON public.terms_acceptances;

-- Allow users to update only their own acceptance records.
CREATE POLICY "Users can update their own terms acceptance"
ON public.terms_acceptances
FOR UPDATE
TO authenticated
USING (
    (SELECT auth.uid()) = user_id
)
WITH CHECK (
    (SELECT auth.uid()) = user_id
);

-- Grant the required table-level UPDATE permission.
GRANT UPDATE
ON TABLE public.terms_acceptances
TO authenticated;

COMMIT;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
