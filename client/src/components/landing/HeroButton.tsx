const HeroButton = () => {
  return (
    <div className="relative group inline-flex">
      <button className="relative inline-flex cursor-pointer items-center rounded-2xl p-px font-semibold text-white shadow-lg shadow-[#5f07f7]/40 transform-gpu transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[#5f07f7]/60 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[#5f07f7] via-[#8b5cf6] to-[#5f07f7] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="relative z-10 inline-flex items-center gap-3 rounded-2xl bg-zinc-950 px-6 py-3 transition-colors duration-200 group-hover:bg-white group-hover:text-zinc-950">
          <span>Start Intelligence Run</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default HeroButton;
