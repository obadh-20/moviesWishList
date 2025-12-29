"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { Button } from "@/components/ui/button";
const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}
export default function Page() {
   const [value, setValue] = useState(2);
   const [hover, setHover] = useState(-1);
  const [movie, setMovie] = useState(null);
  const id = useParams().id;
  const [added, setAdded] = useState(false);
  const AddMovieTowatchList = async () => { 
    try { 
      const res = await fetch("http://localhost:4000/watchlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          movieId: id,
          rating: value,
          status: "PLANNED",
        }),
      });
      const data = await res.json();
      if (res.ok)
      setAdded(true);
      console.log("Add to watchlist response:", data);
    } catch (error) { 
      console.error("Error adding movie to watchlist:", error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/movies/getAMovie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
           
          }),
        });
        const data = await response.json();
        setMovie(data.movie);
        console.log("Fetched movie data:", data.movie);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);
  return (
    <div >
      {movie ? (
        <div className="container flex flex-wrap  p-5 justify-center gap-10 mx-auto mt-10 bg-white rounded-3xl shadow-lg">
          <img
            className="rounded-4xl md:w-[350px] w-auto h-auto"
            src={movie.posterUrl}
            alt={movie.title}
          />

          <div className="flex flex-wrap">
            <div className="mt-3 flex flex-col gap-7 ">
              <h1 className="text-3xl font-bold">{movie.title} Movie</h1>
              <p>
                <span className="filmFileds">Duration</span> {movie.runtime}{" "}
                mins
              </p>
              <p>{movie.overview}</p>

              <p>
                <span className="filmFileds">Type</span> Film
              </p>
              <p>
                <span className="filmFileds">Year</span> {movie.releaseYear}
              </p>
              <p>
                <span className="filmFileds">Genres</span>{" "}
                {movie.genres.join(", ")}
              </p>
              <Box sx={{ width: 100, display: "flex", alignItems: "center" }}>
                <Rating
                  name="hover-feedback"
                  value={value}
                  precision={0.5}
                  getLabelText={getLabelText}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                {value !== null && (
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : value]}
                  </Box>
                )}
              </Box>
            </div>

            <Button variant="destructive" className={"mt-4 cursor-pointer"} onClick={AddMovieTowatchList}>
              Add To Your Watchlist { added ? "✔️": "+"}
            </Button>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
