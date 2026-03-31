const PageLoader = () => (
  <div className="fixed inset-0 z-[70] grid place-items-center bg-white">
    <div className="flex flex-col items-center gap-3 text-black">
      <div className="loader">
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
        <div className="circle">
          <div className="dot" />
          <div className="outline" />
        </div>
      </div>
      <span className="text-xs font-semibold tracking-[0.2em] uppercase">Loading</span>
    </div>
  </div>
);

export default PageLoader;
