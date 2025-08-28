import { motion } from "framer-motion";
import { Loader2, Trophy, Gamepad2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "default" | "gaming";
}

export function LoadingSpinner({ 
  size = "md", 
  text = "Loading...",
  variant = "default" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (variant === "gaming") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-16 h-16 border-4 border-primary-orange/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-orange rounded-full"></div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Trophy className="w-6 h-6 text-primary-orange" />
          </motion.div>
        </div>
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`${textSizeClasses[size]} font-mono font-medium text-gray-600 dark:text-gray-400`}
        >
          {text}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-orange`} />
      <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400`}>
        {text}
      </span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading Tournament Platform..." variant="gaming" />
    </div>
  );
}