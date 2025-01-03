import React, { Suspense } from 'react'
import DashboardPage from './page'
import RingLoader from "react-spinners/RingLoader";


const DashboardLayout = () => {
    return (
        <div className=''>
            <h1 className='text-6xl font-bold text-teal-300 mb-3'>
                <Suspense fallback={<RingLoader color="#36d7b7" size={60} />}>
                    <DashboardPage />
                </Suspense>
            </h1>
        </div>
    )
}

export default DashboardLayout
