import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from './ProtectedRoute'

import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Products } from '@/pages/Products'
import { Customers } from '@/pages/Customers'
import { Suppliers } from '@/pages/Suppliers'
import { Purchases } from '@/pages/Purchases'
import { Sales } from '@/pages/Sales'
import { Reports } from '@/pages/Reports'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Accessible by everyone (Admin & Staff) */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />

        {/* Admin ONLY Routes */}
        <Route path="/suppliers" element={<ProtectedRoute allowedRoles={['Admin']}><Suppliers /></ProtectedRoute>} />
        <Route path="/purchases" element={<ProtectedRoute allowedRoles={['Admin']}><Purchases /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['Admin']}><Reports /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}
