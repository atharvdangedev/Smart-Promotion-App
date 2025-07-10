/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { lazyLoad } from "../lazyLoad";

// Library Imports
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, Outlet } from "react-router-dom";
import { screenMapping } from "./Components/ScreenMapping";
import { setScreenWidth } from "../Redux/actions/moreSettingsActions";
// Component Imports
const CommonBrand = lazyLoad(() => import("../Common/CommonBrand/CommonBrand"));
const CommonHeader = lazyLoad(() =>
  import("../Common/CommonHeader/CommonHeader")
);
const CommonSidebar = lazyLoad(() =>
  import("../Common/CommonSidebar/CommonSidebar")
);
const CommonBreadcrumb = lazyLoad(() =>
  import("../Common/CommonBreadcrumb/CommonBreadcrumb")
);
const CommonFooter = lazyLoad(() =>
  import("../Common/CommonFooter/CommonFooter")
);
const CommonSettings = lazyLoad(() =>
  import("../Common/Setting/CommonSettings")
);

// Theme colors
const themeColorMappings = {
  ValenciaRed: "#D63B38",
  SunOrange: "#F7A614",
  AppleGreen: "#5BC43A",
  CeruleanBlue: "#00B8D6",
  Mariner: "#0066FE",
  PurpleHeart: "#6238B3",
  FrenchRose: "#EB5393",
};

const AdminLayout = ({
  themeColor,
  layout,
  borderStroke,
  borderLayout,
  boxLayout,
  monochrome,
  borderRadius,
  iconColor,
  themeMode,
}) => {
  // Variable declarations
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  // State variables
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [rightbarHidden, setRightbarHidden] = useState(true);
  const [colorCode, setColorCode] = useState("#00B8D6");

  // Set theme color on component mount
  useEffect(() => {
    if (themeColorMappings.hasOwnProperty(themeColor)) {
      setColorCode(themeColorMappings[themeColor]);
    } else {
      setColorCode("#00B8D6");
    }
  }, [themeColor]);

  // Set tooltip color on componnet mount
  useEffect(() => {
    document.documentElement.style.setProperty("--tooltip-color", colorCode);
  }, [colorCode]);

  // Set Screen Width and decide to hide the right sidebar or not on component mount
  useEffect(() => {
    dispatch(setScreenWidth(rightbarHidden));
  }, [dispatch, rightbarHidden]);

  // Decide screen size on component mount
  useEffect(() => {
    if (screenMapping.hasOwnProperty(pathname)) {
      setRightbarHidden(false);
    } else {
      setRightbarHidden(true);
    }
  }, [pathname]);

  // Toggle Sidebar function
  const toggleSidebar = () => {
    setSidebarHidden((prevState) => !prevState);
  };

  return (
    <body
      data-bvite={`theme-${themeColor}`}
      data-bs-theme={themeMode}
      className={`docs ${borderRadius} ${monochrome} ${boxLayout} ${borderLayout} ${borderStroke} ${layout} ${
        sidebarHidden && "sidebar-hide"
      } ${rightbarHidden ? "rightbar-hide" : ""}`}
    >
      <main
        className={`${
          boxLayout === "box-layout rightbar-hide"
            ? "container"
            : "container-fluid"
        } px-0`}
      >
        <CommonBrand />
        <CommonHeader />
        <CommonSidebar iconColor={iconColor} />
        <CommonBreadcrumb toggleSidebar={toggleSidebar} />
        <Outlet />
        <CommonFooter />
        <CommonSettings />
      </main>
    </body>
  );
};

export default AdminLayout;
