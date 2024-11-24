import { ClipboardListIcon, HouseIcon, LogInIcon, MessageCircleIcon, NewspaperIcon, UserCheckIcon, UserPenIcon, UserPlusIcon, UsersIcon } from "lucide-react"
import { IconLink } from "./link-header"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function HomeLink({current= false} : {current?: boolean}) {
    return <IconLink to="/">
        <HouseIcon className={`${current? 'text-black' : ''}`}/>
        <p className={`text-sm ${current? 'text-black' : ''}`}>Home</p>
    </IconLink>
}

export function FeedLink({current= false} : {current?: boolean}) {
    return <IconLink to="/feed">
        <NewspaperIcon className={`${current? 'text-black' : ''}`}/>
        <p className={`text-sm ${current? 'text-black' : ''}`}>Feed</p>
    </IconLink>
}

export function ProfileLink({ id }: { id: string }) {
    return <IconLink to={`/profile/${id}`}>
        <UserPenIcon />
        <p className="text-sm">Profile</p>
    </IconLink>
}

export function UsersLink({current= false} : {current?: boolean}) {
    return <IconLink to="/users">
        <UsersIcon className={`${current? 'text-black' : ''}`}/>
        <p className={`text-sm ${current? 'text-black' : ''}`}>Users</p>
    </IconLink>
}

export function RequestsLink({ notif = false, current = false }: { notif?: boolean, current?: boolean }) {
    return <IconLink to="/requests">
        <UserPlusIcon className={`${current? 'text-black' : ''}`}/>
        <p className={`text-sm ${current? 'text-black' : ''}`}>Request</p>
        <div className={`absolute top-0 right-0 ${notif ? '' : 'hidden'} rounded-full w-1 h-1`}></div>
    </IconLink>
}

export function ConnectionsLink({ notif = false, current = false }: { notif?: boolean, current?: boolean }) {
    return <IconLink to="/connections">
        <UserCheckIcon className={`${current? 'text-black' : ''}`}/>
        <p className={`text-sm ${current? 'text-black' : ''}`}>Connections</p>
        <div className={`absolute top-0 right-0 ${notif ? '' : 'hidden'} rounded-full w-1 h-1`}></div>
    </IconLink>
}

export function ChatLink({ notif = false, current = false }: { notif?: boolean, current?: boolean }) {
    return <IconLink to="/chat">
        <MessageCircleIcon className={`${current? 'text-black' : ''}`}/>
        <p className={`text-sm ${current? 'text-black' : ''}`}>Chat</p>
        <div className={`absolute top-0 right-0 ${notif ? '' : 'hidden'} rounded-full w-1 h-1`}></div>
    </IconLink>
}

export function LoginLink() {
    return <IconLink to="/login">
        <LogInIcon />
        <p className="text-sm">Login</p>
    </IconLink>
}

export function RegisterLink() {
    return <IconLink to="/register">
        <ClipboardListIcon />
        <p className="text-sm">Register</p>
    </IconLink>
}

export function UserProfile({ name, photo_url, email, id }: { name: string, photo_url: string | undefined | null, email: string, id: string }) {

    const auth = useAuth();
    const navigate = useNavigate();

    return <Popover>
        <PopoverTrigger asChild>
            <Button className="flex flex-col gap-1 items-center justify-center">
                <Avatar>
                    <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${photo_url}`} />
                    <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <div className="flex gap-1 border-b-[1px]">
                <Avatar>
                    <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${photo_url}`} />
                    <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grow">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p>{email}</p>
                </div>
            </div>
            <div>
            <Link to={`/profile/${id}`}>Profiles</Link>
            <Button variant={"link"} onClick={() => {
                auth.logout();
                navigate("/");
            }}>Logout</Button>
            </div>
        </PopoverContent>
    </Popover>
}