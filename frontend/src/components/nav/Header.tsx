import { useAuth } from "@/context/AuthContext"
import { Link, useLocation } from "react-router-dom";
import { ChatLink, ConnectionsLink, FeedLink, HomeLink, LoginLink, ProfileLink, RegisterLink, RequestsLink, UserProfile, UsersLink } from "../link";
import { useEffect } from "react";

export default function Header() {
    const auth = useAuth();
    useEffect(() => {
        auth.setUpdate(true);
    }, [])
    return <>
        <header className="flex justify-center bg-white border-b-[1px] sticky top-0">
            <nav className="container my-1 flex justify-between items-center py-1">
                <Link to="/">
                    <img src="/purry.ico" width={40} height={40}/>
                </Link>
                {auth.authenticated && <AuthenticatedNav  name={auth.name} photo_url={auth.photoUrl} email={auth.email} id={auth.userId.toString()}/>}
                {!auth.authenticated && <UnauthenticatedNav/>}
            </nav>
        </header>
    </>
}

function AuthenticatedNav( props: { name: string, photo_url: string | undefined | null, email: string, id: string }) {
    const location = useLocation();
    return <div className="flex gap-2">
        <HomeLink current={location.pathname.startsWith('/')}/>
        <FeedLink current={location.pathname.startsWith('/feed')}/>
        <ProfileLink id={props.id}/>
        <UsersLink current={location.pathname.startsWith('/users')}/>
        <RequestsLink current={location.pathname.startsWith('/requests')}/>
        <ConnectionsLink current={location.pathname.startsWith('/connection')}/>
        <ChatLink current={location.pathname.startsWith('/chat')}/>
        <UserProfile {...props}/>
    </div>
}

function UnauthenticatedNav() {
    const location = useLocation();
    return <div className="flex gap-3">
        <HomeLink current={location.pathname.startsWith('/')}/>
        <UsersLink current={location.pathname.startsWith('/users')}/>
        <LoginLink/>
        <RegisterLink/>
    </div>
}