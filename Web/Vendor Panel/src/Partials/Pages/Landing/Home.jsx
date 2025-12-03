import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import LoadingFallback from "../../Apps/LoadingFallback/LoadingFallback";
import { createMarkup } from "../../Apps/utils/createMarkup";
import formatCurrency from "../../Apps/utils/formatCurrency";

const APP_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${APP_URL}/all-plans`)
      .then((response) => response.json())
      .then((data) => setPlans(data.plans))
      .catch((error) => console.error("Error fetching plans:", error));
  }, [setPlans]);

  if (!plans.length) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <LoadingFallback message="Verifying Payment..." />
      </div>
    );
  }

  const handleSelectPlan = (plan) => {
    navigate("/vendor-registration", { state: { plan } });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="plans-section">
        <div className="plans-container">
          <div className="d-flex flex-column align-items-center text-center mb-5">
            <h1 className="section-title">Choose Your Plan</h1>
            <p className="section-subtitle">
              Transparent pricing that grows with your business
            </p>
          </div>

          <div className="plans-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${plan.id === "2" ? "popular" : ""}`}
              >
                {plan.id === "2" && (
                  <div className="popular-badge">MOST POPULAR</div>
                )}

                <h3 className="plan-title">{plan.title}</h3>

                <div className="plan-price">
                  {formatCurrency(plan.price)}
                  <span className="plan-duration"> / {plan.validity} days</span>
                </div>

                <p className="plan-type">{plan.plan_type}</p>

                <div
                  className="plan-description"
                  dangerouslySetInnerHTML={createMarkup(plan.description)}
                />

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="btn-choose-plan mt-2"
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 text-center">
            <h3 className="h4 fw-bold mb-3 text-dark">
              Need to add agents to your team?
            </h3>
            <p
              className="fs-5 text-muted mx-auto"
              style={{ maxWidth: "720px" }}
            >
              You can purchase agent add-on plans to give your team members
              access to the vendor panel. Each agent will have their own login
              and permissions to manage the business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
