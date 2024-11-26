import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { UserCard } from "@/components/user/user";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { ConnectionApi } from "@/api/connection-api";
import { SearchIcon } from "lucide-react";

type User = {
    id: string;
    email: string;
    full_name: string;
    profile_photo_path: string | null;
    can_connect?: boolean;
};

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        setSearchParams({ search: searchQuery });
    }, [searchQuery, setSearchParams]);

    useEffect(() => {
        const query = searchParams.get("search") || "";
        fetchUsers(query);
    }, [searchParams]);

    const fetchUsers = async (query: string) => {
        try {
            const response = await ConnectionApi.getUsers({ search: query === "" ? undefined : query });
            setUsers(response.body);
        } catch (error) {
            console.log((error as any)?.message);
        }
    };

    const handleSearch = debounce((value: string) => {
        setSearchQuery(value);
    }, 500);

    return (
        <section className="flex flex-col items-center">
            <div className="flex container flex-col md:flex-row md:gap-8 p-4">
                {/* Bagian kiri: Pencarian */}
                <aside className="w-full md:w-1/4 mb-6">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search users..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pr-12"
                        />
                        <SearchIcon
                            size={20}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </aside>

                {/* Bagian kanan: Hasil Pencarian */}
                <main className="w-full md:w-3/4">
                    <div className="grid grid-cols-1 gap-3">
                        {users.length > 0 &&
                            users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    {...user}
                                />
                            ))}
                        {users.length <= 0 && (
                            <p className="text-center text-sm text-[#808080] pt-2">No users</p>
                        )}
                    </div>
                </main>
            </div>
        </section>
    );
}
