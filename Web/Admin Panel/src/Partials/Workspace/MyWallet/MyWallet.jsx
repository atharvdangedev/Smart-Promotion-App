import React, { useEffect, useState } from "react";
// import { useSelector } from 'react-redux'
// import Chart from 'react-apexcharts'

import CalenderTab from "../../Widgets/CalenderTab/CalenderTab";
import WalletTable from "./Components/WalletTable";
import axios from "axios";
import { DollarSign, CreditCard, Mail, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";

const MyWallet = () => {
  // Access token
  const { token } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const [paymentsData, setPaymentsData] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [transactionTotals, setTransactionTotals] = useState({
    total_order_amount: "0",
    category_totals: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState("");
  // const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${APP_URL}/order-totals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setTransactionTotals(response.data.totals);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token]);

  useEffect(() => {
    if (!date) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${APP_URL}/order-totals/${date}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setTransactionTotals(response.data.totals);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token, date]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${APP_URL}/all-payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setPaymentsData(response.data.payments);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token]);

  // Filter orders based on the selected date
  useEffect(() => {
    if (date) {
      const filtered = paymentsData.filter(
        (payment) => payment.addedon === date
      );
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(paymentsData); // If no date selected, show all orders
    }
  }, [date, paymentsData]);

  // useEffect(() => {
  //     setChartKey(prevKey => prevKey + 1);
  // }, [screenWidth]);

  const transformedData = transactionTotals
    ? [
        {
          title: "Total Order Amount",
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

  return (
    <div className="ps-1 pt-1 pb-1 page-body">
      <div className="card bg-transparent border-0">
        <div className="card-header">
          <h3 className="title-font mb-0">My Payments</h3>
          <h3
            className="badge bg-success"
            style={{ padding: "15px", fontSize: "14px" }}
          >
            {date ? "Payments on " + date : "Total Payments"}:{" "}
            {filteredPayments.length}
          </h3>
        </div>
        <div className="card-body">
          <h6 className="card-title">Recent transaction</h6>
          <ul className="row g-3 list-unstyled row-deck">
            {transformedData.map((data, index) => {
              return (
                <li key={index} className="col-xl-3 col-lg-6">
                  <div className="card">
                    <div className="card-body d-flex align-items-start">
                      <div className="avatar rounded no-thumbnail">
                        {React.createElement(data.icon)}
                      </div>
                      <div className="ms-3 me-auto">
                        <h5 className={`fw-normal theme-text-color1 mb-1`}>
                          {data.title}
                        </h5>
                        <p>{data.value}</p>
                        {/* <Chart
                                                    key={chartKey}
                                                    options={data.options}
                                                    series={data.series}
                                                    height={data.options.chart.height}
                                                    type={data.options.chart.type}
                                                /> */}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <CalenderTab setDate={setDate} />
          <hr />
          <WalletTable paymentsData={filteredPayments} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default MyWallet;
