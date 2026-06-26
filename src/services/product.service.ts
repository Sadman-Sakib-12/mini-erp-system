import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'আপনার_Project_URL_টি_Data_API_মেনু_থেকে_কপি_করুন'
)

export const ProductService = {
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    }
    return JSON.parse(localStorage.getItem('erp_products') || '[]')
  },
  
  async addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').insert([product]).select()
      if (error) throw error
      return data[0]
    }
    const products = await this.getProducts()
    const newProduct = { ...product, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    localStorage.setItem('erp_products', JSON.stringify([newProduct, ...products]))
    return newProduct as Product
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      return true
    }
    const products = await this.getProducts()
    localStorage.setItem('erp_products', JSON.stringify(products.filter(p => p.id !== id)))
    return true
  },
}
