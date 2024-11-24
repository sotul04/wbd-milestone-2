import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z
    .object({
        username: z
            .string()
            .min(1, { message: "Username can not be empty." }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." }),
    });

export default function Register() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const [error, setError] = useState<string>();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await auth.login(values);
            navigate("/");
            setError(undefined);
        } catch (error) {
            const message = (error as any)?.message;
            if (message) {
                if (message === 'User not found' || message === 'Password do not match') {
                    setError(message);
                    return;
                }
            }
            setError(undefined);
            toast({
                title: "Opss",
                description: 'Something went wrong',
                variant: "destructive"
            })
        }
    };

    return <>
        <section className="min-h-screen w-full flex flex-col justify-center items-center">
            <Card className="min-w-[300px] drop-shadow-md">
                <CardHeader className="text-center">
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="p-2 text-red-500 bg-red-100 text-center rounded-lg mb-2">{error}</p>}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-0">
                                {/* Username or Email*/}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username or Email</FormLabel>
                                            <FormControl>
                                                <Input className="bg-white" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input className="bg-white" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Register Button */}
                            <Button type="submit" className="w-full rounded-full bg-blue-600 hover:bg-blue-700 font-semibold text-[16px] p-6 ">
                                Login
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <p className="text-center mt-4">
                New on LinkinPurry?{" "}
                <Link to="/register" className="text-blue-500 font-semibold hover:underline">
                    Join Now
                </Link>
            </p>
        </section>
    </>
}