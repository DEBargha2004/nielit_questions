import getTests from "@/actions/get-tests";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function Page({ params: { db } }) {
  try {
    const [columns, testDetails] = await getTests(db);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index}>{col.replace(/_/g, " ")}</TableHead>
            ))}
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testDetails.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col, index) => (
                <TableCell key={index}>{row[col]}</TableCell>
              ))}
              <TableCell>
                <Link href={`/${db}/${row[columns[0]]}`}>
                  <Button>View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  } catch (error) {
    console.log(error);
    return <p>Counld not fetch test details</p>;
  }
}
