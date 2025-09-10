/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../../Common/DataTable/DataTable";
import StatusBadge from "../../../StatusBadge/StatusBadge";
import { formatDate } from "../../../utils/formatDate";
import formatCurrency from "../../../utils/formatCurrency";

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
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="d-flex flex-column">
            {row.original.razorpay_order_id
              ? row.original.razorpay_order_id
              : "N/A"}
          </div>
        </div>
      ),
    },
    {
      Header: "Transaction Id",
      accessor: "transaction_id",
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="d-flex flex-column">
            {row.original.transaction_id ? row.original.transaction_id : "N/A"}
          </div>
        </div>
      ),
    },
    {
      Header: "Plan",
      accessor: (row) => `${row.title} ${row.plan_type}`,
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="d-flex gap-2">
            <strong>{row.original.title}</strong>{" "}
            <span>({row.original.plan_type})</span>
          </div>
        </div>
      ),
    },
    {
      Header: "Vendor",
      accessor: (row) => `${row.first_name} ${row.last_name}`,
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="d-flex flex-column">
            {row.original.first_name} {row.original.last_name}
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
            <span>{formatDate(row.original.payment_date)}</span>
            <span
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(row.original.amount)}
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
            {/* <Link
              to={`/admin/app/orders/${row.original.order_id}`}
              className="btn text-info px-2 me-1"
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Details"
            >
              <i className="bi bi-eye"></i>
            </Link> */}
            {row.original.payment_status === "Completed" && (
              <button
                onClick={() => handleInvoice(row.original.order_id)}
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
