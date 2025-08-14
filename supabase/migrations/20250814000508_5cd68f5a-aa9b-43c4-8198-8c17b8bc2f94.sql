-- Fix the function search path security warning by updating the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, date_of_birth, nationality, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'date_of_birth')::date, CURRENT_DATE),
    COALESCE(NEW.raw_user_meta_data ->> 'nationality', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone_number', '')
  );
  RETURN NEW;
END;
$$;