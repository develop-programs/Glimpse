import { Check } from 'lucide-react'

// Extract steps data outside component for cleaner rendering
const PROCESS_STEPS = [
  {
    step: 1,
    title: "Create or Join",
    description: "Start a new meeting instantly or join with a meeting code in just one click",
    color: "from-blue-600 to-indigo-500"
  },
  {
    step: 2,
    title: "Invite Others",
    description: "Share the meeting link or code with participants via any platform",
    color: "from-indigo-500 via-purple-500 to-blue-500"
  },
  {
    step: 3,
    title: "Collaborate",
    description: "Enjoy crystal-clear video, screen sharing, and interactive tools",
    color: "from-teal-400 via-blue-500 to-indigo-500"
  }
]

export default function HowItWork() {
  return (
    <section className='container mx-auto py-24'>
      <div>
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-blue-600 text-sm font-medium mb-6 border border-green-100/50 shadow-sm">
            <Check className="w-4 h-4 mr-2 animate-pulse" /> Simple Process
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join a meeting in seconds, no downloads or complex setup required
          </p>
        </div>

        {/* Steps Section */}
        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent -translate-y-1/2 hidden md:block" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PROCESS_STEPS.map(({ step, title, description, color }) => (
              <div
                key={step}
                className="relative z-10 bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg transition-all duration-300 border border-border hover:border-sky-300/50 group"
              >
                {/* Hover effects */}
                <div className="absolute -inset-px bg-gradient-to-br from-transparent to-sky-100/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all" />
                <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-green-100/30 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity" />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`bg-gradient-to-br ${color} h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {step}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-3">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-400/60 to-green-400/60 mt-6 rounded-full group-hover:w-24 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
