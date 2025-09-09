import Header from "./Header";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Last Updated: September 4, 2025
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              This Privacy Policy describes how Smartscripts Private Limited
              ("we," "us," or "our") collects, uses, and discloses your
              information when you use our Smart WhatsApp Promotion service (the
              "Service").
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We collect various types of information in connection with the
              Service, including:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Personal Information:</strong> Such as your name, email
                address, contact number, and payment information when you
                register for an account or make a purchase.
              </li>
              <li>
                <strong>Call Data:</strong> Information related to calls made or
                received through the mobile application, including call type
                (incoming, outgoing, missed), duration, and associated contact
                details.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you access
                and use the Service, such as IP address, browser type, operating
                system, and pages visited.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the
                device you use to access the Service, including device model,
                operating system, and unique device identifiers.
              </li>
            </ul>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We use the information we collect for various purposes, including
              to:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 ml-4">
              <li>Provide, maintain, and improve our Service.</li>
              <li>Process your registrations and transactions.</li>
              <li>
                Send automated WhatsApp messages based on call detection and
                your templates.
              </li>
              <li>
                Communicate with you about your account, updates, and
                promotional offers.
              </li>
              <li>
                Monitor and analyze usage and trends to improve your experience.
              </li>
              <li>
                Detect, prevent, and address technical issues and security
                incidents.
              </li>
            </ul>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. How We Share Your Information
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We may share your information with third parties in the following
              circumstances:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Service Providers:</strong> With third-party vendors,
                consultants, and other service providers who perform services on
                our behalf.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of all or a portion of our assets.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or in
                response to valid requests by public authorities.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your
                information with your consent or at your direction.
              </li>
            </ul>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We implement reasonable security measures to protect your
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet
              or electronic storage is 100% secure.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Your Choices and Rights
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              You may have certain rights regarding your personal information,
              such as the right to access, correct, or delete your data. Please
              contact us to exercise these rights.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Changes to This Privacy Policy
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Contact Us
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a href="mailto:support@mcards.in">
                <strong>support@mcards.in</strong>
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
