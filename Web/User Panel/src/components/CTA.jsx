import { CheckCircle } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-[#1C6EA5] to-orange-500">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Automate Your Customer Communication?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join 25,000+ businesses already using Smart WhatsApp Promotion to
          convert every call into a meaningful customer interaction. See how it
          works with a personalized demo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button className="bg-white hover:bg-gray-100 text-[#1C6EA5] font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
            Request Demo
          </button>
          <button className="border-2 border-white hover:bg-white hover:text-[#1C6EA5] text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
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
  );
};

export default CTA;
