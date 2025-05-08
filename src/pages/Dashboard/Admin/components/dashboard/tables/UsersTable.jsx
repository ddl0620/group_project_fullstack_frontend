import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function UsersTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.status}</TableCell>
            <TableCell>{user.joinedDate}</TableCell>
            <TableCell>
              <button className="text-sm text-blue-500 hover:underline">View</button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
