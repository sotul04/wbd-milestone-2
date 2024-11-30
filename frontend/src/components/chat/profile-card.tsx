import { useAuth } from "@/context/AuthContext";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { textCropper } from "@/lib/crop";

interface Chat {
    first_user: {
        id: string;
        full_name: string | null;
        profile_photo_path: string;
    };
    second_user: {
        id: string;
        full_name: string | null;
        profile_photo_path: string;
    };
    id: string;
    updated_at: Date;
    last_message: string | null;
}

export default function ChatCard(chat: Chat) {
    const auth = useAuth();
    const navigate = useNavigate();

    if (auth.userId.toString() === chat.second_user.id)
        return <Card onClick={() => {
            navigate(`/chat/${chat.id}`);
        }} className="flex gap-2 items-center w-full p-2 cursor-pointer">
            <Avatar className="w-12 h-12">
                {chat.first_user.profile_photo_path !== '' &&
                    <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${chat.first_user.profile_photo_path}`} />
                }
                <AvatarFallback>
                    {chat.first_user.full_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex gap-2 w-full justify-between">
                <div className="flex flex-col">
                    <p className="overflow-hidden font-semibold">{chat.first_user.full_name}</p>
                    {chat.last_message && <p className="overflow-hidden text-xs text-[#808080]">{textCropper(chat.last_message, 60)}</p>}
                </div>
                <div className="flex justify-end p-2 min-w-[50px]">
                    <p className="text-xs font-thin text-[#808080]">
                        {new Date(chat.updated_at).toDateString()}
                    </p>
                </div>
            </div>
        </Card>

    return <Card onClick={() => {
        navigate(`/chat/${chat.id}`);
    }} className="flex gap-2 items-center w-full p-2 cursor-pointer">
        <Avatar className="w-12 h-12">
            {chat.second_user.profile_photo_path !== '' &&
                <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${chat.second_user.profile_photo_path}`} />
            }
            <AvatarFallback>
                {chat.second_user.full_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <div className="flex gap-2 w-full justify-between">
            <div className="flex flex-col">
                <p className="overflow-hidden font-semibold">{chat.second_user.full_name}</p>
                {chat.last_message && <p className="overflow-hidden text-xs text-[#808080]">{textCropper(chat.last_message, 60)}</p>}
            </div>
            <div className="flex justify-end p-2 min-w-[50px]">
                <p className="text-xs font-thin text-[#808080]">
                    {new Date(chat.updated_at).toDateString()}
                </p>
            </div>
        </div>
    </Card>
}