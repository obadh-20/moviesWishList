
import { getPrisma } from "../lib/prisma.js"

export const getMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Get total count for pagination metadata
        const total = await getPrisma().movie.count();

        // Get paginated movies
        const movies = await getPrisma().movie.findMany({
            skip: (page - 1) * limit,
            take: limit,
            // Optional: Add orderBy to ensure consistent ordering
            orderBy: {
                createdAt: 'desc' // or any other field
            }
        });

        res.json({
            data: movies, // No need to slice again!
            total: total,
            page: page,
            limit: limit,
            hasMore: (page * limit) < total
        });
    } catch (error) {
        console.log("error in fetching movies", error);
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