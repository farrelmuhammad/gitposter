import { useRevalidator } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";
import { useEffect, useState } from "react";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type SupabaseOutletContext = {
    supabase: TypedSupabaseClient;
    domainUrl: string;
}

type SupabaseEnv = {
    SUPABASE_URL: string
    SUPABASE_ANON_KEY: string
}

type UseSupabase = {
    env: SupabaseEnv;
    serverSession: Session | null;
}

export const useSupabase = ({ env, serverSession }: UseSupabase) => {
    const [supabase] = useState(() => createBrowserClient<Database>(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!));
    const serverAccessToken = serverSession?.access_token;
    const revalidator = useRevalidator();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            if (serverSession?.access_token !== serverAccessToken) {
                revalidator.revalidate();
            }
        })
    }, [supabase.auth, serverAccessToken, revalidator]);

    return { supabase };
}