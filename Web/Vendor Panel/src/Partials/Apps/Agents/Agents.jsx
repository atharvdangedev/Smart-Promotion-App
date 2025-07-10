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
import toast, { Toaster } from "react-hot-toast";
import { handleApiError } from "../utils/handleApiError";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal/DeleteModal";
import Modal from "../StatusModal/Modal";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions.js";
import { APP_PERMISSIONS } from "../utils/permissions.js";
import Can from "../Can/Can.jsx";

const Agents = () => {
  // Navigate function
  const navigate = useNavigate();

  const { can, canAny } = usePermissions();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URLs
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // State initialization
  const [pageSize, setPageSize] = useState(10);
  const [vendorData, setVendorData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  //fetch agents
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/all-agents/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setClientsData(response.data.agents);
        } else if (response.status === 204) {
          setClientsData([]);
        }
      } catch (error) {
        handleApiError(error, "fetching", "agents");
        setClientsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, user.rolename, user?.id]);

  //fetch vendor data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${APP_URL}/${user?.rolename}/${user?.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          const user = res.data.vendor;
          setVendorData(user);
        }
      } catch (error) {
        handleApiError(error, "fetching", `${user?.rolename} details`);
      }
    };

    fetchUser();
  }, [token, APP_URL, Img_url, user?.rolename, user?.user_id]);

  // Handle add page navigation
  const handleAdd = useCallback(
    async () => {
      if (!can(APP_PERMISSIONS.AGENTS_CREATE)) {
        toast.error("You do not have permission to add agents.");
        return;
      }
      if (vendorData.addon_count === 0) {
        toast.error(
          `You have not purchased any add-ons. Please purchase add-ons to add agents`
        );
        return;
      } else if (clientsData.length === vendorData.addon_count) {
        toast.error(
          `Agent count of ${vendorData.addon_count} reached. Purchase more add-ons to add more agents`
        );
        return;
      } else {
        navigate(`/agents/add-agent`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  // Handle edit page navigation
  const handleEdit = useCallback(
    async (firstname, id) => {
      if (!can(APP_PERMISSIONS.AGENTS_EDIT)) {
        toast.error("You do not have permission to edit agents.");
        return;
      }
      navigate(`/agents/edit-agent/${id}`, {
        state: { firstname },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((first_name, id) => {
    if (!can(APP_PERMISSIONS.AGENTS_DELETE)) {
      toast.error("You do not have permission to delete agents.");
      return;
    }
    setAgentToDelete({ first_name, id });
    setIsDeleteModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (agentToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/${user.rolename}/agents/${agentToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json;",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          setClientsData((prevData) =>
            prevData.filter((user) => user.id !== agentToDelete.id)
          );
        }
      } catch (error) {
        handleApiError(error, "deleting", "agent");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setAgentToDelete(null);
      }
    }
  };

  // Handle status click callback
  const handleStatusClick = useCallback((record) => {
    if (!can(APP_PERMISSIONS.AGENTS_CHANGE_STATUS)) {
      toast.error("You do not have permission to change agent status.");
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
        `${APP_URL}/update-user-status/${id}`,
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
        setClientsData((prevData) =>
          prevData.map((user) =>
            user.id === id
              ? { ...user, status: user.status === "1" ? "0" : "1" }
              : user
          )
        );
        setIsStatusModalOpen(false);
      }
    } catch (error) {
      handleApiError(error, "updating", "user status");
    }
  };

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);

  const canSeeActionsColumn = canAny([
    APP_PERMISSIONS.AGENTS_EDIT,
    APP_PERMISSIONS.AGENTS_DELETE,
  ]);

  // Table configuration
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
        Header: "NAME",
        id: "fullName",
        accessor: (row) => `${row.first_name} ${row.last_name}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <img
              src={
                row.original.profile_pic
                  ? `${Img_url}/profile/${row.original.profile_pic}`
                  : `${Img_url}/default/list/user.webp`
              }
              alt={row.original.first_name || "User profile"}
              className="me-2 avatar rounded-circle lg"
              onError={(e) => {
                e.target.src = `${Img_url}/default/list/user.webp`;
              }}
            />
            <div className="d-flex flex-column">
              {row.original.first_name} {row.original.last_name}
            </div>
          </div>
        ),
      },
      { Header: "EMAIL", accessor: "email" },
      { Header: "CONTACT", accessor: "contact_no" },
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
            <Can do={APP_PERMISSIONS.AGENTS_EDIT}>
              <button
                type="button"
                onClick={() =>
                  handleEdit(row.original.first_name, row.original.id)
                }
                className="btn text-info px-2 me-1"
              >
                <i className="bi bi-pencil"></i>
              </button>
            </Can>
            <Can do={APP_PERMISSIONS.AGENTS_DELETE}>
              <button
                type="button"
                onClick={() =>
                  handleDelete(row.original.first_name, row.original.id)
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
  }, [
    canSeeActionsColumn,
    Img_url,
    handleStatusClick,
    handleEdit,
    handleDelete,
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
      data: clientsData,
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
                <strong>Agents List</strong>
              </h4>
              <Can do={APP_PERMISSIONS.AGENTS_CREATE}>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add New Agent
                </button>
              </Can>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {canSeeExports && (
                <ExportButtons
                  data={rows.map((row) => row.original)}
                  fileName="Agents"
                  fields={[
                    "first_name",
                    "last_name",
                    "email",
                    "contact_no",
                    "role",
                    "status",
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

            {recordToUpdate && (
              <Modal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onConfirm={() => handleConfirmStatus(recordToUpdate.id)}
                message={`Are you sure you want to ${
                  recordToUpdate?.status === "1" ? "deactivate" : "activate"
                } user ${recordToUpdate.first_name}?`}
                status={recordToUpdate?.status}
              />
            )}

            {agentToDelete && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete agent ${agentToDelete.first_name}?`}
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
                      <LoadingFallback message="Loading agents..." />
                    </td>
                  </tr>
                ) : clientsData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No agents available.
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

          {clientsData.length > 0 && (
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

export default Agents;
