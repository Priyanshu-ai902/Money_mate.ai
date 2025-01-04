import React, { Suspense } from 'react';
import DashboardPage from './page';
import RingLoader from "react-spinners/RingLoader";

const DashboardLayout = () => {
    return (
        <div className="">
            <div className="flex items-center justify-between p-3 bg-black">
                <h1 className="text-6xl font-bold tracking-tight text-teal-400 p-10">
                    Dashboard
                </h1>
            </div>
            <Suspense
                fallback={
                    <div className="fixed inset-0 flex items-center justify-center bg-white">
                        <RingLoader color="#36d7b7" size={60} />
                    </div>
                }
            >
                <DashboardPage/>
            </Suspense>

        </div>
    );
};

export default DashboardLayout;
