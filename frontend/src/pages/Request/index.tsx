import { ConnectionApi } from "@/api/connection-api";
import { RequestCard } from "@/components/user/request";
import { UserAside } from "@/components/user/user-aside";
import { useEffect, useState } from "react";

type UserProps = {
    from_id: string;
    to_id: string;
    from_user: {
        username: string;
        email: string;
        full_name: string | null;
        profile_photo_path: string;
    };
    created_at: Date;
}

export default function Requests() {
    const [requests, setRequests] = useState<UserProps[]>([]);

    useEffect(() => {
        async function getFriendsList() {
            try {
                const response = await ConnectionApi.connectionRequests();
                setRequests(response.body);
            } catch (error) {
                setRequests([]);
                console.log((error as any)?.message);
            }
        }

        getFriendsList();
    }, []);

    function deleteRequest(idx: number) {
        const newRequests = requests.filter((left, index) => {
            if (idx !== index) return left;
        });
        setRequests(newRequests);
    }

    return <section className="flex flex-col items-center">
        <div className="flex container flex-col sm:flex-row sm:gap-4 md:gap-8 p-4">
            <aside className="w-full sm:w-1/3 md:w-1/4 mb-6 space-y-3 pb-6 border-b-2 sm:border-none">
                <UserAside title="Connection Request" content="Grow your network with the right partners" />
            </aside>

            <main className="w-full md:w-3/4">
                {requests.length <= 0 ? <>
                    <div className="flex items-center justify-center p-1">
                        <p className="text-center text-sm text-[#808080]">No Request</p>
                    </div>
                </> : <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {requests.map((item, index) =>
                            <RequestCard
                                key={item.from_id}
                                {...item}
                                clear={() => deleteRequest(index)}
                            />
                        )}
                    </div>
                </>}
            </main>
        </div>
    </section>
}