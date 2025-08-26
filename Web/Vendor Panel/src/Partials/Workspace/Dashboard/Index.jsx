import { memo, useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { DollarSign, CreditCard, Mail, ShoppingBag } from "lucide-react";
import LoadingFallback from "../../Apps/LoadingFallback/LoadingFallback";
import { Link } from "react-router-dom";
import { handleApiError } from "../../Apps/utils/handleApiError";
import { useSelector } from "react-redux";
import { setPageTitle } from "../../Apps/utils/docTitle";

const Index = memo(() => {
  const Img_url = import.meta.env.VITE_IMG_URL;
  const APP_URL = import.meta.env.VITE_API_URL;

  const { user: userData = {}, token } = useSelector((state) => state.auth);

  setPageTitle("Dashboard | Vendor Panel");

  const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payoutOrders, setPayoutOrders] = useState([]);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [salesRevenueData, setSalesRevenueData] = useState([]);
  const [transactionTotals, setTransactionTotals] = useState({
    total_order_amount: "0",
    category_totals: [],
  });

  // Fetch all orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/all-vendor-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setOrders(response.data.orders);
          setSalesRevenueData(formatSalesRevenueData(response.data.orders));
        } else if (response.status === 204) {
          setSalesRevenueData([]);
        }
      } catch (error) {
        handleApiError(error, "fetching", "orders");
      }
    };

    fetchData();
  }, [APP_URL, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/vendor-payout-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setPayoutOrders(response.data.orders);
        }
      } catch (error) {
        console.log(error);
        setPayoutOrders([]);
      }
    };

    fetchData();
  }, [APP_URL, token]);

  // Fetch monthly analytics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/vendor-monthly-analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setMonthlyAnalytics(response.data.monthly_analytics);
        } else if (response.status === 204) {
          setMonthlyAnalytics([]);
        }
      } catch (error) {
        handleApiError(error, "fetching", "monthly analytics");
      }
    };

    fetchData();
  }, [APP_URL, token]);

  // get transaction totals
  useEffect(() => {
    const fetchData = async () => {
      setIsTransactionLoading(true);
      try {
        const response = await axios.get(`${APP_URL}/all-vendor-order-totals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setTransactionTotals(response.data.totals);
        } else if (response.status === 204) {
          setTransactionTotals({
            total_order_amount: "0",
            category_totals: [],
          });
        }
      } catch (error) {
        handleApiError(error, "fetching", "transaction totals");
      } finally {
        setIsTransactionLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token]);

  //transform the transaction totals data
  const transformedData = transactionTotals
    ? [
        {
          title: "Total Revenue",
          value: `${Number(
            transactionTotals.total_order_amount || 0
          ).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}`,
          icon: DollarSign,
        },
        ...(transactionTotals.category_totals || []).map((category) => ({
          title: category.category_name,
          value: `${Number(category.total_amount || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}`,
          icon: category.category_name.includes("Review")
            ? Mail
            : category.category_name.includes("Business")
            ? CreditCard
            : ShoppingBag,
        })),
      ]
    : [];

  const chartData = useMemo(() => {
    const { category_totals } = transactionTotals;
    if (!category_totals.length) {
      return {
        series: [],
        chart: { type: "bar", height: 300 },
        xaxis: { categories: [] },
      };
    }

    const sortedTotals = [...category_totals].sort(
      (a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount)
    );

    const categories = sortedTotals.map((item) => item.category_name);
    const amounts = sortedTotals.map((item) => parseFloat(item.total_amount));

    return {
      series: [
        {
          name: "Revenue",
          data: amounts,
        },
      ],
      chart: {
        type: "bar",
        height: 300,
      },
      xaxis: {
        categories,
        labels: {
          rotate: -45,
          hideOverlappingLabels: true,
        },
      },
      yaxis: {
        labels: {
          formatter: (val) =>
            val.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            }),
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) =>
          val.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          }),
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
    };
  }, [transactionTotals]);

  // Categories for the chart
  const categories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // data for the chart
  const preOrdersData = monthlyAnalytics.map((item) =>
    parseInt(item.pre_orders)
  );
  const ordersData = monthlyAnalytics.map((item) => parseInt(item.orders));

  // options for the chart
  const options = {
    chart: {
      type: "bar",
      height: 240,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["var(--theme-color1)", "var(--accent-color)"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#ffffff"],
        },
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: () => "Pre-Orders",
          },
        },
        {
          title: {
            formatter: () => "Orders",
          },
        },
      ],
    },
  };

  // series for the chart
  const series = [
    {
      name: "Pre-Orders",
      data: preOrdersData,
    },
    {
      name: "Orders",
      data: ordersData,
    },
  ];

  return (
    <div className="px-4 py-3 page-body">
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-4 li_animate">
            <div className="col-xl-3 col-lg-4">
              <span className="small">Welcome back!</span>
              <h2 className="fw-bold mb-xl-5 mb-4">My Dashboard</h2>
              <div className="d-flex align-items-center justify-content-start">
                <img
                  src={
                    userData?.profile_pic
                      ? `${Img_url}/profile/${userData?.profile_pic}`
                      : `${Img_url}/default/list/user.webp`
                  }
                  alt={userData?.first_name || "User profile"}
                  className="me-2 avatar rounded-circle xl"
                  onError={(e) => {
                    e.target.src = `${Img_url}/default/list/user.webp`;
                  }}
                />
                <div className="ms-3">
                  <h4 className="mb-0 text-gradient title-font">
                    Hello,{" "}
                    {userData
                      ? `${userData?.first_name} ${userData?.last_name}`
                      : "User"}
                    !
                  </h4>
                  <span className="text-muted small">
                    {userData?.email || ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-5 col-md-8 col-sm-8">
              <Chart
                options={options}
                series={series}
                type="bar"
                height={240}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3">
        {/* Transaction Totals */}
        {isTransactionLoading ? (
          <LoadingFallback message="Loading transactions..." />
        ) : (
          <>
            {transformedData.map((data, index) => (
              <div key={index} className="col-lg-2 col-md-4 col-sm-6">
                <div
                  className="card p-3 px-3"
                  style={{
                    minHeight: "170px",
                  }}
                >
                  <div
                    className="fw-bold"
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    {data.title}
                  </div>
                  <div className="py-4 m-0 text-success h3">
                    <div className="text-success fw-bold">{data.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Initiate Order(Pending Payments) */}
        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h6 className="card-title mb-0 fw-bold">Pending Payments</h6>
            </div>
            <div
              className="card-body custom_scroll"
              style={{ height: "320px" }}
            >
              <ul
                className="list-group list-group-flush user-list mb-0"
                role="tablist"
              >
                {payoutOrders.filter(
                  (order) => order.payout_payment_status === "Pending"
                ).length === 0 ? (
                  <li className="list-group-item b-dashed text-center">
                    <span className="mt-4">No Pending Payments Available</span>
                  </li>
                ) : (
                  payoutOrders
                    .filter(
                      (order) => order.payout_payment_status === "Pending"
                    )
                    .slice(0, 5)
                    .map((data, index) => (
                      <li key={index} className="list-group-item b-dashed">
                        <div className="d-flex">
                          <div className="flex-fill ms-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-1">{data.name}</h6>
                              {data.razorpay_order_id && (
                                <Link
                                  to={`/vendor/app/orders/${data.id}`}
                                  className="small"
                                  title="View Details"
                                >
                                  #{data.razorpay_order_id}
                                </Link>
                              )}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="badge bg-danger">Pending</span>
                              <span
                                className="fw-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {Number(data.total_amount).toLocaleString(
                                  "en-IN",
                                  {
                                    style: "currency",
                                    currency: "INR",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmed Orders(Payment Received) */}
        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h6 className="card-title mb-0 fw-bold">
                Confirmed Orders(Payment Received)
              </h6>
            </div>
            <div
              className="card-body custom_scroll"
              style={{ height: "320px" }}
            >
              <ul
                className="list-group list-group-flush user-list mb-0"
                role="tablist"
              >
                {payoutOrders.filter(
                  (order) => order.payout_payment_status === "Received"
                ).length === 0 ? (
                  <li className="list-group-item b-dashed text-center">
                    <span className="mt-4">No Received Payments Available</span>
                  </li>
                ) : (
                  payoutOrders
                    .filter(
                      (order) => order.payout_payment_status === "Received"
                    )
                    .slice(0, 5)
                    .map((data, index) => (
                      <li key={index} className="list-group-item b-dashed">
                        <div className="d-flex">
                          <div className="flex-fill ms-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-1">{data.name}</h6>
                              {data.razorpay_order_id && (
                                <Link
                                  to={`/vendor/app/orders/${data.id}`}
                                  className="small"
                                  title="View Details"
                                >
                                  #{data.razorpay_order_id}
                                </Link>
                              )}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="badge bg-info">Placed</span>
                              <span
                                className="fw-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {Number(data.total_amount).toLocaleString(
                                  "en-IN",
                                  {
                                    style: "currency",
                                    currency: "INR",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h6 className="card-title mb-0 fw-bold">Completed Orders</h6>
            </div>
            <div
              className="card-body custom_scroll"
              style={{ height: "320px" }}
            >
              <ul
                className="list-group list-group-flush user-list mb-0"
                role="tablist"
              >
                {orders.filter((order) => order.order_status === "Delivered")
                  .length === 0 ? (
                  <li className="list-group-item b-dashed text-center">
                    <span className="mt-4">No Completed Orders Available</span>
                  </li>
                ) : (
                  orders
                    .filter((order) => order.order_status === "Delivered")
                    .slice(0, 5)
                    .map((data, index) => (
                      <li key={index} className="list-group-item b-dashed">
                        <div className="d-flex">
                          <div className="flex-fill ms-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-1">{data.name}</h6>
                              {data.razorpay_order_id && (
                                <Link
                                  to={`/admin/app/orders/${data.id}`}
                                  className="small"
                                  title="View Details"
                                >
                                  #{data.razorpay_order_id}
                                </Link>
                              )}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-1">
                              <div>
                                <span className="badge bg-success">
                                  {data.order_status}
                                </span>
                                {data.note && (
                                  <span className="badge bg-info mx-2">
                                    Manual Order
                                  </span>
                                )}
                              </div>

                              <span
                                className="fw-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                <span className="badge bg-dark mx-1">
                                  {data.first_name} {data.last_name}
                                </span>

                                {Number(data.total_amount).toLocaleString(
                                  "en-IN",
                                  {
                                    style: "currency",
                                    currency: "INR",
                                  }
                                )}
                              </span>
                            </div>

                            {!data.razorpay_order_id && (
                              <div className="mt-2">
                                <span className="text-muted small">
                                  Order Pending
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* City Based Revenue */}
        <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">City Based Revenue</h6>
            </div>
            <div
              className="card-body custom_scroll"
              style={{ height: "320px" }}
            >
              <table className="table table-hover mb-0">
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted py-4">
                        No city data available
                      </td>
                    </tr>
                  ) : (
                    salesRevenueData.slice(0, 10).map((data, index) => (
                      <tr key={index}>
                        <td>
                          {data.city}
                          <div
                            className="progress mt-1"
                            style={{ height: "2px" }}
                          >
                            <div
                              className="progress-bar bg-primary"
                              style={{ width: data.width }}
                            ></div>
                          </div>
                        </td>
                        <td className="text-end">
                          <span className="text-success fw-bold">
                            {data.formattedRevenue}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="col-xxl-4 col-xl-4 col-lg-6 col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Category Based Performance</h6>
            </div>
            <div className="card-body py-1" style={{ height: "320px" }}>
              <div>
                {chartData.series && chartData.series.length ? (
                  <Chart
                    options={chartData}
                    series={chartData.series}
                    type={chartData.chart.type}
                    height={chartData.chart.height}
                  />
                ) : (
                  <p>No performance data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Index.displayName = "Index";

export default Index;

const formatSalesRevenueData = (orders) => {
  // Build a map of total revenue per city
  const cityRevenue = orders.reduce((acc, { city, total_amount }) => {
    if (city) {
      acc[city] = (acc[city] || 0) + parseFloat(total_amount);
    }
    return acc;
  }, {});

  // Convert the revenue map to an array of objects, retaining the numeric revenue
  // and also formatting it for display purposes.
  const salesData = Object.entries(cityRevenue).map(([city, revenue]) => ({
    city,
    revenue, // numeric value for calculations
    formattedRevenue: revenue.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    }),
    width: "0%",
  }));

  // Sort in descending order based on the revenue
  salesData.sort((a, b) => b.revenue - a.revenue);

  // Compute width percentages relative to the highest revenue
  if (salesData.length > 0) {
    const maxRevenue = salesData[0].revenue;
    salesData.forEach((item) => {
      item.width = `${Math.round((item.revenue / maxRevenue) * 100)}%`;
    });
  }

  return salesData;
};
