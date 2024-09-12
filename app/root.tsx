import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseEnv, getSupabaseWithSessionAndHeaders } from "./lib/supabase.server";
import { useSupabase } from "./lib/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { serverSession, headers } = await getSupabaseWithSessionAndHeaders({ request });
  const domainUrl = process.env.DOMAIN_URL;
  const env = getSupabaseEnv();

  return json({ serverSession, env, domainUrl }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { env, serverSession, domainUrl } = useLoaderData<typeof loader>();

  const { supabase } = useSupabase({ env, serverSession });
  return <Outlet context={{ supabase, domainUrl }} />;
}
