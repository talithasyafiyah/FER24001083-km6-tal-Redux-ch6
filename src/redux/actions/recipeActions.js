import axios from "axios";
import {
  setMeal,
  setMealSlider,
  setMealDetail,
  setCategory,
  setCategoryList,
  setSearchResults
} from "../reducers/recipeReducers";

export const getMeal = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=seafood`
    );
    dispatch(setMeal(response.data.meals));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return;
    }
    console.error(error.message);
  }
};

export const getCategory = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    dispatch(setCategory(response.data.categories));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return;
    }
    console.error(error.message);
  }
};

export const getCategoryList = () => async (dispatch, getState) => {
  const categoryName = getState().recipe.categoryName;
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
    );
    dispatch(setCategoryList(response.data.meals));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return;
    }
    console.error(error.message);
  }
};

export const getMealSlider = () => async (dispatch) => {
  try {
    const response = await axios.get(`https://dummyjson.com/recipes?limit=10`);
    dispatch(setMealSlider(response.data.recipes));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return;
    }
    console.error(error.message);
  }
};

export const getMealDetail = () => async (dispatch, getState) => {
  const id = getState().recipe.mealId;
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    dispatch(setMealDetail(response.data.meals));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return;
    }
    console.error(error.message);
  }
};

export const getSearchResults = () => async (dispatch, getState) => {
  const searchTerm = getState().recipe.searchKeyword;
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );
    dispatch(setSearchResults(response.data.meals || []));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return;
    }
    console.error(error.message);
  }
};
