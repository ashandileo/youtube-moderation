// https://supabase.com/docs/guides/auth/auth-helpers/nextjs-server-components#creating-a-supabase-client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

export const createClient = () =>
  createClientComponentClient<Database>({
    options: {
      global: {
        fetch,
      },
    },
  });
