-- ============================================================
-- ADSROW: PER-DOCUMENT LEGAL ACCEPTANCE MIGRATION
-- Migration: 202611100002_terms_acceptances_documents.sql
--
-- Prerequisite:
-- The original public.terms_acceptances table must exist.
--
-- Purpose:
-- Store separate acceptance records for Terms and Privacy Policy.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. VERIFY BASE TABLE
-- ============================================================

DO $$
BEGIN
    IF to_regclass('public.terms_acceptances') IS NULL THEN
        RAISE EXCEPTION
            'Migration failed: public.terms_acceptances does not exist. Run the original terms acceptance migration first.';
    END IF;
END;
$$;


-- ============================================================
-- 2. ADD DOCUMENT TYPE
-- ============================================================

ALTER TABLE public.terms_acceptances
ADD COLUMN IF NOT EXISTS document_type text NOT NULL DEFAULT 'terms';


-- ============================================================
-- 3. REMOVE OLD UNIQUENESS CONSTRAINT
-- ============================================================

ALTER TABLE public.terms_acceptances
DROP CONSTRAINT IF EXISTS
terms_acceptances_user_id_terms_version_key;


-- ============================================================
-- 4. ADD DOCUMENT TYPE VALIDATION
-- ============================================================

ALTER TABLE public.terms_acceptances
DROP CONSTRAINT IF EXISTS
terms_acceptances_document_type_check;

ALTER TABLE public.terms_acceptances
ADD CONSTRAINT terms_acceptances_document_type_check
CHECK (
    document_type IN ('terms', 'privacy')
);


-- ============================================================
-- 5. ADD NEW UNIQUE CONSTRAINT
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.terms_acceptances'::regclass
          AND conname = 'terms_acceptances_user_doc_version_key'
    ) THEN

        ALTER TABLE public.terms_acceptances
        ADD CONSTRAINT terms_acceptances_user_doc_version_key
        UNIQUE (
            user_id,
            document_type,
            terms_version
        );

    END IF;
END;
$$;


-- ============================================================
-- 6. ADD INDEX FOR ACCEPTANCE LOOKUPS
-- ============================================================

CREATE INDEX IF NOT EXISTS
idx_terms_acceptances_document_type
ON public.terms_acceptances (
    document_type,
    terms_version
);


-- ============================================================
-- 7. COMPLETE
-- ============================================================

COMMIT;

-- ============================================================
-- END OF MIGRATION
-- ============================================================