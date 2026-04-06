type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  stacked?: boolean;
};

const sizeClasses = {
  sm: {
    badge: "h-10 w-10 text-xs",
    title: "text-base",
    subtitle: "text-[11px]",
    gap: "gap-3",
  },
  md: {
    badge: "h-11 w-11 text-sm",
    title: "text-lg",
    subtitle: "text-xs",
    gap: "gap-3",
  },
  lg: {
    badge: "h-14 w-14 text-base",
    title: "text-xl",
    subtitle: "text-sm",
    gap: "gap-4",
  },
};

export function BrandMark({
  size = "md",
  showWordmark = true,
  stacked = false,
}: BrandMarkProps) {
  const classes = sizeClasses[size];

  return (
    <div
      className={`flex ${
        stacked ? "flex-col items-start" : "items-center"
      } ${classes.gap}`}
    >
      <div className="relative">
        <div
          className={`flex ${classes.badge} items-center justify-center rounded-full bg-fh-graphite font-semibold text-fh-white shadow-[0_10px_30px_rgba(35,38,43,0.16)]`}
        >
          FH
        </div>
        <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border border-fh-white bg-fh-copper" />
      </div>

      {showWordmark ? (
        <div>
          <p
            className={`font-[family-name:var(--font-manrope)] ${classes.title} font-semibold tracking-tight text-fh-graphite`}
          >
            FuseHarbor
          </p>
          <p className={`${classes.subtitle} text-fh-stone`}>
            Premium Home Electrification Marketplace
          </p>
        </div>
      ) : null}
    </div>
  );
}