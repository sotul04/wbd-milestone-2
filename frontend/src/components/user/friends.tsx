import {
    Card,
    CardHeader,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

interface Props {
    id: string;
    username: string;
    email: string;
    full_name: string | null;
    profile_photo_path: string;
}

export function FriendsCard(props: Props) {
    const navigate = useNavigate();
    return <Card className="cursor-pointer space-y-0 gap-0" onClick={() => {
        navigate(`/profile/${props.id}`);
    }}>
        <CardHeader className="px-3 pt-3 pb-3">
            <div className="flex gap-2">
                <Avatar aria-label="User Avatar" className="w-12 h-12 border">
                    {props.profile_photo_path !== '' &&
                        <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${props.profile_photo_path}`} />
                    }
                    <AvatarFallback className="font-bold">{props.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grow flex flex-col gap-0">
                    <h1 className="text-lg font-semibold">{props.full_name}</h1>
                    <p className="text-gray-500 text-sm">{props.email}</p>
                </div>
            </div>
        </CardHeader>
    </Card>
}
