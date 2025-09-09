import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "./Header";
import Footer from "./Footer";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "success") {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
      };

      const redirectTimer = setTimeout(() => {
        window.location.replace(
          "https://smart-promotion-app-vendor.vercel.app"
        );
      }, 3000);

      return () => {
        clearTimeout(redirectTimer);
        window.onpopstate = null;
      };
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="mt-4 text-2xl">
                Payment Successful!
              </CardTitle>
              <CardDescription>
                Your subscription is active. Redirecting you to your
                dashboard...
              </CardDescription>
            </CardHeader>
          </Card>
        );
      case "failed":
        return (
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto bg-red-100 rounded-full p-3 w-fit">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="mt-4 text-2xl">Payment Failed</CardTitle>
              <CardDescription>
                There was an issue processing your payment. No charge was made.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link to="/">Try Again</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      default:
        return (
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto bg-yellow-100 rounded-full p-3 w-fit">
                <AlertTriangle className="w-10 h-10 text-yellow-600" />
              </div>
              <CardTitle className="mt-4 text-2xl">Invalid Status</CardTitle>
              <CardDescription>
                Something went wrong. Please return to the homepage.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        {renderContent()}
      </div>
      <Footer />
    </>
  );
};

export default PaymentStatus;
