import { supabase } from '@/lib/supabase'
import type { Supplier } from '@/types'

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'আপনার_Project_URL_টি_Data_API_মেনু_থেকে_কপি_করুন'
)

export const SupplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    }
    return JSON.parse(localStorage.getItem('erp_suppliers') || '[]')
  },

  async addSupplier(supplier: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('suppliers').insert([supplier]).select()
      if (error) throw error
      return data[0]
    }
    const suppliers = await this.getSuppliers()
    const newSupplier = { ...supplier, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    localStorage.setItem('erp_suppliers', JSON.stringify([newSupplier, ...suppliers]))
    return newSupplier as Supplier
  },

  async deleteSupplier(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('suppliers').delete().eq('id', id)
      if (error) throw error
      return true
    }
    const suppliers = await this.getSuppliers()
    localStorage.setItem('erp_suppliers', JSON.stringify(suppliers.filter(s => s.id !== id)))
    return true
  },

  async updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('suppliers').update(supplier).eq('id', id).select()
      if (error) throw error
      return data[0]
    }
    const suppliers = await this.getSuppliers()
    const index = suppliers.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Not found')
    suppliers[index] = { ...suppliers[index], ...supplier }
    localStorage.setItem('erp_suppliers', JSON.stringify(suppliers))
    return suppliers[index]
  },
}
