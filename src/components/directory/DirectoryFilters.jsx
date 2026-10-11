import { Search, X, SlidersHorizontal } from 'lucide-react';
import {
  DEPARTMENTS,
  ACADEMIC_YEARS,
  ACHIEVEMENT_CATEGORIES,
} from '../../services/directoryTypes';

const DirectoryFilters = ({
  searchQuery,
  setSearchQuery,
  selectedDepartment,
  setSelectedDepartment,
  selectedYear,
  setSelectedYear,
  selectedCategory,
  setSelectedCategory,
  onlyAvailable,
  setOnlyAvailable,
  onReset,
}) => {
  const hasActiveFilters =
    searchQuery ||
    selectedDepartment !== 'All' ||
    selectedYear !== 'All' ||
    selectedCategory !== 'All' ||
    onlyAvailable;

  return (
    <div className="py-8 space-y-6">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ecell-gray/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, skills (e.g. React, PyTorch), competition (e.g. SIH), or role..."
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 text-base focus:outline-none focus:border-ecell-blue focus:bg-white/[0.05] transition-all font-inter"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Row 1: Department Pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono uppercase tracking-widest text-ecell-gray/60">
            Filter by Department
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-ecell-light hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...DEPARTMENTS].map((dept) => {
            const isSelected = selectedDepartment === dept;
            // Short label for cleaner pills
            const label = dept === 'All' ? 'All Departments' : dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-ecell-blue text-white shadow-[0_0_15px_rgba(48,134,248,0.4)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] text-ecell-gray/80 border border-white/[0.06]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Row 2: Category, Academic Year & Availability */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-white/[0.04]">
        
        {/* Category Pills */}
        <div className="md:col-span-6 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-ecell-gray/60 block">
            Achievement Field
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...ACHIEVEMENT_CATEGORIES].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    isSelected
                      ? 'bg-ecell-light/20 text-ecell-glow border border-ecell-light/40 font-medium'
                      : 'bg-white/[0.02] text-white/50 hover:text-white border border-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Academic Year */}
        <div className="md:col-span-3 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-ecell-gray/60 block">
            Academic Year
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['All', ...ACADEMIC_YEARS].map((yr) => {
              const isSelected = selectedYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    isSelected
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/[0.02] text-white/50 hover:text-white border border-white/[0.04]'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Collaboration Status Toggle */}
        <div className="md:col-span-3 space-y-2 flex flex-col justify-end">
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-all">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-ecell-blue focus:ring-0 bg-transparent border-white/20 cursor-pointer"
            />
            <span className="text-xs text-ecell-gray font-medium select-none">
              🔥 Open for Hackathons & Teams
            </span>
          </label>
        </div>

      </div>

    </div>
  );
};

export default DirectoryFilters;
