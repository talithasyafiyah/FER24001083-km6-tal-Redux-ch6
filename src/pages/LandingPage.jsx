import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMeal, getCategory } from "../redux/actions/recipeActions";
import Navbar from "../components/navigations/Navbar";
import Footer from "../components/navigations/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import { setCategoryName, setMealId } from "../redux/reducers/recipeReducers";
import { noAccessToken } from "../redux/actions/authActions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const data = useSelector((state) => state?.recipe);
  const isLoggedIn = useSelector((state) => state?.auth.isLoggedIn);

  useEffect(() => {
    dispatch(noAccessToken(navigate));
    dispatch(getCategory());
    dispatch(getMeal())
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(true));
  }, [dispatch, navigate]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  return (
    <div className="bg-none lg:bg-[url('/bg.jpg')] lg:bg-contain lg:bg-no-repeat overflow-x-hidden">
      <Navbar transparent={true} />
      {/* Hero Section */}
      <div>
        <div className="w-full h-screen text-main">
          <div className="absolute top-0 w-full h-screen flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
              <div className="container items-center">
                <div className="text-left w-full md:w-full lg:w-1/2">
                  <p className=" text-5xl font-bold mb-4">
                    What would you like to cook today?
                  </p>
                  <p className=" text-base font-normal leading-6 mt-6">
                    Discover the recipe you desire based on the provided
                    categories or ingredients you have, and create your own
                    version of the recipe to share it with others! You can do
                    all of that on NomNom.
                  </p>

                  <a href={isLoggedIn ? "#recipe" : "/login"}>
                    <button className="bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-r hover:from-secondary hover:to-primary rounded-full px-12 py-2 text-base text-white font-semibold mt-4">
                      Discover Recipes
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Section */}
      {isLoggedIn ? (
        <section id="recipe" className="mt-20">
          <h1 className="container text-3xl text-left font-bold text-main mb-6">
            Categories
          </h1>
          <Slider {...settings}>
            {isLoading
              ? Array.from({ length: data.category.length }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[280px] cursor-pointer relative group"
                  >
                    <Skeleton height={208} width={270} />
                  </div>
                ))
              : data.category.map((e) => (
                  <div
                    key={e?.idCategory}
                    className="cursor-pointer relative group"
                    onClick={() => {
                      navigate("/list-categories");
                      dispatch(setCategoryName(e?.strCategory));
                    }}
                  >
                    <img
                      className="w-[280px] object-cover rounded-md"
                      src={e?.strCategoryThumb}
                      alt={e?.strCategory}
                    />
                    <div className="absolute bottom-2 left-2 text-white font-semibold bg-black bg-opacity-70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {e?.strCategory}
                    </div>
                  </div>
                ))}
          </Slider>
        </section>
      ) : (
        ""
      )}

      {/* Card Section */}
      <section id="card" className="container my-20">
        <h1 className="text-3xl text-left font-bold text-main mb-6">
          Recipe recommendations
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 28 }).map((_, index) => (
              <div
                key={index}
                className="w-full cursor-pointer h-full bg-transparent overflow-hidden text-white"
              >
                <Skeleton height={208} width={270} />
                <div className="py-3">
                  <div className="flex flex-col justify-between">
                    <div className="min-h-8">
                      <p className="text-sm font-semibold leading-tight line-clamp-2">
                        <Skeleton />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : Array.isArray(data.meal) && data.meal.length > 0 ? (
            data.meal.map((e, i) => (
              <div
                key={i}
                className="w-full bg-white shadow rounded-lg cursor-pointer h-full bg-transparent overflow-hidden text-main transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(`/recipe-details/${e?.idMeal}`);
                    dispatch(setMealId(e?.idMeal));
                  } else {
                    toast.error(
                      "Oops.. you need to log in first to view recipe details."
                    );
                    navigate("/login");
                  }
                }}
              >
                <img
                  className="w-full object-cover h-48"
                  src={e?.strMealThumb}
                />
                <div className="p-3">
                  <div className="flex flex-col justify-between">
                    <div className="min-h-10">
                      <p className="text-base font-semibold leading-tight">
                        {e?.strMeal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes available</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
