import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { getMealSlider } from "../../redux/actions/recipeActions";

function Login() {
  const dispatch = useDispatch();
  const slider = useSelector((state) => state?.recipe.mealSlider);

  useEffect(() => {
    dispatch(getMealSlider());
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    fade: true,
    waitForAnimate: false,
  };

  return (
    <>
      {slider.length > 0 && (
        <Slider {...settings}>
          {slider.map((e, index) => (
            <div key={index} className="h-[280px] relative">
              <img
                className="w-full h-full object-cover"
                src={e?.image}
                alt={`Slide ${index}`}
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>
          ))}
        </Slider>
      )}
    </>
  );
}

export default Login;
