/* eslint-disable react/prop-types */
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import ResponsivePagination from "../ResponsivePagination/ResponsivePagination";
import ExportButtons from "../ExportButtons/ExportButtons";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import { handleApiError } from "../utils/handleApiError";
import axios from "axios";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions.js";
import { APP_PERMISSIONS } from "../utils/permissions.js";
import Can from "../Can/Can.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import formatCurrency from "../utils/formatCurrency.js";

const Commissions = () => {
  const { can } = usePermissions();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  const payoutSchema = yup.object().shape({
    transaction_id: yup.string().required("Transaction ID is required"),
    note: yup.string().required("Reference note is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(payoutSchema),
    mode: "onChange",
  });

  //fetch commissions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/commission`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setData(response.data.commission);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "commissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, user.rolename, refetch]);

  // Handle payout click callback
  const handlePayoutClick = useCallback((record) => {
    setRecordToUpdate(record);
    setIsModalOpen(true);
  }, []);

  // Handle payout complete functionality
  const onSubmit = async (data) => {
    try {
      const payload = {
        id: recordToUpdate.id,
        transaction_id: data.transaction_id,
        note: data.note,
      };

      setIsUpdating(true);
      const response = await axios.post(
        `${APP_URL}/${user.rolename}/pay-commission`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (err) {
      handleApiError(err, "paying", "commission");
    } finally {
      setIsUpdating(false);
      reset();
      setRefetch((prev) => !prev);
      setIsModalOpen(false);
      clearErrors(["transaction_id", "note"]);
    }
  };

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);
  const canSeeActionsColumn = can(APP_PERMISSIONS.COMMISSIONS_PAY);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "SR. NO.",
        id: "serialNumber",
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        Header: "Coupon",
        accessor: "coupon_code",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
              <span
                style={{
                  color: "blue",
                  fontWeight: "bold",
                }}
              >
                {row.original.coupon_code}
              </span>
            </div>
          </div>
        ),
      },
      {
        Header: "Plan",
        accessor: (row) => `${row.plan_title} ${row.plan_type}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex gap-2">
              <strong>{row.original.plan_title}</strong>{" "}
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
              {row.original.first_name
                ? `${row.original.first_name} ${row.original.last_name}`
                : "No Vendor"}
            </div>
          </div>
        ),
      },
      {
        Header: "Business",
        accessor: "business_name",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
              {row.original.business_name
                ? `${row.original.business_name}`
                : "No Business Name Available"}
            </div>
          </div>
        ),
      },
      {
        Header: "Commission",
        accessor: "commission",
        Cell: ({ row }) => {
          return (
            <div
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(row.original.commission)}
            </div>
          );
        },
      },
      {
        Header: "Payout Balance",
        accessor: "payout_balance",
        Cell: ({ row }) => {
          return (
            <div
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(row.original.payout_balance)}
            </div>
          );
        },
      },
      {
        Header: "Payout Status",
        accessor: "payout_status",
        Cell: ({ row }) => (
          <div
            className="d-flex flex-wrap gap-2"
            style={{
              textTransform: "capitalize",
            }}
          >
            <span
              className={`badge ${
                row.original.payout_status === "paid"
                  ? "bg-success"
                  : row.original.payout_status === "pending"
                  ? "bg-warning"
                  : "bg-danger"
              }`}
            >
              {row.original.payout_status ? row.original.payout_status : "N/A"}
            </span>
          </div>
        ),
      },
    ];

    if (canSeeActionsColumn)
      baseColumns.push({
        Header: "Actions",
        accessor: "action",
        Cell: ({ row }) => (
          <div>
            {row.original.payout_balance > 0 && (
              <Can do={APP_PERMISSIONS.COMMISSIONS_PAY}>
                <button
                  className="btn btn-success px-2 me-1"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Payout"
                  disabled={row.original.payout_status === "paid"}
                  onClick={() => handlePayoutClick(row.original)}
                >
                  Pay
                </button>
              </Can>
            )}
          </div>
        ),
      });
    return baseColumns;
  }, [canSeeActionsColumn, handlePayoutClick]);

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

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    clearErrors(["transaction_id", "note"]);
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="col-lg-12 col-md-12">
        <div className="card mb-3 p-3">
          <div className="table-responsive">
            <div className="mb-3 d-flex justify-content-between">
              <h4 className="title-font">
                <strong>Commissions</strong>
              </h4>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Commissions"
                  fields={[
                    "plan_title",
                    "plan_type",
                    "first_name",
                    "last_name",
                    "business_name",
                    "commission",
                    "payout_balance",
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
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      <LoadingFallback message="Loading commissions..." />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No commissions available.
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

          {isModalOpen && (
            <>
              <div className="modal-backdrop show"></div>

              <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div
                  className="modal-dialog modal-dialog-centered modal-lg"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header border-bottom-0">
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleClose}
                        aria-label="Close"
                      />
                    </div>

                    <div className="modal-body pt-0">
                      <h5 className="mb-3">
                        Confirm Payout for coupon code{" "}
                        <strong>{recordToUpdate?.coupon_code}</strong> of{" "}
                        <strong>
                          {recordToUpdate?.plan_title} (
                          {recordToUpdate?.plan_type})
                        </strong>{" "}
                        from affiliate{" "}
                        <strong>
                          {recordToUpdate?.first_name}{" "}
                          {recordToUpdate?.last_name}{" "}
                        </strong>
                      </h5>
                      <p>Please fill up the following extra information</p>
                      <p
                        style={{
                          fontSize: 12,
                        }}
                      >
                        If payment is done by cash, please enter Transaction Id
                        as N/A, and write amount paid in note
                      </p>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Transaction Id */}
                        <div className="mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.transaction_id ? "is-invalid" : ""
                              }`}
                              {...register("transaction_id")}
                              placeholder="Enter Transaction Id"
                            />
                            <label className="form-label">Transaction Id</label>
                            {errors.transaction_id && (
                              <div className="invalid-feedback">
                                {errors.transaction_id.message}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reference note */}
                        <div className="mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.note ? "is-invalid" : ""
                              }`}
                              {...register("note")}
                              placeholder="Enter reference note"
                            />
                            <label className="form-label">Reference Note</label>
                            {errors.note && (
                              <div className="invalid-feedback">
                                {errors.note.message}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          className="me-1 btn btn-primary"
                          type="submit"
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Processing..." : "Confirm Payout"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

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

export default Commissions;
