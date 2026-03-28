import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:9000/api";
const imageUrl = "http://localhost:9000/uploads";

function Home() {
  const [banners, setBanners] = useState([]);
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setIsLoading(true);

      // 1. Get Banners  →  /api/banners
      let bannerRes = await fetch(`${baseUrl}/banners`);
      bannerRes = await bannerRes.json();
      setBanners(bannerRes.data || []);

      // 2. Get Stats  →  /api/stats
      let statsRes = await fetch(`${baseUrl}/stats`);
      statsRes = await statsRes.json();
      setStats(statsRes.data || null);

      // 3. Get Courses  →  /api/courses
      let courseRes = await fetch(`${baseUrl}/courses?featured=true&limit=6`);
      courseRes = await courseRes.json();
      setCourses(courseRes.courses || []);

      // 4. Get Testimonials  →  /api/public/testimonials
      let testimonialRes = await fetch(`${baseUrl}/public/testimonials`);
      testimonialRes = await testimonialRes.json();
      setTestimonials(testimonialRes.data ? testimonialRes.data.slice(0, 3) : []);

      setIsLoading(false);
      toast.success("Welcome to Sikshya Sadan! 🎉");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Failed to load data. Please refresh the page.");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Auto slide banners every 6 seconds
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning("Please enter something to search!");
      return;
    }
    navigate(`/courses?search=${searchQuery}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Sikshya Sadan...</h1>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 pb-20">

      {/* ===== HERO BANNER ===== */}
      <section className="relative h-[600px] bg-blue-900">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 flex items-center transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundColor: banner.bgColor || "#1e3a8a",
                backgroundImage: banner.bgImage ? `url(${imageUrl}/${banner.bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Banner Content */}
              <div className="relative z-20 w-[85%] m-auto text-white space-y-6">
                {banner.badgeText && (
                  <span className="bg-orange-500 text-white px-3 py-1 font-bold text-sm rounded-md">
                    {banner.badgeText}
                  </span>
                )}
                <h1 className="text-5xl font-bold md:w-[700px] leading-snug">
                  {banner.heading}
                </h1>
                <p className="text-2xl text-gray-200 md:w-[600px]">
                  {banner.subheading}
                </p>
                <div className="flex gap-4 pt-4">
                  <Link
                    to={banner.cta1Link || "/courses"}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg"
                  >
                    {banner.cta1Label}
                  </Link>
                  {banner.cta2Label && (
                    <Link
                      to={banner.cta2Link || "/contact"}
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10"
                    >
                      {banner.cta2Label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Default banner if DB is empty
          <div className="flex items-center justify-center h-full text-white text-center px-4">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Welcome to Sikshya Sadan</h1>
              <p className="text-2xl text-gray-200">Empowering IT learners in Nepal</p>
              <Link
                to="/courses"
                className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-bold text-lg mt-4"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        )}

        {/* Slide Dots */}
        <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide ? "w-10 bg-white" : "w-4 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ===== SEARCH BOX ===== */}
      <div className="w-[85%] m-auto -mt-10 z-40 relative bg-white p-6 shadow-md border border-gray-200 rounded-2xl">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Find a course..."
            className="border border-gray-300 rounded-lg p-3 w-full text-lg outline-none bg-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700"
          >
            SEARCH
          </button>
        </form>
      </div>

      {/* ===== STATS ===== */}
      <section className="w-[85%] m-auto mt-20 bg-white p-10 border border-gray-200 shadow-sm flex justify-between items-center rounded-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">{stats?.totalStudents || 0}+</h1>
          <p className="text-lg font-semibold text-gray-500 uppercase mt-2">Enrolled Students</p>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">{stats?.totalCourses || 0}</h1>
          <p className="text-lg font-semibold text-gray-500 uppercase mt-2">Global Courses</p>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">{stats?.totalInstructors || 0}</h1>
          <p className="text-lg font-semibold text-gray-500 uppercase mt-2">Expert Instructors</p>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">5+</h1>
          <p className="text-lg font-semibold text-gray-500 uppercase mt-2">Years of Excellence</p>
        </div>
      </section>

      {/* ===== COURSES ===== */}
      <section className="w-[85%] m-auto mt-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Top Rated Programs</h1>
          <p className="text-xl text-gray-500 mt-2">Explore our most popular courses.</p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-gray-300 rounded-2xl shadow hover:shadow-lg transition overflow-hidden pb-4"
              >
                {/* Course Image */}
                <div className="h-48 w-full bg-gray-200 relative">
                  <img
                    src={`${imageUrl}/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-sm font-bold rounded-md">
                    {course.category}
                  </span>
                </div>

                {/* Course Details */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-500 font-semibold text-sm border-b pb-3">
                    <span>⏱ {course.duration || "3 Months"}</span>
                    <span>⭐ {course.rating || "5.0"}</span>
                  </div>

                  <h1 className="text-xl font-bold line-clamp-2 h-14">{course.title}</h1>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center font-bold">
                      {course.instructor?.photo ? (
                        <img
                          src={`${imageUrl}/${course.instructor.photo}`}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        course.instructor?.name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{course.instructor?.name}</p>
                      <p className="text-sm text-gray-500">Instructor</p>
                    </div>
                  </div>

                  {/* Price & Button */}
                  <div className="flex justify-between items-center pt-3">
                    <h1 className="text-2xl font-bold">Rs. {course.fee}</h1>
                    <Link
                      to={`/courses/${course._id}`}
                      className="bg-orange-500 text-white font-bold px-4 py-2 rounded-md hover:bg-orange-600"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-2xl border font-bold text-gray-500">
            No courses available.
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/courses"
            className="border-2 border-blue-600 text-blue-600 font-bold p-4 px-10 rounded-xl hover:bg-blue-600 hover:text-white transition inline-block"
          >
            EXPLORE ALL COURSES
          </Link>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="w-[85%] m-auto mt-20 flex gap-10">
        {/* Left Text */}
        <div className="w-[35%] space-y-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Hear from our Alumni</h1>
          <p className="text-xl text-gray-500">
            Real stories from real learners who transformed their careers at Sikshya Sadan.
          </p>
          <Link
            to="/about"
            className="bg-blue-600 text-white font-bold w-44 p-4 rounded-xl flex justify-between items-center hover:bg-blue-700"
          >
            About Us →
          </Link>
        </div>

        {/* Right Cards */}
        <div className="w-[60%] flex gap-6">
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-orange-500 mb-4">
                    {"⭐".repeat(t.rating || 5)}
                  </div>
                  <p className="text-gray-600 italic text-lg mb-6">"{t.comment}"</p>
                </div>
                <div className="flex items-center gap-4 border-t pt-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 overflow-hidden">
                    {t.student?.photo ? (
                      <img src={`${imageUrl}/${t.student.photo}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      t.student?.name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">{t.student?.name}</h1>
                    <p className="text-sm text-gray-500">{t.course?.title}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 border rounded-2xl bg-white w-full text-center text-gray-500">
              No testimonials yet.
            </div>
          )}
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="w-[85%] m-auto mt-20 rounded-3xl bg-blue-900 p-16 text-center text-white space-y-6">
        <h1 className="text-4xl font-bold">Your Future in Tech Begins Here.</h1>
        <p className="text-xl text-gray-300 md:w-[600px] m-auto">
          Join our community of developers and innovators. Enroll today and get access to premium resources and mentorship.
        </p>
        <div className="flex justify-center gap-6 pt-4">
          <Link
            to="/admission"
            className="bg-orange-500 text-white font-bold p-4 px-10 rounded-xl hover:bg-orange-600"
          >
            Apply for Admission
          </Link>
          <Link
            to="/contact"
            className="border-2 border-white text-white font-bold p-4 px-10 rounded-xl hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </main>
  );
}

export default Home;