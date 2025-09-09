import {
  Phone,
  MessageSquare,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Menu,
  X,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Play,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center bg-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Advanced Call Detection
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Automate Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C6EA5] to-orange-500">
                {" "}
                WhatsApp Marketing
              </span>
              <span className="block text-3xl lg:text-5xl mt-2">
                Based on Call Activity
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
              Automatically send personalized WhatsApp messages based on
              incoming, outgoing, missed, and rejected calls. Transform every
              phone interaction into a marketing opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-[#1C6EA5] hover:bg-[#FF5604] text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                Request Demo
              </button>
              <button className="border-2 border-gray-300 hover:border-[#1C6EA5] text-gray-700 hover:text-[#1C6EA5] font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                <Play className="w-5 h-5 inline mr-2 group-hover:text-[#1C6EA5]" />
                Watch Video
              </button>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Free setup • 24/7 support
            </div>
          </div>

          <div className="text-center">
            <div className="relative inline-block">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-[#1C6EA5] to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Call Detection Dashboard
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: PhoneIncoming,
                      label: "Incoming Call",
                      status: "Template Sent",
                      color: "text-green-600",
                    },
                    {
                      icon: PhoneOutgoing,
                      label: "Outgoing Call",
                      status: "Follow-up Scheduled",
                      color: "text-blue-600",
                    },
                    {
                      icon: PhoneMissed,
                      label: "Missed Call",
                      status: "Auto Message Sent",
                      color: "text-orange-600",
                    },
                    {
                      icon: PhoneCall,
                      label: "Rejected Call",
                      status: "Callback Reminder",
                      color: "text-red-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <item.icon className={`w-5 h-5 ${item.color} mr-3`} />
                        <span className="text-sm font-medium text-gray-900">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium mx-2 ${item.color}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div
                className="absolute -top-4 -right-4 bg-orange-600 text-white p-3 rounded-full shadow-lg"
                aria-label="View messages"
              >
                <MessageSquare className="w-5 h-5" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 bg-[#1C6EA5] text-white p-3 rounded-full shadow-lg"
                aria-label="View trends"
              >
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
