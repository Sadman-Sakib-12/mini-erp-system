import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface Profile {
  id: string
  email: string
  role: 'Admin' | 'Staff'
  created_at: string
}

export function Users() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // If the table doesn't exist yet, just mock the data or show error
        if (error.code === '42P01') {
           toast.error('Profiles table not found. Please run the SQL script in Supabase.', { duration: 5000 })
        } else {
           throw error
        }
      }
      
      if (data) {
        setUsers(data as Profile[])
      }
    } catch (error: any) {
      toast.error('Failed to load users: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: 'Admin' | 'Staff') => {
    try {
      // Optimistic update
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      toast.success('User role updated successfully')
    } catch (error: any) {
      // Revert on error
      fetchUsers()
      toast.error('Failed to update role: ' + error.message)
    }
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>
            Manage users and assign their roles. To see new users here, ensure the Supabase SQL script has been run.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              No users found or table not set up.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined At</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {users.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">{user.email}</td>
                      <td className="p-4 align-middle">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'Admin' | 'Staff')}
                          className="h-9 w-[130px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Staff">Staff</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
