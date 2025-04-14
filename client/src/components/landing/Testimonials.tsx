import { Star } from "lucide-react";
import { motion } from "framer-motion";

// Define testimonial type for better type safety
interface Testimonial {
    quote: string;
    author: string;
    role: string;
    avatar: string;
    company?: {
        name: string;
        logo?: string;
    };
}

export default function Testimonials() {
    // Expanded testimonials data with more details
    const testimonials: Testimonial[] = [
        {
            quote: "This platform has completely transformed how our remote team collaborates. The video quality is exceptional even with slower connections.",
            author: "Sarah J.",
            role: "Product Manager",
            avatar: "SJ",
        },
        {
            quote: "Setting up meetings has never been easier. The intuitive interface and reliable connections make this our go-to solution for all client meetings.",
            author: "Michael T.",
            role: "CTO",
            avatar: "MT",
        },
        {
            quote: "The security features give us peace of mind when discussing sensitive information with clients across the globe. Best in class encryption.",
            author: "Elena R.",
            role: "Legal Counsel",
            avatar: "ER",
        }
    ];

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    }

    return (
        <section aria-label="Testimonials" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-blue-600 text-sm font-medium mb-4 sm:mb-6">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500" /> Testimonials
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800">Loved by teams worldwide</h2>
                    <p className="mt-2 sm:mt-4 text-base sm:text-lg text-slate-600">
                        See what our users are saying about their experience
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 select-none">
                    {testimonials.slice(0, 3).map((testimonial, i) => (
                        <motion.div
                            key={i}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 md:p-8 border border-sky-100 relative hover:shadow-lg transition-all duration-300 hover:border-green-200 group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 hidden sm:block">
                                <svg width="36" height="24" viewBox="0 0 43 29" className="sm:w-[43px] sm:h-[29px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.7984 0.631644C14.2131 0.631644 16.2557 1.42143 17.9261 3.00101C19.5965 4.58059 20.4317 6.58074 20.4317 9.00148C20.4317 11.3226 19.6261 13.336 18.0149 15.0416C16.4038 16.6475 14.3912 17.4505 11.9773 17.4505C10.6475 17.4505 9.31764 17.2195 7.98777 16.7574C8.86312 18.6372 10.1134 20.2177 11.7387 21.4989C13.3639 22.7801 15.2815 23.4206 17.4913 23.4206V28.2272C14.1229 28.2272 11.0665 27.4108 8.32214 25.778C5.57774 24.1452 3.3643 21.8612 1.68182 18.9262C0.560605 16.9895 0 14.9893 0 12.9257C0 9.61554 1.02876 6.79068 3.08629 4.45112C5.14382 2.11157 8.01768 0.941788 11.7081 0.941788L11.7984 0.631644Z" fill="currentColor" className="fill-sky-200" />
                                    <path d="M33.5601 0.631644C35.9747 0.631644 38.0173 1.42143 39.6877 3.00101C41.3581 4.58059 42.1933 6.58074 42.1933 9.00148C42.1933 11.3226 41.3877 13.336 39.7765 15.0416C38.1654 16.6475 36.1528 17.4505 33.7389 17.4505C32.4091 17.4505 31.0792 17.2195 29.7494 16.7574C30.6247 18.6372 31.875 20.2177 33.5003 21.4989C35.1255 22.7801 37.0431 23.4206 39.2529 23.4206V28.2272C35.8845 28.2272 32.8281 27.4108 30.0837 25.778C27.3393 24.1452 25.1259 21.8612 23.4434 18.9262C22.3222 16.9895 21.7616 14.9893 21.7616 12.9257C21.7616 9.61554 22.7904 6.79068 24.8479 4.45112C26.9054 2.11157 29.7793 0.941788 33.4697 0.941788L33.5601 0.631644Z" fill="currentColor" className="fill-sky-200" />
                                </svg>
                            </div>

                            <div className="mt-4 sm:mt-6">
                                <p className="text-base sm:text-lg leading-relaxed italic text-slate-700">{truncateText(testimonial.quote, 80)}</p>

                                <div className="mt-6 sm:mt-8 flex flex-wrap sm:flex-nowrap items-center">
                                    <div className="flex-shrink-0 size-8 sm:size-10 rounded-full bg-gradient-to-br from-sky-400 to-green-400 flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-sky-200">
                                        {testimonial.avatar}
                                    </div>
                                    <div className="ml-4 flex-grow min-w-0">
                                        <p className="font-medium text-sm sm:text-base text-slate-800 truncate">{testimonial.author}</p>
                                        <p className="text-xs sm:text-sm text-slate-500 truncate">
                                            {testimonial.role} • {testimonial.company?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-300 to-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
