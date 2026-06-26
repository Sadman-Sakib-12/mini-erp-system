import { useState, useEffect } from 'react'
import { ProductService } from '@/services/product.service'
import { SalesService } from '@/services/sales.service'
import { PurchaseService } from '@/services/purchase.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Banknote } from 'lucide-react'
import type { Product, Sale, Purchase } from '@/types'

export function Reports() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setProducts(await ProductService.getProducts())
      setSales(await SalesService.getSales())
      setPurchases(await PurchaseService.getPurchases())
    } catch (error) {
      console.error(error)
    }
  }

  const totalRevenue = sales.reduce((sum, s) => sum + s.total_price, 0)
  const totalCost = purchases.reduce((sum, p) => sum + p.total_price, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <ShoppingCart className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue - totalCost).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter(p => p.stock_quantity < 5).length}</div>
            <p className="text-xs text-muted-foreground">Items with stock &lt; 5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Valuation</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Product</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Stock</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Value</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {products.map(p => (
                      <tr key={p.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{p.name}</td>
                        <td className="p-4">{p.stock_quantity}</td>
                        <td className="p-4 text-right">${(p.stock_quantity * p.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
