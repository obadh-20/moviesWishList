import { Router } from "express";
import { getMovies, getAMovie } from "../controllers/movieControllers.js";
const router = Router();


router.get("/", getMovies);
router.post("/getAMovie", getAMovie);

export default router;