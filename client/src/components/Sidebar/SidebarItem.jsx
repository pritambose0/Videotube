import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

function SidebarItem({ to, icon, label, isHiddenOnSmall, className }) {
  const location = useLocation();
  return (
    <li className={`${isHiddenOnSmall ? "hidden sm:block" : ""} ${className}`}>
      <Link to={to}>
        <button
          className={`flex flex-col items-center justify-center border-white py-1 focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:p-1.5 sm:hover:bg-[#ae7aff] sm:hover:text-black sm:focus:border-[#ae7aff] sm:focus:bg-[#ae7aff] sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 rounded-md ${
            location.pathname == to &&
            "sm:border-none sm:bg-[#ae7aff] sm:text-black text-[#ae7aff]"
          }`}
        >
          <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
            {icon}
          </span>
          <span className="block sm:hidden sm:group-hover:inline lg:inline">
            {label}
          </span>
        </button>
      </Link>
    </li>
  );
}

SidebarItem.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.any,
  label: PropTypes.string,
  isHiddenOnSmall: PropTypes.bool,
  className: PropTypes.string,
};

export default SidebarItem;
