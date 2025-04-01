"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@dataggo/node-akeneo-api";
import { getAllChannels, Channel, getOneProductById } from "@/lib/api/akeneo";

const Table = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table));
const TableHeader = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Header));
const TableRow = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Row));
const TableCell = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Cell));
const TableBody = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.Body));
const TableHeaderCell = dynamic(() => import("akeneo-design-system").then((mod) => mod.Table.HeaderCell));
const Checkbox = dynamic(() => import("akeneo-design-system").then((mod) => mod.Checkbox));

export default function ShopApothekeUIExtension() {
  const [isChecked, updateCheck] = useState<boolean>(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const searchParams = useSearchParams();
  const productId = searchParams.get("product[identifier]");

  useEffect(() => {
    getAllChannels().then((data) => {
      setChannels(data);
    });
    if (!!productId) {
      getOneProductById(productId).then((data) => {
        setProduct(data);
      });
    }
  }, [productId]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableHeaderCell>
            <div className="flex mx-auto">Indication</div>
          </TableHeaderCell>
          {(channels ?? []).map((channel) => (
            <TableHeaderCell key={channel.code}>
              <div className="flex justify-center">{channel.labels.en || channel.code}</div>
            </TableHeaderCell>
          ))}
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Text</TableCell>
            {(channels ?? []).map((channel) => (
              <TableCell key={channel.code}>
                <div className="flex mx-auto">
                  <Checkbox
                    checked={isChecked}
                    onChange={function noRefCheck() {
                      updateCheck(!isChecked);
                    }}
                  ></Checkbox>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
