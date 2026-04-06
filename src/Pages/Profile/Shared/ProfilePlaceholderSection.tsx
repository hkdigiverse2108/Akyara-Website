import type { ProfilePlaceholderSectionProps } from "../../../Types";

const ProfilePlaceholderSection = ({ eyebrow, title, description, emptyMessage }: ProfilePlaceholderSectionProps) => {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#ece6db] bg-white shadow-[0_14px_36px_rgba(17,17,17,0.06)]">
      <div className="border-b border-[#efe7dd] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#f6821f]">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold text-[#111111] sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-[#5f6774] sm:text-base">{description}</p>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-[10px] border border-dashed border-[#d9d9d9] bg-[#f9fafb] px-5 py-8 text-center text-sm text-[#5f6774] sm:text-base">
          {emptyMessage}
        </div>
      </div>
    </div>
  );
};

export default ProfilePlaceholderSection;
