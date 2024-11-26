import { ProfileApi } from "@/api/profile-api";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useToast } from "@/hooks/use-toast";
import { ConnectionApi } from "@/api/connection-api";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { PenIcon } from "lucide-react";
import { FeedCard } from "@/components/feed/feed";
import { Validation } from "@/components/alert/alert";

type UserProfile = {
    name: string;
    username: string;
    work_history?: string | null;
    skills?: string | null;
    profile_photo?: string;
    relevant_posts?: {
        id: string;
        created_at: Date;
        updated_at: Date;
        content: string;
        user_id: string;
    }[] | null;
    connection_count: number;
    connect_status?: string | null;
};

type UserEditProfile = {
    name: string;
    username: string;
    work_history: string;
    skills: string;
};

export default function Profile() {
    const workHistoryRef = useRef<ReactQuill | null>(null);
    const skillsRef = useRef<ReactQuill | null>(null);
    const { userId } = useParams();
    if (!userId) {
        throw new Error("User ID is missing. Cannot load profile.");
    }
    const auth = useAuth();
    const { toast } = useToast();

    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        connection_count: 0,
        username: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const [edited, setEdited] = useState<UserEditProfile>({
        name: "",
        username: "",
        work_history: "",
        skills: "",
    });
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);

    function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        setPhoto(file);
    }

    async function handleConnect() {
        try {
            const response = await ConnectionApi.connectionSend({ to: Number(userId) });
            toast({
                title: 'Success',
                description: response.message
            });
            getProfile();
        } catch (error) {
            toast({
                title: 'Opss',
                description: (error as any)?.message,
                variant: "destructive"
            })
        }
    }

    async function handleDisconnect() {
        try {
            const response = await ConnectionApi.connectionDelete({ to: userId! });
            toast({
                title: 'Success',
                description: response.message
            });
            getProfile();
        } catch (error) {
            toast({
                title: 'Opss',
                description: (error as any)?.message,
                variant: "destructive"
            })
        }
    }

    async function getProfile() {
        try {
            const response = await ProfileApi.getProfile({
                userId: userId!,
            });
            setProfile(response.body);
        } catch (error) {
            throw new Error((error as any)?.message);
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        setEdited({
            name: profile.name,
            username: profile.username,
            work_history: profile.work_history ?? "",
            skills: profile.skills ?? "",
        });
    }, [profile]);

    async function saveEdit(foto?: boolean, deletePhoto?: boolean) {
        try {
            if (!foto) {
                const data = edited;
                const response = await ProfileApi.updateProfile({
                    name: data.name,
                    userId: userId!,
                    username: data.username,
                    skills: data.skills,
                    work_history: data.work_history,
                });
                setProfile((prev) => ({
                    ...prev,
                    name: data.name,
                    username: data.username,
                    skills: data.skills,
                    work_history: data.work_history,
                }));
                toast({
                    title: "Success",
                    description: response.message,
                    className: "bg-green-400 text-white",
                });
            } else {
                if (deletePhoto) {
                    const response = await ProfileApi.updateProfile({
                        userId: userId!,
                        delete_photo: true
                    });
                    await getProfile();
                    auth.setUpdate(prev => !prev);
                    toast({
                        title: "Success",
                        description: response.message,
                        className: "bg-green-400 text-white",
                    });
                } else {
                    const response = await ProfileApi.updateProfile({
                        userId: userId!,
                        delete_photo: false,
                        profilePhotoFile: photo!
                    });
                    await getProfile();
                    auth.setUpdate(prev => !prev);
                    toast({
                        title: "Success",
                        description: response.message,
                        className: "bg-green-400 text-white",
                    });
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Oops",
                    description: (error as any)?.message,
                    variant: "destructive",
                });
            }
        }
    }

    const editorModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            [{ header: [1, 2, 3, false] }],
            [{ align: [] }],
        ],
    };

    const editorFormats = [
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "link",
        "header",
        "align",
    ];

    if (auth.userId.toString() === userId) {
        return (
            <section className="flex flex-col items-center px-2">
                <Card className="container border relative rounded-lg my-5 p-0">
                    <div className="relative h-24 sm:h-36 md:h-44 bg-[#D9E5E7] overflow-hidden rounded-t-lg border-b">
                        <div className="w-full h-[300px] rounded-full absolute bg-[#A0B4B7] bottom-1/2 left-0 -translate-x-[36%] translate-y-1/2"></div>
                        <div className="w-1/2 h-full absolute bg-[#BFD3D6] right-0 top-0 translate-x-[40%]"></div>
                    </div>
                    <Avatar className="absolute border left-[5%] top-24 sm:top-36 md:top-44 -translate-y-1/2 h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
                        <AvatarImage
                            src={`${import.meta.env.VITE_API_URL}/storage/${profile.profile_photo}`}
                        />
                        <AvatarFallback className="text-[48px] sm:text-[60px]">
                            {profile.name.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute left-[5%] top-24 sm:top-36 md:top-44">
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className="bg-blue-200 hover:bg-blue-100 -translate-y-1/2 translate-x-[calc(128px-60%)] sm:translate-x-[calc(160px-60%)] md:translate-x-[calc(192px-60%)]  rounded-full w-9 h-9">
                                    <PenIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="py-2 px-3">
                                <Label>{`New Photo (Max 5MB)`}</Label>
                                <Input
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handlePhotoChange}
                                />
                                <div className="flex gap-2 mt-3 justify-end">
                                    <Button
                                        variant={"outline"}
                                        className="h-8 rounded-full"
                                        onClick={async () => {
                                            await saveEdit(true, photo === null);
                                            setPopoverOpen(false);
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant={"destructive"}
                                        className="h-8 rounded-full"
                                        onClick={async () => {
                                            await saveEdit(true, true);
                                            setPopoverOpen(false);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="mt-[75px] sm:mt-[90px] md:mt-[108px] px-[5%] flex flex-col gap-1">
                        {isEdit ? (
                            <>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={edited.name}
                                    onChange={(e) =>
                                        setEdited((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                />

                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={edited.username}
                                    onChange={(e) =>
                                        setEdited((prev) => ({
                                            ...prev,
                                            username: e.target.value,
                                        }))
                                    }
                                />

                                <Label>Work History</Label>
                                <ReactQuill
                                    ref={workHistoryRef}
                                    value={edited.work_history}
                                    onChange={(content) =>
                                        setEdited((prev) => ({
                                            ...prev,
                                            work_history: content,
                                        }))
                                    }
                                    modules={editorModules}
                                    formats={editorFormats}
                                />

                                <Label>Skills</Label>
                                <ReactQuill
                                    ref={skillsRef}
                                    value={edited.skills}
                                    onChange={(content) =>
                                        setEdited((prev) => ({
                                            ...prev,
                                            skills: content,
                                        }))
                                    }
                                    modules={editorModules}
                                    formats={editorFormats}
                                />

                                <div className="flex justify-end gap-1 mt-2">
                                    <Button
                                        variant="outline"
                                        className="h-8 rounded-full"
                                        onClick={() => setIsEdit(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            saveEdit();
                                            setIsEdit(false);
                                        }}
                                        className="h-8 rounded-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="font-semibold text-2xl sm:text-3xl">
                                    {profile.name}
                                </h1>
                                <p className="text-sm text-[#808080]">{profile.username}</p>
                                {profile.work_history?.trim().length !== 0 &&
                                    <div className="py-1">
                                        <Label>Work History</Label>
                                        <ReactQuill
                                            ref={workHistoryRef}
                                            readOnly
                                            modules={{ toolbar: null }}
                                            value={profile.work_history ?? ""}
                                        />
                                    </div>
                                }
                                {profile.skills?.trim().length !== 0 &&
                                    <div className="py-1">
                                        <Label>Skills</Label>
                                        <ReactQuill
                                            ref={skillsRef}
                                            readOnly
                                            modules={{ toolbar: null }}
                                            value={profile.skills ?? ""}
                                        />
                                    </div>
                                }
                                <div className="flex justify-end mt-2">
                                    <Button
                                        className="rounded-full h-8"
                                        variant="outline"
                                        onClick={() => setIsEdit(true)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end py-2 pr-[5%] mb-2 text-sm text-[#808080]">
                        <Link className={`${buttonVariants({ variant: "link" })} px-0`} to={`/connections/${userId}`}>{`${profile.connection_count} Connection${profile.connection_count > 1 ? "s" : ""
                            }`}</Link>
                    </div>
                </Card>
                {profile.relevant_posts && profile.relevant_posts.length > 0 &&
                    <>
                        <h3 className="text-center text-xl my-2 font-semibold text-[#808080]">Feeds</h3>
                        <div className="w-full container grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {profile.relevant_posts.map(item => (
                                <FeedCard
                                    key={item.id}
                                    {...item}
                                    profile_photo={profile.profile_photo}
                                    name={profile.name}
                                    username={profile.username}
                                />
                            ))}
                        </div>
                    </>
                }
                {profile.relevant_posts && profile.relevant_posts.length <= 0 &&
                    <p className="text-center text-sm text-[#808080]">No Feed</p>
                }
            </section>
        );
    }

    return (
        <section className="flex flex-col items-center px-2">
            <Card className="container border relative rounded-lg my-5 p-0">
                <div className="relative h-24 sm:h-36 md:h-44 bg-[#D9E5E7] overflow-hidden rounded-t-lg border-b">
                    <div className="w-full h-[300px] rounded-full absolute bg-[#A0B4B7] bottom-1/2 left-0 -translate-x-[36%] translate-y-1/2"></div>
                    <div className="w-1/2 h-full absolute bg-[#BFD3D6] right-0 top-0 translate-x-[40%]"></div>
                </div>
                <Avatar className="absolute border left-[5%] top-24 sm:top-36 md:top-44 -translate-y-1/2 h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
                    <AvatarImage
                        src={`${import.meta.env.VITE_API_URL}/storage/${profile.profile_photo}`}
                    />
                    <AvatarFallback className="text-[48px] sm:text-[60px]">
                        {profile.name.substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="mt-[75px] sm:mt-[90px] md:mt-[108px] px-[5%] flex flex-col gap-1">
                    <h1 className="font-semibold text-2xl sm:text-3xl">
                        {profile.name}
                    </h1>
                    <p className="text-sm text-[#808080]">{profile.username}</p>
                    {profile.work_history &&
                        <div className="py-1">
                            <Label>Work History</Label>
                            <ReactQuill
                                ref={workHistoryRef}
                                readOnly
                                modules={{ toolbar: null }}
                                value={profile.work_history ?? ""}
                            />
                        </div>
                    }
                    {profile.skills &&
                        <div className="py-1">
                            <Label>Skills</Label>
                            <ReactQuill
                                ref={skillsRef}
                                readOnly
                                modules={{ toolbar: null }}
                                value={profile.skills ?? ""}
                            />
                        </div>
                    }
                    {profile.connect_status && profile.connect_status === 'connected' &&
                        <div className="flex justify-end mt-2">
                            <Validation
                                trigger="Disconnect"
                                actionDesc="Disconnect"
                                classTrigger={buttonVariants({variant: "destructive"})}
                                classAction={buttonVariants({variant: "destructive"})}
                                action={() => handleDisconnect()}
                                title="Are you sure?"
                                description="This action cannot be undone. Your connection with this user is going to be deleted."
                            />
                        </div>
                    }
                    {profile.connect_status && profile.connect_status === 'disconnected' &&
                        <div className="flex justify-end mt-2">
                            <Button
                                className="rounded-full h-8"
                                variant="outline"
                                onClick={() => handleConnect()}
                            >
                                Connect
                            </Button>
                        </div>
                    }
                    {profile.connect_status && profile.connect_status === 'waiting' &&
                        <div className="flex justify-end mt-2">
                            <Button
                                disabled
                                className="rounded-full h-8"
                                variant={"ghost"}
                            >
                                Waiting
                            </Button>
                        </div>
                    }
                </div>
                <div className="flex justify-end py-2 pr-[5%] text-sm mb-2 text-[#808080]">
                    <Link className={`${buttonVariants({ variant: "link" })} px-0`} to={`/connections/${userId}`}>{`${profile.connection_count} Connection${profile.connection_count > 1 ? "s" : ""
                        }`}</Link>
                </div>
            </Card>
            {profile.relevant_posts && profile.relevant_posts.length > 0 &&
                <>
                    <h3 className="text-center text-xl my-2 font-semibold text-[#808080]">Feeds</h3>
                    <div className="w-full container grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {profile.relevant_posts.map(item => (
                            <FeedCard
                                key={item.id}
                                {...item}
                                profile_photo={profile.profile_photo}
                                name={profile.name}
                                username={profile.username}
                            />
                        ))}
                    </div>
                </>
            }
            {profile.relevant_posts && profile.relevant_posts.length <= 0 &&
                <p className="text-center text-sm text-[#808080]">No Feed</p>
            }
        </section >
    );
}
