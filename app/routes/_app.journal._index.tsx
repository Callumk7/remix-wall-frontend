import { auth } from "@/features/auth/helper";
import { DiscIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Cell, Column, Row, Separator, Table, TableBody, TableHeader } from "react-aria-components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  return json({ session });
};


export default function JournalIndex() {
  return (
    <Table className={"p-1 border rounded-md outline-none self-start w-full"}>
      <TableHeader>
        <Column>
          <DiscIcon />
        </Column>
        <Column isRowHeader>Post Title</Column>
        <Column>Likes</Column>
        <Column>Posted</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>
            <DiscIcon />
          </Cell>
          <Cell>The best post ever</Cell>
          <Cell>232</Cell>
          <Cell>23/11/2023</Cell>
        </Row>
      </TableBody>
    </Table>
  )
}
