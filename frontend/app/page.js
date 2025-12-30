'use client';

import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useMovies } from "../hooks/useMovies";
import { MorphingDialog, MorphingDialogTrigger, MorphingDialogContent, MorphingDialogTitle, MorphingDialogImage, MorphingDialogSubtitle, MorphingDialogClose, MorphingDialogDescription, MorphingDialogContainer } from "@/components/motion-primitives/morphing-dialog";
import { motion } from "framer-motion";
import { MinusCircleIcon } from "lucide-react";
export default function Movies() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { movies, total, loading } = useMovies({
    search: debouncedSearch,
    page,
  });

  const totalPages = Math.ceil(total / 8);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white" }}>

      {/* HERO */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
          🎬 Movie Explorer
        </h1>
        <p style={{ opacity: 0.7 }}>
          Search and discover your favorite movies
        </p>

        <input
          type="text"
          placeholder="Search for a movie..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            marginTop: "25px",
            padding: "12px 16px",
            width: "300px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />
      </section>

      {/* CONTENT */}
      <section style={{ padding: "20px" }}>
        {/* Empty State */}
        {!debouncedSearch && (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            Start typing to search for movies 🎥
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center" }}>
            <p>Loading movies...</p>
          </div>
        )}

        {/* Movies Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {movies.map((item) => (
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
                  layoutId={`dialog-${item.id}`}
                  className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
                >
                  <MorphingDialogImage
                    src={item.posterUrl}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="flex items-end justify-between px-3 py-2">
                    <div>
                      <MorphingDialogTitle className="text-zinc-950 dark:text-zinc-50">
                        {item.title}
                      </MorphingDialogTitle>

                      <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                        {item.releaseYear}
                      </MorphingDialogSubtitle>
                    </div>

                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 dark:border-zinc-50/10">
                      <MinusCircleIcon
                        size={12}
                        onClick={(e) => handleRemove(e, item.id)}
                      />
                    </div>
                  </div>
                </motion.div>
              </MorphingDialogTrigger>

              <MorphingDialogContainer>
                <MorphingDialogContent className="pointer-events-auto w-full max-w-[500px] overflow-hidden rounded-2xl border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900">
                  <div className="flex justify-center p-4">
                    <MorphingDialogImage
                      src={item.posterUrl}
                      alt={item.title}
                      className="h-64 w-auto rounded-xl object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <MorphingDialogTitle className="text-2xl">
                      {item.title}
                    </MorphingDialogTitle>

                    <MorphingDialogSubtitle>
                      {item.releaseYear}
                    </MorphingDialogSubtitle>

                    <MorphingDialogDescription>
                      <p className="mt-2 text-zinc-500">
                        {item.overview || "No description available."}
                      </p>
                    </MorphingDialogDescription>
                  </div>

                  <MorphingDialogClose className="text-zinc-50" />
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          ))}
        </div>

        {/* No Results */}
        {!loading && debouncedSearch && movies.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "30px" }}>
            No movies found 😢
          </p>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              marginTop: "40px",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>

            <span>{page} / {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          opacity: 0.4,
        }}
      >
        Built with ❤️ by You
      </footer>
    </div>
  );
}
