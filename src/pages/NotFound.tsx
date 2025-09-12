import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full gradient-card shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">404</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
              <p className="text-muted-foreground">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full transition-bounce"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full gradient-primary transition-bounce"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
