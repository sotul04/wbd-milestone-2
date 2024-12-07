import { buttonStyles } from "@/components/button";
import { LoginLink, RegisterLink } from "@/components/link";
import { UserAside } from "@/components/user/user-aside";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function HomePage() {
    const auth = useAuth();

    if (auth.authenticated) {
        return (
            <section className="flex flex-col items-center">
                <div className="flex container flex-col sm:flex-row sm:gap-4 md:gap-8 p-4">
                    <aside className="w-full sm:w-1/3 md:w-1/3 mb-6 space-y-3 pb-6 border-b-2 sm:border-none">
                        <UserAside
                            title="Home"
                            content="The first step to building yourself"
                        />
                    </aside>

                    <main className="w-full md:w-3/4">
                        <h2 className="text-4xl font-bold mb-4 text-[#505050]">Welcome, {auth.name}</h2>
                        <p className="text-lg text-[#404040] font-semibold">Explore feeds and updates from your network!</p>
                        <ul className="space-y-2 text-sm my-4">
                            <li>
                                <Link to={`connections/${auth.userId}`} className={`${buttonStyles({variant: "link", size: "xl"})} px-0 font-normal text-sm`}>
                                    Your Connections
                                </Link>
                            </li>
                            <li>
                                <Link to="/requests" className={`${buttonStyles({variant: "link", size: "xl"})} px-0 font-normal text-sm`}>
                                    Connection Requests
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className={`${buttonStyles({variant: "link", size: "xl"})} px-0 font-normal text-sm`}>
                                    Messages
                                </Link>
                            </li>
                        </ul>
                    </main>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col h-[calc(100vh-80px)] items-center px-2 justify-center">
            <div className="container p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to LinkinPurry</h1>
                <p className="mb-4">
                    Join our professional network to connect and grow your career.
                </p>
                <div className="flex justify-center space-x-4">
                    <RegisterLink />
                    <LoginLink />
                </div>
            </div>
        </section>
    );
}
