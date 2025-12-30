"use client";

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from "@/components/motion-primitives/morphing-dialog";

import { MinusCircleIcon, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch("http://localhost:4000/watchlist", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch watchlist");

        const data = await res.json();
        setWatchlist(data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, []);
  const handleRemove = async (e, movieId) => {
    e.stopPropagation(); // Prevent triggering the dialog open
    console.log("Removing movie from watchlist:", e);
    try { 
      const res = await fetch("http://localhost:4000/watchlist/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          movieId: movieId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update the watchlist state to remove the deleted item
        setWatchlist((prevList) =>
          prevList.filter((item) => item.movieId !== movieId)
        );
      }
      console.log("Remove from watchlist response:", data);
    } catch (error) {

      console.error("Error removing movie from watchlist:", error);
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-10 sm:grid-cols-2 md:grid-cols-3">
      {watchlist.map((item) => (
        <MorphingDialog
          key={item.id}
          transition={{
            type: "spring",
            bounce: 0.05,
            duration: 0.25,
          }}
        >
          <MorphingDialogTrigger asChild>
            <motion.div
              layoutId={`dialog-${item.movie.id}`}
              className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
            >
              <MorphingDialogImage
                src={item.movie.posterUrl}
                alt={item.movie.title}
                className="h-48 w-full object-cover"
              />

              <div className="flex items-end justify-between px-3 py-2">
                <div>
                  <MorphingDialogTitle className="text-zinc-950 dark:text-zinc-50">
                    {item.movie.title}
                  </MorphingDialogTitle>

                  <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                    {item.movie.releaseYear}
                  </MorphingDialogSubtitle>
                </div>

                <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 dark:border-zinc-50/10">
                  <MinusCircleIcon
                    size={12}
                    onClick={(e) => handleRemove(e, item.movie.id)}
                  />
                </div>
              </div>
            </motion.div>
          </MorphingDialogTrigger>

          <MorphingDialogContainer>
            <MorphingDialogContent className="pointer-events-auto w-full max-w-[500px] overflow-hidden rounded-2xl border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900">
              <div className="flex justify-center p-4">
                <MorphingDialogImage
                  src={item.movie.posterUrl}
                  alt={item.movie.title}
                  className="h-64 w-auto rounded-xl object-cover"
                />
              </div>

              <div className="p-6">
                <MorphingDialogTitle className="text-2xl">
                  {item.movie.title}
                </MorphingDialogTitle>

                <MorphingDialogSubtitle>
                  {item.movie.releaseYear}
                </MorphingDialogSubtitle>

                <MorphingDialogDescription>
                  <p className="mt-2 text-zinc-500">
                    {item.movie.overview || "No description available."}
                  </p>
                </MorphingDialogDescription>
              </div>

              <MorphingDialogClose className="text-zinc-50" />
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </div>
  );
}
