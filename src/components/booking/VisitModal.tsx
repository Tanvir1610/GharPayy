"use client";
import { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { PGProperty } from "@/types";

interface Props {
  pg: PGProperty;
  userId?: string;
  onClose: () => void;
}

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM",
];

export default function VisitModal({ pg, userId, onClose }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSchedule = async () => {
    if (!userId) { toast.error("Please sign in first"); router.push("/login"); return; }
    if (!date || !time) { toast.error("Please select date and time"); return; }

    setLoading(true);
    const { error } = await supabase.from("visit_schedules").insert({
      pg_id: pg.id,
      user_id: userId,
      visit_date: date,
      visit_time: time,
      status: "Scheduled",
    });
    setLoading(false);
    if (error) { toast.error("Failed to schedule. Please try again."); return; }
    toast.success("Visit scheduled! You'll receive a confirmation.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-display font-bold text-gray-900">Schedule a Visit</h2>
            <p className="text-sm text-gray-500 mt-0.5">{pg.gharpayy_name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Date */}
          <div>
            <label className="label flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Select Date
            </label>
            <input
              type="date"
              min={minDateStr}
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Time slots */}
          <div>
            <label className="label flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Select Time Slot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2 px-1 rounded-xl border-2 text-xs font-medium transition-all ${time === slot ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-100 text-gray-600 hover:border-orange-200"}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {date && time && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-orange-700">
              📅 Visit scheduled for <strong>{new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</strong> at <strong>{time}</strong>
            </div>
          )}

          <button onClick={handleSchedule} disabled={loading || !date || !time} className="btn-primary w-full py-4 justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Confirm Visit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
