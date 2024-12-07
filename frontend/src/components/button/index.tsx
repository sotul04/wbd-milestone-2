import { cva } from "class-variance-authority";

export const buttonStyles = cva(
    "font-semibold rounded-full",
    {
        variants: {
            variant: {
                default: "text-blue-600 bg-white border border-blue-600 transition-shadow hover:shadow-[inset_0_0_0_1px_#004182] hover:bg-blue-50 active:bg-blue-100 ",
                destructive:
                    "text-white bg-red-700 transition-colors hover:bg-red-900 active:bg-red-950 active:text-red-100 ",
                login: 
                    "text-white bg-blue-700 transition-colors hover:bg-blue-900 active:bg-blue-950 active:text-blue-100 ",
                secondary:
                    "text--[#202020] bg-white border transition-shadow border-[#202020] hover:shadow-[inset_0_0_0_1px_#202020] hover:bg-[#f1f1f1] active:bg-[#dedede] ",
                ghost: "bg-orange-50 text-[#808080] hover:bg-orange-50",
                link: "underline-offset-4 hover:underline",
            },
            size: {
                default: "h-8 px-3 ",
                sm: "text-sm h-6 px-2 ",
                lg: "h-10 px-5 ",
                xl: "h-11 px-5 text-lg"
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)