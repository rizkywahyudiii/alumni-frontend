import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, setIsOpen, menuItems }) {
  const location = useLocation();

  return (
    <>
      {/* 1. Mobile Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* 2. Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-800 text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-md">
              <span className="text-2xl">🎓</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-white">AlumniApp</h1>
          </div>
          
          {/* Close Button (Mobile) */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 transition-colors rounded-md lg:hidden text-emerald-100 hover:text-white hover:bg-white/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-5rem)] custom-scrollbar">
          {menuItems.map((menu) => {
            const isActive = location.pathname.startsWith(menu.path); // Logic improved: startsWith handles sub-routes
            
            return (
              <Link
                key={menu.name}
                to={menu.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white text-emerald-700 shadow-lg translate-x-1' 
                    : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-1'
                }`}
              >
                {/* Icon dengan transisi warna */}
                <div className={`mr-4 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-emerald-200 group-hover:text-white'
                }`}>
                  {menu.icon}
                </div>
                
                {menu.name}

                {/* Indikator Active (Dot kecil di kanan) */}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}