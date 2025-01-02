"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="pt-44 pb-20 px-4 bg-black">
            <div className="container mx-auto text-center">
                <h1 className="text-3xl md:text-8xl lg:text-[105px] pb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400">
                    Optimize Your Finances <br /> with Smart Solutions
                </h1>

                <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-green-300 via-yellow-300 via-pink-300 to-purple-300 mb-8 max-w-2xl mx-auto">
                    An AI-driven platform for managing your finances, offering tracking, analysis, and optimization of your spending in real-time.
                </p>



                <div className="flex justify-center space-x-4 pb-5">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">
                            Get Started
                        </Button>
                    </Link>

                    <Button size="lg" variant="outline" className="px-8">
                        Learn more
                    </Button>

                </div>
                <div className="hero-image-wrapper mt-10 md:mt-0 ">
                    <div ref={imageRef} className="hero-image">
                        <Image
                            src="https://autogpt.net/wp-content/uploads/2024/06/Screenshot-2024-06-19-at-18.59.07-768x415.jpg"
                            width={1280}
                            height={720}
                            alt="Dashboard Preview"
                            className="rounded-lg shadow-2xl border mx-auto"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;