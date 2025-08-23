import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [navigation, setNavigation] = useState([
    { name: "الرئيسية", to: "/", current: false },
    { name: "المنتجات", to: "/products", current: false },
    { name: "الاقسام", to: "/categories", current: false },
    { name: "الاقسام الثانوية", to: "/suppliers", current: false },
    { name: "العروض", to: "/offers", current: false },

  ]);

  // تحديث حالة current بناءً على المسار
  useEffect(() => {
    setNavigation((nav) =>
      nav.map((item) => ({
        ...item,
        current: item.to === location.pathname,
      }))
    );
  }, [location.pathname]);

  return (
    <Disclosure as="nav" className="bg-[#1A1A1A] backdrop-blur-md z-50" dir="rtl">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset">
                  <span className="sr-only">فتح القائمة الرئيسية</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:mr-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) =>
                          isActive
                            ? "rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out bg-gradient-to-br from-[#5E54F2] to-[#7C3AED] text-white shadow-[0_4px_15px_rgba(94,84,242,0.4)] scale-110 nav-activate"
                            : "rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out text-[#94a3b8] hover:bg-gray-700 hover:text-white active:scale-75 transform hover:-translate-y-[2px] transition-transform duration-200"
                        }
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* زر تسجيل الخروج */}
                <NavLink
                  to="/login"
                  className="relative rounded-full text-[#DC3545] text-3xl hover:text-red-800 hover:scale-125"
                  aria-label="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 8V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" />
                    <path d="M15 12H3l3-3m0 6l-3-3" />
                  </svg>
                </NavLink>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden" style={{ direction: "ltr" }}>
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.to}
                  className={
                    item.current
                      ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  }
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
