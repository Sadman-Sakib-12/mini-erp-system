import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Package, Users, Truck, ShoppingCart, Banknote, LogOut, LayoutDashboard, BarChart3, UserCog } from 'lucide-react'

export function Layout() {
  const { signOut, user, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Staff'] },
    { name: 'Products', path: '/products', icon: Package, roles: ['Admin', 'Staff'] },
    { name: 'Customers', path: '/customers', icon: Users, roles: ['Admin', 'Staff'] },
    { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['Admin'] },
    { name: 'Purchases', path: '/purchases', icon: ShoppingCart, roles: ['Admin'] },
    { name: 'Sales', path: '/sales', icon: Banknote, roles: ['Admin', 'Staff'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Admin'] },
    { name: 'Users', path: '/users', icon: UserCog, roles: ['Admin', 'Staff'] },
  ]

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-white text-xl tracking-tight bg-slate-950">
          <Package className="mr-2 h-6 w-6 text-indigo-500" /> Mini ERP
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.filter(item => item.roles.includes(role || 'Staff')).map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="md:hidden font-bold text-lg flex items-center">
            <Package className="mr-2 h-5 w-5 text-indigo-600" /> Mini ERP
          </div>
          <div className="flex items-center justify-end w-full space-x-4">
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {user?.email || 'user@erp.local'} <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{role}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
