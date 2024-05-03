import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/navigations/Navbar";
import Footer from "../../components/navigations/Footer";
import Slider from "../../components/slider/HeaderSlider";
import { ProgressBar } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryList } from "../../redux/actions/recipeActions";
import { setMealId } from "../../redux/reducers/recipeReducers";

function ListCategories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const categoryName = useSelector((state) => state?.recipe.categoryName);
  const data = useSelector((state) => state.recipe.categoryList);

  useEffect(() => {
    dispatch(getCategoryList())
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(true));
  }, [dispatch, navigate]);

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

          {/* Hero Section */}
          <div className="relative h-[280px] overflow-x-hidden">
            <div className="w-full h-[280px] absolute top-0">
              <Slider />
            </div>
          </div>

          {/* Card Section */}
          <section id="card" className="container mt-6 mb-20">
            <h1 className="text-lg text-left font-bold text-main mb-4">
              Showing {data.length} results for{" "}
              <span className="text-secondary">"{categoryName}"</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                <Audio
                  height="80"
                  width="80"
                  radius="9"
                  color="green"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              ) : Array.isArray(data) && data.length > 0 ? (
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
      )}
    </div>
  );
}

export default ListCategories;
