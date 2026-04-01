import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";

const GuestProfileState = () => {
  return (
    <section className="mx-auto w-[92%] max-w-[820px] py-16 sm:py-20">
      <div className="overflow-hidden rounded-[10px] border border-[#ece6db] bg-white shadow-[0_24px_60px_rgba(17,17,17,0.08)]">
        <div className="bg-[radial-gradient(circle_at_top_left,#fff5e9_0%,#ffffff_45%,#fffaf5_100%)] px-8 py-12 text-center sm:px-12 sm:py-14">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.34em] text-[#f6821f]">Account</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#111111] sm:text-4xl">Sign in to view your profile</h1>
        <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-[#666666]">
          Your profile page shows account details, contact information, and account status in one place.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111]"
          >
            Sign In
          </Link>
          <Link
            to={ROUTES.AUTH.SIGNUP}
            className="rounded-full border border-[#d9d9d9] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:border-black"
          >
            Create Account
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
};

export default GuestProfileState;
