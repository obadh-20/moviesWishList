import express from "express";
import { Router } from "express";
import { getAllMovies, getAMovie } from "../controllers/movieControllers.js";
const router = Router();
console.log("movie routes hetted");

router.get("/", getAllMovies);
router.post("/searchMovie", getAMovie);

export default router;