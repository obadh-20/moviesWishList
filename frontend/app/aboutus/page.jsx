import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
const page = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="container grid grid-cols-4  grid-rows-2 gap-4 border p-10 rounded-3xl mt-10">
        <div className="col-span-2">
          <div className="p-5 bg-[#676a4b] *:mt-3 rounded-2xl">
            <Button
              className={"hover:bg-white hover:text-[#101828] rounded-lg"}
            >
              About Us
            </Button>
            <p className="text-3xl font-bold text-accent w-90">
              FIND YOUR BEST MOVIE WATCHLIST WITH UNLIMITED OPTIONS
            </p>
            <p className="text-accent text-[13px]">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl,
              eget ultricies nunc nisl eget nunc.
            </p>
          </div>
        </div>

        <div className="bg-[#efefef] p-5 rounded-2xl flex flex-col justify-between">
          <div className="text-[#676a4b] ">
            <p className="text-5xl font-bold">300+</p>
            <p className="text-[13px] mt-2">Users Signed Up</p>
          </div>
          <Button>
            <Link href="/register">Sign Up for A Watchlist</Link>
          </Button>
        </div>
        <div className="bg-[#efefef] p-5 rounded-2xl flex flex-col justify-between">
          <div className="text-[#676a4b] ">
            <p className="text-5xl font-bold">20+</p>
            <p className="text-[13px] mt-2">Different Genres</p>
          </div>
          <Button>
            <Link href="/watchlist">Find What Suits You</Link>
          </Button>
        </div>

        <div className="col-span-3 relative ">
          <Image
            src="/125-1258020_taken-3.jpg"
            alt="About Us Image"
            fill={true}
            className="rounded-3xl"
          />
        </div>
        <div className="bg-[#efefef] p-5 rounded-2xl flex flex-col justify-between">
          <div className="text-[#676a4b] ">
            <p className="text-5xl font-bold">1420+</p>
            <p className="text-[13px] mt-2">Different Movies</p>
          </div>
          <Button>
            <Link href="/movies">Go Watch Some !!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
