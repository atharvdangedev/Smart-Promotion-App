import { memo, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import LoadingFallback from "../../Apps/LoadingFallback/LoadingFallback";
import { handleApiError } from "../../Apps/utils/handleApiError";
import { useSelector } from "react-redux";
import { setPageTitle } from "../../Apps/utils/docTitle";

const Index = memo(() => {
  const Img_url = import.meta.env.VITE_IMG_URL;
  const APP_URL = import.meta.env.VITE_API_URL;

  setPageTitle("Dashboard | Vendor Panel");

  const { user: userData = {}, token } = useSelector((state) => state.auth);
  const [statData, setStatData] = useState(null);

  // Fetch all stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/${userData.rolename}/${userData.rolename}-dashboard-stats`,
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
                type="bar"
                height={300}
                series={[
                  {
                    name: "Incoming",
                    data: statData.graphs.agent_call_distribution.map((a) =>
                      Number(a.incoming)
                    ),
                  },
                  {
                    name: "Outgoing",
                    data: statData.graphs.agent_call_distribution.map((a) =>
                      Number(a.outgoing)
                    ),
                  },
                  {
                    name: "Missed",
                    data: statData.graphs.agent_call_distribution.map((a) =>
                      Number(a.missed)
                    ),
                  },
                  {
                    name: "Rejected",
                    data: statData.graphs.agent_call_distribution.map((a) =>
                      Number(a.rejected)
                    ),
                  },
                ]}
                options={{
                  chart: { stacked: true },
                  xaxis: {
                    categories: statData.graphs.agent_call_distribution.map(
                      (a) => a.first_name
                    ),
                  },
                  legend: { position: "bottom" },
                  colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
                  dataLabels: { enabled: false },
                  noData: {
                    text: "No call distribution data available",
                    align: "center",
                    verticalAlign: "middle",
                    style: {
                      fontSize: "14px",
                      color: "#9ca3af",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        {/* stat cards and graphs*/}
        <div className="col-sm-6 col-lg-12">
          <div className="card h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">Average Call Duration</h6>
              <h3 className="fw-bold">{statData.cards.avg_duration} mins</h3>
            </div>
          </div>
        </div>

        <div className="col-sm-3 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="mb-3">Calls by Type</h6>
              <Chart
                type="donut"
                height={300}
                series={Object.values(statData.graphs.calls_by_type_chart)}
                options={{
                  labels: Object.keys(statData.graphs.calls_by_type_chart),
                  colors: ["#22c55e", "#f59e0b", "#ef4444", "#6366f1"],
                  legend: { position: "bottom" },
                  dataLabels: { enabled: true },
                  chart: { type: "donut" },
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-sm-3 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="mb-3">Call Trend</h6>
              <Chart
                type="area"
                height={250}
                series={[
                  {
                    name: "Calls",
                    data: statData.graphs.call_trend.map((c) =>
                      parseInt(c.count)
                    ),
                  },
                ]}
                options={{
                  xaxis: {
                    categories: statData.graphs.call_trend.map((c) => c.date),
                  },
                  dataLabels: { enabled: false },
                  stroke: { curve: "smooth" },
                  colors: ["#6366f1"],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Index.displayName = "Index";

export default Index;
