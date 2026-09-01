import {
  DEFAULT_MOCKUP_STATE,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
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

export function HeroMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/90 bg-[#0c0c0e]">
      {/* The window is authored at DESIGN_WIDTH and scaled to fit the hero column. */}
      <div className="w-full [container-type:inline-size]">
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={ASPECT_STYLE}
          role="img"
          aria-label={ALT}
        >
          <div className="absolute top-0 left-0 origin-top-left" style={SCALE_STYLE}>
            <MockupWindow state={DEFAULT_MOCKUP_STATE} />
          </div>
        </div>
      </div>
    </div>
  );
}
