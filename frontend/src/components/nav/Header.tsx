import { useAuth } from "@/context/AuthContext"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChatLink, ConnectionsLink, FeedLink, HomeLink, LoginLink, ProfileLink, RegisterLink, RequestsLink, UserProfile, UsersLink } from "../link";
import { useEffect, useState } from "react";
import { GripIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";

export default function Header() {
    const auth = useAuth();
    useEffect(() => {
        auth.setUpdate(true);
    }, []);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const toggleSideBar = () => {
        setSideBarOpen(prev => !prev);
    }
    return <>
        <header className="flex justify-center bg-white border-b-[1px] sticky top-0 z-30">
            <nav className="container my-1 flex justify-between items-center py-1 px-2">
                <Link to="/">
                    <img src="/purry.ico" width={40} height={40} />
                </Link>
                {auth.authenticated && <AuthenticatedNav name={auth.name} photo_url={auth.photoUrl} email={auth.email} id={auth.userId.toString()} sideBarOpen={sideBarOpen} toggleSideBar={toggleSideBar} />}
                {!auth.authenticated && <UnauthenticatedNav sideBarOpen={sideBarOpen} toggleSideBar={toggleSideBar} />}
            </nav>
        </header>
    </>
}

function AuthenticatedNav(props: { name: string, photo_url: string | undefined | null, email: string, id: string, sideBarOpen: boolean, toggleSideBar: () => void }) {
    const location = useLocation();
    const auth = useAuth();
    const navigate = useNavigate();
    return <>
        <div className={`fixed inset-y-0 left-0 md:hidden transform ${props.sideBarOpen ? "translate-x-0" : "-translate-x-full"} items-center transition flex flex-col duration-200 px-2 ease-in-out bg-white w-full space-y-6 h-screen z-50`}>
            <div className="flex container justify-between my-1 py-1 items-center">
                <Link to="/">
                    <img src="/purry.ico" width={40} height={40} />
                </Link>
                <div onClick={() => props.toggleSideBar()} className="text-[#808080] hover:text-[#191919]">
                    <XIcon className="w-8 h-8" />
                </div>
            </div>
            <div className="flex container flex-col gap-3 items-start">
                <HomeLink onClick={props.toggleSideBar} current={location.pathname === '/'} />
                <FeedLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/feed')} />
                <ProfileLink onClick={props.toggleSideBar} current={location.pathname.startsWith("/profile")} id={props.id} />
                <UsersLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/users')} />
                <RequestsLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/requests')} />
                <ConnectionsLink id={props.id} onClick={props.toggleSideBar} current={location.pathname.startsWith('/connection')} />
                <ChatLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/chat')} />
                <div className="w-full border-t-[1px] flex justify-center">
                    <div className="py-3">
                        <div className="flex gap-2">
                            <Avatar className="w-14 h-14">
                                <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${props.photo_url}`} />
                                <AvatarFallback>{props.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grow flex flex-col gap-0">
                                <h3 className="text-lg font-semibold">{props.name}</h3>
                                <p className="text-gray-500 text-sm">{props.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between flex-col">
                            <Link onClick={props.toggleSideBar} className={`${buttonVariants({ variant: "outline" })} mt-2 h-7 rounded-[999px] border-blue-700 text-blue-700 font-semibold bg-white hover:border-2 hover:text-blue-800 hover:bg-blue-50 `} to={`/profile/${props.id}`}>Show Profile</Link>
                            <Button className="h-4 mt-2 px-1" variant={"link"} onClick={() => {
                                auth.logout();
                                navigate("/");
                            }}>Logout</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div onClick={() => props.toggleSideBar()} className="md:hidden text-[#808080] hover:text-[#191919]">
            <GripIcon className="w-8 h-8"/>
        </div>
        <div className="gap-2 hidden md:flex">
            <HomeLink onClick={props.toggleSideBar} current={location.pathname === '/'} />
            <FeedLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/feed')} />
            <ProfileLink onClick={props.toggleSideBar} current={location.pathname.startsWith("/profile")} id={props.id} />
            <UsersLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/users')} />
            <RequestsLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/requests')} />
            <ConnectionsLink id={props.id} onClick={props.toggleSideBar} current={location.pathname.startsWith('/connection')} />
            <ChatLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/chat')} />
            <UserProfile {...props} />
        </div>
    </>
}

function UnauthenticatedNav(props: { sideBarOpen: boolean, toggleSideBar: () => void }) {
    const location = useLocation();
    return <>
        <div className={`fixed inset-y-0 left-0 md:hidden transform ${props.sideBarOpen ? "translate-x-0" : "-translate-x-full"} items-center transition flex flex-col duration-200 px-2 ease-in-out bg-white w-full space-y-6 h-screen z-20`}>
            <div className="flex container justify-between my-1 py-1 items-center">
                <Link to="/">
                    <img src="/purry.ico" width={40} height={40} />
                </Link>
                <div onClick={() => props.toggleSideBar()} className="text-[#808080] hover:text-[#191919]">
                    <XIcon className="w-8 h-8" />
                </div>
            </div>
            <div className="flex container flex-col gap-3 items-start">
                <HomeLink onClick={props.toggleSideBar} current={location.pathname === "/"} />
                <UsersLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/users')} />
                <LoginLink />
                <RegisterLink />
            </div>
        </div>
        <div onClick={() => props.toggleSideBar()} className="md:hidden text-[#808080] hover:text-[#191919]">
            <GripIcon className="w-8 h-8" />
        </div>
        <div className="gap-3 hidden md:flex">
            <HomeLink onClick={props.toggleSideBar} current={location.pathname === '/'} />
            <UsersLink onClick={props.toggleSideBar} current={location.pathname.startsWith('/users')} />
            <RegisterLink />
            <LoginLink />
        </div>
    </>
}