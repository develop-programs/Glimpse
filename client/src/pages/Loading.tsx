import { motion } from "motion/react"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative">
            {/* Animated background blobs */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute top-[40%] right-[20%] w-40 h-40 rounded-full bg-sky-400/10 blur-xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 2
                    }}
                />
            </div>

            <div className="relative z-10 text-center">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-sky-300 to-purple-300 bg-clip-text text-transparent">
                        Glimpse
                    </h1>
                    <p className="text-sky-200 text-lg md:text-xl mb-10 tracking-wide">
                        Setting up your secure connection...
                    </p>
                </motion.div>

                {/* Loading animation - dots */}
                <motion.div
                    className="flex justify-center items-center space-x-4 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-4 w-4 md:h-5 md:w-5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </motion.div>

                {/* Video camera icon with rings */}
                <div className="relative w-32 h-32 mx-auto mb-10">
                    {/* Outer rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-sky-400/20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-purple-400/20"
                        animate={{ scale: [1.1, 1.3, 1.1] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5
                        }}
                    />

                    {/* Pulsing circle */}
                    <motion.div
                        className="absolute inset-2 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-full"
                        animate={{
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                    />

                    {/* Icon container */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.6,
                            type: "spring",
                            stiffness: 100
                        }}
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </motion.div>
                </div>

                {/* Status text */}
                <motion.div
                    className="text-sky-200 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <p className="mb-2 text-base">Preparing your video conferencing experience</p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-sky-300/70">
                        <span className="inline-block w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                        <p>This will only take a moment</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
