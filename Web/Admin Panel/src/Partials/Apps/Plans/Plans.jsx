/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import ExportButtons from "../ExportButtons/ExportButtons";
import axios from "axios";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import ResponsivePagination from "../ResponsivePagination/ResponsivePagination";
import { handleApiError } from "../utils/handleApiError";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../StatusModal/Modal";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions";
import Can from "../Can/Can";
import { APP_PERMISSIONS } from "../utils/permissions";

const Plans = () => {
  // Navigate function
  const navigate = useNavigate();

  const { can, canAny } = usePermissions();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  //fetch plans
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/${user.rolename}/plans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setData(response.data.plans);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "plans");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, user.rolename]);

  // Handle edit page navigation
  const handleEdit = useCallback(
    async (id) => {
      if (!can(APP_PERMISSIONS.PLANS_EDIT)) {
        toast.error("You do not have permission to edit plan.");
        return;
      }
      navigate(`/admin/plans/edit-plan/${id}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((title, id) => {
    if (!can(APP_PERMISSIONS.PLANS_DELETE)) {
      toast.error("You do not have permission to delete plan.");
      return;
    }
    setPlanToDelete({ title, id });
    setIsDeleteModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (planToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/${user.rolename}/plans/${planToDelete.id}`,
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
            prevData.filter((plan) => plan.id !== planToDelete.id)
          );
        }
      } catch (error) {
        handleApiError(error, "deleting", "plans");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
      }
    }
  };

  // Handle status click callback
  const handleStatusClick = useCallback((record) => {
    if (!can(APP_PERMISSIONS.PLANS_CHANGE_STATUS)) {
      toast.error("You do not have permission to change plan status.");
      return;
    }
    setRecordToUpdate(record);
    setIsStatusModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle status change functionality
  const handleConfirmStatus = async (id) => {
    try {
      const response = await axios.put(
        `${APP_URL}/${user.rolename}/update-plan-status/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setData((prevData) =>
          prevData.map((plan) =>
            plan.id === id
              ? { ...plan, status: plan.status === "1" ? "0" : "1" }
              : plan
          )
        );
        setIsStatusModalOpen(false);
      }
    } catch (error) {
      handleApiError(error, "updating", "plan status");
    }
  };

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);

  const canSeeActionsColumn = canAny([
    APP_PERMISSIONS.PLANS_EDIT,
    APP_PERMISSIONS.PLANS_DELETE,
  ]);

  // Table configuration
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "SR NO",
        accessor: "serialNumber",
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        Header: "NAME",
        accessor: "title",
      },
      {
        Header: "TYPE",
        accessor: "plan_type",
      },
      {
        Header: "VALIDITY",
        accessor: "validity",
        Cell: ({ row }) => {
          return <div>{row.original.validity} days</div>;
        },
      },
      {
        Header: "PRICE",
        accessor: "price",
        Cell: ({ row }) => {
          return (
            <div>
              {Number(row.original.price).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </div>
          );
        },
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value, row }) => (
          <button
            onClick={() => handleStatusClick(row.original)}
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
    ];

    if (canSeeActionsColumn)
      baseColumns.push({
        Header: "ACTIONS",
        accessor: "activated",
        Cell: ({ row }) => (
          <div>
            <Can do={APP_PERMISSIONS.PLANS_EDIT}>
              <button
                type="button"
                onClick={() => handleEdit(row.original.id)}
                className="btn text-info px-2 me-1"
              >
                <i className="bi bi-pencil"></i>
              </button>
            </Can>
            <Can do={APP_PERMISSIONS.PLANS_DELETE}>
              <button
                type="button"
                onClick={() =>
                  handleDelete(row.original.title, row.original.id)
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
  }, [canSeeActionsColumn, handleDelete, handleEdit, handleStatusClick]);

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
                <strong>Plans</strong>
              </h4>
              <Can do={APP_PERMISSIONS.PLANS_CREATE}>
                <Link className="btn btn-primary" to="/admin/plans/add-plan">
                  Add New Plan
                </Link>
              </Can>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Plans"
                  fields={["title", "plan_type", "validity", "price", "status"]}
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

            {recordToUpdate && (
              <Modal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onConfirm={() => handleConfirmStatus(recordToUpdate.id)}
                message={`Are you sure you want to ${
                  recordToUpdate?.status === "1" ? "deactivate" : "activate"
                } plan ${recordToUpdate.title}?`}
                status={recordToUpdate?.status}
              />
            )}

            {planToDelete && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete plan ${planToDelete.title}?`}
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
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      <LoadingFallback message="Loading plans..." />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No plans available.
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

export default Plans;
