import { Card } from "@/components/ui/Card";
import { Quote } from "lucide-react";

export interface ReviewProps {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  socialLink?: string | null;
  category?: string | null; // To eventually filter reviews by service type
}

export function ReviewCard({ review }: { review: ReviewProps }) {
  return (
    <Card className="flex flex-col sm:flex-row h-full overflow-hidden bg-white border border-brand-primary/10 shadow-sm hover:shadow-md transition-shadow relative">
      
      {/* Visual / Image Column */}
      <div className="relative w-full sm:w-1/3 min-h-[250px] shrink-0 bg-brand-primary/5 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-brand-primary/10">
        {review.imageUrl ? (
          <img 
            src={review.imageUrl} 
            alt={review.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <span className="text-brand-primary/20 font-serif font-bold text-8xl uppercase">
            {review.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Content Column */}
      <div className="flex flex-col p-8 sm:w-2/3 justify-between relative">
        <Quote size={40} className="absolute top-6 left-6 text-brand-primary/10 z-0" />
        
        <div className="relative z-10 mb-8 mt-4">
          <p className="text-brand-contrast/80 italic leading-relaxed text-lg">
            "{review.description}"
          </p>
        </div>

        <div className="relative z-10 mt-auto pt-4 border-t border-brand-primary/10">
          <h4 className="font-bold text-brand-primary text-xl mb-1">{review.name}</h4>
          {review.category && (
            <span className="text-xs text-brand-contrast/50 uppercase tracking-widest font-medium">
              {review.category}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
