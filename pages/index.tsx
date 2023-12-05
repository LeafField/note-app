import React, { useState, FormEvent } from "react";
import { BadgeCheckIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import { useMutateAuth } from "../hooks/useMutateAuth";
import { Layout } from "../components/Layout";
import { NextPage } from "next";

const Auth: NextPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  } = useMutateAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  return (
    <Layout title="Auth">
      <ShieldCheckIcon className="mb-6 h-12 w-12 text-pink-500" />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="my-6 flex items-center justify-center text-sm">
          <span
            className="cursor-pointer font-medium hover:text-indigo-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            change mode ?
          </span>
        </div>
        <button
          type="submit"
          className="relative flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:text-indigo-700"
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <BadgeCheckIcon className="h-5 w-5" />
          </span>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </Layout>
  );
};

export default Auth;
