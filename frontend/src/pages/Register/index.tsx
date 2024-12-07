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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AuthApi } from "@/api/auth-api";
import { buttonStyles } from "@/components/button";

const formSchema = z
    .object({
        name: z.string().min(3, { message: "Name must be at least 3 characters." }),
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters." }).regex(/^[^\s@]+$/, "Username cannot be an email or contain '@'"),
        email: z.string().email({ message: "Please enter a valid email address." }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." }),
        confirmPassword: z
            .string()
            .min(8, { message: "Confirm Password must be at least 8 characters." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export default function Register() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { username, email, name, password } = values;
            await AuthApi.register({ username, name, email, password });
            auth.setUpdate(prev => !prev);
            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Opss",
                    description: error.message,
                    variant: "destructive"
                });
            } else {
                const message = (error as any)?.message;
                if (message) {
                    if (message === 'Email has been used') {
                        form.setError("email", {
                            type: "manual",
                            message: "This email is already in use."
                        })
                        return;
                    }
                    if (message === 'Username has been used') {
                        form.setError("username", {
                            type: "manual",
                            message: "This username is already in use."
                        })
                        return;
                    }
                }
                toast({
                    title: "Opss",
                    description: 'Something went wrong',
                    variant: "destructive"
                })
            }
        }
    };

    return <>
        <section className="min-h-screen w-full flex flex-col justify-center items-center">
            <Card className="max-w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle>Make the most of your professional life</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-0">
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input className="bg-white" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input className="bg-white" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input className="bg-white" type="email" {...field} />
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
                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input className="bg-white" placeholder="Re-enter your password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Register Button */}
                            <Button type="submit" className={`${buttonStyles({ variant: "login", size: "xl" })} w-full`}>
                                Register
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-center">
                        Already on LinkinPurry?{" "}
                        <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    </>
}