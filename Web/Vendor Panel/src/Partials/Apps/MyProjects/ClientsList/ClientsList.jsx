/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { Link, useNavigate } from "react-router-dom";
import ExportButtons from "../../ExportButtons/ExportButtons";
import Modal from "../../StatusModal/Modal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserActivation from "../../UserActivation/UserActivation";
import DeleteModal from "../../DeleteModal/DeleteModal";
import ResponsivePagination from "../../ResponsivePagination/ResponsivePagination";
import LoadingFallback from "../../LoadingFallback/LoadingFallback";
import { handleApiError } from "../../utils/handleApiError";
import { setPageTitle } from "../../utils/docTitle";

const ClientsList = () => {
  // Navigate function
  const navigate = useNavigate();

  // Access token
  const token = localStorage.getItem("jwtToken");

  setPageTitle("Users | Vendor Panel");

  // API URLs
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // State initialization
  const [pageSize, setPageSize] = useState(10);
  const [clientsData, setClientsData] = useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUserActivationModalOpen, setIsUserActivationModalOpen] =
    useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${APP_URL}/vendor-panel-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json;",
          },
        });
        if (response.status === 200) {
          setClientsData(response.data.users);
        } else if (response.status === 204) {
          setClientsData([]);
        }
      } catch (error) {
        setClientsData([]);
        handleApiError(error, "fetching", "users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token]);

  // Handle edit page navigation
  const handleEdit = useCallback(
    async (firstname, id) => {
      navigate(`/vendor/user/edit-user/${id}`, { state: { firstname } });
    },
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((firstname, id) => {
    setUserToDelete({ firstname, id });
    setIsDeleteModalOpen(true);
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/delete-user/${userToDelete.id}`,
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
            prevData.filter((user) => user.id !== userToDelete.id)
          );
        }
      } catch (error) {
        handleApiError(error, "deleting", "user");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  // Handle status click callback
  const handleStatusClick = useCallback((record) => {
    setRecordToUpdate(record);
    setIsStatusModalOpen(true);
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

  // Handle user activation callback
  const handleUserActivationClick = useCallback((record) => {
    setRecordToUpdate(record);
    setIsUserActivationModalOpen(true);
  }, []);

  // Handle user activation functionality (via email)
  const handleUserActivationConfirm = async () => {
    try {
      const params = new URLSearchParams();
      params.append("email", recordToUpdate.email);
      const response = await axios.post(
        `${APP_URL}/SendActivationToken`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      handleApiError(error, "sending activation mail to", "user");
    } finally {
      setIsUserActivationModalOpen(false);
    }
  };

  // Handle user activation functionality (directly)
  const handleUserActivationConfirmDirectly = async () => {
    try {
      const response = await axios.post(
        `${APP_URL}/activate-user/${recordToUpdate.id}`,
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
            user.id === recordToUpdate.id
              ? { ...user, activated: "1", status: "1" }
              : user
          )
        );
      }
    } catch (error) {
      handleApiError(error, "activating", "user");
    } finally {
      setIsUserActivationModalOpen(false);
    }
  };

  // Table configuration
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
        Header: "NAME",
        id: "fullName",
        accessor: (row) => `${row.firstname} ${row.lastname}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <img
              src={
                row.original.profile
                  ? `${Img_url}/profile/list/${row.original.profile}`
                  : `${Img_url}/default/list/user.webp`
              }
              alt={row.original.firstname || "User profile"}
              className="me-2 avatar rounded-circle lg"
              onError={(e) => {
                e.target.src = `${Img_url}/default/list/user.webp`;
              }}
            />
            <div className="d-flex flex-column">
              {row.original.firstname} {row.original.lastname}
            </div>
          </div>
        ),
      },
      { Header: "EMAIL", accessor: "email" },
      { Header: "CONTACT", accessor: "contact_no" },
      {
        Header: "ROLE",
        accessor: "role",
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
      {
        Header: "ACTIONS",
        accessor: "activated",
        Cell: ({ row, value }) => (
          <div>
            <button
              type="button"
              onClick={() =>
                handleEdit(row.original.firstname, row.original.id)
              }
              className="btn text-info px-2 me-1"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              type="button"
              onClick={() =>
                handleDelete(row.original.firstname, row.original.id)
              }
              className="btn text-danger px-2"
            >
              <i className="fa fa-trash"></i>
            </button>
            {value === "0" ? (
              <button
                className="btn btn-sm"
                onClick={() => handleUserActivationClick(row.original)}
              >
                <i className="bi bi-shield-lock"></i>
              </button>
            ) : (
              ""
            )}
          </div>
        ),
      },
    ],
    [
      Img_url,
      handleStatusClick,
      handleEdit,
      handleDelete,
      handleUserActivationClick,
    ]
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
                <strong>Users List</strong>
              </h4>
              <Link className="btn btn-primary" to="/vendor/user/add-user">
                Add New User
              </Link>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <ExportButtons
                data={rows.map((row) => row.original)}
                fileName="Users"
                fields={[
                  "firstname",
                  "lastname",
                  "email",
                  "contact_no",
                  "role",
                  "status",
                ]}
              />
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
                } user ${recordToUpdate.firstname}?`}
                status={recordToUpdate?.status}
              />
            )}

            {recordToUpdate && (
              <UserActivation
                isOpen={isUserActivationModalOpen}
                onClose={() => setIsUserActivationModalOpen(false)}
                viaEmail={handleUserActivationConfirm}
                directly={handleUserActivationConfirmDirectly}
                message={`This is an vendor only action. Are you sure you want to manually activate ${
                  recordToUpdate.firstname + " " + recordToUpdate.lastname
                }?`}
                isLoading={isLoading}
              />
            )}

            {userToDelete && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete user ${userToDelete.firstname}?`}
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
                      <LoadingFallback message="Loading users..." />
                    </td>
                  </tr>
                ) : clientsData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No users available.
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

export default ClientsList;
