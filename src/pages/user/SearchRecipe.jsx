import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navigations/Navbar";
import Footer from "../../components/navigations/Footer";
import Slider from "../../components/slider/HeaderSlider";
import { ProgressBar } from "react-loader-spinner";
import {
  setMealId,
  setSearchKeyword,
} from "../../redux/reducers/recipeReducers";
import { getMeal, getSearchResults } from "../../redux/actions/recipeActions";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../functions/debounce";

function SearchRecipe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const searchTerm = useSelector((state) => state?.recipe.searchKeyword);
  const preview = useSelector((state) => state?.recipe.meal);
  const searchResults = useSelector((state) => state?.recipe.searchResults);

  useEffect(() => {
    dispatch(getMeal())
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(true));
  }, [navigate, dispatch]);

  const searchRecipe = (term) => {
    dispatch(getSearchResults());
  };

  const delayedSearch = useDebounce(searchRecipe, 300);

  const handleSearchInputChange = (e) => {
    dispatch(setSearchKeyword(e.target.value));
    delayedSearch(e.target.value);
  };

  const data =
    searchResults && searchResults.length > 0 ? searchResults : preview;

  return (
    <div>
      {isLoading ? (
        <ProgressBar
          visible={true}
          height="80"
          width="80"
          barColor="#ffb03e"
          borderColor="#f67356"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          wrapperClass=""
        />
      ) : (
        <div>
          <Navbar transparent={true} />
          <div className="relative h-screen overflow-x-hidden">
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-1/2">
              <h1 className="text-4xl font-semibold text-white text-center mb-6">
                Search Recipes
              </h1>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search recipe.."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="w-full items-center rounded-full text-base shadow-md border border-gray-200 px-8 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="items-center absolute right-6 top-3.5 h-5 w-5 text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full h-[280px] absolute top-0">
              <Slider />
            </div>
          </div>

          <section id="card" className="container -mt-[300px] mb-16">
            <div>
              {Array.isArray(data) && data.length > 0 && (
                <h2 className="text-base text-left font-semibold text-main mb-4">
                  Showing {data.length} results{" "}
                  {searchTerm && (
                    <>
                      for <span className="text-secondary">"{searchTerm}"</span>
                    </>
                  )}
                </h2>
              )}
              {Array.isArray(data) && data.length === 0 && searchTerm && (
                <p className="text-base text-left font-semibold text-red-600 mb-4">
                  No recipes found for "{searchTerm}"
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((e, i) => (
                    <div
                      key={i}
                      className="w-full bg-white shadow rounded-lg cursor-pointer h-full bg-transparent overflow-hidden text-main transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
                      onClick={() => {
                        navigate(`/recipe-details/${e?.idMeal}`);
                        dispatch(setMealId(e?.idMeal));
                      }}
                    >
                      <img
                        className="w-full object-cover h-48"
                        src={e?.strMealThumb}
                        alt={e?.strMeal}
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
                  <p></p>
                )}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default SearchRecipe;
