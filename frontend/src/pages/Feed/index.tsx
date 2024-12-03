import { ConnectionApi } from "@/api/connection-api";
import { feedAPI } from "@/api/feed-api";
import { ProfileApi } from "@/api/profile-api";
import { useAuth } from "@/context/AuthContext";
import { Feed, UserProfile, UserProps } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FeedPage() {
    const auth = useAuth();

    const [friends, setFriends] = useState<UserProps[]>([]);

    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        connection_count: 0,
        username: "",
    });

    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setModalOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [postError, setPostError] = useState<string | null>(null);

    async function getProfile() {
        try {
            if (!auth.userId) return;
            const response = await ProfileApi.getProfile({
                userId: auth.userId.toString()
            });
            setProfile(response.body);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    async function fetchFeeds() {
        setIsLoading(true);
        try {
            const userIds = [auth.userId.toString(), ...friends.map(friend => friend.id.toString())]; // Combine user's ID and friends' IDs
    
            const response = await feedAPI.getUserFeeds({
                userIds, // Pass the list of user IDs
                cursor: undefined,
                limit: 10,
            });
    
            if (response?.body?.formattedFeeds?.length > 0) {
                setFeeds(response.body.formattedFeeds);
            } else {
                setFeeds([]);
            }
    
            setError(null);
        } catch (err) {
            console.error("Error fetching feeds:", err);
            setError("Failed to fetch feeds. Please try again.");
            setFeeds([]);
        } finally {
            setIsLoading(false);
        }
    }
    
    async function createPost() {
        if (!newPostContent.trim()) {
            setPostError("Post content cannot be empty.");
            return;
        }
    
        try {
            setIsLoading(true); 
            setPostError(null); 

            await feedAPI.createFeed({
                user_id: auth.userId.toString(),
                content: newPostContent.trim(),
            });
    
            setNewPostContent(""); 
            await fetchFeeds();
            setModalOpen(false); 
        } catch (error) {
            console.error("Error creating post:", error);
            setPostError("Failed to create post. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    function getTimeDifference(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
        if (diffInSeconds < 60) {
            return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days === 1 ? '' : 's'} ago`;
        }
    }

    useEffect(() => {
        async function initializeData() {
            try {
                // Fetch friends first
                const response = await ConnectionApi.connectionList({
                    userId: auth.userId.toString()!,
                });
                setFriends(response.body);

                // Then fetch feeds based on the updated friends list
                const userIds = [auth.userId.toString(), ...response.body.map(friend => friend.id.toString())];


                const feedsResponse = await feedAPI.getUserFeeds({
                    userIds,
                    cursor: undefined,
                    limit: 10,
                });

                if (feedsResponse?.body?.formattedFeeds?.length > 0) {
                    setFeeds(feedsResponse.body.formattedFeeds);
                } else {
                    setFeeds([]);
                }

                getProfile()

                setError(null);
            } catch (error) {
                console.error("Error initializing data:", error);
                setFriends([]);
                setFeeds([]);
                setError("Failed to load data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }

        if (auth.userId) {
            setIsLoading(true);
            initializeData();
        }
    }, [auth.userId]);


    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 p-4 bg-white shadow-lg">
                <div className="space-y-4">
                    <div className="bg-gray-200 h-32 rounded-md"></div>
                    <h2 className="text-lg font-semibold">Selamat datang, {profile.name}!</h2>
                    <p className="text-sm text-gray-600">Koneksi: {profile.connection_count}</p>
                    <button className="w-full text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg">
                        Kembangkan jaringan Anda
                    </button>
                </div>
            </aside>
            
            {/* Main Body */}
            <main className="flex-1 p-4">
                {/* Add Post Section */}
                <div className="bg-white p-4 rounded-md shadow-md mb-4">
                    <div className="flex items-center space-x-4">
                        {/* Profile Picture */}
                        <img 
                            src="/purry.ico" 
                            alt="profile-pic" 
                            className="h-12 w-12 rounded-full"
                        />

                        {/* Button */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full text-left px-4 py-2 border rounded-full text-gray-600 bg-gray-100 focus:outline-none hover:bg-gray-200"
                        >
                            Start a post, try writing with AI
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-4 text-gray-600">
                        <button className="flex items-center space-x-2 text-sm font-medium text-blue-600">
                            <img
                                src="https://img.icons8.com/color/24/null/image-gallery.png"
                                alt="Photo Icon"
                            />
                            <span>Photo</span>
                        </button>
                        <button className="flex items-center space-x-2 text-sm font-medium text-green-600">
                            <img
                                src="https://img.icons8.com/color/24/null/video.png"
                                alt="Video Icon"
                            />
                            <span>Video</span>
                        </button>
                        <button className="flex items-center space-x-2 text-sm font-medium text-orange-600">
                            <img
                                src="https://img.icons8.com/color/24/null/news.png"
                                alt="Write Article Icon"
                            />
                            <span>Write article</span>
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4 w-11/12 max-w-md shadow-lg">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="/purry.ico"
                                        alt="profile-pic"
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{profile.name}</h3>
                                        <p className="text-sm text-gray-500">Post to Anyone</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Input Section */}
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value.slice(0, 280))}
                                maxLength={280}
                                placeholder="What do you want to talk about?"
                                className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-gray-500 text-sm mt-1">{newPostContent.length}/280</p>
                            {postError && <p className="text-red-500 text-sm mt-2">{postError}</p>}

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex space-x-2">
                                    {/* Optional: Add more buttons if needed */}
                                </div>
                                <button
                                    onClick={createPost}
                                    disabled={!newPostContent.trim() || isLoading}
                                    className={`bg-blue-600 text-white px-4 py-1 rounded-full font-semibold hover:bg-blue-700 ${
                                        !newPostContent.trim() || isLoading ? "disabled:bg-blue-300" : ""
                                    }`}
                                >
                                    {isLoading ? "Posting..." : "Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Feed */}
                {isLoading ? (
                    <p>Loading feeds...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    feeds.map((feed) => (
                        <Link to={`/feed/${feed.id}`} key={feed.id}>
                            <div key={feed.id} className="bg-white p-4 rounded-md shadow-md mb-4 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                                    <div>
                                        <h3 className="font-semibold">{feed.title}</h3>
                                        <p className="text-sm text-gray-600">{feed.user_id}</p>
                                    </div>
                                </div>

                                <p className="text-gray-800 break-words break-before-right">{feed.content}</p>
                                <div className="flex justify-between items-center text-gray-600 text-sm">
                                    <span>{getTimeDifference(feed.updated_at)}</span>
                                    <span>{feed.likes ?? 0} likes • {feed.comments ?? 0} comments</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
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
