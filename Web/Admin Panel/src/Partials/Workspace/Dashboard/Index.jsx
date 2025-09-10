import { memo, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import LoadingFallback from "../../Apps/LoadingFallback/LoadingFallback";
import { handleApiError } from "../../Apps/utils/handleApiError";
import { useSelector } from "react-redux";
import formatCurrency from "../../Apps/utils/formatCurrency";

const Index = memo(() => {
  const Img_url = import.meta.env.VITE_IMG_URL;
  const APP_URL = import.meta.env.VITE_API_URL;

  const { user: userData = {}, token } = useSelector((state) => state.auth);
  const [statData, setStatData] = useState(null);

  // Fetch all stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/${userData.rolename}/admin-dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setStatData(response.data.data);
        } else if (response.status === 204) {
          setStatData([]);
        }
      } catch (error) {
        handleApiError(error, "fetching", "stats");
      }
    };

    fetchData();
  }, [APP_URL, token, userData.rolename]);

  if (!statData) {
    return <LoadingFallback />;
  }

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
                options={{
                  chart: { type: "bar" },
                  colors: ["#22c55e", "#6366f1", "#f97316", "#9ca3af"],
                  xaxis: {
                    categories: statData.revenue_and_plans.revenue_per_plan.map(
                      (p) => p.title
                    ),
                  },
                  dataLabels: {
                    enabled: true,
                    style: {
                      colors: ["#ffffff"],
                      fontWeight: "bold",
                      fontSize: "14px",
                    },
                  },
                  plotOptions: {
                    bar: {
                      distributed: true,
                      dataLabels: {
                        position: "center",
                      },
                    },
                  },
                }}
                series={[
                  {
                    name: "Revenue",
                    data: statData.revenue_and_plans.revenue_per_plan.map((p) =>
                      parseFloat(p.revenue)
                    ),
                  },
                ]}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        {/* stat cards */}
        {/* Total Revenue */}
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3 shadow-sm rounded-3">
            <h6 className="text-muted">Total Revenue</h6>
            <h3
              style={{
                color: "green",
                fontWeight: "semi-bold",
              }}
            >
              {formatCurrency(statData.cards.total_revenue)}
            </h3>
          </div>
        </div>
        {/* Total Vendors */}
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3 shadow-sm rounded-3">
            <h6 className="text-muted">Total Vendors</h6>
            <h3>{statData.cards.total_vendors}</h3>
          </div>
        </div>
        {/* Total Agents */}
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3 shadow-sm rounded-3">
            <h6 className="text-muted">Total Agents</h6>
            <h3>{statData.cards.total_agents}</h3>
          </div>
        </div>
        {/* Active Subscriptions */}
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3 shadow-sm rounded-3">
            <h6 className="text-muted">Active Subscriptions</h6>
            <h3>{statData.cards.active_subscriptions}</h3>
          </div>
        </div>
        {/* Expired */}
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3 shadow-sm">
            <h6>Expired</h6>
            <h4>{statData.subscriptions.expired}</h4>
          </div>
        </div>
        {/* Upcoming Renewals */}
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3 shadow-sm">
            <h6>Upcoming Renewals</h6>
            <h4>{statData.subscriptions.upcoming_renewals}</h4>
          </div>
        </div>
        {/* Renewals Count */}
        <div className="col-sm-6 col-lg-3">
          <div className="card p-3 shadow-sm">
            <h6>Renewals Count</h6>
            <h4>{statData.subscriptions.renewals_count}</h4>
          </div>
        </div>

        {/* Active plan distribution */}
        <div className="col-sm-3 col-lg-4">
          <div className="card p-3 mb-4">
            <h5 className="mb-3">Active Plan Distribution</h5>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: statData.revenue_and_plans.active_plan_distribution.map(
                  (p) => p.title
                ),
              }}
              series={statData.revenue_and_plans.active_plan_distribution.map(
                (p) => parseInt(p.active_count, 10)
              )}
              type="donut"
              height={300}
            />
          </div>
        </div>

        {/* Monthly revenue growth */}
        <div className="col-sm-3 col-lg-4">
          <div className="card p-3 mb-4">
            <h5 className="mb-3">Monthly Revenue Growth</h5>
            <Chart
              options={{
                chart: { type: "line" },
                xaxis: {
                  categories:
                    statData.revenue_and_plans.monthly_revenue_growth.map(
                      (m) => m.month
                    ),
                },
              }}
              series={[
                {
                  name: "Revenue",
                  data: statData.revenue_and_plans.monthly_revenue_growth.map(
                    (m) => parseFloat(m.revenue)
                  ),
                },
              ]}
              type="line"
              height={300}
            />
          </div>
        </div>

        {/* Call trends */}
        <div className="col-sm-3 col-lg-4">
          <div className="card p-3 mb-4">
            <h5 className="mb-3">Call Trends</h5>
            <Chart
              options={{
                chart: { type: "line" },
                xaxis: {
                  categories: statData.calls_and_crm.call_trends.map(
                    (c) => c.call_date
                  ),
                },
              }}
              series={[
                {
                  name: "Total Calls",
                  data: statData.calls_and_crm.call_trends.map((c) =>
                    parseInt(c.total_calls, 10)
                  ),
                },
              ]}
              type="line"
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

Index.displayName = "Index";

export default Index;
