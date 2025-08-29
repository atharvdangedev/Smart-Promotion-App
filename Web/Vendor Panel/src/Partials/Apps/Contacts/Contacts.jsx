/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
  useRowSelect,
} from "react-table";
import ExportButtons from "../ExportButtons/ExportButtons";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import ResponsivePagination from "../ResponsivePagination/ResponsivePagination";
import { handleApiError } from "../utils/handleApiError";
import axios from "axios";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions";
import { APP_PERMISSIONS } from "../utils/permissions";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setPageTitle } from "../utils/docTitle";
import Can from "../Can/Can";
import ImportContactsModal from "./ImportContactsModal";
import DeleteModal from "../DeleteModal/DeleteModal";

const Contacts = () => {
  // Navigate function
  const navigate = useNavigate();

  const { can, canAny } = usePermissions();

  setPageTitle("Contacts | Vendor Panel");

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [data, setData] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);

  const useServerPagination = true;

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);

  const canSeeActionsColumn = canAny([
    APP_PERMISSIONS.CONTACTS_EDIT,
    APP_PERMISSIONS.CONTACTS_DELETE,
  ]);

  // Handle edit page navigation
  const handleEdit = useCallback(
    async (firstname, id) => {
      if (!can(APP_PERMISSIONS.CONTACTS_EDIT)) {
        toast.error("You do not have permission to edit contacts.");
        return;
      }
      navigate(`/contacts/edit-contact/${id}`, {
        state: { firstname },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((contact_name, id) => {
    if (!can(APP_PERMISSIONS.CONTACTS_DELETE)) {
      toast.error("You do not have permission to delete contacts.");
      return;
    }
    setContactToDelete({ contact_name, id });
    setIsDeleteModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/${user.rolename}/contacts/${contactToDelete.id}`,
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
            prevData.filter((contact) => contact.id !== contactToDelete.id)
          );
        }
      } catch (error) {
        handleApiError(error, "deleting", "contact");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setContactToDelete(null);
      }
    }
  };

  // Table configuration
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "CONTACT NAME",
        accessor: "contact_name",
      },
      {
        Header: "CONTACT NO",
        accessor: "contact_number",
      },
      {
        Header: "CONTACT EMAIL",
        accessor: "email",
      },
      {
        Header: "CONTACT BIRTHDATE",
        accessor: "birthdate",
      },
    ];
    if (canSeeActionsColumn)
      baseColumns.push({
        Header: "ACTIONS",
        accessor: "activated",
        Cell: ({ row }) => (
          <div>
            <Can do={APP_PERMISSIONS.CONTACTS_EDIT}>
              <button
                type="button"
                onClick={() =>
                  handleEdit(row.original.contact_name, row.original.id)
                }
                className="btn text-info px-2 me-1"
              >
                <i className="bi bi-pencil"></i>
              </button>
            </Can>
            <Can do={APP_PERMISSIONS.CONTACTS_DELETE}>
              <button
                type="button"
                onClick={() =>
                  handleDelete(row.original.contact_name, row.original.id)
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
    selectedFlatRows,
    setPageSize: setTablePageSize,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize },
      manualPagination: useServerPagination,
      autoResetPage: false,
      pageCount:
        useServerPagination && totalRecords !== null
          ? Math.ceil(totalRecords / pageSize)
          : -1,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    if (!useServerPagination) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/contact/vendor`,
          {
            params: { page: pageIndex + 1, limit: pageSize },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setData(response.data.vendor_contacts);
          setTotalRecords(response.data.pagination.total);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    APP_URL,
    pageIndex,
    pageSize,
    token,
    useServerPagination,
    user.rolename,
    refetch,
  ]);

  const handleBulkDelete = async () => {
    const ids = selectedFlatRows.map((row) => row.original.id);

    if (ids.length === 0) {
      toast.error("Please select at least one contact to delete.");
      return;
    }

    try {
      setIsDeleting(true);

      const response = await axios.delete(
        `${APP_URL}/${user.rolename}/contacts/delete-multiple-contacts`,
        {
          data: { ids },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          response.data.message || "Contacts deleted successfully."
        );
        setData((prev) => prev.filter((c) => !ids.includes(c.id)));
      }
    } catch (error) {
      handleApiError(error, "deleting", "contacts");
    } finally {
      setIsBulkDeleteOpen(false);
      setIsDeleting(false);
    }
  };

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

  const handleImportContacts = () => {
    setShowModal(false);
    setRefetch((prev) => !prev);
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="col-lg-12 col-md-12">
        <div className="card mb-3 p-3">
          <div className="table-responsive">
            <div className="mb-3 d-flex justify-content-between">
              <h4 className="title-font">
                <strong>Contacts</strong>
              </h4>
              <div>
                <Can do={APP_PERMISSIONS.CONTACTS_IMPORT}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Import Contacts
                  </button>
                </Can>
                <Can do={APP_PERMISSIONS.CONTACTS_DELETE}>
                  {selectedFlatRows.length > 0 && (
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => setIsBulkDeleteOpen(true)}
                      disabled={isDeleting}
                    >
                      {isDeleting
                        ? "Deleting..."
                        : `Delete Selected (${selectedFlatRows.length})`}
                    </button>
                  )}
                </Can>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Contacts"
                  fields={[
                    "contact_name",
                    "contact_number",
                    "email",
                    "birthdate",
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

            <ImportContactsModal
              show={showModal}
              onClose={handleImportContacts}
            />

            {contactToDelete && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete contact ${contactToDelete.contact_name}?`}
                isLoading={isDeleting}
              />
            )}

            <DeleteModal
              isOpen={isBulkDeleteOpen}
              onClose={() => setIsBulkDeleteOpen(false)}
              onConfirm={handleBulkDelete}
              isLoading={isDeleting}
              message={`Are you sure you want to delete ${selectedFlatRows.length} contacts? This action cannot be undone.`}
            />

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
                      <LoadingFallback message="Loading contacts..." />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No Contacts available.
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

          {totalRecords > 0 && (
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

export default Contacts;
