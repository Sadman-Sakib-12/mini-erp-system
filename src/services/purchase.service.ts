import { supabase } from '@/lib/supabase'
import type { Purchase } from '@/types'
import { ProductService } from './product.service'

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'আপনার_Project_URL_টি_Data_API_মেনু_থেকে_কপি_করুন'
)

export const PurchaseService = {
  async getPurchases(): Promise<Purchase[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('purchases').select('*').order('date', { ascending: false })
      if (error) throw error
      return data || []
    }
    return JSON.parse(localStorage.getItem('erp_purchases') || '[]')
  },

  async addPurchase(purchase: Omit<Purchase, 'id' | 'total_price' | 'date'>): Promise<Purchase> {
    const total_price = purchase.quantity * purchase.unit_price
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('purchases').insert([{ ...purchase, total_price }]).select()
      if (error) throw error
      return data[0]
    }
    const purchases = await this.getPurchases()
    const newPurchase = { ...purchase, total_price, id: crypto.randomUUID(), date: new Date().toISOString() }
    localStorage.setItem('erp_purchases', JSON.stringify([newPurchase, ...purchases]))
    
    // Update local stock
    const products = await ProductService.getProducts()
    const pIndex = products.findIndex(p => p.id === purchase.product_id)
    if(pIndex > -1) {
      products[pIndex].stock_quantity += purchase.quantity
      localStorage.setItem('erp_products', JSON.stringify(products))
    }
    return newPurchase as Purchase
  },
}
