-- Create profiles table for admin user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT 'Developer Name',
    title TEXT NOT NULL DEFAULT 'Full-Stack Developer',
    headline TEXT NOT NULL DEFAULT 'Building scalable, high-performance applications with clean architecture.',
    bio TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CV storage table
CREATE TABLE public.cv_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact submissions table
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies: public read, owner write
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects policies: public read visible projects, owner full access
CREATE POLICY "Visible projects are viewable by everyone" 
ON public.projects FOR SELECT USING (is_visible = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" 
ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" 
ON public.projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" 
ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- CV policies: public read, owner write
CREATE POLICY "CV is viewable by everyone" 
ON public.cv_files FOR SELECT USING (true);

CREATE POLICY "Users can manage own CV" 
ON public.cv_files FOR ALL USING (auth.uid() = user_id);

-- Contact submissions: public insert, authenticated read
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions" 
ON public.contact_submissions FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update submissions" 
ON public.contact_submissions FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete submissions" 
ON public.contact_submissions FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for portfolio assets
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true);

-- Storage policies for portfolio assets
CREATE POLICY "Portfolio assets are publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can upload portfolio assets"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update portfolio assets"
ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete portfolio assets"
ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-assets' AND auth.uid() IS NOT NULL);