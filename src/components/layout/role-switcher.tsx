'use client'

import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { loginAsUser } from '@/app/actions/auth-actions'
import { User2 } from 'lucide-react'

export function RoleSwitcher({ users, currentUser }: { users: any[], currentUser: any | null }) {
  const router = useRouter()

  const handleUserChange = async (userId: string) => {
    await loginAsUser(userId)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <User2 className="w-4 h-4 text-slate-500" />
      <Select defaultValue={currentUser?.id} onValueChange={handleUserChange}>
        <SelectTrigger className="w-[200px] h-8 text-xs bg-slate-50 border-slate-200">
          <SelectValue placeholder="Select Role / Login" />
        </SelectTrigger>
        <SelectContent>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id} className="text-xs">
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
