/* eslint-disable no-useless-escape */
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
import { jwtDecode } from "jwt-decode";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
// const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const accountNumberRegex = /^[0-9]{9,18}$/;
const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;

// Schema definition
const schema = yup.object().shape({
  gst_number: yup
    .string()
    .required("GST Number is required")
    .matches(gstRegex, "Invalid GST Number (e.g., 22AAAAA0000A1Z5)"),

  account_holder: yup
    .string()
    .required("Account holder name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Account holder name must contain only alphabets and spaces."
    )
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),

  account_type: yup
    .string()
    .required("Account type is required")
    .oneOf(
      ["savings", "current"],
      "Account type must be 'savings' or 'current'"
    ),

  bank_name: yup
    .string()
    .required("Bank name is required")
    .min(3, "Bank name must be at least 3 characters"),

  bank_account_no: yup
    .string()
    .required("Bank account number is required")
    .matches(
      accountNumberRegex,
      "Invalid account number (must be 9–18 digits)"
    ),

  branch: yup
    .string()
    .required("Branch is required")
    .min(3, "Branch name must be at least 3 characters"),

  upi_id: yup
    .string()
    .required("UPI ID is required")
    .matches(upiRegex, "Invalid UPI ID format (e.g., name@bank)"),

  // ifsc_code: yup.string().notRequired(),
});

