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
import axios from "axios";
import { handleApiError } from "../utils/handleApiError";
import ApproveModal from "../ApproveModal/ApproveModal";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions.js";
import { APP_PERMISSIONS } from "../utils/permissions.js";
import Can from "../Can/Can.jsx";

const CouponCodeManagement = () => {
  const { can } = usePermissions();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [couponToApprove, setCouponToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //fetch coupons
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/coupons`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setData(response.data.coupons);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "coupons");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, user.rolename]);

  // Handle approve callback
  const handleApprove = useCallback((coupon_code, id) => {
    if (!can(APP_PERMISSIONS.COUPONS_APPROVE)) {
      toast.error("You do not have permission to approve coupons.");
      return;
    }
    setCouponToApprove({ coupon_code, id });
    setIsApproveModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle approve functionality
  const handleConfirmApprove = async () => {
    if (couponToApprove) {
      setIsApproving(true);
      try {
        const response = await axios.put(
          `${APP_URL}/${user.rolename}/approve-coupon/${couponToApprove.id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json;",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          setData((prevData) =>
            prevData.map((coupon) =>
              coupon.id === couponToApprove.id
                ? { ...coupon, approve: coupon.approve === "1" ? "0" : "1" }
                : coupon
            )
          );
        }
      } catch (error) {
        handleApiError(error, "approving", "coupon");
      } finally {
        setIsApproving(false);
        setIsApproveModalOpen(false);
        setCouponToApprove(null);
      }
    }
  };

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);
  const canSeeActionsColumn = can(APP_PERMISSIONS.COUPONS_APPROVE);

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
      },
      {
        Header: "Plans",
        accessor: "plans",
        Cell: ({ row }) => {
          const plans = row.original.plans || [];
          if (plans.length === 0) {
            return <span>No Plans</span>;
          }

          return (
            <div className="d-flex flex-column">
              {plans.map((plan, idx) => (
                <div key={idx} className="mb-1">
                  <strong>{plan.title}</strong> <span>({plan.plan_type})</span>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        Header: "User",
        accessor: (row) => `${row.first_name} ${row.last_name}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
              {row.original.first_name
                ? `${row.original.first_name} ${row.original.last_name}`
                : "No User"}
            </div>
          </div>
        ),
      },
      {
        Header: "Plan Validity",
        accessor: (row) => `${row.valid_from} ${row.valid_till}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex">
              from <span className="mx-1">{row.original.valid_from}</span> to
              <span className="mx-1">{row.original.valid_till}</span>
            </div>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <div
            className={`badge ${value === "1" ? "bg-success" : "bg-danger"}`}
            style={{
              backgroundColor: value === "1" ? "#28a745" : "#dc3545",
              borderColor: value === "1" ? "#28a745" : "#dc3545",
              color: "#fff",
            }}
          >
            {value === "1" ? "Active" : "Inactive"}
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
            <Can do={APP_PERMISSIONS.COUPONS_APPROVE}>
              <button
                className="btn btn-success px-2 me-1"
                data-toggle="tooltip"
                type="button"
                disabled={row.original.approve === "1"}
                onClick={() =>
                  handleApprove(row.original.coupon_code, row.original.id)
                }
                data-placement="bottom"
                title={row.original.approve === "0" ? "Approve Request" : ""}
              >
                {row.original.approve === "0" ? "Approve" : "Approved"}
              </button>
            </Can>
          </div>
        ),
      });
    return baseColumns;
  }, [canSeeActionsColumn, handleApprove]);

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
      <Toaster />
      <div className="col-lg-12 col-md-12">
        <div className="card mb-3 p-3">
          <div className="table-responsive">
            <div className="mb-3 d-flex justify-content-between">
              <h4 className="title-font">
                <strong>Coupon Codes Management</strong>
              </h4>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Coupon Codes"
                  fields={[
                    "coupon_code",
                    "title",
                    "plan_type",
                    "first_name",
                    "last_name",
                    "valid_from",
                    "valid_till",
                    "status",
                    "approve",
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

            {couponToApprove && (
              <ApproveModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleConfirmApprove}
                message={`Are you sure you want to approve coupon ${couponToApprove.coupon_code}?`}
                isLoading={isApproving}
              />
            )}

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
                      <LoadingFallback message="Loading coupon codes..." />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No coupon codes available.
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

export default CouponCodeManagement;
