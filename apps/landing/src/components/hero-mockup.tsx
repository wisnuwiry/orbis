import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import {
  DEFAULT_MOCKUP_STATE,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  MOCKUP_STATES,
  type MockupStateId,
  MockupWindow,
} from "~/components/mockup";

const ALT =
  "Padu desktop app with coding agents, a conversation, and a code diff open side by side";

const ASPECT_STYLE = { aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` };

// `tan(atan2(a, b))` is the CSS way to divide one length by another, so the scale
// factor tracks the container with no JS, no layout thrash, and a correct
// server-rendered first paint.
const SCALE_STYLE = {
  width: DESIGN_WIDTH,
  height: DESIGN_HEIGHT,
  transform: `scale(tan(atan2(100cqw, ${DESIGN_WIDTH}px)))`,
};

const PILL_TRANSITION = { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] as const };

export function HeroMockup() {
  const [state, setState] = useState<MockupStateId>(DEFAULT_MOCKUP_STATE);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-white/[0.03] p-1 rounded-full border border-white/[0.08] backdrop-blur-xl w-fit mx-auto shadow-lg shadow-black/40">
        {MOCKUP_STATES.map((option) => (
          <StatePill
            key={option.id}
            id={option.id}
            label={option.label}
            selected={option.id === state}
            onSelect={setState}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/90 bg-[#0c0c0e]/90">
        {/* The window is authored at DESIGN_WIDTH and scaled to fit the hero column. */}
        <div className="w-full [container-type:inline-size]">
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={ASPECT_STYLE}
            role="img"
            aria-label={ALT}
          >
            <div className="absolute top-0 left-0 origin-top-left" style={SCALE_STYLE}>
              <MockupWindow state={state} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatePill({
  id,
  label,
  selected,
  onSelect,
}: {
  id: MockupStateId;
  label: string;
  selected: boolean;
  onSelect: (id: MockupStateId) => void;
  }) {
  const select = useCallback(() => onSelect(id), [onSelect, id]);
  return (
    <button
      type="button"
      onClick={select}
      aria-pressed={selected}
      className={`relative cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all sm:text-sm ${
        selected ? "text-white" : "text-zinc-400 hover:text-white"
      }`}
    >
      {selected ? (
        <motion.span
          layoutId="hero-mockup-pill"
          transition={PILL_TRANSITION}
          className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15 ring-inset shadow-sm"
        />
      ) : null}
      <span className="relative">{label}</span>
    </button>
  );
}
