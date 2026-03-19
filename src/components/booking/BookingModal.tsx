"use client";
import { useState } from "react";
import { X, Home, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { PGProperty } from "@/types";

interface Props {
  pg: PGProperty;
  userId?: string;
  onClose: () => void;
}

const PAYMENT_METHODS = ["UPI", "Card", "Cash", "Bank Transfer"] as const;

export default function BookingModal({ pg, userId, onClose }: Props) {
  const router = useRouter();

  const roomOptions = [
    { label: "Triple Sharing", price: pg.price_triple, key: "Triple Sharing" },
    { label: "Double Sharing", price: pg.price_double, key: "Double Sharing" },
    { label: "Single / Private", price: pg.price_single, key: "Single Sharing" },
  ].filter((r) => r.price && r.price > 0);

  const [roomType, setRoomType] = useState(
    roomOptions[1]?.key || roomOptions[0]?.key || ""
  );
  const [moveInDate, setMoveInDate] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]>("UPI");
  const [loading, setLoading] = useState(false);

  const selectedRoom = roomOptions.find((r) => r.key === roomType);
  const rent = selectedRoom?.price || 0;
  const deposit = rent;

  const handleBook = async () => {
    if (!userId) {
      toast.error("Please sign in first");
      router.push("/login");
      return;
    }
    if (!moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }
    if (!roomType) {
      toast.error("Please select a room type");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      pg_id: pg.id,
      user_id: userId,
      room_type: roomType,
      move_in_date: moveInDate,
      payment_method: paymentMethod,
      monthly_rent: rent,
      security_deposit: deposit,
      status: "Pending",
    });

    setLoading(false);
    if (error) {
      toast.error("Booking failed. Please try again.");
      return;
    }
    toast.success("Booking request sent! We'll confirm shortly.");
    onClose();
    router.push("/dashboard");
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-display font-bold text-gray-900">Book Your Room</h2>
            <p className="text-sm text-gray-500 mt-0.5">{pg.gharpayy_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Room type */}
          <div>
            <label className="label">Room Type</label>
            <div className="space-y-2">
              {roomOptions.map((r) => (
                <label
                  key={r.key}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    roomType === r.key
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-100 hover:border-orange-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="room"
                      value={r.key}
                      checked={roomType === r.key}
                      onChange={() => setRoomType(r.key)}
                      className="accent-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{r.label}</span>
                  </div>
                  <span className="font-display font-bold text-orange-500">
                    ₹{r.price?.toLocaleString()}/mo
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Move-in date */}
          <div>
            <label className="label">Move-in Date</label>
            <input
              type="date"
              min={minDateStr}
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="label">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    paymentMethod === pm
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-100 text-gray-600 hover:border-orange-200"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          {rent > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Monthly Rent</span>
                <span className="font-medium">₹{rent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Security Deposit (1 month)</span>
                <span className="font-medium">₹{deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Due Now</span>
                <span className="text-orange-500">₹{(rent + deposit).toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={loading}
            className="btn-primary w-full py-4 justify-center text-base"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Home className="w-5 h-5" />
                Confirm Booking
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Booking request will be confirmed within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
