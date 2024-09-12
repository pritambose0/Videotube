import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (!authStatus) return;
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      // navigate("/");
      return;
    }
  }, [authStatus, navigate, authentication]);

  return <>{children}</>;
}

Protected.propTypes = {
  children: PropTypes.any,
  authentication: PropTypes.bool,
};
