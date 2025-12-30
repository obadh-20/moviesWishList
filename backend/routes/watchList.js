import { Router } from "express";
import { getUserWatchList, addMovieToWatchlist,deleteMovieFromWatchlist } from "../controllers/watchListController.js";
import { authMiddleware } from "../midlleware/auth_middleware.js"
const router = Router();
router.use(authMiddleware);
router.get("/",  getUserWatchList);
router.post("/add",addMovieToWatchlist);
router.delete("/remove", deleteMovieFromWatchlist);

export default router;