import { useState, useEffect } from 'react'
import { ProductService } from '@/services/product.service'
import { CustomerService } from '@/services/customer.service'
import { SalesService } from '@/services/sales.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Banknote, Plus, Printer } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { Sale, Product, Customer } from '@/types'

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [productId, setProductId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unitPrice, setUnitPrice] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const prodData = await ProductService.getProducts()
      setProducts(prodData)
      
      const custData = await CustomerService.getCustomers()
      setCustomers(custData)
      
      const salesData = await SalesService.getSales()
      setSales(salesData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId || !customerId) {
      toast.error("Select a product and customer")
      return
    }
    try {
      await SalesService.addSale({
        product_id: productId,
        customer_id: customerId,
        quantity: parseInt(quantity),
        unit_price: parseFloat(unitPrice)
      })
      setQuantity('1')
      setUnitPrice('')
      loadData()
      toast.success("Sale recorded and stock deducted!")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to record sale")
    }
  }

  const handlePrint = (sale: any) => {
    const doc = new jsPDF()
    const prodName = products.find(prod => prod.id === sale.product_id)?.name || 'Unknown'
    const custName = customers.find(c => c.id === sale.customer_id)?.name || 'Unknown'

    doc.setFontSize(20)
    doc.text('INVOICE', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`Date: ${new Date(sale.date).toLocaleDateString()}`, 14, 40)
    doc.text(`Invoice #: INV-${sale.id.slice(0, 8).toUpperCase()}`, 14, 50)
    doc.text(`Customer: ${custName}`, 14, 60)

    ;(doc as any).autoTable({
      startY: 70,
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: [
        [prodName, sale.quantity, `$${Number(sale.unit_price).toFixed(2)}`, `$${Number(sale.total_price).toFixed(2)}`],
      ],
      theme: 'grid',
    })

    doc.save(`Invoice_${sale.id.slice(0, 8)}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Record Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <select 
                  id="customer" 
                  required 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={customerId} 
                  onChange={e => setCustomerId(e.target.value)}
                >
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
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
                  <option value="">Select product...</option>
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
                <Label htmlFor="price">Selling Price</Label>
                <Input id="price" type="number" step="0.01" required value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
              </div>
              <div className="pt-2 text-lg font-bold text-green-600">
                Revenue: ${(parseFloat(quantity) * parseFloat(unitPrice) || 0).toFixed(2)}
              </div>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Record Sale
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales History (Invoices)</CardTitle>
            <div className="w-1/2">
              <Input 
                placeholder="Search sales..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : sales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <Banknote className="mx-auto h-8 w-8 mb-2 opacity-50" />
                No sales recorded.
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Customer</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Product</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Qty</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Total</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {sales.filter(s => {
                      const prodName = products.find(prod => prod.id === s.product_id)?.name || ''
                      const custName = customers.find(c => c.id === s.customer_id)?.name || ''
                      return prodName.toLowerCase().includes(searchTerm.toLowerCase()) || custName.toLowerCase().includes(searchTerm.toLowerCase())
                    }).map(s => {
                      const prodName = products.find(prod => prod.id === s.product_id)?.name || 'Unknown'
                      const custName = customers.find(c => c.id === s.customer_id)?.name || 'Unknown'
                      return (
                      <tr key={s.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{new Date(s.date).toLocaleDateString()}</td>
                        <td className="p-4">{custName}</td>
                        <td className="p-4">{prodName}</td>
                        <td className="p-4">{s.quantity}</td>
                        <td className="p-4 text-right font-bold text-green-600">${Number(s.total_price).toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <Button variant="outline" size="sm" onClick={() => handlePrint(s)}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                          </Button>
                        </td>
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
