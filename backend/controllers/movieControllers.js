
import { getPrisma } from "../lib/prisma.js"

export const getAllMovies = async (req,res) => { 
    try {
       
        const prisma = getPrisma();
        const movies = await prisma.movie.findMany({ take: 10 });
        if (movies.length === 0) { 
            res.status(404).json({ message: "No movies Found" });

        }
        res.status(200).json({ movies });
    } catch (error) { 
        console.log("error in fetching movies", error);
    }
}
export const getAMovie = async (req, res) => { 
    try { 
        const { title } = req.body;
        const prisma = getPrisma();
        const movie = await prisma.movie.findMany({ where: { title: title } });
        if (!movie) { 
            res.status(404).json({ message: "Movie not Found" });
        }
        res.status(200).json({ movie });

    } catch (error) {
        console.log("error in fetching that movie", error);
     }
}