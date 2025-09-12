import * as React from "react";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  className?: string;
  fluid?: boolean;
  widthClass?: string;
};

export default function PaginationSearch({
  search,
  onSearchChange,
  className = "",
  fluid = false,            
  widthClass = "w-[300px]", // <- ancho del buscador (ajústalo a tu gusto)
}: Props) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const filled = Boolean(search && search.trim().length > 0);

  const wrapperClass = `${fluid ? "flex-1" : "inline-flex"} ${className}`;

  return (
    <div className={wrapperClass}>
      <form
        ref={formRef}
        className={`
          relative ${widthClass}
          bg-white h-9
          pl-12 pr-3
          ring-1 ring-gray-200 shadow-sm
          focus-within:ring-[#1789FC]
        `}
        onReset={() => {
          onSearchChange("");
          requestAnimationFrame(() =>
            formRef.current?.querySelector("input")?.focus()
          );
        }}
      >
        <label htmlFor="pagination-search" className="sr-only">
          Buscar por nombre
        </label>

        {/* input */}
        <input
          id="pagination-search"
          type="text"
          autoComplete="off"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          data-filled={filled ? "true" : "false"}
          className="
            peer w-full h-full
            bg-transparent border-0 outline-none
            text-[#091540] placeholder-gray-400
          "
        />

        {/* íconos a la izquierda */}
        <div
          aria-hidden
          className="
            absolute left-3 top-1/2 -translate-y-1/2
            flex items-center justify-center
            transition
            peer-focus:scale-110
            peer-[:not(:placeholder-shown)]:scale-110
            peer-data-[filled=true]:scale-110
          "
        >
          {/* lupa (visible cuando vacío) */}
          <svg
            className="
              h-[15px] w-[15px] text-gray-900 transition
              peer-focus:opacity-0 peer-focus:invisible
              peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:invisible
              peer-data-[filled=true]:opacity-0 peer-data-[filled=true]:invisible
            "
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>


          <svg
            className="
              h-[15px] w-[15px] opacity-0 invisible text-gray-900 transition
              peer-focus:opacity-100 peer-focus:visible peer-focus:text-[#15A986]
              peer-[:not(:placeholder-shown)]:opacity-100 peer-[:not(:placeholder-shown)]:visible peer-[:not(:placeholder-shown)]:text-[#15A986]
              peer-data-[filled=true]:opacity-100 peer-data-[filled=true]:visible peer-data-[filled=true]:text-[#15A986]
            "
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C12 2 5 10 5 15.5C5 19.09 8.13401 22 12 22C15.866 22 19 19.09 19 15.5C19 10 12 2 12 2Z" />
          </svg>
        </div>

        {/* botón reset a la derecha */}
        <button
          type="reset"
          aria-label="Limpiar búsqueda"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            inline-flex items-center justify-center
            h-5 w-5 rounded-full
            text-gray-900
            transition
            opacity-0 scale-0 invisible
            peer-focus:opacity-100 peer-focus:scale-100 peer-focus:visible
            peer-[:not(:placeholder-shown)]:opacity-100 peer-[:not(:placeholder-shown)]:scale-100 peer-[:not(:placeholder-shown)]:visible
            peer-data-[filled=true]:opacity-100 peer-data-[filled=true]:scale-100 peer-data-[filled=true]:visible
            hover:ring-2 hover:ring-gray-200
          "
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
