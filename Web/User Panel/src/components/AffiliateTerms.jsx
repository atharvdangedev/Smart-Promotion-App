import Header from "./Header";
import Footer from "./Footer";

const AffiliateTerms = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-100 font-sans leading-normal tracking-normal">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto rounded-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
              Affiliate Program Terms & Conditions
            </h1>
            <p className="text-gray-600 text-center mb-10">
              Last Updated: September 3, 2025
            </p>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                Please read these affiliate terms and conditions ("Terms")
                carefully before joining our affiliate program. By joining our
                affiliate program, you agree to be bound by these Terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
                1. Enrollment in the Affiliate Program
              </h2>
              <p className="mb-6">
                To begin the enrollment process, you will submit a complete
                Affiliate Program application through our website. We will
                evaluate your application and notify you of your acceptance or
                rejection. We may reject your application if we determine that
                your site is unsuitable for our Program for any reason.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
                2. Affiliate Responsibilities
              </h2>
              <p className="mb-6">As an affiliate, you agree to:</p>
              <ul className="list-disc list-inside space-y-3 mb-6 pl-4">
                <li>
                  Promote our products and services to your audience in a
                  truthful and honest manner.
                </li>
                <li>
                  Not engage in any form of spamming or unsolicited
                  communication.
                </li>
                <li>
                  Not use our name or any of our intellectual property in any
                  way that is not authorized by us.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
                3. Commission and Payouts
              </h2>
              <p className="mb-6">
                You will receive a commission for each new customer that you
                refer to us through your unique affiliate link. The commission
                rate and payment schedule will be detailed in your affiliate
                dashboard.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
                4. Termination
              </h2>
              <p className="mb-6">
                We may terminate your affiliate account at any time, with or
                without cause, by giving you written notice. You may also
                terminate your affiliate account at any time by giving us
                written notice.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AffiliateTerms;
