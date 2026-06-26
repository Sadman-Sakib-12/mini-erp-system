export interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock_quantity: number
  created_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
}

export interface Purchase {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  date: string
}

export interface Sale {
  id: string
  product_id: string
  customer_id: string
  quantity: number
  unit_price: number
  total_price: number
  date: string
}
