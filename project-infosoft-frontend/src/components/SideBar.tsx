"use client";
import { Link, useLocation } from "@tanstack/react-router";
import { Video, Users, Film, BarChart3 } from "lucide-react";
import { cn } from "../lib/utils";


const mainRoutes = [
    {
        label: "Videos",
        icon: Video,
        href: "/videos",
        color: "text-blue-600",
    },
    {
        label: "Customers",
        icon: Users,
        href: "/customers",
        color: "text-blue-700",
    },
    {
        label: "Rentals",
        icon: Film,
        href: "/rentals",
        color: "text-blue-800",
    },
    {
        label: "Reports",
        icon: BarChart3,
        href: "/reports",
        color: "text-blue-900",
    },
];

export default function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="hidden md:flex h-full w-72 flex-col border-r bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4">
            <div className="flex items-center gap-2 px-2 mb-6">
                <Video className="h-8 w-8 text-blue-600" />
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Bogsy Video Store
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-300">
                        Management System
                    </span>
                </div>
            </div>

            <div className="space-y-1">
                {mainRoutes.map((route) => (
                    <Link
                        key={route.href}
                        to={route.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-blue-200 dark:hover:bg-blue-800",
                            pathname === route.href
                                ? "bg-blue-300 dark:bg-blue-700 text-blue-900 dark:text-blue-100 shadow-sm"
                                : "text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100"
                        )}
                    >
                        <route.icon className={cn("h-5 w-5", route.color)} />
                        {route.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}