import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactInfoCard from "./ContactInfoCard";

const contactInfoData = [
  {
    title: "Email Us",
    description: "Our team typically responds within 24 hours",
    items: ["support@glimpse.app", "sales@glimpse.app"],
    icon: Mail,
    color: "blue" as const
  },
  {
    title: "Call Us",
    description: "Available Monday through Friday, 9am-6pm EST",
    items: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    icon: Phone,
    color: "indigo" as const
  },
  {
    title: "Visit Us",
    description: "Drop by our office for a coffee and chat",
    items: ["123 Tech Avenue", "San Francisco, CA 94107"],
    icon: MapPin,
    color: "purple" as const
  }
];

export default function ContactInfoSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <motion.div
      className="lg:col-span-5 order-1 lg:order-2 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {contactInfoData.map((info, index) => (
        <ContactInfoCard key={index} info={info} />
      ))}
    </motion.div>
  );
}
