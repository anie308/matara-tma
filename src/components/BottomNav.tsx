import { Link, useLocation, useNavigate } from "react-router-dom";

// Define the type for a navigation link
interface NavLink {
  title: string;
  link: string;
}

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const links: NavLink[] = [
    { title: "Ref", link: "/ref" },
    { title: "Rank", link: "/rank" },
    { title: "Tasks", link: "/tasks" },
    { title: "Game", link: "/game" },
  ];

  return (
    <div className="fixed bottom-0 w-full text-white flex items-center justify-center">
      {/* Central navigation button */}
      <div
        onClick={() => navigate('/')}
        className="absolute z-20 w-20 h-20 flex items-center justify-center bottom-9 cursor-pointer"
      >
        <img
          src="/circle.png"
          className="w-full h-full object-cover"
          alt="Home Button"
        />
      </div>

      {/* Navigation links */}
      <div className="grid grid-cols-4 w-full">
        {links.map((linkInfo) => (
          <Link
            key={linkInfo.link}
            to={linkInfo.link}
            className={`p-5 border-t-4 border-[#02354C] font-bold flex items-center justify-center ${
              currentPath === linkInfo.link ? "active-nav" : "nav-btn"
            }`}
          >
            {linkInfo.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;