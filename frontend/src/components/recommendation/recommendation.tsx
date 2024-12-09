import { ConnectionApi } from "@/api/connection-api";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { UserRecommendationCard } from "./recommendation-card";

interface RecProps {
    id: string;
    username: string;
    full_name: string | null;
    profile_photo_path: string;
}

export function Recommendations() {
    const [recss, setRecss] = useState<RecProps[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchRecs() {
            setLoading(true);
            try {
                const response = await ConnectionApi.getRecommendations();
                setRecss(response.body);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }
        fetchRecs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center gap-1 my-3">
                <LoaderCircleIcon className="animate-spin" />
                <p className="text-[#808080]">Loading</p>
            </div>
        );
    }

    return (
        <>
            {recss.length === 0 &&
                <div>
                    <p className="text-center text-sm text-[#808080]">No recommendations</p>
                </div>
            }
            {recss.length > 0 &&
                <>
                    <h1 className="mt-3 mb-2 text-lg text-[#808080] font-semibold">Connections for you</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {
                            recss.map((rec, idx) =>
                                <UserRecommendationCard
                                    key={`${idx}-${rec.id}`}
                                    {...rec}
                                />
                            )
                        }
                    </div>
                </>
            }
        </>
    );

}