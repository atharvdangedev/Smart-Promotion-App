import { CheckCircle, MessageSquare, Star, Users } from "lucide-react";

const Stats = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-[#1C6EA5] to-orange-500">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Trusted by Businesses Worldwide
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join thousands of companies already automating their customer
          communication
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              number: "25,000+",
              label: "Active Users",
              icon: <Users className="w-6 h-6" />,
            },
            {
              number: "100M+",
              label: "Messages Automated",
              icon: <MessageSquare className="w-6 h-6" />,
            },
            {
              number: "99.2%",
              label: "Delivery Success",
              icon: <CheckCircle className="w-6 h-6" />,
            },
            {
              number: "4.9/5",
              label: "Customer Rating",
              icon: <Star className="w-6 h-6" />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
            >
              <div className="flex justify-center mb-4 text-white">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
