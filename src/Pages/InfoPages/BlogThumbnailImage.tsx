import { useMemo, useState } from "react";
import { getBlogThumbnailCandidates } from "./blogData";

type BlogThumbnailImageProps = {
  value?: string;
  alt: string;
  className: string;
  loading?: "lazy" | "eager";
};

const BlogThumbnailImage = ({ value, alt, className, loading = "lazy" }: BlogThumbnailImageProps) => {
  const candidates = useMemo(() => getBlogThumbnailCandidates(value), [value]);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentSource = candidates[activeIndex];
  if (!currentSource) return <div aria-hidden="true" className={`${className} bg-[#eef1f5]`} />;

  return (
    <img
      src={currentSource}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        setActiveIndex((previous) => (previous + 1 < candidates.length ? previous + 1 : previous));
      }}
    />
  );
};

export default BlogThumbnailImage;
