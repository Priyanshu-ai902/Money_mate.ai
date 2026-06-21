"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight,
  BarChart3, 
  CreditCard, 
  PlusCircle, 
  TrendingUp, 
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  RefreshCw,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const slides = [
    {
      image: "/dashboard.png",
      title: "Finance Dashboard",
      description: "View accounts, transactions, budgets, and spending insights from one place."
    },
    {
      image: "/account.png",
      title: "Account Management",
      description: "Create and manage multiple financial accounts with detailed summaries."
    },
    {
      image: "/add.png",
      title: "Transaction Tracking",
      description: "Quickly add expenses and income while keeping records organized."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 selection:text-white">
      {/* SECTION 1: HERO */}
      <section className="min-h-[85vh] flex items-center pt-28 pb-20 md:pt-36 border-b border-white/5 bg-black">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center w-full">
            {/* Left side (50% on desktop) */}
            <div className="space-y-8 text-left py-4 max-w-2xl xl:max-w-3xl">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                Manage Your Personal Finances in One Place
              </h1>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
                Track expenses, manage accounts, monitor budgets, and understand your spending with a clean and simple dashboard.
              </p>
              <div className="flex flex-row gap-4 pt-2">
                <Link href="/dashboard">
                  <Button className="h-12 rounded-xl px-8 bg-cyan-600 hover:bg-cyan-500 text-white text-base font-semibold transition-colors shadow-lg shadow-cyan-600/10">
                    Get Started
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="h-12 rounded-xl px-8 border border-white/10 hover:bg-white/5 text-white text-base font-semibold bg-transparent transition-colors">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side (50% on desktop) */}
            <div className="flex justify-center lg:justify-end w-full relative">
              {/* Custom floating and perspective stylesheet */}
              <style>{`
                @keyframes hero-float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                }
                .animate-hero-float {
                  animation: hero-float 7s ease-in-out infinite;
                }
                .hero-screenshot-card {
                  transform: perspective(1000px) rotateY(-4deg) rotateX(2deg);
                  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s;
                }
                .hero-screenshot-card:hover {
                  transform: perspective(1000px) rotateY(-1deg) rotateX(1deg) scale(1.02);
                }
                @media (max-width: 1024px) {
                  .hero-screenshot-card {
                    transform: none !important;
                  }
                  .hero-screenshot-card:hover {
                    transform: scale(1.01) !important;
                  }
                  @keyframes hero-float-tablet {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-4px); }
                  }
                  .animate-hero-float {
                    animation: hero-float-tablet 7s ease-in-out infinite;
                  }
                }
              `}</style>

              {/* Grid and gradient glow decoration background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 -z-20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-900/10 rounded-full blur-[120px] -z-30 pointer-events-none" />

              {/* Floating Wrapper */}
              <div className="animate-hero-float w-full max-w-[1000px] relative group">
                {/* Glow behind image only */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 rounded-3xl blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                {/* Inner Card Container (3D + Hover) */}
                <div className="hero-screenshot-card relative rounded-2xl border border-white/10 bg-zinc-950 p-1 shadow-[0_20px_50px_rgba(6,182,212,0.1)] hover:shadow-[0_25px_60px_rgba(6,182,212,0.2)] overflow-hidden">
                  <div className="absolute top-2 left-4 flex gap-1.5 z-20">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <div className="border border-white/5 rounded-xl overflow-hidden mt-5 bg-zinc-900 w-full relative">
                    <Image
                      src="/dashboard.png"
                      alt="Money-mate Dashboard"
                      width={1280}
                      height={720}
                      className="w-full h-auto object-contain rounded-xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRODUCT OVERVIEW (CAROUSEL) */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white">Product Overview</h2>
            <p className="text-slate-400 mt-2 text-base">
              Explore the core interfaces designed to simplify your financial logging.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* The main slider container */}
            <div className="relative rounded-2xl border border-white/10 bg-zinc-950 p-3 shadow-2xl overflow-hidden group">
              <div className="absolute top-3 left-4 flex gap-1.5 z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>

              {/* Slide Images */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-900 mt-6">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-white/10 bg-zinc-950/80 text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-white/10 bg-zinc-950/80 text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Slide Information */}
            <div className="mt-8 text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-white transition-all duration-300">
                {slides[currentSlide].title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed transition-all duration-300">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-cyan-500 w-6" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white">Features</h2>
            <p className="text-slate-400 mt-2 text-base">
              A comprehensive toolkit tailored to map your cash flows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white space-y-3">
              <CreditCard className="h-5 w-5 text-cyan-400" />
              <h4 className="text-base font-semibold text-slate-100">Account Management</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create checking, savings, or credit accounts to represent your banking structures under a single profile.
              </p>
            </Card>

            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white space-y-3">
              <ArrowDownRight className="h-5 w-5 text-cyan-400" />
              <h4 className="text-base font-semibold text-slate-100">Expense Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quickly audit monthly expenditures and catalog individual items to specific payment categories.
              </p>
            </Card>

            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white space-y-3">
              <ArrowUpRight className="h-5 w-5 text-cyan-400" />
              <h4 className="text-base font-semibold text-slate-100">Income Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log earnings, recurring salaries, and investments to ensure your overall balance records are accurate.
              </p>
            </Card>

            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white space-y-3">
              <PieChart className="h-5 w-5 text-cyan-400" />
              <h4 className="text-base font-semibold text-slate-100">Budget Monitoring</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create monthly budget bounds, calculate real-time pacing limits, and track warnings before you overspend.
              </p>
            </Card>

            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white space-y-3">
              <RefreshCw className="h-5 w-5 text-cyan-400" />
              <h4 className="text-base font-semibold text-slate-100">Recurring Transactions</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Establish repeat patterns for recurring receipts, utility bills, subscription software, or credit accounts.
              </p>
            </Card>

            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white space-y-3">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h4 className="text-base font-semibold text-slate-100">Financial Insights</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Observe spending aggregations and view structured data breakdowns dynamically inside your tables.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white">How it works</h2>
            <p className="text-slate-400 mt-2 text-base">
              Establish your personal finance workbook in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white flex flex-col space-y-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-slate-100">1. Create an Account</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sign up securely using clerk authentication and input checking or savings cards.
              </p>
            </Card>

            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white flex flex-col space-y-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <PlusCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-slate-100">2. Add Transactions</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log income or expenses, select checking pools, assign categories, and set dates.
              </p>
            </Card>

            <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white flex flex-col space-y-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-slate-100">3. Monitor Your Finances</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Analyze active balances, net balance trends, and recurring costs across statements.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-12 text-center relative overflow-hidden shadow-2xl hover:border-cyan-500/20 transition-all duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              Start tracking expenses and managing your finances today.
            </p>
            <div className="flex flex-row justify-center gap-3 pt-2">
              <Link href="/dashboard">
                <Button className="h-11 rounded-xl px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors">
                  Get Started
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="h-11 rounded-xl px-6 border border-white/10 hover:bg-white/5 text-white font-medium bg-transparent transition-colors">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="border-t border-white/5 bg-zinc-950/40 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3 max-w-sm">
              <Link href="/">
                <h1 className="text-2xl font-semibold">
                  <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
                    Money
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">-mate</span>
                </h1>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed">
                A simple, clean personal finance workspace designed to track expenses, manage accounts, and monitor budgets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product</span>
                <Link href="/dashboard" className="text-slate-400 hover:text-cyan-400 transition-colors text-xs">
                  Dashboard
                </Link>
                <Link href="/transaction/create" className="text-slate-400 hover:text-cyan-400 transition-colors text-xs">
                  Add Transaction
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Money-mate. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}