import Header from "./Header";
import Footer from "./Footer";

const TermsOfService = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Last Updated: September 4, 2025
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              By accessing and using the Smart WhatsApp Promotion service
              ("Service"), you accept and agree to be bound by the terms and
              provisions of this agreement. If you do not agree to abide by the
              above, please do not use this Service.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Smart WhatsApp Promotion provides an automated post-call WhatsApp
              messaging service designed to enhance customer engagement for
              businesses. The Service includes a mobile application and
              web-based panels for managing templates, reports, and agents.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Accounts
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To access certain features of the Service, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Privacy Policy
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy,
              which is incorporated into these Terms by this reference. Please
              review our Privacy Policy to understand our practices.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              All content, trademarks, and data on this Service, including but
              not limited to software, databases, text, graphics, icons, and
              hyperlinks, are the property of Smartscripts Private Limited or
              its licensors.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Smartscripts Private Limited shall not be liable for any direct,
              indirect, incidental, special, or consequential damages resulting
              from the use or inability to use the Service.
            </p>
          </div>

          <div className="rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Changes to Terms
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Smartscripts Private Limited reserves the right to modify these
              Terms of Service at any time. Your continued use of the Service
              after any such changes constitutes your acceptance of the new
              Terms.
            </p>
          </div>

          <div className="mt-12 text-center text-gray-600 text-sm">
            <p>
              This is a placeholder for the actual Terms of Service. Please
              replace this content with your legally binding terms.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;
