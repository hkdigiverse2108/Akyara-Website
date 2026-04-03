type CategoryCardProps = {
  title: string;
  count: string;
  image: string;
  contentClass: string;
  imageWrapClass: string;
  imageClass?: string;
  imageAlignClass?: string;
  isLarge?: boolean;
  useImageAsBackground?: boolean;
};

const CategoryCard = ({
  title,
  count,
  image,
  contentClass,
  imageWrapClass,
  imageClass,
  imageAlignClass,
  isLarge = false,
  useImageAsBackground = false,
}: CategoryCardProps) => {
  const imageSizeClass = "h-full max-h-none";

  return (
    <div
      className={`group relative h-full w-full overflow-hidden    [&_a]:text-black  ${
        isLarge ? "min-h-[220px] sm:min-h-[260px] lg:row-span-2 lg:min-h-[520px]" : "min-h-[200px] sm:min-h-[240px]"
      }`}
    >
      {useImageAsBackground && (
        <div
          className="pointer-events-none absolute inset-0 origin-bottom-left bg-cover bg-no-repeat bg-left-bottom transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
      )}
      {useImageAsBackground ? (
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.75)_36%,rgba(255,255,255,0.08)_74%)]"
          aria-hidden="true"
        />
      ) : null}
      <div className="relative z-10 flex h-full w-full items-stretch gap-3 sm:gap-6">
        <div className={`flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-6 lg:p-8 ${contentClass}`}>
          <div>
            <h3 className="text-[1.02rem] font-bold uppercase tracking-wide text-black sm:text-[1.08rem] lg:text-lg">{title}</h3>
            <p className="mt-1 text-sm text-gray-700 sm:text-[0.95rem]">{count}</p>
          </div>

          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-black px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 hover:bg-black hover:text-white sm:mt-5 sm:min-w-[150px] sm:w-auto sm:px-5 sm:py-2.5">
            Browse Items
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <div
          className={`pointer-events-none flex h-full min-w-0 justify-end transition-transform duration-500 group-hover:scale-[1.04] ${
            imageAlignClass ?? "items-end"
          } ${imageWrapClass}`}
        >
          {!useImageAsBackground && (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className={`h-full w-full object-contain object-right object-bottom transition-transform duration-500 ${imageSizeClass} ${
                imageClass ?? ""
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
