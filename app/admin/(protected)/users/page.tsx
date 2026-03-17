import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import bcrypt from 'bcryptjs';

export default async function UsersPage() {
  const users = await db.user.findMany({ include: { role: true }, orderBy: { createdAt: 'asc' } });

  async function createUser(formData: FormData) {
    'use server';
    const roleKey = String(formData.get('role'));
    const role = await db.role.findUnique({ where: { key: roleKey as any } });
    if (!role) return;
    await db.user.create({ data: { name: String(formData.get('name')), email: String(formData.get('email')), passwordHash: await bcrypt.hash(String(formData.get('password')), 12), roleId: role.id } });
  }

  return <div className="space-y-6"><Card><CardContent><form action={createUser} className="grid gap-4 md:grid-cols-2"><input name="name" placeholder="Name" className="h-12 rounded-2xl border border-white/12 bg-white/4 px-4 text-sm text-white" /><input name="email" placeholder="Email" className="h-12 rounded-2xl border border-white/12 bg-white/4 px-4 text-sm text-white" /><input name="password" type="password" placeholder="Password" className="h-12 rounded-2xl border border-white/12 bg-white/4 px-4 text-sm text-white" /><select name="role" className="h-12 rounded-2xl border border-white/12 bg-[#111117] px-4 text-sm text-white">{['SUPER_ADMIN','ADMIN','SALES','VIEWER'].map((item) => <option key={item}>{item}</option>)}</select><div className="md:col-span-2"><Button type="submit">Create user</Button></div></form></CardContent></Card><Card><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-left text-white/50"><th className="pb-3">Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-white/8"><td className="py-3">{user.name}</td><td>{user.email}</td><td>{user.role.key}</td></tr>)}</tbody></table></div></CardContent></Card></div>;
}
