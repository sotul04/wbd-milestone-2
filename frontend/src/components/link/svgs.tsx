import { SIZE_ICON } from "./constant";

export const HomeIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7z"></path>
    </svg>
);

export const ConnectionsIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <path d="M12 6.5a4.5 4.5 0 114.5 4.5A4.49 4.49 0 0112 6.5zm6 6.5h-3a3 3 0 00-3 3v6h9v-6a3 3 0 00-3-3zM6.5 6A3.5 3.5 0 1010 9.5 3.5 3.5 0 006.5 6zm1 9h-2A2.5 2.5 0 003 17.5V22h7v-4.5A2.5 2.5 0 007.5 15z"></path>
    </svg>
);

export const ChatIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
    </svg>
);

export const MenuIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <path d="M3 3h4v4H3zm7 4h4V3h-4zm7-4v4h4V3zM3 14h4v-4H3zm7 0h4v-4h-4zm7 0h4v-4h-4zM3 21h4v-4H3zm7 0h4v-4h-4zm7 0h4v-4h-4z"></path>
    </svg>
);

export const FeedIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <rect x="2" y="2" width="21" height="21" rx="3" ry="3" fill={color} />
        <circle cx="8" cy="8" r="1.5" fill="#ffffff" />
        <rect x="11" y="7" width="6" height="1.5" fill="#ffffff" />
        <rect x="6" y="11" width="12" height="1.5" fill="#ffffff" />
    </svg>
);


export const ProfileIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <circle cx="12" cy="7" r="5" fill={color} />
        <path d="M15 14.2H9a6 6 0 00-6 8h18a6 6 0 00-6-8z" fill={color} />
    </svg>
);

export const UsersIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <circle cx="9" cy="7" r="5" fill={color} />
        <path d="M14 14.2H6a6 6 0 00-6 8h18a6 6 0 00-6-8z" fill={color} />
        <circle cx="17.5" cy="7" r="3" fill={color} />
        <path d="M15 12H14a6 6 0 00-5 6h16a6 6 0 00-5-6z" fill={color} />
    </svg>
);

export const RequestsIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <circle cx="12" cy="7" r="5" fill={color} />
        <path d="M15 14.2H9a6 6 0 00-6 8h18a6 6 0 00-6-8z" fill={color} />
        <line x1="18" y1="10" x2="24" y2="10" stroke={color} strokeWidth="2" />
        <line x1="21" y1="7" x2="21" y2="13" stroke={color} strokeWidth="2" />
    </svg>
);

export const AddChatIcon = ({ className, size = SIZE_ICON, color = 'currentColor' }: { className?: string; size?: number; color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        className={className}
        focusable="false"
    >
        <line x1="18" y1="21" x2="24" y2="21" stroke={color} strokeWidth="2" />
        <line x1="21" y1="18" x2="21" y2="24" stroke={color} strokeWidth="2" />
        <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
    </svg>
);
