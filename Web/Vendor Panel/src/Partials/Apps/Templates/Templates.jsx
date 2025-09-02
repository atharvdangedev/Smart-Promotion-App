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
import { Link, useNavigate } from "react-router-dom";
import Modal from "../StatusModal/Modal";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions.js";
import { APP_PERMISSIONS } from "../utils/permissions.js";
import Can from "../Can/Can.jsx";
import { setPageTitle } from "../utils/docTitle.js";
import PrimaryModal from "../PrimaryModal/PrimaryModal.jsx";

const Templates = () => {
  const { can, canAny } = usePermissions();

  const navigate = useNavigate();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  setPageTitle("Templates | Vendor Panel");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrimaryModalOpen, setIsPrimaryModalOpen] = useState(false);
  const [templateToUpdatePrimary, setTemplateToUpdatePrimary] = useState(null);
  const [isUpdatingPrimary, setIsUpdatingPrimary] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //fetch templates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/templates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setData(response.data.templates);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "templates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, user.rolename]);

  // Handle edit page navigation
  const handleEdit = useCallback(
    (templateName, templateId) => {
      if (!can(APP_PERMISSIONS.TEMPLATES_EDIT)) {
        toast.error("You do not have permission to edit templates.");
        return;
      }
      navigate(`/templates/edit-template/${templateId}`, {
        state: { templateName },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((templateName, id) => {
    if (!can(APP_PERMISSIONS.TEMPLATES_DELETE)) {
      toast.error("You do not have permission to delete templates.");
      return;
    }
    setTemplateToDelete({ templateName, id });
    setIsDeleteModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/${user.rolename}/templates/${templateToDelete.id}`,
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
            prevData.filter((template) => template.id !== templateToDelete.id)
          );
        }
      } catch (error) {
        handleApiError(error, "deleting", "template");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setTemplateToDelete(null);
      }
    }
  };

  // Handle status click callback
  const handleStatusClick = useCallback((record) => {
    if (!can(APP_PERMISSIONS.TEMPLATES_CHANGE_STATUS)) {
      toast.error("You do not have permission to change template status.");
      return;
    }
    setRecordToUpdate(record);
    setIsModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle status change functionality
  const handleConfirm = async (id) => {
    try {
      const response = await axios.put(
        `${APP_URL}/${user.rolename}/update-template-status/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((template) =>
            template.id === id
              ? { ...template, status: response.data.new_status.toString() }
              : template
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      handleApiError(error, "updating", "template status");
    } finally {
      setIsModalOpen(false);
      setRecordToUpdate(null);
    }
  };

  const handlePrimaryClick = useCallback((template) => {
    setTemplateToUpdatePrimary(template);
    setIsPrimaryModalOpen(true);
  }, []);

  const handleConfirmPrimary = async () => {
    if (!templateToUpdatePrimary) return;

    setIsUpdatingPrimary(true);
    try {
      const newPrimaryStatus =
        templateToUpdatePrimary.is_primary === "1" ? "0" : "1";
      const response = await axios.put(
        `${APP_URL}/${user.rolename}/update-primary/${templateToUpdatePrimary.id}`,
        { is_primary: newPrimaryStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((template) =>
            template.id === templateToUpdatePrimary.id
              ? { ...template, is_primary: newPrimaryStatus }
              : template
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      handleApiError(error, "updating", "template status");
    } finally {
      setIsUpdatingPrimary(false);
      setIsPrimaryModalOpen(false);
      setTemplateToUpdatePrimary(null);
    }
  };

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);
  const canSeeActionsColumn = canAny([
    APP_PERMISSIONS.TEMPLATES_EDIT,
    APP_PERMISSIONS.TEMPLATES_CHANGE_STATUS,
    APP_PERMISSIONS.TEMPLATES_DELETE,
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
        Header: "TEMPLATE TITLE",
        accessor: "title",
      },
      {
        Header: "TEMPLATE TYPE",
        accessor: "template_type",
      },
    ];

    if (canSeeActionsColumn)
      baseColumns.push(
        {
          Header: "STATUS",
          accessor: "status",
          Cell: ({ value, row }) => (
            <Can do={APP_PERMISSIONS.TEMPLATES_CHANGE_STATUS}>
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
            </Can>
          ),
        },
        {
          Header: "Primary",
          accessor: "is_primary",
          Cell: ({ value, row }) => (
            <Can do={APP_PERMISSIONS.TEMPLATES_CHANGE_STATUS}>
              <button
                onClick={() => handlePrimaryClick(row.original)}
                className={`btn btn-sm ${
                  value === "1" ? "btn-warning" : "btn-secondary"
                }`}
                style={{
                  backgroundColor: value === "1" ? "#4287f5" : "#f58442",
                  borderColor: value === "1" ? "#4287f5" : "#f58442",
                  color: "#fff",
                  width: "90px",
                  height: "35px",
                }}
              >
                {value === "1" ? "Primary" : "Regular"}
              </button>
            </Can>
          ),
        },
        {
          Header: "Actions",
          accessor: "action",
          Cell: ({ row }) => (
            <div>
              <Can do={APP_PERMISSIONS.TEMPLATES_EDIT}>
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(row.original.title, row.original.id)
                  }
                  className="btn text-info px-2 me-1"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </Can>
              <Can do={APP_PERMISSIONS.TEMPLATES_DELETE}>
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
        }
      );
    return baseColumns;
  }, [
    canSeeActionsColumn,
    handleDelete,
    handleEdit,
    handlePrimaryClick,
    handleStatusClick,
  ]);

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
                <strong>Templates</strong>
              </h4>
              <Can do={APP_PERMISSIONS.TEMPLATES_CREATE}>
                <Link className="btn btn-primary" to="/templates/add-template">
                  Add New Template
                </Link>
              </Can>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Templates"
                  fields={["title", "template_type", "status"]}
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

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => handleConfirm(recordToUpdate?.id)}
              message={`Are you sure you want to ${
                recordToUpdate?.status === "1" ? "deactivate" : "activate"
              } template ${recordToUpdate?.title}?`}
            />

            {templateToUpdatePrimary && (
              <PrimaryModal
                isOpen={isPrimaryModalOpen}
                onClose={() => setIsPrimaryModalOpen(false)}
                onConfirm={handleConfirmPrimary}
                message={`Are you sure you want to mark this ${
                  templateToUpdatePrimary.title
                } template as ${
                  templateToUpdatePrimary.is_primary === "1"
                    ? "regular"
                    : "primary"
                }?`}
                isLoading={isUpdatingPrimary}
              />
            )}

            {templateToDelete && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete template ${templateToDelete.templateName}?`}
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
                      <LoadingFallback message="Loading templates..." />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No Templates available.
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

export default Templates;
