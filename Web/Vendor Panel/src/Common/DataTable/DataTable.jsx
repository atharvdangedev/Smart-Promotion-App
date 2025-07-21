/* eslint-disable react/prop-types */
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import ResponsivePagination from "../../Partials/Apps/ResponsivePagination/ResponsivePagination";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ExportButtons from "../../Partials/Apps/ExportButtons/ExportButtons";
import LoadingFallback from "../../Partials/Apps/LoadingFallback/LoadingFallback";

// Custom date range filter function
const dateRangeFilter = (rows, id, filterValue) => {
  const { startDate, endDate } = filterValue || {};
  if (!startDate || !endDate) return rows;

  return rows.filter((row) => {
    const rowDate = new Date(row.values[id]);
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Reset time part for accurate date comparison
    rowDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return rowDate >= start && rowDate <= end;
  });
};

const DataTable = ({ columns, data, isLoading }) => {
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  // Define the filter types
  const filterTypes = useMemo(
    () => ({
      dateRange: dateRangeFilter,
    }),
    []
  );

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
    setFilter,
    setPageSize: setTablePageSize,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
      filterTypes,
    },
    useFilters,
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

  // Handle date range changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = { ...dateRange, [name]: value };
    // Check validity if both dates are present
    if (newDateRange.startDate && newDateRange.endDate) {
      const start = new Date(newDateRange.startDate);
      const end = new Date(newDateRange.endDate);

      if (end < start) {
        toast.error("End date cannot be before start date.");
        return;
      } else {
        setFilter("order_date", newDateRange);
      }
    } else {
      setFilter("order_date", newDateRange);
    }
    setDateRange(newDateRange);
  };

  return (
    <div className="col-lg-12 col-md-12">
      <Toaster />
      <div className="card mb-3 p-3">
        <div className="table-responsive">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <div>
                <input
                  value={globalFilter || ""}
                  onChange={handleGlobalFilterChange}
                  className="form-control"
                  placeholder="Search..."
                />
              </div>
              <div
                style={{ borderLeft: "1px solid #000", height: "30px" }}
                className="d-flex align-items-center"
              ></div>
              <div className="d-flex align-items-center">
                <span className="me-2">Show</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  {[10, 20, 30, 40, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="ms-2">entries</span>
              </div>
              <div
                style={{ borderLeft: "1px solid #000", height: "30px" }}
                className="d-flex align-items-center"
              ></div>
              <div className="d-flex align-items-center gap-2">
                <span className="me-2">Filter</span>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="form-control"
                />
                <span>to</span>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="form-control"
                />
              </div>
              <div
                style={{ borderLeft: "1px solid #000", height: "30px" }}
                className="d-flex align-items-center"
              ></div>
              <div className="d-flex align-items-center gap-2">
                <span className="me-2">Exports:</span>
                <ExportButtons
                  fileName="Orders"
                  data={rows.map((row) => row.original)}
                  fields={[
                    "razorpay_order_id",
                    "category_name",
                    "id",
                    "name",
                    "email",
                    "mobile",
                    "order_date",
                    "total_amount",
                    "order_status",
                  ]}
                />
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
                      const { key, ...restHeaderProps } = column.getHeaderProps(
                        column.getSortByToggleProps()
                      );
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
                    <LoadingFallback message="Loading orders..." />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No order data available.
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
  );
};

export default DataTable;
