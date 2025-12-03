import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, setIsOpen, menuItems }) {
  const location = useLocation();

  return (
    <>
      {/* 1. Mobile Backdrop (Gelap-gelap di belakang sidebar saat mobile) */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* 2. Sidebar Container */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h1 className="font-bold text-xl text-gray-800 tracking-tight">AlumniApp</h1>
          </div>
          
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-1 text-gray-500 hover:text-red-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.name}
                to={menu.path}
                onClick={() => setIsOpen(false)} // Tutup sidebar pas klik menu (mobile)
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`mr-3 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {menu.icon}
                </div>
                {menu.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}