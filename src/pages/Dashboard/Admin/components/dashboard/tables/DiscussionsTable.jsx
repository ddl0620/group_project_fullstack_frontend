import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DiscussionsTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Replies</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((discussion) => (
          <TableRow key={discussion.id}>
            <TableCell className="font-medium">{discussion.title}</TableCell>
            <TableCell>{discussion.author}</TableCell>
            <TableCell>{discussion.replies}</TableCell>
            <TableCell>{discussion.createdAt}</TableCell>
            <TableCell>
              <button className="text-sm text-blue-500 hover:underline">View</button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
