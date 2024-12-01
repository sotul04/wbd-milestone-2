import { ProfileApi } from "@/api/profile-api";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import { useEffect, useState } from "react";

export default function HomePage() {
    const auth = useAuth();

    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        connection_count: 0,
        username: "",
    });

    async function getProfile() {
        try {
            if (!auth.userId) return; // Ensure userId is available
            const response = await ProfileApi.getProfile({
                userId: auth.userId.toString(), // Use auth.userId instead of params userId if relevant
            });
            setProfile(response.body); // Update state with API response
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    useEffect(() => {
        getProfile();
    }, [auth.userId]); // Trigger only when auth.userId changes

    // Dummy data for the feed
    // const feeds = [
    //     {
    //         id: 1,
    //         name: "Nada Raudah Mumtazah",
    //         title: "Undergraduate Student of Ocean Engineering, Bandung Institute of Technology",
    //         content:
    //             "ARUNGI is a national-level design competition based on ocean engineering knowledge for high school students (SMA/SMK/MA equivalent), organized by KMKL and ALKA ITB.",
    //         time: "4hr",
    //         likes: 32,
    //         comments: 5,
    //     },
    //     {
    //         id: 2,
    //         name: "Mario Mahardika Sinulingga",
    //         title: "IT Enthusiast",
    //         content: "Check out the latest opportunities in the tech world!",
    //         time: "6hr",
    //         likes: 45,
    //         comments: 8,
    //     },
    //     {
    //         id: 3,
    //         name: "Institut Teknologi Bandung (ITB)",
    //         title: "Official Account",
    //         content: "KMKL dan ALKA ITB Sukses Gelar ARUNGI 2024.",
    //         time: "5hr",
    //         likes: 100,
    //         comments: 25,
    //     },
    //     {
    //         id: 4,
    //         name: "LinkedIn Official",
    //         title: "Your Career Partner",
    //         content: "Update your job preferences to help recruiters find you for the right opportunities.",
    //         time: "8hr",
    //         likes: 22,
    //         comments: 3,
    //     },
    //     {
    //         id: 5,
    //         name: "John Doe",
    //         title: "Senior Developer at Tech Inc.",
    //         content: "Building scalable solutions for the next generation.",
    //         time: "10hr",
    //         likes: 67,
    //         comments: 15,
    //     },
    // ];


    /**
     * <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-full transition duration-200 hover:bg-[var(--artdeco-button-secondary-default-hover-background-color)] hover:text-[var(--artdeco-button-secondary-default-hover-color)] hover:shadow-[inset_0_0_0_2px_var(--artdeco-button-secondary-default-hover-border-color)]">
    Kembangkan jaringan Anda
</button>

     */

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 p-4 bg-white shadow-lg">
                <div className="space-y-4">
                    <div className="bg-gray-200 h-32 rounded-md"></div>

                    {auth.userId ? (
                    <>
                        <h2 className="text-lg font-semibold">Selamat datang, {auth.name}!</h2>
                        <p className="text-sm text-gray-600">Koneksi: {profile.connection_count} </p>
                        <button onClick={
                        () => {
                            const data = new Date("2024-11-29T13:10:22.193Z").toLocaleString("en-Gb", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            console.log(data);
                        }
                    } className="px-3 h-8 rounded-full font-semibold text-white bg-red-700 duration-100 transition-colors hover:bg-red-900 active:bg-red-950 active:text-red-100">
                            Kembangkan jaringan
                        </button>
                    </>
                    ) : (
                        <p>You haven't sign in!</p>
                    )}
                </div>
            </aside>

            {/* Main Feed */}
            <main className="flex-1 p-4">
                {auth.feeds?.map((feed) => (
                    <div
                        key={feed.id}
                        className="bg-white p-4 rounded-md shadow-md mb-4 space-y-2"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                            <div>
                                <h3 className="font-semibold">{feed.name}</h3>
                                <p className="text-sm text-gray-600">{feed.title}</p>
                            </div>
                        </div>
                        <p className="text-gray-800">{feed.content}</p>
                        <div className="flex justify-between items-center text-gray-600 text-sm">
                            <span>{feed.time} ago</span>
                            <span>{feed.likes} likes • {feed.comments} comments</span>
                        </div>
                    </div>
                ))}
            </main>

            {/* Right Sidebar */}
            <aside className="w-full md:w-1/4 p-4 bg-white shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Berita LinkedIn</h2>
                <ul className="space-y-2">
                    <li className="text-sm text-gray-800">
                        <a href="#" className="hover:underline">
                            Americans see ideal salary at $270K
                        </a>
                        <p className="text-xs text-gray-500">4j yang lalu - 28,970 pembaca</p>
                    </li>
                    <li className="text-sm text-gray-800">
                        <a href="#" className="hover:underline">
                            Amazon raises stake in Anthropic
                        </a>
                        <p className="text-xs text-gray-500">8j yang lalu - 18,304 pembaca</p>
                    </li>
                    <li className="text-sm text-gray-800">
                        <a href="#" className="hover:underline">
                            Bitcoin takes aim at $100K mark
                        </a>
                        <p className="text-xs text-gray-500">4j yang lalu - 7,526 pembaca</p>
                    </li>
                </ul>
            </aside>
        </div>
    );
}
