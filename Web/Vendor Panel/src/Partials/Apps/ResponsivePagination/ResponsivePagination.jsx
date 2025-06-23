/* eslint-disable react/prop-types */

const ResponsivePagination = ({
  pageIndex,
  pageOptions,
  gotoPage,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
}) => {
  const getPageNumbers = () => {
    const totalPages = pageOptions.length;
    const currentPage = pageIndex + 1;
    const isMobile = window.innerWidth < 768;
    const result = new Set(); // Using Set to prevent duplicates

    if (isMobile) {
      // Always show first page
      result.add(1);

      // Show current page and adjacent pages
      if (currentPage > 2) result.add("...");
      if (currentPage > 1) result.add(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages)
        result.add(currentPage);
      if (currentPage < totalPages - 1) result.add(currentPage + 1);
      if (currentPage < totalPages - 2) result.add("...");

      // Always show last page
      result.add(totalPages);
    } else {
      // Desktop view
      result.add(1); // Always show first page

      if (currentPage > 3) result.add("...");

      // Show pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        result.add(i);
      }

      if (currentPage < totalPages - 2) result.add("...");
      if (totalPages > 1) result.add(totalPages); // Always show last page
    }

    return Array.from(result);
  };

  return (
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination pagination-sm flex-wrap justify-content-center">
        <li className={`page-item ${!canPreviousPage ? "disabled" : ""}`}>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="page-link"
            aria-label="Previous page"
          >
            <span className="d-none d-sm-inline">Previous</span>
            <span className="d-inline d-sm-none">&lt;</span>
          </button>
        </li>

        {getPageNumbers().map((pageNum, index) => (
          <li
            key={index}
            className={`page-item ${pageNum === pageIndex + 1 ? "active" : ""} ${
              pageNum === "..." ? "disabled" : ""
            }`}
          >
            {pageNum === "..." ? (
              <span className="page-link">...</span>
            ) : (
              <button
                onClick={() => gotoPage(pageNum - 1)}
                className="page-link"
              >
                {pageNum}
              </button>
            )}
          </li>
        ))}

        <li className={`page-item ${!canNextPage ? "disabled" : ""}`}>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="page-link"
            aria-label="Next page"
          >
            <span className="d-none d-sm-inline">Next</span>
            <span className="d-inline d-sm-none">&gt;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default ResponsivePagination;
