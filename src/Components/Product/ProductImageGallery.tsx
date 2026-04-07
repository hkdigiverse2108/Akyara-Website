import type { ProductItem } from "../../Types";

interface ProductImageGalleryProps {product: ProductItem;selectedImage: string;setSelectedImage: (image: string) => void;isImageZoomed: boolean;setIsImageZoomed: (zoomed: boolean) => void;zoomOrigin: { x: number; y: number };handleImageMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;resetImageZoom: () => void;}

export const ProductImageGallery = ({product,selectedImage,setSelectedImage,isImageZoomed,setIsImageZoomed,zoomOrigin,handleImageMouseMove,resetImageZoom,
}: ProductImageGalleryProps) => {
  return (
    <div className="min-w-0 w-full max-w-[640px]">
      <div className="mx-auto flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[2px] p-4 sm:aspect-[5/6] sm:p-5" onMouseEnter={() => setIsImageZoomed(true)} onMouseMove={handleImageMouseMove} onMouseLeave={resetImageZoom}>
        <img src={selectedImage || product.image} alt={product.name} className="block h-full w-full object-contain transition duration-200 ease-out" style={{   transform: isImageZoomed ? "scale(1.45)" : "scale(1)",   transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,}}/>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-2">
        {product.gallery.map((img, index) => {
          const isActive = selectedImage === img;

          return (
            <button key={`gallery-${index}-${img}`} type="button" onClick={() => setSelectedImage(img)} className={`overflow-hidden rounded-[2px] border bg-white transition ${isActive ? "border-[#111827]" : "border-[#eceef2] hover:border-[#c9d1dc]" }`}>
              <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="h-14 w-full object-contain sm:h-16"/>
            </button>
          );
        })}
      </div>
    </div>
  );
};
