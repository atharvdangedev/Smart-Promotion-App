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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleApiError } from "../utils/handleApiError";
import toast, { Toaster } from "react-hot-toast";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions.js";
import { APP_PERMISSIONS } from "../utils/permissions.js";
import Can from "../Can/Can.jsx";

const CouponCodeManagement = () => {
  // Navigation function
  const navigate = useNavigate();

  const { can, canAny } = usePermissions();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Handle edit page navigation
  const handleEdit = useCallback(
    (couponName, couponId) => {
      if (!can(APP_PERMISSIONS.COUPONS_EDIT)) {
        toast.error("You do not have permission to edit coupons.");
        return;
      }
      navigate(`/coupon-codes/edit-coupon/${couponId}`, {
        state: { couponName },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((couponName, id) => {
    if (!can(APP_PERMISSIONS.COUPONS_DELETE)) {
      toast.error("You do not have permission to delete coupons.");
      return;
    }
    setCouponToDelete({ couponName, id });
    setIsDeleteModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (couponToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/${user.rolename}/coupons/${couponToDelete.id}`,
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
            prevData.filter((coupon) => coupon.id !== couponToDelete.id)
          );
        }
      } catch (error) {
        handleApiError(error, "deleting", "coupon");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setCouponToDelete(null);
      }
    }
  };

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);
  const canSeeActionsColumn = canAny([
    APP_PERMISSIONS.COUPONS_EDIT,
    APP_PERMISSIONS.COUPONS_DELETE,
  ]);

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
        Header: "Plan",
        accessor: (row) => `${row.plan_title} ${row.plan_type}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
              <span>
                <strong>Plan:</strong> {row.original.title}
              </span>
              <span>
                <strong>Plan Type:</strong> {row.original.plan_type}
              </span>
            </div>
          </div>
        ),
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
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <button
            className={`btn btn-sm ${
              value === "1" ? "btn-success" : "btn-danger"
            }`}
            style={{
              backgroundColor: value === "1" ? "#28a745" : "#dc3545",
              borderColor: value === "1" ? "#28a745" : "#dc3545",
              color: "#fff",
              width: "90px",
              height: "35px",
            }}
          >
            {value === "1" ? "Active" : "Inactive"}
          </button>
        ),
      },
      {
        Header: "Plan Validity",
        accessor: (row) => `${row.valid_from} ${row.valid_till}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
              from <span>{row.original.valid_from}</span> to
              <span>{row.original.valid_till}</span>
            </div>
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
            <Can do={APP_PERMISSIONS.COUPONS_EDIT}>
              <button
                type="button"
                onClick={() =>
                  handleEdit(row.original.coupon_code, row.original.id)
                }
                className="btn text-info px-2 me-1"
              >
                <i className="bi bi-pencil"></i>
              </button>
            </Can>
            <Can do={APP_PERMISSIONS.COUPONS_DELETE}>
              <button
                type="button"
                onClick={() =>
                  handleDelete(row.original.coupon_code, row.original.id)
                }
                className="btn text-danger px-2"
              >
                <i className="fa fa-trash"></i>
              </button>
            </Can>
          </div>
        ),
      });
    return baseColumns;
  }, [canSeeActionsColumn, handleDelete, handleEdit]);

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
                <strong>Coupon Codes</strong>
              </h4>
              <div className="d-flex justify-content-between gap-2">
                <Can do={APP_PERMISSIONS.COUPONS_CREATE}>
                  <Link
                    className="btn btn-primary"
                    to="/coupon-codes/add-coupon"
                  >
                    Add New Coupon
                  </Link>
                </Can>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Coupon Codes"
                  fields={[
                    "coupon_code",
                    "plan_title",
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

            {couponToDelete && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete coupon ${couponToDelete.couponName}?`}
                isLoading={isDeleting}
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
