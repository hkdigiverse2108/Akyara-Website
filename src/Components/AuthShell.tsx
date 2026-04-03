import type { AuthShellProps } from "../Types";

const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => {
  return (
    <section className="mx-auto w-[92%] max-w-[1200px] py-10 sm:py-14 md:py-[80px]">
      <div className="mx-auto w-full max-w-[520px] rounded-[22px] border border-[#ececec] bg-white p-5 shadow-[0_18px_50px_-32px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-[#111111] sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-[#6b6b6b]">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-[#6b6b6b]">{footer}</div>}
      </div>
    </section>
  );
};

export default AuthShell;
