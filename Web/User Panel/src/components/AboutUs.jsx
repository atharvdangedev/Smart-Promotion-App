import Header from "./Header";
import Footer from "./Footer";
import { CheckCircle } from "lucide-react";

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              About Smart WhatsApp Promotion
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Revolutionizing Post-Call Customer Engagement
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Smart WhatsApp Promotion is an innovative SaaS product developed
              by{" "}
              <a
                href="https://smartscripts.tech"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#1C6EA5]"
              >
                Smartscripts Private Limited
              </a>
              . We are dedicated to transforming how businesses connect with
              their customers after phone calls, turning every interaction into
              an opportunity for growth and stronger relationships.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              The Problem We Solve
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              In today's fast-paced business environment, effective post-call
              follow-up is crucial but often overlooked. Many businesses face
              challenges such as:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Inconsistent follow-ups and missed opportunities.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Time-consuming manual tasks for repetitive messaging.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Lack of personalization in customer communications.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Untracked engagement and difficulty measuring communication
                effectiveness.
              </li>
            </ul>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Unique Solution: Intelligent Automation
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              At the core of Smart WhatsApp Promotion is our advanced, in-house
              developed{" "}
              <span className="font-semibold text-[#1C6EA5]">
                call detection algorithm
              </span>
              . Embedded within our Android mobile app, this intelligent
              technology automatically identifies call types and customer
              details, enabling:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>Smart Detection: </strong> Recognizes call type and
                customer.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>Template Matching: </strong> Instantly matches call type
                to pre-defined WhatsApp message templates.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>Automated Delivery: </strong> Sends personalized
                messages automatically.
              </li>
            </ul>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              This seamless process ensures timely, relevant communication, from
              thank-you notes with product catalogs to survey links and
              troubleshooting guides, all without manual effort.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Key Benefits for Your Business
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Boost Customer Engagement
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Maximize Efficiency
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Personalize at Scale
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Drive Conversions
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                Gain Actionable Insights
              </li>
            </ul>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Smart WhatsApp Promotion?
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>In-House Expertise:</strong> Developed by Smartscripts
                Private Limited, ensuring deep understanding and continuous
                innovation.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>Cutting-Edge Technology:</strong> Our advanced call
                detection algorithm sets us apart.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>Comprehensive Solution:</strong> From automated
                messaging to detailed analytics and team management, we cover
                all your post-call engagement needs.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>Scalable & Flexible:</strong> Grow your business and
                team with our adaptable plans and agent add-ons.
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{" "}
                <strong>Dedicated Support: </strong> We're here to help you
                succeed.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
