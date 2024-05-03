import React from "react";
import { facebookLogin } from "../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { FacebookProvider, LoginButton } from "react-facebook";
import { useNavigate } from "react-router-dom";

export default function FbLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <FacebookProvider appId="1216211556029829">
        <LoginButton
          scope="email"
          onError={(error) => {
            console.error(error);
          }}
          onSuccess={(response) => dispatch(facebookLogin(response, navigate))}
        >
          <div className="w-full text-main text-sm bg-white border border-slate-300 rounded-full font-medium px-10 py-1.5 hover:bg-gray-100">
            <div className="flex gap-0.5 items-center">
              <img src="fb.svg" alt="google" width={26} />
              <p>Sign in</p>
            </div>
          </div>
        </LoginButton>
      </FacebookProvider>
    </>
  );
}
