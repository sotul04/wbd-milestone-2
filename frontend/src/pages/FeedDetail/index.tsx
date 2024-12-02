import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { feedAPI } from "@/api/feed-api";
import { Feed } from "@/types";

export default function FeedDetailPage() {
    const id = Number(useParams().postId); // Get the feed ID from the route
    const [feed, setFeed] = useState<Feed | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeedDetail() {
            try {
                const response = await feedAPI.readFeed({id}); // Fetch feed by ID
                console.log("respon: ", response)
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
            <h1 className="text-xl font-bold">{feed.title}</h1>
            <p className="text-gray-600">{feed.content}</p>
            <div className="text-sm text-gray-500">
                <span>{feed.likes ?? 0} likes • {feed.comments ?? 0} comments</span>
            </div>
        </div>
    );
}
