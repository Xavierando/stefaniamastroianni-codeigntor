import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  durationMin?: number | null;
  price?: number | null;
}

export function ServiceCard({ id, title, description, durationMin, price }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="flex flex-col h-full bg-white border-0 shadow-sm hover:shadow-soft transition-all duration-300 rounded-[2rem] overflow-hidden p-8">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-2xl font-serif text-brand-contrast group-hover:text-brand-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 mb-8">
          <CardDescription className="text-base text-brand-contrast/70 leading-relaxed font-light mb-6">
            {description}
          </CardDescription>
          
          {(durationMin || price) && (
            <div className="flex items-center gap-6 mt-auto">
              {durationMin && (
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-contrast/50">
                  <Clock size={14} className="mr-2 text-brand-secondary" />
                  {durationMin} min
                </div>
              )}
              {price && (
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-contrast/50">
                  <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full mr-2" />
                  € {price}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0 pt-6 mt-auto">
          <Link to={`/prenota?service_id=${id}`} className="w-full">
            <Button variant="link" className="p-0 h-auto text-brand-primary hover:text-brand-primary/80 flex items-center gap-2 group/btn font-semibold">
              Prenota Ora
              <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
