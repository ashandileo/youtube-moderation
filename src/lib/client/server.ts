import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

// https://supabase.com/docs/guides/auth/auth-helpers/nextjs-server-components#creating-a-supabase-client

export const createClient = () =>
  createServerComponentClient<Database>(
    {
      cookies,
    },
    {
      options: {
        global: {
          fetch,
        },
      },
    },
  );
