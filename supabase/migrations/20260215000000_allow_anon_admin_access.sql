-- Allow anonymous (unauthenticated) access for personal portfolio admin.
-- Your app uses VITE_ADMIN_USER_ID so only that user's data is used; RLS here
-- allows the anon key to read/write so you never need to sign in in the app.

-- Profiles: anon can manage (for admin without login)
CREATE POLICY "Anon can manage profiles for admin"
ON public.profiles FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Projects: anon can manage
CREATE POLICY "Anon can manage projects for admin"
ON public.projects FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- CV files: anon can manage (SELECT already allowed, add insert/update/delete)
CREATE POLICY "Anon can manage cv_files for admin"
ON public.cv_files FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Contact submissions: anon can view and update (admin messages)
CREATE POLICY "Anon can view contact submissions"
ON public.contact_submissions FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon can update contact submissions"
ON public.contact_submissions FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Anon can delete contact submissions"
ON public.contact_submissions FOR DELETE
TO anon
USING (true);

-- Storage: anon can upload/update/delete portfolio assets
CREATE POLICY "Anon can upload portfolio assets"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Anon can update portfolio assets"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Anon can delete portfolio assets"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'portfolio-assets');
