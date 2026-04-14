import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState, type FormEvent } from "react";
import { Mutations } from "../Api";
import { useAppSelector } from "../Store/Hooks";

export const NewsletterPopup = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const sessionEmail = user?.email ?? "";
  const newsletterMutation = Mutations.useSubscribeNewsletter();

  const [subscribe, setSubscribe] = useState({
    show: false,
    email: "",
    status: null as { error?: string; success?: string } | null,
  });

  useEffect(() => {
    if (isAuthenticated) return;
    const t = setTimeout(() => {
      setSubscribe((s) => ({ ...s, show: true }));
    }, 2000);
    return () => clearTimeout(t);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!sessionEmail) return;
    setSubscribe((s) => ({ ...s, email: s.email || sessionEmail }));
  }, [sessionEmail]);

  const closeSubscribePopup = () => setSubscribe({ show: false, email: "", status: null });

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    const email = subscribe.email.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setSubscribe((s) => ({
        ...s,
        status: { error: !email ? "Email is required" : "Invalid email" },
      }));
    }

    try {
      const res = await newsletterMutation.mutateAsync({ email });
      setSubscribe((s) => ({
        ...s,
        status: { success: typeof res?.message === 'string' ? res.message : "Subscribed successfully" },
      }));
      setTimeout(closeSubscribePopup, 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Subscription failed";
      setSubscribe((s) => ({
        ...s,
        status: { error: typeof errorMsg === 'string' ? errorMsg : "An error occurred" },
      }));
    }
  };

  if (!subscribe.show) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center animate-fadeIn">
      <div className="absolute inset-0 bg-black/55" onClick={closeSubscribePopup} />
      <div className="relative z-[1] w-[min(520px,92vw)] rounded-[15px] bg-white px-5 py-6 text-black shadow-[0_24px_60px_rgba(0,0,0,0.45)] animate-slideUp sm:px-8 sm:py-7" role="dialog" aria-modal="true">
        <button className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1f1f1f] text-[1.2rem] text-[#1f1f1f] hover:bg-black/5" type="button" aria-label="Close subscribe popup" onClick={closeSubscribePopup}>
          <CloseOutlined className="text-[0.95rem] leading-none" aria-hidden="true" />
        </button>
        <img className="mx-auto mb-4 h-10 w-auto" src="/assets/images/logo/logo.png" alt="Akyara" />
        <h3 className="mb-[10px] text-center font-display text-[1.35rem] text-[#1f1f1f] sm:text-[1.6rem]">Don't Miss Out</h3>
        <p className="mb-6 text-center text-[#6b6b6b] leading-relaxed">Subscribe for exclusive offers, new fragrance launches, and curated scentstories delivered to your inbox.</p>
        <form className="grid gap-3" onSubmit={handleSubscribe}>
          <div className="relative">
            <input className={`w-full rounded-[14px] border px-4 py-3 text-[#2b2b2b] placeholder:text-[#b7b7b7] outline-none transition-all duration-200 ${  subscribe.status?.error     ? "border-[#ffccc7] bg-[#fff2f0] focus:border-[#ff4d4f]"     : "border-[#e1e1e1] focus:border-black"}`} type="email" placeholder="Enter your email address" value={subscribe.email} onChange={(e) => setSubscribe((s) => ({ ...s, email: e.target.value, status: null }))} disabled={newsletterMutation.isPending} />
          </div>
          {subscribe.status?.error && (
            <p className="flex items-center gap-2 px-1 text-xs font-medium text-[#ff4d4f] animate-shake">
              <span className="inline-block h-1 w-1 rounded-full bg-[#ff4d4f]" />
              {subscribe.status.error}
            </p>
          )}
          {subscribe.status?.success && (
            <p className="flex items-center gap-2 px-1 text-xs font-medium text-[#52c41a] animate-fadeIn">
              <span className="inline-block h-1 w-1 rounded-full bg-[#52c41a]" />
              {subscribe.status.success}
            </p>
          )}
          <button type="submit" disabled={newsletterMutation.isPending} className="mt-2 w-full rounded-full bg-black py-3.5 font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-all hover:bg-[#111111] hover:shadow-black/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"> {newsletterMutation.isPending ? "Joining..." : "Submit"}</button>
        </form>
      </div>
    </div>
  );
};
