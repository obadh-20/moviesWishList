
import { getPrisma } from "../lib/prisma.js"

export const getMovies = async (req, res) => {
    try {
        const prisma = getPrisma();

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.q || "";

        const where = search
            ? {
                title: {
                    contains: search,
                    mode: "insensitive", // case insensitive
                },
            }
            : {};

        const total = await prisma.movie.count({ where });

        const movies = await prisma.movie.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            data: movies,
            total,
            page,
            limit,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error("error in fetching movies", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getPopularMovies = async (req, res) => { 
    try {
        const prisma = getPrisma();
        const popularMovies = await prisma.movie.findMany({
            orderBy: {
                popularity: 'desc'
            },
            take: 10
        });
        res.json({ popularMovies });
    } catch (error) {
        console.log("error in fetching popular movies", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getAMovie = async (req, res) => { 
    try { 
        const { id } = req.body;
        console.log("ID received:", id); // Debugging line
        const prisma = getPrisma();
        const movie = await prisma.movie.findUnique({ where: { id: id } });
        if (!movie) { 
            return res.status(404).json({ message: "Movie not Found" });
        }
        return res.status(200).json({ movie });

    } catch (error) {
        console.log("error in fetching that movie", error);
     }
}