/* eslint-disable react/prop-types */
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useEffect, useMemo, useState } from "react";
import ResponsivePagination from "../ResponsivePagination/ResponsivePagination";
import ExportButtons from "../ExportButtons/ExportButtons";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import axios from "axios";
import { handleApiError } from "../utils/handleApiError";
import { useSelector } from "react-redux";
import usePermissions from "../../../hooks/usePermissions";
import { APP_PERMISSIONS } from "../utils/permissions";
import { setPageTitle } from "../utils/docTitle";
import formatCurrency from "../utils/formatCurrency.js";

const Commissions = () => {
  const { can } = usePermissions();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  setPageTitle("Commissions | Vendor Panel");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  // State initialization
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //fetch commission
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
        handleApiError(error, "fetching", "commission");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, user.rolename]);

  const canSeeExports = can(APP_PERMISSIONS.EXPORTS);

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
    ],
    []
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

  return (
    <div className="px-4 py-3 page-body">
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
