import { redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { PostSearch } from "~/components/post-search";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Post } from "~/components/post";
import { ViewLikes } from "~/components/view-likes";
import { ViewComments } from "~/components/view-comments";
import { WritePost } from "~/components/write-post";
import { getSupabaseWithSessionAndHeaders } from "~/lib/supabase.server";
import { getAllPostsWithDetails } from "~/lib/database.server";
import { combinePostsWithLikes, formatToTwitterDate, getUserDataFromSession } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { supabase, serverSession, headers } = await getSupabaseWithSessionAndHeaders({ request });

    if (!serverSession) {
        return redirect("/login", { headers });
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get("query");

    const { data } = await getAllPostsWithDetails({ dbClient: supabase });

    const {
        userId: sessionUserId,
        // userName,
        // userAvatarUrl
    } = getUserDataFromSession(serverSession);

    const posts = combinePostsWithLikes(data, sessionUserId);

    return json({ query, posts }, { headers });
}

export default function Gitposts() {
    const { query, posts } = useLoaderData<typeof loader>();
    const navigation = useNavigation();

    const post = posts[0];

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
                        avatarUrl={post.author!.avatar_url}
                        name={post.author!.name}
                        username={post.author!.usernname}
                        title={post.title}
                        userId={post.author!.id}
                        id={post.id}
                        dateTimeString={formatToTwitterDate(post.created_at)}
                    >
                        <ViewLikes likes={post.likes} likedByUser={post.isLikedByUser} pathname={`/profile/farrelmuhammaad`} />
                        <ViewComments comments={post.comments.length} pathname={`/profile/farrelmuhammaad`} />
                    </Post>
                </TabsContent>
                <TabsContent value="write-posts">
                    <WritePost sessionUserId="123" postId="1" />
                </TabsContent>
            </Tabs>
        </div>
    );
}