import { getPrisma } from "../lib/prisma.js";

export const getUserWatchList = async (req, res) => { 
    try {
        
        const prisma = getPrisma();

        console.log("fetching watchlist for user:", req.user.id);
        const watchlist = await prisma.watchlistItem.findMany({
            where: { userId: req.user.id }
        });
        if (watchlist.length === 0) {
          return  res.status(404).json({ message: "No movies in the watchlist" });
        } 
         return   res.status(200).json({ watchlist });
        
    } catch (error) { 
        console.log("error in fetching user watchlist", error);
    }
}
export const addMovieToWatchlist = async (req, res) => { 
    try {
        const { movieId, status, rating } = req.body;
      
        if (!movieId) { 
            return res.status(400).json({ message: "missing some values" });
        }
        const prisma = getPrisma();
        console.log("adding movie to watchlist for user:", req.user.id);
        const existingMovie = await prisma.watchlistItem.findUnique({
            where: { userId_movieId: { userId: req.user.id, movieId: movieId } }
        });
        if (existingMovie) { 
            return res.status(409).json({ message: "movie already in watchlist" });
        }
        const movie = await prisma.watchlistItem.create({
            data: {
                userId: req.user.id,
                movieId,
                status: status ? status : "PLANNED",
                rating: rating ? rating : 0,
            }
        });
        return res.status(201).json({ message: "movie added to watchlist", movie });
     } catch (error) { 
        console.log("error in adding movie to watchlist", error);
    }
}
export const deleteMovieFromWatchlist = async (req, res) => { 
    try {
        const { movieId } = req.body;
        if (!movieId ) {
            return res.status(400).json({ message: "missing some values" });
        }
        const prisma = getPrisma();
        console.log("deleting movie from watchlist for user:", req.user.id);
        const movie = await prisma.watchlistItem.delete({
            where: { userId_movieId: { userId: req.user.id, movieId: movieId } }
        });
        if (movie) {
            return res.status(201).json({ message: "movie deleted from watchlist", movie });
        }
        return res.status(404).json({ message: "movie not found" });
    } catch (error) {
        console.log("error in adding movie to watchlist", error);
    }
}