"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useCallback, useRef } from "react";
import { FocusCards } from "@/components/ui/focus-cards";
import { Spinner } from "@/components/ui/spinner";

export default function App() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs to track if component is mounted
  const isMounted = useRef(true);
  const initialFetchDone = useRef(false);

  const fetchData = useCallback(
    async (pageNum, isInitial = false) => {
      // Prevent multiple simultaneous requests
      if (isLoading && !isInitial) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/movies?page=${pageNum}&limit=10`
        );
        const data = await res.json();

        if (res.ok && isMounted.current) {
          setMovies((prevItems) => {
            // For initial load, replace instead of append
            if (isInitial) {
              return data.data;
            }

            // For subsequent loads, append with deduplication
            const existingIds = new Set(prevItems.map((movie) => movie.id));
            const newMovies = data.data.filter(
              (movie) => !existingIds.has(movie.id)
            );
            return [...prevItems, ...newMovies];
          });

          if (isInitial) {
            setTotalMovies(data.total);
          }
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.log(error);
        if (isMounted.current) {
          setHasMore(false);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [isLoading]
  );

  useEffect(() => {
    isMounted.current = true;

    // Only fetch initial data once
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchData(1, true);
    }

    return () => {
      isMounted.current = false;
      initialFetchDone.current = false;
    };
  }, [fetchData]);

  const handleLoadMoreData = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={movies.length}
      next={handleLoadMoreData}
      hasMore={hasMore}
      loader={<div className="flex items-center justify-center h-screen"><Spinner /></div>}
      endMessage={<p>No more data to load.</p>}
    >
      <FocusCards cards={movies} />
    </InfiniteScroll>
  );
}
