/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../../../../Common/DataTable/DataTable";
import StatusBadge from "../../../StatusBadge/StatusBadge";

const orderStatuses = {
  Failed: "#dc3545",
  Initiated: "#6c757d",
  Processing: "#0d6efd",
  Placed: "#20c997",
  Printing: "#6610f2",
  Setup: "#fd7e14",
  Shipping: "#0dcaf0",
  Delivered: "#198754",
  Pending: "#ffc107",
};

const paymentStatus = {
  Failed: "#dc3545",
  Processing: "#0d6efd",
  Completed: "#198754",
  Cancelled: "#ffc107",
};

const InvoicesTable = ({ invoiceData, isLoading }) => {
  const navigate = useNavigate();

  const handleInvoice = (id) => {
    navigate(`/vendor/app/invoice`, { state: { invoiceId: id } });
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
      Header: "Category Name",
      accessor: "category_name",
    },
    {
      Header: "Client",
      accessor: (row) => `${row.name} ${row.email}`,
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="d-flex flex-column">
            <span>{row.original.name}</span>
            <span>{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      Header: "Order Date",
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
      Header: "Order Status",
      accessor: "order_status",
      Cell: ({ row }) => (
        <StatusBadge
          status={
            row.original.order_status ? row.original.order_status : "NoStatus"
          }
          badgeStatuses={orderStatuses}
        />
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
              to={`/vendor/app/orders/${row.original.id}`}
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
