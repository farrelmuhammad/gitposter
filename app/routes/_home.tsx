import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Link, Outlet, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { AppLogo } from "~/components/app-logo";
import { Button } from "~/components/ui/button";
import { SupabaseOutletContext } from "~/lib/supabase";

export default function Home() {
    const [isNavOpen, setNavOpen] = useState<boolean>(false);
    const { supabase } = useOutletContext<SupabaseOutletContext>();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    }

    return (
        <section className="w-full bg-white min-h-screen flex flex-col items-center">
            <nav className="sticky top-0 z-50 flex w-full items-center justify-between p-4 border-b border-zinc-200 flex-wrap md:flex-nowrap">
                <Link to={"/"} className="flex items-center space-x-2">
                    <AppLogo className="h-8 w-8 md:h-10 md:w-10" />
                    <h1 className="text-xl font-semibold text-zinc-900">Gitposter</h1>
                </Link>
                <button onClick={() => setNavOpen(!isNavOpen)} className="md:hidden">
                    {isNavOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
                </button>
                <div className={`flex md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 ${isNavOpen ? "flex-col order-last w-full md:w-auto" : "hidden md:flex"
                    }`}>
                    <Link prefetch="intent" to={`/profile/${"farrelmuhammaad"}`}>
                        @farrelmuhammaad
                    </Link>
                    <img
                        alt="Profile"
                        className="rounded-full"
                        height={40}
                        src={"https://avatars.githubusercontent.com/u/81765631?v=4"}
                        style={{
                            aspectRatio: "40/40",
                            objectFit: "cover"
                        }}
                        width={40}
                    />
                    <Button onClick={handleSignOut}>Logout</Button>
                </div>
            </nav>
            <Outlet />
        </section>
    );
}