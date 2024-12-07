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
                        <div className="flex flex-col text-sm my-4">
                            <Link to={`connections/${auth.userId}`} className="font-semibold hover:underline underline-offset-4 py-1">
                                Your Connections
                            </Link>
                            <Link to="/requests" className="font-semibold hover:underline underline-offset-4 py-1">
                                Connection Requests
                            </Link>
                            <Link to="/chat" className="font-semibold hover:underline underline-offset-4 py-1">
                                Messages
                            </Link>
                        </div>
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
