import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
    return (
            <div className="container flex flex-col items-center justify-center py-20">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
                <p className="mt-2 text-muted-foreground text-center max-w-md">
                    We couldn't find the page you're looking for. The link might be incorrect or the page may have been removed.
                </p>
                <Button asChild className="mt-8">
                    <Link to="/">Return Home</Link>
                </Button>
            </div>
    );
}
