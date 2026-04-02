import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  durationMin?: number | null;
  price?: number | null;
}

export function ServiceCard({ id, title, description, durationMin, price }: ServiceCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-brand-secondary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-base text-brand-contrast/80 leading-relaxed mb-4">
          {description}
        </CardDescription>
        
        {/* Metadata section (duration/price) could go here if available */}
        {(durationMin || price) && (
          <div className="flex items-center gap-4 text-sm text-brand-contrast/60 mb-2">
            {durationMin && (
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {durationMin} minuti
              </div>
            )}
            {price && (
              <div className="flex items-center font-medium">
                € {price}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/prenota?service_id=${id}`} className="w-full">
          <Button variant="outline" className="w-full group">
            Prenota Ora
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
