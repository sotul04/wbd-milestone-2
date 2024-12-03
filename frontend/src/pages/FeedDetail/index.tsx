import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { feedAPI } from "@/api/feed-api";
import { Feed } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function FeedDetailPage() {
    const auth = useAuth();
    const { postId } = useParams();
    const id = Number(postId);
    const [feed, setFeed] = useState<Feed | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const navigate = useNavigate(); 

    async function deleteFeed(id: number) {
        if (!window.confirm("Are you sure you want to delete this feed?")) return;

        try {
            setIsLoading(true); 
            await feedAPI.deleteFeed({id}); 
            alert("Feed deleted successfully."); 
            navigate("/feed"); 
        } catch (error) {
            console.error("Error deleting feed:", error);
            alert("Failed to delete feed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    // Save edited feed
    async function saveFeed() {
        try {
            setIsLoading(true);
            const response = await feedAPI.updateFeed({ id, content });
            const refreshedFeed = await feedAPI.readFeed({ id });
            setFeed(refreshedFeed.body.feed);
            setContent(response.body.feed.content); 
            alert("Feed updated successfully.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating feed:", error);
            alert("Failed to update feed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function fetchFeedDetail() {
            try {
                const response = await feedAPI.readFeed({ id });
                setFeed(response.body.feed);
                setContent(response.body.feed.content);
            } catch (err) {
                console.error("Error fetching feed:", err);
                setError("Failed to load feed details.");
            }
        }

        fetchFeedDetail();
    }, [id]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!feed) return <p>Loading feed details...</p>;

    return (
        <div className="p-4">
            {isEditing ? (
                <div>
                    {/* Edit Form */}
                    <h1 className="text-xl font-bold">Edit Feed</h1>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        {/* <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        /> */}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value.slice(0, 280))}
                            maxLength={280}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                            rows={4}
                        />
                        <p className="text-gray-500 text-sm mt-1">{content.length}/280</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={saveFeed}
                            disabled={isLoading}
                            className={`text-white bg-blue-500 hover:bg-blue-700 rounded-md px-4 py-2 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700 px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Feed Details */}
                    <h1 className="text-xl font-bold">{feed.title}</h1>
                    <p className="text-gray-600">{feed.content}</p>
                    <div className="text-sm text-gray-500">
                        <span>{feed.likes ?? 0} likes • {feed.comments ?? 0} comments</span>
                    </div>

                    {feed.user_id === auth.userId.toString() && (
                        <div className="flex gap-4 mt-4">
                            {/* Edit Button */}
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                                Edit
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteFeed(feed.id);
                                }}
                                disabled={isLoading}
                                className={`text-red-500 hover:text-red-700 text-sm font-medium ${
                                    isLoading ? "cursor-not-allowed opacity-50" : ""
                                }`}
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
