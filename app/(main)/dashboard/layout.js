import React, { Suspense } from 'react';
import RingLoader from "react-spinners/RingLoader";

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-slate-100">
            <div className="max-w-[1400px] mx-auto px-6 pt-8 space-y-6">
                <div className="flex flex-col space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-teal-400">
                        Dashboard
                    </h1>
                    <p className="text-sm text-slate-400">
                        Track your finances and spending insights.
                    </p>
                </div>
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center py-20">
                            <RingLoader color="#2dd4bf" size={60} />
                        </div>
                    }
                >
                    {children}
                </Suspense>
            </div>
        </div>
    );
};

export default DashboardLayout;

