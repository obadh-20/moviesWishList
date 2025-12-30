import { useEffect, useState } from "react";

export function useMovies({ search, page }) {
    const [movies, setMovies] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 🔴 Don't fetch if search is empty
        if (!search.trim()) {
            setMovies([]);
            setTotal(0);
            return;
        }

        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setLoading(true);

                const res = await fetch(
                    `http://localhost:4000/movies?q=${search}&page=${page}&limit=8`,
                    { signal: controller.signal }
                );

                const data = await res.json();

                setMovies(data.data);
                setTotal(data.total);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();

        return () => controller.abort();
    }, [search, page]);

    return { movies, total, loading };
}
