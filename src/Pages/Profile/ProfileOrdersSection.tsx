import { CheckCircleFilled, ClockCircleOutlined, CloseCircleFilled, ShoppingOutlined, TruckOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";
import type { OrderCard, OrderStatus } from "../../Types";



const sampleOrders: OrderCard[] = [
  {
    id: "#AKY-24091",
    date: "03 Apr 2026",
    status: "Delivered",
    total: 2499,
    payment: "UPI",
    address: "Dodge City, Kansas, United States",
    items: [
      { name: "Classic Cotton Shirt", quantity: 1, size: "M", color: "Blue" },
      { name: "Denim Cargo Pants", quantity: 1, size: "32", color: "Charcoal" },
    ],
  },
  {
    id: "#AKY-24106",
    date: "01 Apr 2026",
    status: "Shipped",
    total: 1799,
    payment: "COD",
    eta: "Expected by 06 Apr 2026",
    address: "Nashville, Tennessee, United States",
    items: [{ name: "Relaxed Fit T-Shirt", quantity: 2, size: "L", color: "White" }],
  },
  {
    id: "#AKY-24118",
    date: "29 Mar 2026",
    status: "Cancelled",
    total: 999,
    payment: "Card",
    address: "Longview, Texas, United States",
    items: [{ name: "Athletic Joggers", quantity: 1, size: "M", color: "Olive" }],
  },
];

const statusBadgeClass: Record<OrderStatus, string> = {
  Delivered: "bg-[#e9f8ef] text-[#0f9d58]",
  Processing: "bg-[#fff7e8] text-[#b26800]",
  Shipped: "bg-[#eef4ff] text-[#2f5fc6]",
  Cancelled: "bg-[#ffeaea] text-[#c62828]",
};

const statusIcon: Record<OrderStatus, ReactNode> = {
  Delivered: <CheckCircleFilled />,
  Processing: <ClockCircleOutlined />,
  Shipped: <TruckOutlined />,
  Cancelled: <CloseCircleFilled />,
};

const formatPrice = (amount: number) => `Rs ${amount.toLocaleString("en-IN")}`;

const ProfileOrdersSection = () => {
  const totalOrders = sampleOrders.length;
  const deliveredOrders = sampleOrders.filter((order) => order.status === "Delivered").length;
  const processingOrders = sampleOrders.filter((order) => order.status === "Processing" || order.status === "Shipped").length;
  const cancelledOrders = sampleOrders.filter((order) => order.status === "Cancelled").length;

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#e6ebf1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">My Order</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">Order Summary</h2>
            <p className="mt-2 text-sm text-[#5b6472]">Track deliveries, review purchases, and check order status updates.</p>
          </div>
          <Link
            to={ROUTES.INFO.TRACKING}
            className="inline-flex items-center gap-2 rounded-full border border-[#dde4ee] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a]"
          >
            <ShoppingOutlined />
            Track Order
          </Link>
        </div>
      </div>

      <div className="grid gap-4 border-b border-[#e6ebf1] p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-6 xl:p-8">
        {[
          { label: "Total Orders", value: totalOrders },
          { label: "Delivered", value: deliveredOrders },
          { label: "In Progress", value: processingOrders },
          { label: "Cancelled", value: cancelledOrders },
        ].map((summary) => (
          <div key={summary.label} className="rounded-[12px] border border-[#e8edf4] bg-white p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">{summary.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{summary.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 p-4 lg:p-6 xl:p-8">
        {sampleOrders.map((order) => (
          <article key={order.id} className="rounded-[12px] border border-[#e5e9f0] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eef2f8] pb-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">Order ID</p>
                <h3 className="mt-1 text-base font-semibold text-[#0f172a]">{order.id}</h3>
                <p className="mt-1 text-sm text-[#5b6472]">Placed on {order.date}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[order.status]}`}>
                  {statusIcon[order.status]}
                  {order.status}
                </span>
                <p className="text-sm font-semibold text-[#111827]">{formatPrice(order.total)}</p>
              </div>
            </div>

            <div className="grid gap-4 pt-4 md:grid-cols-[minmax(0,1fr)_240px]">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">Items</p>
                <ul className="mt-2 space-y-2">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.name}`} className="rounded-[10px] border border-[#edf1f7] bg-[#f9fbff] px-3 py-2 text-sm text-[#374151]">
                      <span className="font-semibold text-[#111827]">{item.name}</span>
                      {` x${item.quantity}`}
                      {item.size ? ` | Size ${item.size}` : ""}
                      {item.color ? ` | ${item.color}` : ""}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[10px] border border-[#edf1f7] bg-[#f8fafc] p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">Delivery</p>
                <p className="mt-2 text-sm text-[#374151]">{order.address}</p>
                <p className="mt-2 text-sm font-medium text-[#111827]">Payment: {order.payment}</p>
                {order.eta ? <p className="mt-1 text-xs text-[#2f5fc6]">{order.eta}</p> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProfileOrdersSection;
