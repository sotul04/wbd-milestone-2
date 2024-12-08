import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAsideProps {
    title: string;
    content: string;
}

export function UserAside({ title, content }: UserAsideProps) {
    const auth = useAuth();

    if (!auth.authenticated) {
        return <p role="alert" className="text-sm text-red-500">You are not authenticated.</p>;
    }

    return (
        <>
            {/* User Card */}
            <Card className="border relative rounded-lg p-0" aria-labelledby="user-details">
                <div
                    className="relative h-16 bg-[#D9E5E7] overflow-hidden rounded-t-lg border-b"
                    aria-hidden="true"
                >
                    <div className="w-full h-[180px] rounded-full absolute bg-[#A0B4B7] bottom-1/2 left-0 -translate-x-[36%] translate-y-1/2"></div>
                    <div className="w-1/2 h-full absolute bg-[#BFD3D6] right-0 top-0 translate-x-[40%]"></div>
                </div>
                <Avatar 
                    className="absolute border left-[5%] top-16 -translate-y-1/2 h-16 w-16"
                    aria-label={`Avatar of ${auth.name}`}
                >
                    {auth.photoUrl !== "" ? (
                        <AvatarImage
                            src={`${import.meta.env.VITE_API_URL}/storage/${auth.photoUrl}`}
                            alt={`Profile picture of ${auth.name}`}
                        />
                    ) : (
                        <AvatarFallback className="text-[32px]" aria-hidden="true">
                            {auth.name.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div id="user-details" className="mt-[30px] px-4 flex flex-col pb-2">
                    <h1 className="font-semibold text-lg">{auth.name}</h1>
                    <p className="text-xs text-[#808080]">@{auth.username}</p>
                </div>
            </Card>

            {/* Additional Information Card */}
            <Card>
                <div className="space-y-1 py-2">
                    <h1 className="text-sm font-semibold px-4" id="aside-title">
                        {title}
                    </h1>
                    <p
                        className="text-xs text-[#808080] px-4"
                        aria-labelledby="aside-title"
                        aria-describedby="aside-content"
                        id="aside-content"
                    >
                        {content}
                    </p>
                </div>
            </Card>
        </>
    );
}
