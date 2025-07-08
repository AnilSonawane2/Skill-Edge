import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import CourseCard from "../../Components/CourseCard";
import Layout from "../../Layout/Layout";

export default function CourseList() {
  const dispatch = useDispatch();

  const { coursesData } = useSelector((state) => state.course);

  async function fetchCourses() {
    await dispatch(getAllCourses());
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Layout>
      <section className="flex flex-col gap-14 md:py-6 py-5 md:px-20 px-3 min-h-screen">
        <h1 className="md:text-4xl text-4xl lg:font-bold w-fit text-gray-900 dark:text-white font-[500] after:content-[' '] relative after:absolute after:-bottom-3.5 after:left-0 after:h-1.5 after:w-[60%] after:rounded-full after:bg-purple-400 dark:after:bg-purple-600">
          Explore the courses made by{" "}
          <span className="font-[800] text-purple-500">
            Industry experts
          </span>
        </h1>
        {/* course container */}
        <div className="flex gap-12 md:justify-start justify-center flex-wrap">
          {coursesData?.map((element) => {
            return <CourseCard key={element._id} data={element} />;
          })}
        </div>
      </section>
    </Layout>
  );
}
