/* eslint-disable react/prop-types */
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useEffect, useMemo, useState, useCallback } from "react";
import ResponsivePagination from "../ResponsivePagination/ResponsivePagination";
import ExportButtons from "../ExportButtons/ExportButtons";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import axios from "axios";
import { handleApiError } from "../utils/handleApiError";
import { formatDate } from "../utils/formatDate";
import { useSelector } from "react-redux";
import { APP_PERMISSIONS } from "../utils/permissions";
import usePermissions from "../../../hooks/usePermissions";
import { createOrderApi, verifyPaymentApi } from "../utils/paymentApis";
import PaymentComponent from "../utils/PaymentComponent";
import PlansModal from "./PlansModal";
import CheckoutModal from "./CheckoutModal";
import formatCurrency from "../utils/formatCurrency.js";
import { Validity } from "../utils/Validity.jsx";

const Subscriptions = () => {
  // Access token
  const { token, user } = useSelector((state) => state.auth);

  const { can } = usePermissions();

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  //fetch subscriptions
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setData(response.data.subscriptions);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, user.rolename, refetch]);

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);

  const handlePurchase = useCallback((plan) => {
    setSelectedPlan(plan);
    setShowPlansModal(false);
    setShowCheckoutModal(true);
  }, []);

  const handleRenew = useCallback(() => {
    setShowPlansModal(true);
  }, []);

  const handleProceedToPayment = async (finalPrice, coupon) => {
    setProcessingPayment(true);
    try {
      const order = await createOrderApi(
        APP_URL,
        token,
        selectedPlan.id,
        coupon
      );
      const payment = new PaymentComponent({
        amount: finalPrice,
        orderId: order.razorpay_order_id,
        customerInfo: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.contact_no,
        },
        metadata: {
          companyName: "Smartscripts Private Limited",
          description: `Purchase of subscription for ${selectedPlan.validity} days`,
          themeColor: "#1C6EA5",
        },
        onSuccess: async (paymentResult) => {
          try {
            await verifyPaymentApi(APP_URL, token, {
              razorpay_order_id: paymentResult.orderId,
              razorpay_payment_id: paymentResult.paymentId,
              razorpay_signature: paymentResult.signature,
            });
            setShowCheckoutModal(false);
            setRefetch((prev) => !prev);
          } catch (error) {
            handleApiError(error, "verifying", "payment");
          }
        },
        onError: (error) => handleApiError(error, "processing", "payment"),
      });
      await payment.initializePayment();
    } catch (error) {
      handleApiError(error, "creating", "order");
    } finally {
      setProcessingPayment(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "SR. NO.",
        id: "serialNumber",
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        Header: "Plan",
        accessor: (row) => `${row.plan_name} ${row.plan_type}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex gap-2">
              <strong>{row.original.plan_name}</strong>{" "}
              <span>({row.original.plan_type})</span>
            </div>
          </div>
        ),
      },
      {
        Header: "Plan Validity",
        accessor: (row) => `${row.start_date} ${row.end_date}`,
        Cell: ({ row }) => (
          <Validity
            from={row.original.start_date}
            till={row.original.end_date}
          />
        ),
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ row }) => {
          return (
            <div
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(row.original.price)}
            </div>
          );
        },
      },
      {
        Header: "Paid Amount",
        accessor: "paid_amount",
        Cell: ({ row }) => {
          return (
            <div
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(row.original.paid_amount)}
            </div>
          );
        },
      },
      {
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) =>
          new Date(row.original.end_date) < new Date() ? (
            <button
              onClick={handleRenew}
              type="button"
              className="btn text-info px-2 me-1"
            >
              Renew
            </button>
          ) : (
            <span
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              Active
            </span>
          ),
      },
    ],
    [handleRenew]
  );

  // Use the useTable hook to build the table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    setPageSize: setTablePageSize,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Handle search function
  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value || undefined);
  };

  // Handle page size change function
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setTablePageSize(newPageSize);
  };

  return (
    <div className="px-4 py-3 page-body">
      <div className="col-lg-12 col-md-12">
        <div className="card mb-3 p-3">
          <div className="table-responsive">
            <div className="mb-3 d-flex justify-content-between">
              <h4 className="title-font">
                <strong>Subscriptions</strong>
              </h4>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowPlansModal(true);
                }}
              >
                Add New Sub
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Subscriptions"
                  fields={[
                    "plan_name",
                    "plan_type",
                    "business_name",
                    "first_name",
                    "last_name",
                    "start_date",
                    "end_date",
                    "price",
                  ]}
                />
              )}

              <div className="d-flex align-items-center">
                <div className="me-2">
                  <input
                    value={globalFilter || ""}
                    onChange={handleGlobalFilterChange}
                    className="form-control"
                    placeholder="Search..."
                  />
                </div>
                <div className="d-flex align-items-center">
                  Show
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="form-select mx-2"
                    style={{ width: "auto" }}
                  >
                    {[10, 20, 30, 40, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  entries
                </div>
              </div>
            </div>

            <table
              {...getTableProps()}
              className="myDataTable table table-hover align-middle mb-0"
              style={{ width: "100%" }}
            >
              <thead style={{ verticalAlign: "top" }}>
                {headerGroups.map((headerGroup) => {
                  const { key, ...restHeaderGroupProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...restHeaderGroupProps}>
                      {headerGroup.headers.map((column) => {
                        const { key, ...restHeaderProps } =
                          column.getHeaderProps(column.getSortByToggleProps());
                        return (
                          <th key={key} {...restHeaderProps}>
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      <LoadingFallback message="Loading subscriptions..." />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No subscriptions available.
                    </td>
                  </tr>
                ) : page.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No results match your search.
                    </td>
                  </tr>
                ) : (
                  page.map((row) => {
                    prepareRow(row);
                    const { key, ...restRowProps } = row.getRowProps();
                    return (
                      <tr key={key} {...restRowProps}>
                        {row.cells.map((cell) => {
                          const { key, ...restCellProps } = cell.getCellProps();
                          return (
                            <td key={key} {...restCellProps}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <PlansModal
            show={showPlansModal}
            onClose={() => setShowPlansModal(false)}
            onPurchase={handlePurchase}
          />

          <CheckoutModal
            show={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            plan={selectedPlan}
            onProceedToPayment={handleProceedToPayment}
            processingPayment={processingPayment}
          />

          {data.length > 0 && (
            <ResponsivePagination
              pageIndex={pageIndex}
              pageOptions={pageOptions}
              gotoPage={gotoPage}
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              previousPage={previousPage}
              nextPage={nextPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
