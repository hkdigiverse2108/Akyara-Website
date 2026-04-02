import type { ProfilePlaceholderSectionProps } from "./types/index";

const ProfilePlaceholderSection = ({eyebrow,title,description,emptyMessage,}: ProfilePlaceholderSectionProps) => {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#ece7e1] bg-white shadow-[0_20px_55px_rgba(17,17,17,0.06)]">
      <div className="border-b border-[#f0ebe6] bg-[linear-gradient(180deg,#ffffff_0%,#fdf9f4_100%)] px-7 py-8 sm:px-9">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.34em] text-[#f6821f]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[#111111] sm:text-[2rem]">{title}</h2>
        <p className="mt-4 max-w-[720px] text-base leading-7 text-[#666666]">{description}</p>
      </div>

      <div className="p-7 sm:p-9">
        <div className="rounded-[10px] border border-dashed border-[#e3d8ca] bg-[#faf7f2] px-6 py-10 text-center">
          <p className="text-sm font-medium text-[#8c8c8c]">{emptyMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePlaceholderSection;
