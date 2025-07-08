import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import heroPng from "../assets/images/hero.png";

export default function HomePage() {
  return (
    <Layout>
      <section className="md:py-10 py-7 mb-10 text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]">
        <div className="md:w-1/2 w-full space-y-7">
          <h1 className="md:text-5xl text-5xl font-semibold text-gray-900 dark:text-gray-200">
            Find the world's best
            <div className="text-violet-500 font-bold"> Online Courses</div>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-300">
            We have a large library of courses taught by highly skilled and
            qualified faculties at a very affordable cost.
          </p>

          <div className="space-x-6 flex">
            <Link to="/courses">
              <button className="bg-purple-500 font-[400] text-slate-100 dark:text-gray-950 md:px-5 px-3 md:py-3 py-3 rounded-md  md:text-lg text-base cursor-pointer transition-all ease-in-out duration-300">
                Explore courses
              </button>
            </Link>

            <Link to="/contact">
              <button className="border border-purple-500 text-gray-700 dark:text-white px-5 py-3 rounded-md font-semibold md:text-lg text-base cursor-pointer  transition-all ease-in-out duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 w-1/7 flex items-center justify-center drop-shadow-[0_0_30px_#a855f7]">
          <img 
            alt="homepage image" 
            src={heroPng} 
            className="transition-transform duration-500 ease-in-out hover:rotate-[-3deg] hover:scale-105"
          />
        </div>
      </section>
    </Layout>
  );
}
