import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <>
      <Navbar />
      <div className="mt-44">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Simple, transparent pricing</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you and start connecting with your team
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-sky-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-600">Free</CardTitle>
                <CardDescription>For personal use</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-700">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Up to 3 participants</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>40 minutes per meeting</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Screen sharing</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Chat feature</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 border-0">
                  <a href="/signup">Get Started</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 relative scale-105">
              <div className="absolute -top-4 right-0 left-0 flex justify-center">
                <div className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700">Pro</CardTitle>
                <CardDescription>For small teams</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-700">$12</span>
                  <span className="text-muted-foreground">/month per host</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Up to 10 participants</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited meeting duration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Screen sharing & recording</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Meeting scheduling</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 border-0">
                  <a href="/signup">Start 14-day Trial</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Business Plan */}
            <Card className="border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-sky-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-600">Business</CardTitle>
                <CardDescription>For organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-700">$20</span>
                  <span className="text-muted-foreground">/month per host</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Up to 100 participants</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited meeting duration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Admin controls & reports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>24/7 premium support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full border-blue-400 text-blue-700 hover:bg-blue-50">
                  <a href="/contact-sales">Contact Sales</a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <div className="mt-8 max-w-3xl mx-auto space-y-6">
              <div className="p-6 bg-gradient-to-r from-sky-50 to-green-50 rounded-lg border border-sky-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-blue-700">Do I need to install software?</h3>
                <p className="mt-2 text-muted-foreground">
                  No, Glimpse works directly in your web browser. No downloads or installations are required.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-sky-50 to-green-50 rounded-lg border border-sky-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-blue-700">Can I upgrade or downgrade my plan?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, you can change your plan at any time. Upgrades are effective immediately, while downgrades take effect at the end of your billing cycle.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-sky-50 to-green-50 rounded-lg border border-sky-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-blue-700">Is there a free trial?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, we offer a 14-day free trial for our Pro and Business plans, no credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
