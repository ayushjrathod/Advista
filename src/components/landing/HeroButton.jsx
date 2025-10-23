const HeroButton = () => {
  return (
    <div className="relative group">
      <button className="relative inline-block p-px font-semibold leading-6 shadow-lg shadow-[#5f07f7] text-white bg-neutral-900 cursor-pointer rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#5f07f7] via-cyan-500 to-[#5f07f7] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
          <div className="relative z-10 flex items-center space-x-3">
            <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300">
              Start Research
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
            >
              <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
            </svg>
          </div>
        </span>
      </button>
    </div>
  );
};

export default HeroButton;
