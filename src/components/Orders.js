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
        console.log(results)
    }
    getUserOrders();
  }, [token]);

  return (
    <>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Order</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((data) => {
            if( !data ) {
              return (
                <TableRow>
                  <TableCell align="center">No Recent Orders</TableCell>
                </TableRow>
              )
            } else {
              return (
                <TableRow key={data.id}>
                  <TableCell align="left">{data.date}</TableCell>
                  {data.items.map((item, index) => {
                    return(
                      <TableCell key={index}> {item.name} </TableCell>
                    )
                  })}
                  <TableCell align="left">{data.status}</TableCell>
                  <TableCell align="right">{`$${data.total}`}</TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default Orders;