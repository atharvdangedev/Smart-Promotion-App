import {
  MessageSquare,
  Users,
  TrendingUp,
  Shield,
  Clock,
  PhoneCall,
} from "lucide-react";
const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Every Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform your call management into a
            powerful WhatsApp marketing engine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <PhoneCall className="w-8 h-8 text-[#1C6EA5]" />,
              title: "Smart Call Detection",
              description:
                "Our Advanced Algorithm automatically identifies and categorizes all call types with 99.9% accuracy.",
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
              title: "Template Management",
              description:
                "Create and manage unlimited message templates for different call scenarios and customer segments.",
            },
            {
              icon: <Users className="w-8 h-8 text-green-600" />,
              title: "Contact Segmentation",
              description:
                "Automatically segment contacts based on call behavior and engagement patterns.",
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
              title: "Analytics Dashboard",
              description:
                "Track call patterns, message delivery rates, and customer engagement with detailed reports.",
            },
            {
              icon: <Clock className="w-8 h-8 text-indigo-600" />,
              title: "Smart Timing",
              description:
                "Send messages at optimal times based on customer timezone and activity patterns.",
            },
            {
              icon: <Shield className="w-8 h-8 text-red-600" />,
              title: "Compliance Ready",
              description:
                "Fully compliant with WhatsApp Business API policies and GDPR regulations.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-100"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
