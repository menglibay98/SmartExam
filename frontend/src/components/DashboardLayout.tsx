import type { ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "./DashboardLayout.css";

interface DashboardLayoutProps {
    children: ReactNode;
}

function DashboardLayout({
    children
}: DashboardLayoutProps) {

    return (
        <div className="dashboard-layout">

            <Navbar />

            <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;