"use client";

import React, { useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "../firebase";
import userStore from "../store/userStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [islLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = userStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in.");
        setUser(user);
        setIsLoggedIn(true);
      } else {
        console.log("User is signed out.");
        setUser(null);
        setIsLoggedIn(false);
      }
    });
  }, [auth]);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
      });
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Timestamp by ARC Solutions
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="#" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Records
          </a>
          {islLoggedIn ? (
            <>
              <button
                onClick={() => signOut(auth)}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>

              <p>"USER: "{user?.displayName}</p>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="text-gray-300 hover:text-white"
            >
              Login
            </button>
          )}
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <a href="#" className="block text-gray-300 hover:text-white p-2">
            Home
          </a>
          <a href="#" className="block text-gray-300 hover:text-white p-2">
            Records
          </a>
          <a href="#" className="block text-gray-300 hover:text-white p-2">
            About
          </a>
          <a href="#" className="block text-gray-300 hover:text-white p-2">
            Logout
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
