interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Generating content...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-primary-500/20" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" />
      </div>
      <p className="text-gray-400 text-sm font-medium">{message}</p>
      <div className="flex gap-1.5 mt-3">
        <div className="w-2 h-2 rounded-full bg-primary-500 typing-dot" />
        <div className="w-2 h-2 rounded-full bg-primary-500 typing-dot" />
        <div className="w-2 h-2 rounded-full bg-primary-500 typing-dot" />
      </div>
    </div>
  )
}
