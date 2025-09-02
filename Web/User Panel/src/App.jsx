import React, { useState } from "react";
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

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="bg-white"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      {/* Header - WordPress style navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-white p-2 rounded-lg mr-3 shadow-md">
                <img src="/logo.png" alt="logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Smart WhatsApp Promotion
                </h1>
                <p className="text-xs text-gray-500 -mt-1">SWP</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Reviews
              </a>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                Request Demo
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t py-4">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-blue-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-blue-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-blue-700 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Reviews
                </a>
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                  Request Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - WordPress theme inspired */}
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-orange-500">
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
                <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                  Request Demo
                </button>
                <button className="border-2 border-gray-300 hover:border-blue-700 text-gray-700 hover:text-blue-700 font-semibold py-4 px-8 rounded-lg transition-all duration-200 text-lg group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                  <Play className="w-5 h-5 inline mr-2 group-hover:text-blue-700" />
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
                    <div className="bg-gradient-to-r from-blue-700 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  className="absolute -bottom-4 -left-4 bg-blue-700 text-white p-3 rounded-full shadow-lg"
                  aria-label="View trends"
                >
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How Smart WhatsApp Promotion Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent system monitors your call activity and
              automatically triggers personalized WhatsApp messages based on
              call types and outcomes.
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
                    <div className="bg-gradient-to-r from-blue-700 to-orange-500 text-white p-3 rounded-xl mr-4">
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
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-700 to-orange-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
                icon: <PhoneCall className="w-8 h-8 text-blue-700" />,
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

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-orange-500">
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Mitchell",
                role: "Sales Director",
                company: "TechFlow Solutions",
                avatar: "SM",
                content:
                  "SWP transformed our follow-up process. We now capture 85% more leads from missed calls automatically. The ROI has been incredible.",
                rating: 5,
              },
              {
                name: "David Chen",
                role: "CEO",
                company: "GrowthLab Agency",
                avatar: "DC",
                content:
                  "The call detection feature is game-changing. Our response time improved by 90% and customer satisfaction scores are at an all-time high.",
                rating: 5,
              },
              {
                name: "Maria Rodriguez",
                role: "Operations Manager",
                company: "CustomerFirst Inc",
                avatar: "MR",
                content:
                  "Simple setup, powerful results. We've automated 80% of our customer communication while maintaining a personal touch. Highly recommend!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-orange-50 p-8 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-700 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "₹2,999",
                period: "/month",
                description: "Perfect for small businesses",
                features: [
                  "Up to 1,000 calls/month",
                  "5 message templates",
                  "Basic analytics",
                  "Email support",
                  "WhatsApp integration",
                ],
                popular: false,
                cta: "Start Free Trial",
              },
              {
                name: "Professional",
                price: "₹6,999",
                period: "/month",
                description: "Most popular for growing teams",
                features: [
                  "Up to 10,000 calls/month",
                  "Unlimited templates",
                  "Advanced analytics",
                  "Priority support",
                  "Custom integrations",
                  "Team collaboration",
                ],
                popular: true,
                cta: "Request Demo",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For large organizations",
                features: [
                  "Unlimited calls",
                  "Custom development",
                  "Dedicated support",
                  "SLA guarantee",
                  "On-premise option",
                  "Advanced security",
                ],
                popular: false,
                cta: "Contact Sales",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white p-8 mt-3 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-700 scale-105 shadow-2xl"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-block bg-gradient-to-r from-blue-700 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-200 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-700 to-orange-500 hover:from-blue-800 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Automate Your Customer Communication?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join 25,000+ businesses already using Smart WhatsApp Promotion to
            convert every call into a meaningful customer interaction. See how
            it works with a personalized demo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-white hover:bg-gray-100 text-blue-700 font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Request Demo
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Contact Sales
            </button>
          </div>

          <div className="flex items-start justify-center text-blue-100 text-sm">
            <CheckCircle className="w-4 h-4 text-blue-200 mr-2" />
            Free setup consultation • No long-term contracts • 30-day money-back
            guarantee
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="text-white p-2 rounded-lg mr-3">
                  <img src="/logo.png" alt="logo" className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Smart WhatsApp Promotion
                  </h3>
                  <p className="text-xs text-gray-400">SWP</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Transform every phone call into a marketing opportunity with
                intelligent WhatsApp automation. Built for businesses that value
                customer relationships.
              </p>
              <div className="flex items-center text-sm text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                GDPR Compliant
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Training
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                Copyright <span>@{new Date().getFullYear()}</span> Smart
                WhatsApp Promotion. Developed by{" "}
                <a
                  href="https://smartscripts.tech/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Smartscripts Private Limited.
                </a>{" "}
                All Rights Reserved
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
