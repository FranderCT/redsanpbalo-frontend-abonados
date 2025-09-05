const Loader = () => {
    return (
        <div className="w-full gap-x-2 flex justify-center items-center">
        <div className="w-5 bg-[#1789FC] animate-pulse h-5 rounded-full animate-bounce" />
        <div className="w-5 animate-pulse h-5 bg-[#1789FC] rounded-full animate-bounce" />
        <div className="w-5 h-5 animate-pulse bg-[#1789FC] rounded-full animate-bounce" />
        </div>
    );
}

export default Loader;