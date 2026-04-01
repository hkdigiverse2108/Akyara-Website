type CategoryPageProps = {
  title: string;
  description: string;
};

const CategoryPage = ({ title, description }: CategoryPageProps) => {
  return (
    <section className="mx-auto w-[92%] max-w-[1200px] py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#f6821f]">Collection</p>
      <h1 className="mt-4 text-3xl font-semibold text-[#111111] sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-[640px] text-base leading-7 text-[#666666]">{description}</p>
    </section>
  );
};

export default CategoryPage;
