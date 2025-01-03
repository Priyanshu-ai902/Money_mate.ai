import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PenBox } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkuser";

const Header = async () => {
  await checkUser()
  return (
    <div className="fixed top-0 w-full bg-black backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            className="w-8 h-9"
            src="https://cdn-icons-png.flaticon.com/512/1315/1315310.png"
            alt="logo"
            height={40}
            width={100}
          />
          <Link href={"/"}>
            <h1 className="text-3xl font-semibold">
              <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
                Money
              </span>
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">-mate</span>
            </h1>
          </Link>

        </div>



        <div className="flex space-x-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-teal-600  hover:text-teal-200 flex items-center gap-2"
            >
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline font-semibold">Dashboard</span>
              </Button>
            </Link>
            <a href="/transaction/create">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </a>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
