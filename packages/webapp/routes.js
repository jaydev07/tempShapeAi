const routes = [
  {
    name: "Dashboards",
    icon: "fas fa-home text-primary",
    path: "/",
    layout: "/student",
  },
  {
    path: "/bootcamp",
    name: "Bootcamp",
    icon: "fas fa-book text-green",
    layout: "/student",
  },
  {
    path: "/certificates",
    name: "Your Certificates",
    icon: "fas fa-award text-danger",
    layout: "/student",
  },
  {
    path: "/search",
    name: "Search",
    icon: "fas fa-search text-info",
    layout: "/student",
  },
  {
    path: "/logout",
    name: "Logout",
    icon: "fas fa-sign-out-alt text-red",
    layout: "/student",
  },
];

export default routes;
