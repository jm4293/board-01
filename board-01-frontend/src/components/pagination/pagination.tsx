type PaginationProps = {
  pagination: any;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
};

export const Pagination = ({ pagination, setPagination }: PaginationProps) => {
  const btn_first = () => {
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  const btn_last = () => {
    setPagination({
      ...pagination,
      currentPage: pagination.pageCount,
    });
  };

  const btn_prev = () => {
    if (pagination.currentPage > 1) {
      setPagination({
        ...pagination,
        currentPage: pagination.currentPage - 1,
      });
    }
  };

  const btn_next = () => {
    if (pagination.currentPage < pagination.pageCount) {
      setPagination({
        ...pagination,
        currentPage: pagination.currentPage + 1,
      });
    }
  };

  const btn_page = (page: number) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });
  };

  return (
    <div className="pagination">
      <button
        className="pagination-item"
        onClick={btn_first}
        disabled={pagination.currentPage === 1}
      >
        &#60;&#60;
      </button>

      <button
        className="pagination-item"
        onClick={btn_prev}
        disabled={pagination.currentPage === 1}
      >
        &#60;
      </button>

      {pagination.dataCount !== 0 ? (
        Array.from({ length: 5 }, (_, index) => {
          const temp = index + 1 + Math.floor((pagination.currentPage - 1) / 5) * 5;

          if (temp <= pagination.pageCount) {
            return (
              <button
                className={`pagination-item ${pagination.currentPage === temp ? "active" : ""}`}
                onClick={() => btn_page(temp)}
              >
                {temp}
              </button>
            );
          }
        })
      ) : (
        <button className="pagination-item" disabled={true}>
          1
        </button>
      )}

      <button
        className="pagination-item"
        onClick={btn_next}
        disabled={pagination.currentPage === pagination.pageCount || pagination.dataCount === 0}
      >
        &#62;
      </button>

      <button
        className="pagination-item"
        onClick={btn_last}
        disabled={pagination.currentPage === pagination.pageCount || pagination.dataCount === 0}
      >
        &#62;&#62;
      </button>
    </div>
  );
};
