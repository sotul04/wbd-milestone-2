import {
    Card,
    CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef } from "react";

interface Props {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
    profile_photo?: string;
    name: string;
    username: string;
}

export function FeedCard(props: Props) {
    const desRef = useRef<ReactQuill | null>(null);
    const navigate = useNavigate();

    const created = new Date(props.created_at);
    const updated = new Date(props.updated_at);

    return (
        <Card
            className="space-y-0 gap-0 cursor-pointer"
            onClick={() => navigate(`/feed/${props.id}`)}
        >
            <CardHeader className="px-3 pt-3 pb-3">
                <div className="flex gap-2">
                    <Avatar className="w-14 h-14">
                        <AvatarImage
                            src={`${import.meta.env.VITE_API_URL}/storage/${props.profile_photo}`}
                        />
                        <AvatarFallback className="font-bold">
                            {props.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grow flex flex-col gap-0">
                        <h3 className="text-lg cursor-pointer font-semibold">
                            {props.name}
                        </h3>
                        <p className="text-gray-500 text-sm">{props.username}</p>
                    </div>
                </div>
                <ReactQuill
                    ref={desRef}
                    readOnly
                    modules={{ toolbar: null }}
                    value={props.content}
                />
                <div className="flex justify-end">
                    {created.getTime() >= updated.getTime() ? (
                        <p className="text-xs text-[#808080]">{`Created at: ${created.toLocaleDateString()}`}</p>
                    ) : (
                        <p className="text-xs text-[#808080]">{`Updated at: ${updated.toLocaleDateString()}`}</p>
                    )}
                </div>
            </CardHeader>
        </Card>
    );
}
