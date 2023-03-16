import * as React from "react";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOrders } from "../utils/API";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

const Orders = () => {
  const [token] = useOutletContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getUserOrders() {
        const results = await getOrders(token);
        setOrders(results);
    }
    getUserOrders();
  }, [token]);

  return (
    <>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((data) => {
            return (
              <TableRow key={data.id}>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.status}</TableCell>
                <TableCell align="right">{`$${data.total}`}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default Orders;