const CouponCodeManagement = () => {
  // Navigation function
  const navigate = useNavigate();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const decoded = jwtDecode(token);
  const { role } = decoded.data;

  const accountTypes = [
    {
      value: "savings",
      label: "Savings",
    },
    {
      value: "current",
      label: "Current",
    },
  ];

  //fetch coupons
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/affiliate/coupons`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setData(response.data.coupons);
        } else if (response.status === 204) {
          setData([]);
        }
      } catch (error) {
        setData([]);
        handleApiError(error, "fetching", "coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token]);

  // Handle edit page navigation
  const handleEdit = useCallback(
    (couponName, couponId) => {
      navigate(`/coupon-codes/edit-coupon/${couponId}`, {
        state: { couponName },
      });
    },
    [navigate]
  );

  // Handle delete callback
  const handleDelete = useCallback((couponName, id) => {
    setCouponToDelete({ couponName, id });
    setIsDeleteModalOpen(true);
  }, []);

  // Handle delete functionality
  const handleConfirmDelete = async () => {
    if (couponToDelete) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${APP_URL}/affiliate/coupons/${couponToDelete.id}`,
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
        Header: "Coupon",
        accessor: "coupon_code",
      },
      {
        Header: "Plan",
        accessor: (row) => `${row.plan_title} ${row.plan_type}`,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
              <span>{row.original.plan_title}</span>
              <span>{row.original.plan_type}</span>
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
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => {
          return (
            <div>
              <button
                type="button"
                onClick={() =>
                  handleEdit(row.original.coupon_code, row.original.id)
                }
                className="btn text-info px-2 me-1"
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDelete(row.original.coupon_code, row.original.id)
                }
                className="btn text-danger px-2"
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleEdit]
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

  // Use form initialization
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Handle submit
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      setIsUpdating(true);
      formData.append("account_holder", data.account_holder);
      formData.append("account_type", data.account_type);
      formData.append("bank_name", data.bank_name);
      formData.append("bank_account_no", data.bank_account_no);
      formData.append("branch", data.branch);
      formData.append("upi_id", data.upi_id);
      if (data.gst_number) formData.append("gst_number", data.gst_number);

      const res = await axios.post(`${APP_URL}/become-an-affiliate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleApiError(error, "becoming an", "affiliate");
    } finally {
      reset();
      setIsUpdating(false);
      setIsModalOpen(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    setIsModalOpen(false);
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
                {role === "5" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Become An Affiliate
                  </button>
                )}
                <Link className="btn btn-primary" to="/coupon-codes/add-coupon">
                  Add New Coupon
                </Link>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <ExportButtons
                data={rows.map((row) => row.original)}
                fileName="Coupon Codes"
                fields={[
                  "first_name",
                  "last_name",
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
                {loading ? (
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
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close"
                      />
                    </div>

                    <div className="modal-body pt-0">
                      <h4 className="title-font">Become An Affiliate</h4>
                      <p>Please fill up the following extra information</p>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.account_holder ? "is-invalid" : ""
                                }`}
                                id="account_holder"
                                {...register("account_holder")}
                                placeholder="Account Holder Name"
                                tabIndex="8"
                              />
                              <label htmlFor="account_holder">
                                Account Holder Name
                              </label>
                              {errors.account_holder && (
                                <div className="invalid-feedback">
                                  {errors.account_holder.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.bank_name ? "is-invalid" : ""
                                }`}
                                id="bank_name"
                                {...register("bank_name")}
                                placeholder="Bank Name"
                                tabIndex="9"
                              />
                              <label htmlFor="bank_name">Bank Name</label>
                              {errors.bank_name && (
                                <div className="invalid-feedback">
                                  {errors.bank_name.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                type="text"
                                inputMode="numeric"
                                onInput={(e) =>
                                  (e.target.value = e.target.value.replace(
                                    /\D+/g,
                                    ""
                                  ))
                                }
                                className={`form-control ${
                                  errors.bank_account_no ? "is-invalid" : ""
                                }`}
                                id="bank_account_no"
                                {...register("bank_account_no")}
                                placeholder="Bank Account No:"
                                tabIndex="11"
                              />
                              <label htmlFor="bank_account_no">
                                Bank Account No:
                              </label>
                              {errors.bank_account_no && (
                                <div className="invalid-feedback">
                                  {errors.bank_account_no.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.branch ? "is-invalid" : ""
                                }`}
                                id="branch"
                                {...register("branch")}
                                placeholder="Branch"
                                tabIndex="12"
                              />
                              <label htmlFor="branch">Branch</label>
                              {errors.branch && (
                                <div className="invalid-feedback">
                                  {errors.branch.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.upi_id ? "is-invalid" : ""
                                }`}
                                id="upi_id"
                                {...register("upi_id")}
                                placeholder="UPI ID"
                                tabIndex="24"
                              />
                              <label htmlFor="upi_id">UPI ID</label>
                              {errors.upi_id && (
                                <div className="invalid-feedback">
                                  {errors.upi_id.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                type="text"
                                maxLength={15}
                                className={`form-control ${
                                  errors.gst_number ? "is-invalid" : ""
                                }`}
                                id="gst_number"
                                {...register("gst_number")}
                                placeholder="GST Number"
                                tabIndex="14"
                              />
                              <label htmlFor="gst_number">GST Number</label>
                              {errors.gst_number && (
                                <div className="invalid-feedback">
                                  {errors.gst_number.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-floating">
                              <Controller
                                name="account_type"
                                control={control}
                                rules={{ required: "Account Type is required" }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    options={accountTypes}
                                    tabIndex="15"
                                    className={`basic-single ${
                                      errors.account_type ? "is-invalid" : ""
                                    }`}
                                    classNamePrefix="select"
                                    isClearable={true}
                                    isSearchable={true}
                                    placeholder="Select Account Type"
                                    value={
                                      accountTypes.find(
                                        (type) => type.value === field.value
                                      ) || null
                                    }
                                    onChange={(selectedOption) =>
                                      field.onChange(
                                        selectedOption
                                          ? selectedOption.value
                                          : ""
                                      )
                                    }
                                    styles={{
                                      control: (baseStyles) => ({
                                        ...baseStyles,
                                        height: "calc(3.5rem + 2px)",
                                        borderRadius: "0.375rem",
                                        border: "1px solid #ced4da",
                                      }),
                                      valueContainer: (baseStyles) => ({
                                        ...baseStyles,
                                        height: "100%",
                                        padding: "0.7rem 0.6rem",
                                      }),
                                      placeholder: (baseStyles) => ({
                                        ...baseStyles,
                                        color: "#6c757d",
                                      }),
                                      input: (baseStyles) => ({
                                        ...baseStyles,
                                        margin: 0,
                                        padding: 0,
                                      }),
                                      menu: (baseStyles) => ({
                                        ...baseStyles,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                )}
                              />
                              {errors.account_type && (
                                <div className="invalid-feedback">
                                  {errors.account_type.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-12">
                            <button
                              className="me-1 btn btn-primary"
                              type="submit"
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Processing..." : "Submit Details"}
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
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

export default CouponCodeManagement;
