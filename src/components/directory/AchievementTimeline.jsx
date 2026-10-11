import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import EvidenceModal from './EvidenceModal';

const AchievementTimeline = ({ achievements = [] }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  if (!achievements || achievements.length === 0) {
    return (
      <div className="py-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <Award className="w-10 h-10 text-white/20 mx-auto mb-3" />
        <p className="text-sm text-ecell-gray/60 font-mono">
          No qualifying achievements recorded yet.
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 border-b border-white/[0.08]">
      
      {/* Section Identifier */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ecell-light block mb-1">
            Section 02 // Documented Record
          </span>
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
            Verified Achievements & Honors
          </h2>
        </div>
        <div className="font-mono text-xs text-ecell-gray/60 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
          {achievements.length} Qualifying Milestones
        </div>
      </div>

      {/* Numbered Editorial Index */}
      <div className="space-y-6">
        {achievements.map((item, idx) => {
          const numberLabel = String(idx + 1).padStart(2, '0');

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-ecell-blue/40 p-6 md:p-8 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Column 1: Number & Level */}
                <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between gap-4">
                  <div className="font-mono text-3xl md:text-4xl font-bold text-white/30 group-hover:text-ecell-blue transition-colors">
                    {numberLabel}
                  </div>

                  <div className="space-y-1.5 text-right lg:text-left">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider font-semibold bg-ecell-blue/15 text-ecell-glow border border-ecell-blue/30">
                      {item.level} Level
                    </span>
                    <div className="text-xs font-mono text-ecell-gray/60">
                      {item.date}
                    </div>
                  </div>
                </div>

                {/* Column 2: Title, Organizer, Description */}
                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-ecell-light mb-1">
                      <span>{item.event}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                    <h3 className="font-sora text-xl md:text-2xl font-bold text-white group-hover:text-ecell-glow transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                      Organized by {item.organizer}
                    </p>
                  </div>

                  <p className="text-sm text-ecell-gray leading-relaxed font-light">
                    {item.description}
                  </p>

                  {/* Position Pill */}
                  {item.position && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {item.position}
                    </div>
                  )}
                </div>

                {/* Column 3: Evidence & Verification Actions */}
                <div className="lg:col-span-3 flex lg:flex-col gap-2.5 justify-end lg:items-end pt-2">
                  <button
                    onClick={() => setSelectedAchievement(item)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-ecell-blue text-white text-xs font-medium border border-white/10 hover:border-ecell-blue transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Inspect Proof
                  </button>

                  {item.verificationLink && (
                    <a
                      href={item.verificationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-transparent hover:bg-white/[0.05] text-ecell-light hover:text-white text-xs font-mono transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Official Link
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal for viewing certificate evidence */}
      <EvidenceModal
        isOpen={Boolean(selectedAchievement)}
        onClose={() => setSelectedAchievement(null)}
        achievement={selectedAchievement}
      />

    </section>
  );
};

export default AchievementTimeline;
