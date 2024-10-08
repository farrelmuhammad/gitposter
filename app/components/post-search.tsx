import { Form, useSubmit } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";

export function PostSearch({
    searchQuery,
    isSearching
}: {
    searchQuery: string | null;
    isSearching: boolean;
}) {
    const [query, setQuery] = useState(searchQuery || "");
    const submit = useSubmit();
    const formRef = useRef<HTMLFormElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        // Only cleanup required for the timeout
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [timeoutRef]);

    return (
        <div className="flex justify-between items-center my-3">
            <h2 className="md:text-xl font-heading font-semibold w-7/12">
                {query ? `Results for "${query}"` : "All posts"}
            </h2>
            <div className="w-1/12 flex justify-center">
                {isSearching && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <Form
                role="search"
                ref={formRef}
                id="search-form"
                className="w-4/12 flex"
                onChange={() => {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                        if (formRef.current) {
                            submit(formRef.current);
                        } else {
                            console.error("your code sucks!!")
                        }
                    }, 250);
                }}
            >
                <Input
                    type="search"
                    name="query"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search posts..."
                />

            </Form>
        </div >
    );
}