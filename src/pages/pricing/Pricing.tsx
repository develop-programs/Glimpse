import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useAtomValue } from "jotai";
import { featureData } from "@/data/feature";
import React from "react";

export default function Pricing() {
  const features = useAtomValue(featureData);

  // Define pricing plans with their features
  const pricingPlans = [
    {
      name: "Free",
      description: "For personal use",
      price: "$0",
      period: "/month",
      features: [
        "Up to 3 participants",
        "40 minutes per meeting",
        "Screen sharing",
        "Chat feature",
        "Basic support"
      ],
      buttonText: "Get Started",
      buttonHref: "/signup",
      buttonVariant: "default",
      className: "border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-sky-200",
      buttonClassName: "w-full bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 border-0"
    },
    {
      name: "Pro",
      description: "For small teams",
      price: "$12",
      period: "/month per host",
      features: [
        "Up to 10 participants",
        "Unlimited meeting duration",
        "Screen sharing & recording",
        "Meeting scheduling",
        "Priority support"
      ],
      buttonText: "Start 14-day Trial",
      buttonHref: "/signup",
      buttonVariant: "default",
      className: "border-2 border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 relative scale-105",
      buttonClassName: "w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 border-0",
      isPopular: true
    },
    {
      name: "Business",
      description: "For organizations",
      price: "$20",
      period: "/month per host",
      features: [
        "Up to 100 participants",
        "Unlimited meeting duration",
        "All Pro features",
        "Admin controls & reports",
        "24/7 premium support"
      ],
      buttonText: "Contact Sales",
      buttonHref: "/contact-sales",
      buttonVariant: "outline",
      className: "border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-sky-200",
      buttonClassName: "w-full border-blue-400 text-blue-700 hover:bg-blue-50"
    }
  ];

  // FAQ data
  const faqItems = [
    {
      question: "Do I need to install software?",
      answer: "No, Glimpse works directly in your web browser. No downloads or installations are required."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades are effective immediately, while downgrades take effect at the end of your billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial for our Pro and Business plans, no credit card required."
    }
  ];

  // Create a comprehensive feature list from both free and premium features
  const allFeatures = [
    ...features.free.items.map(item => ({
      title: item.title,
      // Define which plan includes this feature
      included: { free: true, pro: true, business: true }
    })),
    ...features.premium.previewItems.map(item => ({
      title: item.title,
      // Premium features typically available in Pro and Business plans
      included: {
        free: false,
        pro: item.title === "Unlimited Participants" ? false : true,
        business: true
      }
    }))
  ];

  React.useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [])

  return (
    <>
      <Navbar />
      <div className="mt-44">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Simple, transparent pricing</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you and start connecting with your team
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={plan.className}>
                {plan.isPopular && (
                  <div className="absolute -top-4 right-0 left-0 flex justify-center">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-600">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-700">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant={plan.buttonVariant === "outline" ? "outline" : "default"} className={plan.buttonClassName}>
                    <a href={plan.buttonHref}>{plan.buttonText}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Feature Comparison Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Feature Comparison</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Compare our plans to find the perfect fit for your needs
            </p>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-lg">Features</th>
                    <th className="text-center py-4 px-4 font-semibold text-lg text-blue-600">Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-lg text-blue-700">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold text-lg text-blue-800">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 font-medium">{feature.title}</td>
                      <td className="py-3 px-4 text-center">
                        {feature.included.free ?
                          <Check className="h-5 w-5 text-green-500 mx-auto" /> :
                          <X className="h-5 w-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.included.pro ?
                          <Check className="h-5 w-5 text-green-500 mx-auto" /> :
                          <X className="h-5 w-5 text-gray-300 mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.included.business ?
                          <Check className="h-5 w-5 text-green-500 mx-auto" /> :
                          <X className="h-5 w-5 text-gray-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Need more details about specific features?
                <Button variant="link" className="ml-1 text-blue-600 hover:text-blue-800">
                  <a href="/features">View full feature details</a>
                </Button>
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <div className="mt-8 max-w-3xl mx-auto space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="p-6 bg-gradient-to-r from-sky-50 to-green-50 rounded-lg border border-sky-100 hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-semibold text-blue-700">{item.question}</h3>
                  <p className="mt-2 text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
