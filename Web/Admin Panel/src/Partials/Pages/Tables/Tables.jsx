/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { Link, useNavigate } from "react-router-dom";
import ExportButtons from "../../Apps/ExportButtons/ExportButtons";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../../Apps/StatusModal/Modal";
import DeleteModal from "../../Apps/DeleteModal/DeleteModal";
import ResponsivePagination from "../../Apps/ResponsivePagination/ResponsivePagination";
import { handleApiError } from "../../Apps/utils/handleApiError";

const Tables = () => {
  // Navigation function
  const navigate = useNavigate();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // State initialization
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  //fetch business list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/business`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setData(response.data.business);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "businesses");
      }
    };

    fetchData();
  }, [APP_URL, token]);

  // Handle status click callback
  const handleStatusClick = useCallback((record) => {
    setRecordToUpdate(record);
    setIsModalOpen(true);
  }, []);

  // Handle status change functionality
  const handleConfirm = useCallback(async () => {
    if (recordToUpdate) {
      setIsUpdating(true);
      try {
        const newStatus = recordToUpdate.status === "1" ? "0" : "1";
        const response = await axios.put(
          `${APP_URL}/update-business-status/${recordToUpdate.id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json;",
            },
          }
        );

        if (response.status === 200) {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === recordToUpdate.id
                ? { ...item, status: newStatus }
                : item
            )
          );
          toast.success(response.data.message);
        }
      } catch (error) {
        handleApiError(error, "updating", "status");
      } finally {
        setIsModalOpen(false);
        setIsUpdating(false);
      }
    }
  }, [recordToUpdate, APP_URL, token]);

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle edit page navigation
  const handleEdit = useCallback(
    (businessName, id) => {
      navigate(`/admin/editBusiness/${businessName}/${id}`);
    },
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((businessName, id) => {
    setBusinessToDelete({ businessName, id });
    setIsDeleteModalOpen(true);
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (businessToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/delete-business/${businessToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json;",
            },
          }
        );
        if (response.status === 200) {
          setData((prevData) =>
            prevData.filter((business) => business.id !== businessToDelete.id)
          );
          toast.success(response.data.message);
        }
      } catch (error) {
        handleApiError(error, "deleting", "business");
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setBusinessToDelete(null);
      }
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
        Header: "BUSINESS",
        accessor: "business_name",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <img
              src={
                row.original.logo
                  ? `${Img_url}/logo/list/${row.original.logo}`
                  : `${Img_url}/default/list/business-logo.webp`
              }
              alt={row.original.business_name || "Business logo"}
              className="me-2 avatar rounded-circle lg"
              onError={(e) => {
                e.target.src = `${Img_url}/default/list/business-logo.webp`;
              }}
            />
            <div className="d-flex flex-column">
              {row.original.business_name}
            </div>
          </div>
        ),
      },
      {
        Header: "CONTACT",
        accessor: (row) => `${row.business_contact} ${row.business_email}`,
        Cell: ({ row }) => (
          <div>
            <div>{row.original.business_contact}</div>
            <div>{row.original.business_email}</div>
          </div>
        ),
      },
      {
        Header: "TYPE",
        accessor: "business_type",
      },
      {
        Header: "OWNER",
        accessor: (row) => `${row.firstname} ${row.lastname}`,
        Cell: ({ row }) => (
          <div>
            {row.original.firstname} {row.original.lastname}
          </div>
        ),
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
              color: "#ffffff",
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
        Cell: ({ row }) => (
          <div>
            <button
              type="button"
              onClick={() =>
                handleEdit(row.original.business_name, row.original.id)
              }
              className="btn text-info px-2 me-1"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              type="button"
              onClick={() =>
                handleDelete(row.original.business_name, row.original.id)
              }
              className="btn text-danger px-2"
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [Img_url, handleDelete, handleEdit, handleStatusClick]
  );

  // Use the useTable hook to build the table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
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
                <strong>Business List</strong>
              </h4>
              <Link className="btn btn-primary" to="/admin/addBusiness">
                Add New Business
              </Link>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <ExportButtons data={data} />
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
              onClose={handleCloseModal}
              onConfirm={handleConfirm}
              isLoading={isUpdating}
              message={`Are you sure you want to ${
                recordToUpdate?.status === "1" ? "deactivate" : "activate"
              } business ${recordToUpdate?.business_name}?`}
            />

            {businessToDelete && (
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete business ${businessToDelete.businessName}?`}
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
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      No records found
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

export default Tables;
