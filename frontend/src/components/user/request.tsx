import {
    Card,
    CardHeader,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { ConnectionApi } from "@/api/connection-api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

interface Props {
    from_id: string;
    to_id: string;
    from_user: {
        username: string;
        email: string;
        full_name: string | null;
        profile_photo_path: string;
    };
    created_at: Date;
    clear?: () => void;
}

export function RequestCard(props: Props) {
    const navigate = useNavigate();
    const { toast } = useToast();

    async function handleConnect(accept: boolean) {
        try {
            const response = await ConnectionApi.connectionConnect({ to: Number(props.from_id), accept: accept });
            toast({
                title: 'Success',
                description: response.message
            });
            props.clear?.();
        } catch (error) {
            toast({
                title: 'Opss',
                description: (error as any)?.message,
                variant: "destructive"
            });
        }
    }

    return <Card className="space-y-0 gap-0" >
        <CardHeader className="px-3 pt-3 pb-3">
            <div className="flex gap-2">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${props.from_user.profile_photo_path ? props.from_user.profile_photo_path : ''}`} />
                    <AvatarFallback className="font-bold">{props.from_user.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grow flex flex-col gap-0">
                    <h3 onClick={() => {
                        navigate(`/profile/${props.from_id}`);
                    }} className="text-lg cursor-pointer hover:underline underline-offset-4 font-semibold">{props.from_user.full_name}</h3>
                    <p className="text-gray-500 text-sm">{props.from_user.email}</p>
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                <Button
                    variant={"destructive"}
                    className="h-8 rounded-full"
                    onClick={() => handleConnect(false)}
                >
                    Reject
                </Button>
                <Button
                    variant={"outline"}
                    className="h-8 rounded-full"
                    onClick={() => handleConnect(true)}
                >
                    Accept
                </Button>
            </div>
        </CardHeader>
    </Card>
}
