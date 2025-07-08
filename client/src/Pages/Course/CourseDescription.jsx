import React, { useEffect } from "react";
import Layout from "../../Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CourseDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { role, data } = useSelector((state) => state.auth);

  useEffect(() => {
    if(!state) {
      navigate("/courses");
    }
  }, [])
  return (
    <Layout>
      <section className="min-h-[90vh] md:pt-12 pt-2 px-4 lg:px-20 flex flex-col   text-gray-800 dark:text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 relative">
          <div className="lg:col-span-1 space-y-5">
            <img
              className="md:w-[87%] w-full h-auto lg:h-64 rounded-md shadow-md"
              alt="thumbnail"
              src={state?.thumbnail?.secure_url}
            />

            <div className="space-y-4">
              <div className="flex flex-col text-lg font-inter">
                <p className="font-semibold">
                  <span className="text-purple-600 dark:text-purple-500 font-bold">
                    Total lectures:{" "}
                  </span>
                  {state?.numberOfLectures}
                </p>

                <p className="font-semibold">
                  <span className="text-purple-600 dark:text-purple-500 font-bold">
                    Instructor:{" "}
                  </span>
                  {state?.createdBy}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10 text-lg">
            <h1 className="md:text-3xl text-2xl lg:text-4xl font-bold text-purple-500 mb-5 text-center w-fit after:content-[' '] relative after:absolute after:-bottom-3.5 after:left-0 after:h-1.5 after:w-[60%] after:rounded-full after:bg-pink-400 dark:after:bg-pink-600">
              {state?.title}
            </h1>

            <div className="space-y-1">
              <h2 className="text-2xl text-gray-800 dark:text-white font-[600]">
                Course description:
              </h2>
              <p className="text-lg text-gray-600 dark:text-violet-300 font-[500] whitespace-pre-wrap">
                {state?.description}
              </p>
            </div>

            {role === "ADMIN" || data?.subscription?.status === "active" ? (
              <button
                onClick={() =>
                  navigate("/course/displaylectures", { state: { ...state } })
                }
                className="bg-violet-500 dark:bg-violet-600 text-white text-xl rounded-md font-bold px-5 py-3 w-full   transition-all ease-in-out duration-300"
              >
                Watch lectures
              </button>
            ) : (
              <button
                onClick={() => navigate("/checkout")}
                className="bg-violet-500 dark:bg-violet-600 text-white text-xl rounded-md font-bold px-5 py-3 w-full   transition-all ease-in-out duration-300"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
