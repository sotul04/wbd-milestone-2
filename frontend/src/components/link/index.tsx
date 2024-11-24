import { ClipboardListIcon, HouseIcon, LogInIcon, MessageCircleIcon, NewspaperIcon, UserCheckIcon, UserPenIcon, UserPlusIcon, UsersIcon } from "lucide-react"
import { IconLink } from "./link-header"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button, buttonVariants } from "../ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function HomeLink({ current = false }: { current?: boolean }) {
    return <IconLink to="/">
        <HouseIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Home</p>
    </IconLink>
}

export function FeedLink({ current = false }: { current?: boolean }) {
    return <IconLink to="/feed">
        <NewspaperIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Feed</p>
    </IconLink>
}

export function ProfileLink({ id }: { id: string }) {
    return <IconLink to={`/profile/${id}`}>
        <UserPenIcon className="w-[26px] h-[26px]"/>
        <p className="text-sm">Profile</p>
    </IconLink>
}

export function UsersLink({ current = false }: { current?: boolean }) {
    return <IconLink to="/users">
        <UsersIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Users</p>
    </IconLink>
}

export function RequestsLink({ notif = false, current = false }: { notif?: boolean, current?: boolean }) {
    return <IconLink to="/requests">
        <UserPlusIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Request</p>
        <div className={`absolute top-0 right-[20%] bg-red-600 ${notif ? '' : 'hidden'} rounded-full w-2 h-2`}></div>
    </IconLink>
}

export function ConnectionsLink({ notif = false, current = false }: { notif?: boolean, current?: boolean }) {
    return <IconLink to="/connections">
        <UserCheckIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Connections</p>
        <div className={`absolute top-0 right-[20%] bg-red-600 ${notif ? '' : 'hidden'} rounded-full w-2 h-2`}></div>
    </IconLink>
}

export function ChatLink({ notif = false, current = false }: { notif?: boolean, current?: boolean }) {
    return <IconLink to="/chat">
        <MessageCircleIcon className={`w-[26px] h-[26px] ${current ? 'text-black' : ''}`} />
        <p className={`text-sm ${current ? 'text-black' : ''}`}>Chat</p>
        <div className={`absolute top-0 right-[20%] bg-red-600 ${notif ? '' : 'hidden'} rounded-full w-2 h-2`}></div>
    </IconLink>
}

export function LoginLink() {
    return <IconLink to="/login">
        <LogInIcon className="w-[26px] h-[26px]"/>
        <p className="text-sm">Login</p>
    </IconLink>
}

export function RegisterLink() {
    return <IconLink to="/register">
        <ClipboardListIcon className="w-[26px] h-[26px]" />
        <p className="text-sm">Register</p>
    </IconLink>
}

export function UserProfile({ name, photo_url, email, id }: { name: string, photo_url: string | undefined | null, email: string, id: string }) {

    const auth = useAuth();
    const navigate = useNavigate();

    return <Popover>
        <PopoverTrigger className="text-[#808080] hover:text-black">
            <Avatar className="w-[26px] h-[26px]">
                <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${photo_url}`} />
                <AvatarFallback className="text-black font-bold">{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="text-sm">Me</p>
        </PopoverTrigger>
        <PopoverContent className="p-3 right-0">
            <div className="border-b-[1px] pb-3">
                <div className="flex gap-2">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${photo_url}`} />
                        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grow flex flex-col gap-0">
                        <h3 className="text-lg font-semibold">{name}</h3>
                        <p className="text-gray-500 text-sm">{email}</p>
                    </div>
                </div>
                <Link className={`${buttonVariants({ variant: "outline" })} w-full mt-2 h-7 rounded-[999px] border-blue-700 text-blue-700 font-semibold bg-white hover:border-2 hover:text-blue-800 hover:bg-blue-50 `} to={`/profile/${id}`}>Show Profile</Link>
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