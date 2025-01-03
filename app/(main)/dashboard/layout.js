import React, { Suspense } from 'react';
import DashboardPage from './page';
import RingLoader from "react-spinners/RingLoader";

const DashboardLayout = () => {
    return (
        <div>
            <h1 className="text-6xl font-bold text-teal-300 mb-3">
                <Suspense
                    fallback={
                        <div className="fixed inset-0 flex items-center justify-center bg-white">
                            <RingLoader color="#36d7b7" size={60} />
                        </div>
                    }
                >
                    <DashboardPage />
                </Suspense>
            </h1>
        </div>
    );
};

export default DashboardLayout;
