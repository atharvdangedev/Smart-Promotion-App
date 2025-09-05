import { MessageSquare, Phone, Zap } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How Smart WhatsApp Promotion Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent system monitors your call activity and automatically
            triggers personalized WhatsApp messages based on call types and
            outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: <Phone className="w-8 h-8" />,
              title: "Call Detection",
              description:
                "Our system automatically detects and categorizes all your incoming, outgoing, missed, and rejected calls in real-time.",
            },
            {
              step: "02",
              icon: <MessageSquare className="w-8 h-8" />,
              title: "Template Matching",
              description:
                "Based on call type and outcome, the system selects the most appropriate pre-defined WhatsApp message template.",
            },
            {
              step: "03",
              icon: <Zap className="w-8 h-8" />,
              title: "Automated Delivery",
              description:
                "Personalized messages are automatically sent via WhatsApp, ensuring timely follow-ups and engagement.",
            },
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8 h-full border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-[#1C6EA5] to-orange-500 text-white p-3 rounded-xl mr-4">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-bold text-gray-300">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#1C6EA5] to-orange-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
