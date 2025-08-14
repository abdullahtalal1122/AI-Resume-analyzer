'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
    IconArrowLeft,
    IconBrandTabler,
    IconFileText,
    IconSettings,
    IconUserBolt,
    IconChartBar,
    IconHistory,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Resume Analyser",
            href: "/resume-analyser",
            icon: (
                <IconFileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Resume History",
            href: "/resume-history",
            icon: (
                <IconHistory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Analytics",
            href: "/analytics",
            icon: (
                <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: "#",
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];

    return (
        <ProtectedRoute>
            <div className={cn(
                "mx-auto flex w-full h-screen flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800"
            )}>
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                    <SidebarBody className="justify-between gap-10">
                        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                            {sidebarOpen ? <Logo /> : <LogoIcon />}
                            <div className="mt-8 flex flex-col gap-2">
                                {links.map((link, idx) => (
                                    <SidebarLink key={idx} link={link} />
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
                            <SidebarLink
                                link={{
                                    label: user?.name || "User",
                                    href: "#",
                                    icon: (
                                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    ),
                                }}
                            />
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-start gap-2 group/sidebar py-2 w-full text-left"
                            >
                                <IconArrowLeft className="h-5 w-5 shrink-0 text-red-600" />
                                <motion.span
                                    animate={{
                                        display: sidebarOpen ? "inline-block" : "none",
                                        opacity: sidebarOpen ? 1 : 0,
                                    }}
                                    className="text-red-600 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                                >
                                    Logout
                                </motion.span>
                            </button>
                        </div>
                    </SidebarBody>
                </Sidebar>

                {/* Main Content Area */}
                <div className="flex flex-1">
                    <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                        {children}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

// Logo components
const Logo = () => {
    return (
        <Link
            href="/dashboard"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-blue-600 dark:bg-blue-400" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                Resume Analyzer
            </motion.span>
        </Link>
    );
};

const LogoIcon = () => {
    return (
        <Link
            href="/dashboard"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-blue-600 dark:bg-blue-400" />
        </Link>
    );
};
