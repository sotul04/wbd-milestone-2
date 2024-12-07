import { ConnectionApi } from "@/api/connection-api";
import { FriendsCard } from "@/components/user/friends";
import { UserAside } from "@/components/user/user-aside";
import { UserProps } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

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

    return <section className="flex flex-col items-center">
        <div className="flex container flex-col sm:flex-row sm:gap-4 md:gap-8 p-4">
            <aside className="w-full sm:w-1/3 md:w-1/4 mb-6 space-y-3 pb-6 border-b-2 sm:border-none">
                <UserAside title="Connections" content="Build your network and develop yourself" />
            </aside>

            <main className="w-full md:w-3/4">
                {friends.length <= 0 ? <>
                    <div className="flex items-center justify-center p-1">
                        <p className="text-center text-sm text-[#808080]">No Connection</p>
                    </div>
                </> : <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {friends.map(item =>
                            <FriendsCard
                                key={item.id}
                                {...item}
                            />
                        )}
                    </div>
                </>}
            </main>
        </div>
    </section>
}