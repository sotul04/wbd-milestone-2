import {
    Card,
    CardHeader,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConnectionApi } from "@/api/connection-api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

interface Props {
    id: string;
    email: string;
    full_name: string;
    profile_photo_path: string | null;
    can_connect?: boolean;
}

export function UserCard(props: Props) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [canConnect, setCanConnect] = useState(props.can_connect ?? false);

    async function handleConnect() {
        try {
            const response = await ConnectionApi.connectionSend({ to: Number(props.id) });
            toast({
                title: 'Success',
                description: response.message
            });
            setCanConnect(false);
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
                    <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${props.profile_photo_path ? props.profile_photo_path : ''}`} />
                    <AvatarFallback className="font-bold">{props.full_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grow flex flex-col gap-0">
                    <h3 onClick={() => {
                        navigate(`/profile/${props.id}`);
                    }} className="text-lg cursor-pointer hover:underline underline-offset-4 font-semibold">{props.full_name}</h3>
                    <p className="text-gray-500 text-sm">{props.email}</p>
                </div>
            </div>
            {canConnect && <div className="flex justify-end my-2">
                    <Button
                        className="h-8"
                        variant={"outline"}
                        onClick={() => {
                            handleConnect();
                        }}
                    >
                        Connect
                    </Button>
                </div>}
        </CardHeader>
    </Card>
}
