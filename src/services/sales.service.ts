import { supabase } from '@/lib/supabase'
import type { Sale } from '@/types'
import { ProductService } from './product.service'

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'আপনার_Project_URL_টি_Data_API_মেনু_থেকে_কপি_করুন'
)

export const SalesService = {
  async getSales(): Promise<Sale[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('sales').select('*').order('date', { ascending: false })
      if (error) throw error
      return data || []
    }
    return JSON.parse(localStorage.getItem('erp_sales') || '[]')
  },

  async addSale(sale: Omit<Sale, 'id' | 'total_price' | 'date'>): Promise<Sale> {
    const total_price = sale.quantity * sale.unit_price
    
    // Stock validation
    const products = await ProductService.getProducts()
    const pIndex = products.findIndex(p => p.id === sale.product_id)
    if(pIndex === -1) throw new Error("Product not found")
    if(products[pIndex].stock_quantity < sale.quantity) throw new Error("Not enough stock!")

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('sales').insert([{ ...sale, total_price }]).select()
      if (error) throw error
      return data[0]
    }
    
    const sales = await this.getSales()
    const newSale = { ...sale, total_price, id: crypto.randomUUID(), date: new Date().toISOString() }
    localStorage.setItem('erp_sales', JSON.stringify([newSale, ...sales]))
    
    // Update local stock
    products[pIndex].stock_quantity -= sale.quantity
    localStorage.setItem('erp_products', JSON.stringify(products))
    return newSale as Sale
  },
}
