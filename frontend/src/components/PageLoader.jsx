export default function PageLoader() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1117] text-white">
      <div className="relative mb-5 h-[50px] w-[50px]">
        <div className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-60"></div>
        <div
          className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-60"
          style={{ animationDelay: "-1s" }}
        ></div>
      </div>
      <p className="animate-pulse text-[1.1rem] tracking-[1.5px] text-slate-400">Loading...</p>
    </div>
  );
}
