import { ConnectionApi } from "@/api/connection-api";
import { FriendsCard } from "@/components/user/friends";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

type UserProps = {
    id: string;
    username: string;
    email: string;
    full_name: string | null;
    profile_photo_path: string;
}

export default function Connections() {
    const { userId } = useParams();

    if (!userId) {
        throw new Error("UserId is required");
    }
    const [friends, setFriends] = useState<UserProps[]>([]);

    useEffect(() => {
        async function getFriendsList() {
            try {
                const response = await ConnectionApi.connectionList({
                    userId: userId!
                });
                setFriends(response.body);
            } catch (error) {
                setFriends([]);
                console.log((error as any)?.message);
            }
        }

        getFriendsList();
    }, []);

    return <section className="flex flex-col items-center px-2 py-3">
        {friends.length > 0 &&
            <>
                <h3 className="text-center text-xl my-2 font-semibold text-[#808080]">Connections</h3>
                <div className="w-full container grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {friends.map(item => (
                        <FriendsCard
                            key={item.id}
                            {...item}
                        />
                    ))}
                </div>
            </>
        }
        {friends.length <= 0 && <div>
            <p className="text-center text-sm text-[#808080]">No Connections</p>
        </div>}
    </section>
}