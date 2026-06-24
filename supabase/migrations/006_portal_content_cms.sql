-- Portal CMS: admin-managed banners, webinars, and FAQs
-- Applied via Supabase MCP (portal_content_cms)

CREATE TYPE portal_audience AS ENUM ('recruiter', 'applicant', 'admin', 'all');

CREATE TABLE portal_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  image_url text,
  cta_label text,
  cta_link text,
  audience portal_audience NOT NULL DEFAULT 'recruiter',
  sort_order integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE portal_webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  timezone text DEFAULT 'Asia/Kolkata',
  registration_url text,
  audience portal_audience NOT NULL DEFAULT 'recruiter',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE portal_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  audience portal_audience NOT NULL DEFAULT 'applicant',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_portal_banners_audience ON portal_banners(audience, is_active, sort_order);
CREATE INDEX idx_portal_webinars_audience ON portal_webinars(audience, is_active, scheduled_at);
CREATE INDEX idx_portal_faqs_audience ON portal_faqs(audience, is_active, sort_order);

ALTER TABLE portal_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY portal_banners_read ON portal_banners
  FOR SELECT TO authenticated
  USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
  );

CREATE POLICY portal_webinars_read ON portal_webinars
  FOR SELECT TO authenticated
  USING (is_active = true AND scheduled_at >= now() - interval '1 day');

CREATE POLICY portal_faqs_read ON portal_faqs
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY portal_banners_admin ON portal_banners
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY portal_webinars_admin ON portal_webinars
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY portal_faqs_admin ON portal_faqs
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
