import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { feedAPI } from "@/api/feed-api";
import { Feed } from "@/types";

export default function FeedDetailPage() {
    const { postId } = useParams(); // Get the feed ID from the route
    const id = Number(postId);
    const [feed, setFeed] = useState<Feed | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state for delete
    const navigate = useNavigate(); // To redirect after deletion

    async function deleteFeed(id: number) {
        if (!window.confirm("Are you sure you want to delete this feed?")) return;

        try {
            setIsLoading(true); // Show loading indicator
            await feedAPI.deleteFeed({id}); // Call delete API
            alert("Feed deleted successfully."); // Show success message
            navigate("/feed"); // Redirect to the main feed page
        } catch (error) {
            console.error("Error deleting feed:", error);
            alert("Failed to delete feed. Please try again.");
        } finally {
            setIsLoading(false); // Remove loading indicator
        }
    }

    useEffect(() => {
        async function fetchFeedDetail() {
            try {
                const response = await feedAPI.readFeed({ id }); // Fetch feed by ID
                setFeed(response.body.feed);
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
            {/* Feed Details */}
            <h1 className="text-xl font-bold">{feed.title}</h1>
            <p className="text-gray-600">{feed.content}</p>
            <div className="text-sm text-gray-500">
                <span>{feed.likes ?? 0} likes • {feed.comments ?? 0} comments</span>
            </div>

            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent default navigation
                    deleteFeed(feed.id);
                }}
                disabled={isLoading} // Disable button while deleting
                className={`mt-4 text-red-500 hover:text-red-700 text-sm font-medium ${
                    isLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
            >
                {isLoading ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}
