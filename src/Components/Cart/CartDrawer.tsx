import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Drawer, Typography } from "antd";
import { Link } from "react-router-dom";
import { useCart } from "../../Hooks/useCart";
import EmptyState from "../EmptyState";

const { Title, Text } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
 // const navigate = useNavigate();
  const { cartList, removeCartItem, toggleCart } = useCart();
 // const { isAuthenticated } = useAppSelector((state) => state.auth);

  const parsePrice = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const calculateSubtotal = () => {
    return cartList.reduce((acc: number, item: any) => {
      const price = parsePrice(item.price || item.productId?.sellingPrice);
      const qty = item.quantity || 1;
      return acc + price * qty;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  // const handleCheckout = () => {
  //   onClose();
  //   // Checkout disabled for now as requested
  //   // if (isAuthenticated) {
  //   //   navigate("/checkout");
  //   // } else {
  //   //   navigate(ROUTES.AUTH.LOGIN);
  //   // }
  // };

  return (
    <Drawer open={open} onClose={onClose} width={300} closable={false} styles={{ header: { padding: 0, border: 'none' }, body: { padding: 0 }, footer: { padding: 0, border: 'none' } }}
      footer={
        cartList.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-5 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="mb-5 space-y-2">
              <div className="flex items-center justify-between">
                <Text className="text-gray-400 text-xs font-medium">Estimated Shipping</Text>
                <Text className="text-green-600 font-bold uppercase tracking-widest text-[0.6rem]">Free</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm font-bold text-[#111827]">Total Amount</Text>
                <Text className="text-xl font-black text-[#111827] tracking-tighter italic">Rs {subtotal.toLocaleString("en-IN")}</Text>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Button size="large" className="h-12 w-full rounded-xl border border-gray-100 text-sm font-bold text-[#111827] hover:!border-black hover:!text-black" onClick={onClose}>Continue Shopping</Button>
            </div>
          </div>
        )
      }
    >
      <div className="flex h-full flex-col font-display">
        <div className="relative flex items-center justify-between border-b border-[#f1f1f1] px-5 py-5 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <ShoppingOutlined className="text-base" />
            </div>
            <div>
              <Title level={5} style={{ margin: 0 }} className="font-bold tracking-tight">Your Bag</Title>
              <Text className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{cartList.length} Items</Text>
            </div>
          </div>
          <Button type="text"icon={<CloseOutlined className="text-[10px]" />}onClick={onClose}className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-all hover:rotate-90 hover:!bg-black hover:!text-white"/>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2 scrollbar-hide">
          {cartList.length === 0 ? (
            <EmptyState title="Bag is Empty"description="Your curation awaits. Start exploring our latest collections to fill your bag."buttonText="Start Curating"onButtonClick={onClose}/>
          ) : (
            <div className="space-y-6 py-4">
              {cartList.map((item: any) => {
                const productId = item.productId?._id || item.productId;
                const pIdString = typeof productId === 'string' ? productId : productId?._id;
                const name = item.name || item.productId?.title || "Exclusive Item";
                const price = parsePrice(item.price || item.productId?.sellingPrice);
                const image = item.image || item.productId?.thumbnail || "/assets/images/placeholder.jpg";
                const quantity = item.quantity || 1;

                const uniqueKey = `${pIdString}-${item.size || ''}-${item.color || ''}`;

                return (
                  <div key={uniqueKey} className="group flex items-center gap-5">
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f9f9f9]">
                      <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                           <Link to={`/products/${pIdString}`} onClick={onClose} className="line-clamp-2 text-[0.92rem] font-bold leading-snug text-[#111827] transition hover:text-[#ef6b4a]">{name}</Link>
                           <Button type="text" icon={<DeleteOutlined className="text-lg" />} onClick={() => removeCartItem(pIdString, item.size, item.color)} className="text-gray-300 hover:!text-red-500 hover:!bg-red-50 p-0 h-auto"/>
                        </div>
                        {(item.size || item.color) && (
                          <div className="mt-2 flex gap-1.5 flex-wrap">
                             {item.size && <span className="text-[0.65rem] font-black text-gray-500 bg-gray-100 rounded-md px-2 py-0.5 uppercase tracking-wide">Sz: {item.size}</span>}
                             {item.color && <span className="text-[0.65rem] font-black text-gray-500 bg-gray-100 rounded-md px-2 py-0.5 uppercase tracking-wide">Cl: {item.color}</span>}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-xl bg-gray-50 p-1 ring-1 ring-gray-100">
                          <Button type="text" size="small" icon={<MinusOutlined className="text-[10px]" />} onClick={() => toggleCart(item, -1)} disabled={quantity <= 1} className="flex items-center justify-center rounded-lg hover:!bg-white hover:!shadow-sm text-gray-400 hover:!text-black disabled:opacity-30"/>
                          <span className="w-10 text-center text-sm font-black text-[#111827]">{quantity}</span>
                          <Button type="text" size="small" icon={<PlusOutlined className="text-[10px]" />} onClick={() => toggleCart(item, 1)} className="flex items-center justify-center rounded-lg hover:!bg-white hover:!shadow-sm text-gray-400 hover:!text-black"/>
                        </div>
                        <Text className="text-base font-black text-[#111827]">Rs {(price * quantity).toLocaleString("en-IN")}</Text>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
