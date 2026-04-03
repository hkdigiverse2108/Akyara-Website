import { Link } from "react-router-dom";
import { ROUTES } from "../Constants";

const NotFound = () => {
  return (
    <section className="bg-[#f8f9fb]">

      <div className="mx-auto grid min-h-[58vh] w-[92%] max-w-[1200px] place-items-center py-14 sm:py-16">
        <div className="max-w-[760px] text-center">
          <div className="mx-auto mb-8 inline-grid h-20 w-20 place-items-center rounded-full bg-[#fdeef0] text-3xl text-[#ef6b4a]">
            :)
          </div>

          <h1 className="text-3xl font-semibold text-[#0f172a] sm:text-5xl">404. Page not found.</h1>
          <p className="mx-auto mt-5 max-w-[620px] text-base leading-8 text-[#5f6774] sm:text-[1.12rem]">
            Sorry, we couldn&apos;t find the page you were looking for. We suggest that you return to home page.
          </p>

          <Link
            to={ROUTES.HOME}
            className="mt-9 inline-flex items-center justify-center rounded-[4px] bg-[#111111] px-8 py-3.5 text-lg font-semibold text-white transition hover:bg-black"
          >
            Go To Home Page
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
