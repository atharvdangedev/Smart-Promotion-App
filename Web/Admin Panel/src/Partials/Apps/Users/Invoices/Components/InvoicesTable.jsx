/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../../../../Common/DataTable/DataTable";
import StatusBadge from "../../../StatusBadge/StatusBadge";

const paymentStatus = {
  Failed: "#dc3545",
  Processing: "#0d6efd",
  Completed: "#198754",
  Cancelled: "#ffc107",
};

const InvoicesTable = ({ invoiceData, isLoading }) => {
  const navigate = useNavigate();

  const handleInvoice = (id) => {
    navigate(`/admin/app/invoice`, { state: { invoiceId: id } });
  };

  const columns = [
    {
      Header: "#",
      accessor: "no",
      Cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      Header: "Order Id",
      accessor: "razorpay_order_id",
    },
    {
      Header: "Transaction Id",
      accessor: "transaction_id",
    },
    {
      Header: "Plan Name",
      accessor: "plan_name",
    },
    {
      Header: "Vendor",
      accessor: (row) => `${row.vendor_firstname} ${row.vendor_lastname}`,
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="d-flex flex-column">
            {row.original.vendor_firstname
              ? `${row.original.vendor_firstname} ${row.original.vendor_lastname}`
              : "No Vendor"}
          </div>
        </div>
      ),
    },
    {
      Header: "Transaction Details",
      accessor: "order_date",
      filter: "dateRange",
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="d-flex flex-column">
            <span>{row.original.order_date}</span>
            <span>{row.original.note ? "By Admin" : "By Customer"}</span>
            <span>
              {Number(row.original.total_amount).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
        </div>
      ),
    },
    {
      Header: "Payment Status",
      accessor: "payment_status",
      Cell: ({ row }) => (
        <StatusBadge
          status={
            row.original.payment_status
              ? row.original.payment_status
              : "NoStatus"
          }
          badgeStatuses={paymentStatus}
        />
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => {
        return (
          <div>
            <Link
              to={`/admin/app/orders/${row.original.id}`}
              className="btn text-info px-2 me-1"
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Details"
            >
              <i className="bi bi-eye"></i>
            </Link>
            {row.original.order_status === "Delivered" && (
              <button
                onClick={() => handleInvoice(row.original.id)}
                className="btn text-info px-2 me-1"
                data-toggle="tooltip"
                data-placement="bottom"
                title="View Invoice"
              >
                <i className="bi bi-download"></i>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable columns={columns} data={invoiceData} isLoading={isLoading} />
  );
};

export default InvoicesTable;
