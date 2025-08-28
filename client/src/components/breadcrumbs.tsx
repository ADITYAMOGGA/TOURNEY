import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
      aria-label="Breadcrumb"
    >
      <Link href="/" className="flex items-center hover:text-primary-orange transition-colors">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          {item.current ? (
            <span className="font-medium text-gray-900 dark:text-white font-mono">
              {item.label}
            </span>
          ) : item.href ? (
            <Link 
              href={item.href}
              className="hover:text-primary-orange transition-colors font-mono"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-mono">{item.label}</span>
          )}
        </div>
      ))}
    </motion.nav>
  );
}