import { Link } from "react-router-dom";


export function IconLink({ children, to }: { children: React.ReactNode, to: string }) {
    return <Link to={to} className="flex md:flex-col md:min-w-[60px] gap-2 md:gap-0 items-center justify-center text-[#808080] hover:text-[#191919] relative">
        {children}
    </Link>
}