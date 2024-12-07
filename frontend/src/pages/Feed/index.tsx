import { FeedApi } from "@/api/feed-api";
import { FeedCard } from "@/components/feed/feed";
import { UserAside } from "@/components/user/user-aside";
import { useAuth } from "@/context/AuthContext";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buttonStyles } from "@/components/button";
import { useToast } from "@/hooks/use-toast";

export default function FeedPage() {

    const auth = useAuth();
    const [feeds, setFeeds] = useState<{
        id: string;
        user_id: string;
        content: string;
        user: {
            full_name: string | null;
            profile_photo_path: string;
        };
        created_at: Date;
        updated_at: Date;
    }[]>([]);
    const { ref, inView } = useInView();
    const [content, setContent] = useState("");
    const { toast } = useToast();
    const [isOpen, setOpen] = useState(false);

    const fetchItems = useCallback(
        async ({ pageParam }: { pageParam: string | null }) => {
            return await FeedApi.getFeeds({ limit: 10, cursor: pageParam });
        }, []
    )

    const {
        data,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["chats"],
        queryFn: fetchItems,
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    useEffect(() => {
        const dataFetched = data ? data.pages[data.pages.length - 1].data : [];
        setFeeds(prev => [...prev, ...dataFetched]);
    }, [data]);

    async function handlePost() {
        try {
            const response = await FeedApi.createFeed({ content: content });
            const newFeed = {
                ...response.body,
                user: {
                    full_name: auth.name,
                    profile_photo_path: auth.photoUrl,
                }
            }
            setContent("");
            setFeeds(prev => {
                const newFeeds = [newFeed, ...prev];
                return newFeeds;
            });
            toast({
                title: "Success",
                description: "Feed succefully created"
            });
        } catch (error) {
            toast({
                title: "Opss",
                description: (error as any)?.message
            });
        }
    }

    function onDelete(index: number) {
        setFeeds(prev => {
            const filtered = prev.filter((_, idx) => idx !== index);
            return filtered;
        })
    }

    function onUpdate(index: number, content: string, updated_at: Date) {
        setFeeds(prev => {
            const updated = [...prev];
            updated[index].content = content;
            updated[index].updated_at = updated_at;
            return updated;
        })
    }

    return (
        <section className="flex flex-col items-center">
            <div className="flex container flex-col md:flex-row md:gap-8 p-4">
                <aside className="w-full sm:w-1/3 md:w-1/4 mb-6 space-y-3 pb-6 border-b-2 md:border-none">
                    <UserAside title="Feeds" content="Find something interesting and also share yours" />
                </aside>

                <main className="w-full md:w-3/4">
                    <div className="grid grid-cols-1 gap-3">
                        {/* Feed add */}
                        <Card className="p-0">
                            <div className="flex items-center gap-2 p-3">
                                <Avatar className="h-12 w-12 border">
                                    {auth.photoUrl !== '' &&
                                        <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${auth.photoUrl}`} />
                                    }
                                    <AvatarFallback className="font-bold">
                                        {auth.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Dialog open={isOpen} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <button className="border h-12 text-sm font-semibold rounded-full flex-grow text-left p-3 px-5 transition-all hover:bg-[#efefef]">
                                            Start making posts
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] md:max-w-[600px] m-2">
                                        <DialogTitle className="hidden"></DialogTitle>
                                        <DialogHeader>
                                            <div className="flex gap-3 items-center">
                                                <Avatar className="h-12 w-12 border">
                                                    {auth.photoUrl !== '' &&
                                                        <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${auth.photoUrl}`} />
                                                    }
                                                    <AvatarFallback className="font-bold">
                                                        {auth.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="text-lg font-semibold">
                                                    {auth.name}
                                                </h3>
                                            </div>
                                        </DialogHeader>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value.slice(0, 280))}
                                            maxLength={280}
                                            placeholder="What do you want to talk about?"
                                            className="w-full text-area-scrollbar bg-transparent h-32 p-2 border-none rounded-md focus:outline-none resize-none"
                                        />
                                        <DialogFooter>
                                            <Button onClick={async () => {
                                                await handlePost();
                                                setOpen(false);
                                            }} disabled={content.trim().length === 0} className={buttonStyles({ variant: "login" })}>Posting</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>
                        { /* Feeds */}
                        {feeds.map((item, index) =>
                            <FeedCard
                                key={`${index}${item.id}`}
                                {...item}
                                profile_photo={item.user.profile_photo_path}
                                name={item.user.full_name ?? ""}
                                onDelete={() => onDelete(index)}
                                index={index}
                                onUpdate={onUpdate}
                            />
                        )
                        }
                    </div>
                    <div className="flex items-center justify-center py-2" ref={ref}>
                        {isFetchingNextPage && <LoaderCircleIcon className="animate-spin" />}
                    </div>
                </main>
            </div>
        </section>
    );
}

