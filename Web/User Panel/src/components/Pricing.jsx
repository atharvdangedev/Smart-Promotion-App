import { useQuery } from "@tanstack/react-query";
import { createMarkup } from "../utils/createMarkup";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { features } from "../lib/features";
import formatCurrency from "@/utils/formatCurrency";

const Pricing = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/all-plans`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const handleSelectPlan = (plan) => {
    navigate("/register", { state: { plan } });
  };
  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Transparent pricing that grows with your business
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-full mx-auto">
          {isLoading && <p>Loading plans...</p>}
          {error && <p>Error fetching plans: {error.message}</p>}
          {plans &&
            plans.plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white p-8 mt-3 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                  plan.is_popular
                    ? "border-[#1C6EA5] scale-105 shadow-2xl"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {plan.id === "2" && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-block bg-gradient-to-r from-[#1C6EA5] to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.title}
                  </h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-gray-600 ml-1">
                      /{plan.validity} days
                    </span>
                  </div>
                  <p
                    className="text-gray-600 mb-4"
                    dangerouslySetInnerHTML={createMarkup(plan.description)}
                  ></p>
                </div>

                <ul className="mb-8 space-y-4">
                  {features
                    .find((f) => f.planId === plan.id)
                    ?.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-200 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                    plan.is_popular
                      ? "bg-gradient-to-r from-[#1C6EA5] to-orange-500 hover:from-[#FF5604] hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "border-2 border-[#1C6EA5] text-[#1C6EA5] hover:bg-[#1C6EA5] hover:text-white"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need to add agents to your team?
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You can purchase agent add-on plans to give your team members access
            to the vendor panel. Each agent will have their own login and
            permissions to manage the business.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
