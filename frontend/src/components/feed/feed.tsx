import {
    Card,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { buttonStyles } from "../button";
import { EllipsisIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FeedApi } from "@/api/feed-api";
import { Validation } from "../alert/alert";

interface Props {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
    profile_photo?: string;
    name: string;
}

interface FeedProps extends Props {
    onDelete: () => void
    index: number
    onUpdate: (index: number, content: string, updated_at: Date) => void
}

export function FeedCard(props: FeedProps) {
    const created = new Date(props.created_at);
    const updated = new Date(props.updated_at);
    const { toast } = useToast();

    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        content: props.content,
    });
    const auth = useAuth();

    async function handleDelete() {
        try {
            await FeedApi.deleteFeed({ id: Number(props.id) });
            props.onDelete()
            toast({
                title: "Deleted",
                description: "Feed has been deleted"
            });
        } catch (error) {
            toast({
                title: "Opss",
                description: (error as any)?.message
            });
        }
    }

    async function handleUpdate() {
        try {
            const response = await FeedApi.updateFeed({ id: props.id, content: data.content });
            props.onUpdate(props.index, response.body.content, response.body.updated_at);
            toast({
                title: "Updated",
                description: "Feed has been updated"
            });
        } catch (error) {
            setData({ content: props.content });
            toast({
                title: "Opps",
                description: (error as any)?.message
            });
        }
    }

    return (
        <Card
            className="space-y-0 gap-0"
        >
            <div className="p-3 flex flex-col gap-2 justify-between h-full">
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Avatar className="w-12 h-12 border">
                            {props.profile_photo && props.profile_photo !== '' &&
                                <AvatarImage
                                    src={`${import.meta.env.VITE_API_URL}/storage/${props.profile_photo}`}
                                />
                            }
                            <AvatarFallback className="font-bold">
                                {props.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow gap-0 self-center">
                            <Link to={`/profile/${props.user_id}`} className="text-lg font-semibold hover:underline">
                                {props.name}
                            </Link>
                        </div>
                        {props.user_id === auth.userId.toString() &&
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild className="self-start">
                                    <button
                                        aria-label="Option button"
                                        className="text-[#808080] rounded-lg px-2 hover:text-[#202020] hover:bg-[#efefef]">
                                        <EllipsisIcon />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 max-w-24">
                                    <button className="w-full text-sm text-[#808080] text-left hover:bg-[#efefef] py-1 px-4" onClick={() => {
                                        setOpen(false);
                                        setEdit(prev => !prev);
                                    }}>{edit ? 'Cancel' : 'Edit'}</button>
                                    <Validation
                                        trigger="Delete"
                                        actionDesc="Delete"
                                        classTrigger="w-full text-sm text-[#808080] text-left hover:bg-[#ffcdcd] px-4"
                                        classAction={buttonStyles({ variant: "destructive" })}
                                        action={() => {
                                            setOpen(false);
                                            setEdit(false);
                                            handleDelete();
                                        }}
                                        description="Your feed is going to be permanently deleted."
                                    />
                                </PopoverContent>
                            </Popover>
                        }
                    </div>
                    {!edit &&
                        <p className="text-sm text-[#303030]">{props.content}</p>
                    }
                    {edit &&
                        <>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData({ content: e.target.value.slice(0, 280) })}
                                maxLength={280}
                                placeholder="What do you want to talk about?"
                                className="w-full text-sm text-[#606060] rounded-md text-area-scrollbar bg-[#fdfbef] h-12 p-2 border-none focus:outline-none resize-none"
                            />
                            <div className="flex justify-between gap-2">
                                <p className="text-sm text-[#808080]">{data.content.trim().length}/280</p>
                                <div className="flex gap-2">
                                    <Button className={buttonStyles({ variant: "secondary", size: "sm" })} onClick={() => {
                                        setEdit(false);
                                        setData({ content: props.content });
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button className={buttonStyles({ size: "sm" })} disabled={data.content.trim().length === 0} onClick={() => {
                                        setEdit(false);
                                        handleUpdate()
                                    }}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className="flex justify-end">
                    {created.getTime() >= updated.getTime() ? (
                        <p className="text-xs text-[#808080]">{`Created at: ${created.toLocaleDateString()}`}</p>
                    ) : (
                        <p className="text-xs text-[#808080]">{`Updated at: ${updated.toLocaleDateString()}`}</p>
                    )}
                </div>
            </div>
        </Card>
    );
}
