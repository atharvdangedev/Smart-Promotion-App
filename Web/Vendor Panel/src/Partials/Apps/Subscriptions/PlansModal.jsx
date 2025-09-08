/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import { handleApiError } from "../utils/handleApiError";

const PlansModal = ({ show, onClose, onPurchase }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const APP_URL = import.meta.env.VITE_API_URL;

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const { data, status } = await axios.get(
        `${APP_URL}/${user.rolename}/plans`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (status === 200) {
        setPlans(data.plans.filter((plan) => plan.id !== "1"));
      } else {
        setPlans([]);
      }
    } catch (error) {
      setPlans([]);
      handleApiError(error, "fetching", "plans");
    } finally {
      setLoading(false);
    }
  }, [APP_URL, token, user.rolename]);

  useEffect(() => {
    if (show) {
      fetchPlans();
    }
  }, [show, fetchPlans]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" onClick={onClose}>
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Available Plans</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body p-4">
              {loading && <LoadingFallback message="Loading plans..." />}
              {!loading && plans.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col" className="border-0 ps-3">
                          Plan Name
                        </th>
                        <th scope="col" className="border-0 text-center">
                          Validity
                        </th>
                        <th scope="col" className="border-0 text-end">
                          Price
                        </th>
                        <th scope="col" className="border-0 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.map((plan) => (
                        <tr key={plan.id}>
                          <td className="py-3 ps-3">
                            <div className="fw-bold">{plan.title}</div>
                            <div className="small text-muted">
                              {plan.plan_type}
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            {plan.validity} days
                          </td>
                          <td className="py-3 text-end fw-bold">
                            {Number(plan.price).toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })}
                          </td>
                          <td className="py-3 text-center">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => onPurchase(plan)}
                            >
                              Buy Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!loading && plans.length === 0 && (
                <p className="text-center text-muted py-5">
                  No subscription plans are available at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default PlansModal;
