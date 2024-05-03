import axios from "axios";
import {
  setToken,
  setIsLoggedIn,
  setUser,
  setLogin,
} from "../reducers/authReducers";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const login = (data, navigate, setMessage) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://shy-cloud-3319.fly.dev/api/v1/auth/login",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { token } = response.data.data;

    if (response.status === 200) {
      toast.success("Login successful");
      dispatch(setToken(token));
      dispatch(setIsLoggedIn(true));
      dispatch(setLogin("login"));
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setMessage(error.response.data.message);
      return;
    }
    console.error(error.message);
  }
};

export const register = (data, navigate, setMessage) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://shy-cloud-3319.fly.dev/api/v1/auth/register",
      data
    );

    const { token } = response.data.data;

    if (response.status === 201) {
      toast.success("Account registration successful.");
      dispatch(setToken(token));
      dispatch(setIsLoggedIn(true));
      dispatch(setLogin("login"));
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setMessage(error.response.data.message);
      return;
    }
    console.error(error.message);
  }
};

export const googleLogin =
  (credentialResponse, navigate) => async (dispatch) => {
    const token = credentialResponse.credential;
    dispatch(setToken(token));
    dispatch(setIsLoggedIn(true));
    dispatch(setLogin("google"));
    toast.success("Login successful.");
    setTimeout(() => {
      navigate("/", {
        state: { token: credentialResponse.credential },
      });
    }, 1500);
  };

export const facebookLogin = (response, navigate) => async (dispatch) => {
  if (response.status === "connected") {
    const token = response.authResponse.accessToken;
    dispatch(setToken(token));
    dispatch(setIsLoggedIn(true));
    dispatch(setLogin("facebook"));
    toast.success("Login successful.");
    setTimeout(() => {
      navigate("/", {
        state: { token: response.authResponse.accessToken },
      });
    }, 1500);
  }
};

export const getUser = () => async (dispatch, getState) => {
  const loginType = getState().auth.login;
  const token = getState().auth.token;

  if (loginType === "google") {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    dispatch(setUser(decodedToken));
  } else if (loginType === "facebook") {
    try {
      const response = await axios.get(
        "https://graph.facebook.com/me?fields=id,name,email,picture",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Facebook user data:", response.data);
      dispatch(setUser(response.data));
    } catch (error) {
      console.error("Error fetching Facebook user data:", error);
    }
  } else {
    try {
      const response = await axios.get(
        "https://shy-cloud-3319.fly.dev/api/v1/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

export const noAccessToken = (navigate) => async (dispatch, getState) => {
  const loginType = getState().auth.login;
  const token = getState().auth.token;
  if (loginType) {
    if (loginType === "google") {
      const decoded = jwtDecode(token);
      if (decoded?.exp < new Date() / 1000) {
        dispatch(setToken(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        dispatch(setLogin(null));
        toast.error("Token has expired.");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
      }
    } else if (loginType === "facebook") {
      try {
        await axios.get(
          "https://graph.facebook.com/me?fields=id,name,email,picture",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        dispatch(setToken(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        dispatch(setLogin(null));
        toast.error("Token has expired.");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
        console.error("Error fetching Facebook user data:", error);
      }
    } else {
      try {
        await axios.get("https://shy-cloud-3319.fly.dev/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        dispatch(setToken(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setUser(null));
        dispatch(setLogin(null));
        toast.error("Token has expired.");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
        console.error("Error fetching data:", error);
      }
    }
  }
};

export const checkToken = (navigate) => (dispatch, getState) => {
  const token = getState().auth.token;

  if (!token) {
    toast.error("Oops.. unable to access the page, please log in first.");
    navigate("/login");
  }
};

export const logout = (navigate) => (dispatch) => {
  try {
    dispatch(setToken(null));
    dispatch(setIsLoggedIn(false));
    dispatch(setUser(null));
    dispatch(setLogin(null));

    if (navigate) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
    toast.success("Successfully logged out.");
  } catch (error) {
    toast.error(error?.message);
  }
};
