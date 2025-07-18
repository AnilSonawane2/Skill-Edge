import React, { useEffect, useState } from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import { LuMoon } from "react-icons/lu";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const element = document.querySelector("html");
    element.classList.remove("light", "dark");
    if (darkMode) {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 md:h-[72px] h-[65px] md:px-[35px] px-[15px] bg-[#ffffffd0] dark:bg-[#21242bc5] shadow-custom backdrop-blur-md flex justify-between">
      <div className="flex text-2xl font-bold text-purple-400 ml-14 mt-4 gap-x-2">
        <img src="/log.png" className="h-8 w-8"/>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-transparent bg-clip-text">
          Skill-Edge
        </span>
      </div>
      <button className="p-5 rounded-full text-lg font-semibold">
        {darkMode ? (
          <MdOutlineWbSunny size={26} className="text-white" onClick={toggleDarkMode} />
        ) : (
          <LuMoon
            size={26}
            className="text-gray-900"
            onClick={toggleDarkMode}
          />
        )}
      </button>
    </nav>
  );
}
