import React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export const SearchButton: React.FC = () => {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push("/courses?focus=true");
  };

  return (
    <button
      onClick={handleSearchClick}
      className="p-2 text-secondaryText hover:text-primaryText rounded-xl hover:bg-black/5 transition-all duration-200 ease-out cursor-pointer"
      aria-label="Search courses"
    >
      <Search className="w-4 h-4" />
    </button>
  );
};
export default SearchButton;
