/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import DataTable from "./DataTable";

// eslint-disable-next-line react/prop-types
const WalletTable = ({ paymentsData, isLoading }) => {
  const columns = [
    {
      Header: "SR. NO.",
      id: "serialNumber",
      Cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      Header: "Customer Name",
      accessor: "name",
    },
    {
      Header: "Order Id",
      accessor: "razorpay_order_id",
    },
    {
      Header: "Payment Date",
      accessor: "addedon",
      filter: "dateRange",
    },
    {
      Header: "Transaction Id",
      accessor: "transaction_id",
      Cell: ({ row }) => {
        return <div>{row.original.transaction_id || "Vendor Approved"}</div>;
      },
    },
    {
      Header: "Transaction Status",
      accessor: "payment_status",
      Cell: ({ row }) => {
        return (
          <div
            className={`btn btn-sm text-white ${
              row.original.payment_status === "Success"
                ? "bg-success"
                : row.original.payment_status === "Pending"
                  ? "bg-warning"
                  : "bg-danger"
            }`}
          >
            {row.original.payment_status}
          </div>
        );
      },
    },
    {
      Header: "Order Total",
      accessor: "order_total",
      Cell: ({ row }) => {
        return (
          <div>
            {Number(row.original.order_total).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable columns={columns} data={paymentsData} isLoading={isLoading} />
  );
};

export default WalletTable;
