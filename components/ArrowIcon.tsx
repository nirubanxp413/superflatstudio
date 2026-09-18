export function ArrowIcon() {
  return (
    <div className="relative w-[60px] h-[60px] bg-[#003df5] shrink-0 flex items-center justify-center">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[60px] h-[60px]"
      >
        <g transform="translate(13.25, 13.28)">
          {/* Top horizontal bar */}
          <rect x="0" y="0" width="27.241" height="6.255" fill="#D9D9D9" />
          {/* Right vertical bar */}
          <rect x="27.24" y="6.25" width="6.255" height="27.241" fill="#D9D9D9" />
          {/* Diagonal steps */}
          <rect x="14.4" y="11.9" width="7.198" height="7.198" fill="#D9D9D9" />
          <rect x="7.2" y="19.1" width="7.198" height="7.198" fill="#D9D9D9" />
          <rect x="0" y="26.3" width="7.198" height="7.198" fill="#D9D9D9" />
        </g>
      </svg>
    </div>
  );
}
