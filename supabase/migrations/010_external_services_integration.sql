-- NVite campaigns & candidate invites
CREATE TABLE IF NOT EXISTS nvite_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  subject text NOT NULL,
  message_template text NOT NULL,
  questions jsonb DEFAULT '[]'::jsonb,
  total_sent integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_responded integer DEFAULT 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidate_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  campaign_id uuid REFERENCES nvite_campaigns(id) ON DELETE SET NULL,
  subject text,
  message_text text,
  questions jsonb DEFAULT '[]'::jsonb,
  answers jsonb DEFAULT '[]'::jsonb,
  response_token text UNIQUE DEFAULT gen_random_uuid()::text,
  sent_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  email_opened_at timestamptz,
  email_clicked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidate_invites_recruiter ON candidate_invites(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_candidate_invites_candidate ON candidate_invites(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_invites_token ON candidate_invites(response_token);

CREATE TABLE IF NOT EXISTS nvite_scheduled (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES nvite_campaigns(id) ON DELETE CASCADE,
  recruiter_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  payload jsonb NOT NULL,
  schedule_at timestamptz NOT NULL,
  status text DEFAULT 'pending',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nvite_scheduled_pending ON nvite_scheduled(schedule_at) WHERE status = 'pending';

-- Recruiter notes & tags
CREATE TABLE IF NOT EXISTS recruiter_candidate_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recruiter_candidate_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  tag text NOT NULL,
  color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now(),
  UNIQUE(recruiter_id, applicant_id, tag)
);

-- RLS
ALTER TABLE nvite_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE nvite_scheduled ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_candidate_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_candidate_tags ENABLE ROW LEVEL SECURITY;

-- Helper: current user's client_id
CREATE OR REPLACE FUNCTION public.current_client_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT client_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- nvite_campaigns policies
DROP POLICY IF EXISTS nvite_campaigns_recruiter_select ON nvite_campaigns;
CREATE POLICY nvite_campaigns_recruiter_select ON nvite_campaigns
  FOR SELECT USING (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS nvite_campaigns_recruiter_insert ON nvite_campaigns;
CREATE POLICY nvite_campaigns_recruiter_insert ON nvite_campaigns
  FOR INSERT WITH CHECK (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS nvite_campaigns_recruiter_update ON nvite_campaigns;
CREATE POLICY nvite_campaigns_recruiter_update ON nvite_campaigns
  FOR UPDATE USING (recruiter_id = public.current_client_id());

-- candidate_invites policies
DROP POLICY IF EXISTS candidate_invites_recruiter_select ON candidate_invites;
CREATE POLICY candidate_invites_recruiter_select ON candidate_invites
  FOR SELECT USING (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS candidate_invites_recruiter_insert ON candidate_invites;
CREATE POLICY candidate_invites_recruiter_insert ON candidate_invites
  FOR INSERT WITH CHECK (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS candidate_invites_recruiter_update ON candidate_invites;
CREATE POLICY candidate_invites_recruiter_update ON candidate_invites
  FOR UPDATE USING (recruiter_id = public.current_client_id());

-- notes policies
DROP POLICY IF EXISTS recruiter_notes_select ON recruiter_candidate_notes;
CREATE POLICY recruiter_notes_select ON recruiter_candidate_notes
  FOR SELECT USING (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS recruiter_notes_insert ON recruiter_candidate_notes;
CREATE POLICY recruiter_notes_insert ON recruiter_candidate_notes
  FOR INSERT WITH CHECK (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS recruiter_notes_update ON recruiter_candidate_notes;
CREATE POLICY recruiter_notes_update ON recruiter_candidate_notes
  FOR UPDATE USING (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS recruiter_notes_delete ON recruiter_candidate_notes;
CREATE POLICY recruiter_notes_delete ON recruiter_candidate_notes
  FOR DELETE USING (recruiter_id = public.current_client_id());

-- tags policies
DROP POLICY IF EXISTS recruiter_tags_select ON recruiter_candidate_tags;
CREATE POLICY recruiter_tags_select ON recruiter_candidate_tags
  FOR SELECT USING (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS recruiter_tags_insert ON recruiter_candidate_tags;
CREATE POLICY recruiter_tags_insert ON recruiter_candidate_tags
  FOR INSERT WITH CHECK (recruiter_id = public.current_client_id());

DROP POLICY IF EXISTS recruiter_tags_delete ON recruiter_candidate_tags;
CREATE POLICY recruiter_tags_delete ON recruiter_candidate_tags
  FOR DELETE USING (recruiter_id = public.current_client_id());

-- Admin full access
DROP POLICY IF EXISTS nvite_campaigns_admin ON nvite_campaigns;
CREATE POLICY nvite_campaigns_admin ON nvite_campaigns
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS candidate_invites_admin ON candidate_invites;
CREATE POLICY candidate_invites_admin ON candidate_invites
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS recruiter_notes_admin ON recruiter_candidate_notes;
CREATE POLICY recruiter_notes_admin ON recruiter_candidate_notes
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS recruiter_tags_admin ON recruiter_candidate_tags;
CREATE POLICY recruiter_tags_admin ON recruiter_candidate_tags
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
