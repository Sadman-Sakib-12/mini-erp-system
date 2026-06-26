import { supabase } from '@/lib/supabase'
import type { Customer } from '@/types'

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'আপনার_Project_URL_টি_Data_API_মেনু_থেকে_কপি_করুন'
)

export const CustomerService = {
  async getCustomers(): Promise<Customer[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    }
    return JSON.parse(localStorage.getItem('erp_customers') || '[]')
  },

  async addCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('customers').insert([customer]).select()
      if (error) throw error
      return data[0]
    }
    const customers = await this.getCustomers()
    const newCustomer = { ...customer, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    localStorage.setItem('erp_customers', JSON.stringify([newCustomer, ...customers]))
    return newCustomer as Customer
  },

  async deleteCustomer(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('customers').delete().eq('id', id)
      if (error) throw error
      return true
    }
    const customers = await this.getCustomers()
    localStorage.setItem('erp_customers', JSON.stringify(customers.filter(c => c.id !== id)))
    return true
  },
}
