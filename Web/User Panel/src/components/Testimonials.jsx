import { Star } from "lucide-react";

const Testimonials = () => {
  return (
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
                <div className="bg-gradient-to-r from-[#1C6EA5] to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4">
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
  );
};

export default Testimonials;
