export default function AssistantWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="bg-gradient-to-tr from-[#630ed4] to-[#9052f9] text-white w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(99,14,212,0.4)] hover:scale-105 active:scale-95 transition-all">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-7">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
}
