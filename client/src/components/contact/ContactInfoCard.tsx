import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type ContactInfo = {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  color: "blue" | "indigo" | "purple";
};

type ContactInfoCardProps = {
  info: ContactInfo;
};

export default function ContactInfoCard({ info }: ContactInfoCardProps) {
  const { title, description, items, icon: Icon, color } = info;
  
  const colorClasses = {
    blue: {
      border: "border-blue-100 dark:border-blue-900/50",
      gradient: "from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/30",
      bgGradient: "from-blue-500/10",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconText: "text-blue-600 dark:text-blue-400",
      iconHover: "group-hover:bg-blue-600",
      itemText: "text-blue-600 dark:text-blue-400",
      itemDot: "bg-blue-500"
    },
    indigo: {
      border: "border-indigo-100 dark:border-indigo-900/50",
      gradient: "from-white/90 to-indigo-50/90 dark:from-slate-800/90 dark:to-indigo-900/30",
      bgGradient: "from-indigo-500/10",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
      iconText: "text-indigo-600 dark:text-indigo-400",
      iconHover: "group-hover:bg-indigo-600",
      itemText: "text-indigo-600 dark:text-indigo-400",
      itemDot: "bg-indigo-500"
    },
    purple: {
      border: "border-purple-100 dark:border-purple-900/50",
      gradient: "from-white/90 to-purple-50/90 dark:from-slate-800/90 dark:to-purple-900/30",
      bgGradient: "from-purple-500/10",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconText: "text-purple-600 dark:text-purple-400",
      iconHover: "group-hover:bg-purple-600",
      itemText: "text-purple-600 dark:text-purple-400",
      itemDot: "bg-purple-500"
    }
  };
  
  const classes = colorClasses[color];

  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.6 }
      }
    }} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card className={`overflow-hidden border ${classes.border} bg-gradient-to-br ${classes.gradient} backdrop-blur-md shadow-xl rounded-3xl group`}>
        <div className={`absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r ${classes.bgGradient} to-transparent`}></div>
        <CardContent className="p-[clamp(1.25rem,1rem+1vw,2rem)] relative">
          <div className="flex gap-5 items-start">
            <div className={`${classes.iconBg} rounded-2xl p-4 ${classes.iconText} ${classes.iconHover} group-hover:text-white transition-colors duration-300`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-[clamp(1.1rem,1rem+0.5vw,1.25rem)] font-bold mb-3">{title}</h3>
              <p className="text-[clamp(0.9rem,0.85rem+0.25vw,1rem)] text-slate-600 dark:text-slate-300 mb-5">{description}</p>
              
              {items.map((item, index) => (
                <div 
                  key={index} 
                  className={`font-medium ${classes.itemText} text-[clamp(0.875rem,0.825rem+0.25vw,0.95rem)] flex items-center gap-2 ${index !== items.length - 1 ? 'mb-1' : ''} group-hover:translate-x-1 transition-transform duration-${200 + index * 100}`}
                >
                  <span className={`inline-block w-1 h-1 ${classes.itemDot} rounded-full`}></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
