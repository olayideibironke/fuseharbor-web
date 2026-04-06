import { MapPin, ShieldCheck, Sparkles } from "lucide-react";

type PublicLaunchNoteProps = {
  title?: string;
  description?: string;
};

export function PublicLaunchNote({
  title = "Maryland-first, premium rollout",
  description = "FuseHarbor is being launched carefully with a quality-first approach. The platform is focused on a cleaner homeowner experience, stronger pro fit, and a more polished electrification marketplace before broader rollout.",
}: PublicLaunchNoteProps) {
  return (
    <div className="rounded-[32px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-6 shadow-sm lg:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-white/80 px-4 py-2 text-sm font-semibold text-fh-graphite">
          <MapPin size={15} className="text-fh-copper" />
          Maryland first
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-white/80 px-4 py-2 text-sm font-semibold text-fh-graphite">
          <ShieldCheck size={15} className="text-fh-copper" />
          Trust-led rollout
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-white/80 px-4 py-2 text-sm font-semibold text-fh-graphite">
          <Sparkles size={15} className="text-fh-copper" />
          Premium positioning
        </div>
      </div>

      <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
        {title}
      </h3>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-fh-stone">
        {description}
      </p>
    </div>
  );
}