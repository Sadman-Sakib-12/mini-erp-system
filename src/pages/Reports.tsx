import { useState, useEffect } from 'react'
import { ProductService } from '@/services/product.service'
import { SalesService } from '@/services/sales.service'
import { PurchaseService } from '@/services/purchase.service'
import { CustomerService } from '@/services/customer.service'
import { SupplierService } from '@/services/supplier.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product, Sale, Purchase, Customer, Supplier } from '@/types'

export function Reports() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setProducts(await ProductService.getProducts())
      setSales(await SalesService.getSales())
      setPurchases(await PurchaseService.getPurchases())
      setCustomers(await CustomerService.getCustomers())
      setSuppliers(await SupplierService.getSuppliers())
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

      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button variant={activeTab === 'overview' ? 'default' : 'outline'} onClick={() => setActiveTab('overview')}>Overview</Button>
        <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>Product Report</Button>
        <Button variant={activeTab === 'customers' ? 'default' : 'outline'} onClick={() => setActiveTab('customers')}>Customer Report</Button>
        <Button variant={activeTab === 'suppliers' ? 'default' : 'outline'} onClick={() => setActiveTab('suppliers')}>Supplier Report</Button>
        <Button variant={activeTab === 'purchases' ? 'default' : 'outline'} onClick={() => setActiveTab('purchases')}>Purchase Report</Button>
        <Button variant={activeTab === 'sales' ? 'default' : 'outline'} onClick={() => setActiveTab('sales')}>Sales Report</Button>
      </div>

      {activeTab === 'overview' && (
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
      )}

      {activeTab === 'products' && (
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory Report</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Product Name</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">SKU</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Unit Price</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Current Stock</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {products.map(p => (
                      <tr key={p.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{p.name}</td>
                        <td className="p-4">{p.sku}</td>
                        <td className="p-4">${Number(p.price).toFixed(2)}</td>
                        <td className="p-4">{p.stock_quantity}</td>
                        <td className="p-4 text-right font-bold text-green-600">${(p.stock_quantity * p.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'customers' && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory Report</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Customer Name</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Email</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {customers.map(c => (
                      <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{c.name}</td>
                        <td className="p-4">{c.email}</td>
                        <td className="p-4">{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'suppliers' && (
        <Card>
          <CardHeader>
            <CardTitle>Supplier Directory Report</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Supplier Name</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Email</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {suppliers.map(s => (
                      <tr key={s.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{s.name}</td>
                        <td className="p-4">{s.email}</td>
                        <td className="p-4">{s.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'purchases' && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase History Report</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Product</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Qty</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {purchases.map(p => {
                      const prodName = products.find(prod => prod.id === p.product_id)?.name || 'Unknown'
                      return (
                      <tr key={p.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="p-4">{prodName}</td>
                        <td className="p-4">{p.quantity}</td>
                        <td className="p-4 text-right font-bold text-destructive">${Number(p.total_price).toFixed(2)}</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'sales' && (
        <Card>
          <CardHeader>
            <CardTitle>Sales History Report</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Customer</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Product</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Qty</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {sales.map(s => {
                      const prodName = products.find(prod => prod.id === s.product_id)?.name || 'Unknown'
                      const custName = customers.find(c => c.id === s.customer_id)?.name || 'Unknown'
                      return (
                      <tr key={s.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4">{new Date(s.date).toLocaleDateString()}</td>
                        <td className="p-4">{custName}</td>
                        <td className="p-4">{prodName}</td>
                        <td className="p-4">{s.quantity}</td>
                        <td className="p-4 text-right font-bold text-green-600">${Number(s.total_price).toFixed(2)}</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
