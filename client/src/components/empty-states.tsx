import { motion } from "framer-motion";
import { Trophy, Search, Plus, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface EmptyStateProps {
  variant: "no-tournaments" | "no-search-results" | "no-filters";
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  searchQuery?: string;
}

export function EmptyState({ 
  variant, 
  title, 
  description, 
  actionText, 
  actionHref, 
  onAction,
  searchQuery 
}: EmptyStateProps) {
  const icons = {
    "no-tournaments": Trophy,
    "no-search-results": Search,
    "no-filters": Filter
  };

  const colors = {
    "no-tournaments": "text-primary-orange",
    "no-search-results": "text-blue-500",
    "no-filters": "text-purple-500"
  };

  const IconComponent = icons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-4"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center`}
      >
        <IconComponent className={`w-12 h-12 ${colors[variant]}`} />
      </motion.div>

      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-mono"
      >
        {title}
      </motion.h3>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed"
      >
        {description}
        {searchQuery && (
          <span className="block mt-2 font-mono text-sm">
            Search: <span className="text-primary-orange font-bold">"{searchQuery}"</span>
          </span>
        )}
      </motion.p>

      {(actionText && (actionHref || onAction)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {actionHref ? (
            <Link href={actionHref}>
              <Button className="gradient-primary text-white px-8 py-3 font-mono">
                <Plus className="w-5 h-5 mr-2" />
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={onAction}
              className="gradient-primary text-white px-8 py-3 font-mono"
            >
              {actionText}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function NoTournaments() {
  return (
    <EmptyState
      variant="no-tournaments"
      title="No Tournaments Available"
      description="Ready to start your gaming journey? Create your first tournament and bring the community together for epic battles!"
      actionText="Create Tournament"
      actionHref="/create-tournament"
    />
  );
}

export function NoSearchResults({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      variant="no-search-results"
      title="No Tournaments Found"
      description="We couldn't find any tournaments matching your search criteria. Try different keywords or browse all tournaments."
      searchQuery={searchQuery}
    />
  );
}

export function NoFilterResults({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      variant="no-filters"
      title="No Tournaments Match Your Filters"
      description="Try adjusting your filters to discover more tournaments that match your gaming preferences."
      actionText="Clear All Filters"
      onAction={onClearFilters}
    />
  );
}