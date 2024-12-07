import { IconLink } from "./link-header"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import {
    HomeIcon,
    FeedIcon,
    ProfileIcon,
    ConnectionsIcon,
    ChatIcon,
    UsersIcon,
    RequestsIcon

} from "./svgs"
import { buttonStyles } from "../button"

export function HomeLink({ current = false, onClick = () => { } }: { current?: boolean, onClick?: () => void }) {
    return <IconLink onClick={onClick} to="/">
        <HomeIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Home</p>
    </IconLink>
}

export function FeedLink({ current = false, onClick = () => { } }: { current?: boolean, onClick?: () => void }) {
    return <IconLink onClick={onClick} to="/feed">
        <FeedIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Feed</p>
    </IconLink>
}

export function ProfileLink({ id, current = false, onClick = () => { } }: { id: string, current?: boolean, onClick?: () => void }) {
    return <IconLink onClick={onClick} to={`/profile/${id}`}>
        <ProfileIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Profile</p>
    </IconLink>
}

export function UsersLink({ current = false, onClick = () => { } }: { current?: boolean, onClick?: () => void }) {
    return <IconLink onClick={onClick} to="/users">
        <UsersIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Users</p>
    </IconLink>
}

export function RequestsLink({ notif = false, current = false, onClick = () => { } }: { notif?: boolean, current?: boolean, onClick?: () => void }) {
    return <IconLink onClick={onClick} to="/requests">
        <RequestsIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Request</p>
        <div className={`absolute top-0 right-[20%] bg-red-600 ${notif ? '' : 'hidden'} rounded-full w-2 h-2`}></div>
    </IconLink>
}

export function ConnectionsLink({ id, notif = false, current = false, onClick = () => { } }: { id: string, notif?: boolean, current?: boolean, onClick?: () => void }) {
    return <IconLink onClick={onClick} to={`/connections/${id}`}>
        <ConnectionsIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Connections</p>
        <div className={`absolute top-0 right-[20%] bg-red-600 ${notif ? '' : 'hidden'} rounded-full w-2 h-2`}></div>
    </IconLink>
}

export function ChatLink({ notif = false, current = false, onClick = () => { } }: { notif?: boolean, current?: boolean, onClick?: () => void }) {
    return <IconLink onClick={onClick} to="/chat">
        <ChatIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Chat</p>
        <div className={`absolute top-0 right-[20%] bg-red-600 ${notif ? '' : 'hidden'} rounded-full w-2 h-2`}></div>
    </IconLink>
}

export function LoginLink({ onClick = () => { } }: { onClick?: () => void }) {
    return <IconLink onClick={onClick} to="/login">
        <button className={buttonStyles({ variant: "login", size: "xl" })}>
            Log in
        </button>
    </IconLink>
}

export function RegisterLink({ onClick = () => { } }: { onClick?: () => void }) {
    return <IconLink onClick={onClick} to="/register">
        <button className={buttonStyles({ size: "xl" })}>
            Join now
        </button>
    </IconLink>
}

export function UserProfile({ name, photo_url, email, id }: { name: string, photo_url: string | undefined | null, email: string, id: string }) {

    const auth = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    return <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="text-[#808080] flex flex-col items-center md:min-w-[30px] hover:text-black">
            <Avatar className="w-[26px] h-[26px] border">
                {photo_url && photo_url !== '' &&
                    <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${photo_url}`} />
                }
                <AvatarFallback className="text-black font-bold">{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="text-sm">Me</p>
        </PopoverTrigger>
        <PopoverContent className="p-3 right-0">
            <div className="border-b-[1px] pb-3">
                <div className="flex gap-2">
                    <Avatar className="w-14 h-14 border">
                        {photo_url && photo_url !== '' &&
                            <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${photo_url}`} />
                        }
                        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grow flex flex-col gap-0">
                        <h3 className="text-lg font-semibold">{name}</h3>
                        <p className="text-gray-500 text-sm">{email}</p>
                    </div>
                </div>
                <button
                    className={`${buttonStyles({ size: "sm" })} w-full mt-2`}
                    onClick={() => {
                        setIsOpen(false);
                        navigate(`/profile/${id}`);
                    }}
                >
                    Show Profile
                </button>
            </div>
            <div>
                <Button className="h-4 mt-2 px-1" variant={"link"} onClick={() => {
                    auth.logout();
                    navigate("/");
                }}>Logout</Button>
            </div>
        </PopoverContent>
    </Popover>
}