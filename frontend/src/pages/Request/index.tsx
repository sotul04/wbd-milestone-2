import { ConnectionApi } from "@/api/connection-api";
import { RequestCard } from "@/components/user/request";
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

    return <section className="flex flex-col items-center px-2 py-3">
        {requests.length > 0 &&
            <>
                <h3 className="text-center text-xl my-2 font-semibold text-[#808080]">Requests</h3>
                <div className="w-full container grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {requests.map((item, index) => (
                        <RequestCard
                            key={item.from_id}
                            {...item}
                            clear={() => deleteRequest(index)}
                        />
                    ))}
                </div>
            </>
        }
        {requests.length <= 0 && <div>
            <p className="text-center text-sm text-[#808080]">No Requests</p>
        </div>}
    </section>
}