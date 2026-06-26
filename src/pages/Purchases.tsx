import { useState, useEffect } from 'react'
import { ProductService } from '@/services/product.service'
import { PurchaseService } from '@/services/purchase.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Plus } from 'lucide-react'
import type { Purchase, Product } from '@/types'
import toast from 'react-hot-toast'

export function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unitPrice, setUnitPrice] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const prodData = await ProductService.getProducts()
      setProducts(prodData)
      
      const purchData = await PurchaseService.getPurchases()
      setPurchases(purchData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId) {
      toast.error("Select a product")
      return
    }
    try {
      await PurchaseService.addPurchase({
        product_id: productId,
        quantity: parseInt(quantity),
        unit_price: parseFloat(unitPrice)
      })
      setQuantity('1')
      setUnitPrice('')
      loadData()
      toast.success("Purchase added and stock updated!")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to add purchase")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Record Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <select 
                  id="product" 
                  required 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={productId} 
                  onChange={e => {
                    setProductId(e.target.value)
                    const p = products.find(p => p.id === e.target.value)
                    if(p) setUnitPrice(p.price.toString())
                  }}
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input id="qty" type="number" min="1" required value={quantity} onChange={e => setQuantity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Unit Price</Label>
                <Input id="price" type="number" step="0.01" required value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
              </div>
              <div className="pt-2 text-lg font-bold">
                Total: ${(parseFloat(quantity) * parseFloat(unitPrice) || 0).toFixed(2)}
              </div>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Record Purchase
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <ShoppingCart className="mx-auto h-8 w-8 mb-2 opacity-50" />
                No purchases recorded.
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Product</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Qty</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Unit Price</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {purchases.map(p => {
                      const prodName = products.find(prod => prod.id === p.product_id)?.name || 'Unknown'
                      return (
                      <tr key={p.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="p-4">{prodName}</td>
                        <td className="p-4">{p.quantity}</td>
                        <td className="p-4">${Number(p.unit_price).toFixed(2)}</td>
                        <td className="p-4 text-right font-bold">${Number(p.total_price).toFixed(2)}</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
