import { useLoaderData, useNavigation } from "@remix-run/react";
import { PostSearch } from "~/components/post-search";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Post } from "~/components/post";
import { ViewLikes } from "~/components/view-likes";
import { ViewComments } from "~/components/view-comments";
import { WritePost } from "~/components/write-post";

export const loader = ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get("query");

    return json({ query });
}

export default function Gitposts() {
    const { query } = useLoaderData<typeof loader>();
    const navigation = useNavigation();

    const isSearching = Boolean(
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("query")
    );

    return (
        <div className="w-full max-w-xl px-4 flex flex-col">
            <Tabs defaultValue="view-posts" className="my-2">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="view-posts">
                        View Posts
                    </TabsTrigger>
                    <TabsTrigger value="write-posts">
                        Write Posts
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="view-posts">
                    <Separator />
                    <PostSearch isSearching={isSearching} searchQuery={query} />
                    <Post
                        avatarUrl={"https://avatars.githubusercontent.com/u/81765631?v=4"}
                        name="farrel muhammad"
                        username="farrelmuhammaad"
                        title={"## markdown title"}
                        userId="123"
                        id="456"
                        dateTimeString="20, Nov 2024"
                    >
                        <ViewLikes likes={69} likedByUser={true} pathname={`/profile/farrelmuhammaad`} />
                        <ViewComments comments={69} pathname={`/profile/farrelmuhammaad`} />
                    </Post>
                </TabsContent>
                <TabsContent value="write-posts">
                    <WritePost sessionUserId="123" postId="1" />
                </TabsContent>
            </Tabs>
        </div>
    );
}