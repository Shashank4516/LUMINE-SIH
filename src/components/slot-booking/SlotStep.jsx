import React from "react";

const SlotStep = ({
  isActive,
  temple,
  selectedTempleId = "",
  date,
  timeSlot,
  temples: fetchedTemples = [],
  onTempleChange,
  onDateChange,
  onTimeChange,
  // Prediction props
  availableNodes = [],
  selectedNodeId = "",
  onNodeChange,
  predictions,
  isLoadingPredictions,
}) => {
  if (!isActive) return null;

  // Use fetched temples from backend, or fallback to hardcoded list
  // IMPORTANT: Use database ID directly as the value
  const rawTemples =
    fetchedTemples.length > 0
      ? fetchedTemples.map((t) => ({
          id: t.id, // Use database ID directly
          name: t.name,
        }))
      : [
          // Fallback with hardcoded IDs (these should match database)
          { id: 1, name: "Somnath Temple" },
          { id: 2, name: "Dwarkadhish Temple" },
          { id: 3, name: "Nageshwar Jyotirlinga" },
          { id: 4, name: "Rukmini Devi Temple" },
        ];

  // Deduplicate temples based on ID to prevent duplicates in dropdown
  const temples = Array.from(
    new Map(rawTemples.map((item) => [item.id, item])).values()
  );

  const timeSlots = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
  ];

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // Filter slots based on predictions if available
  const getFilteredSlots = () => {
    if (!predictions || !predictions.slots) return timeSlots;

    const counts = Object.values(predictions.slots);
    if (counts.length === 0) return timeSlots;

    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const range = max - min;
    
    // Dynamic threshold: Lower 50% of the range are "Recommended"
    // If range is 0 (all same), all are recommended
    const threshold = range === 0 ? max : min + range * 0.5;

    return timeSlots.filter(slot => {
      const count = predictions.slots[slot];
      // If slot has no prediction data, maybe show it? Or hide? 
      // Let's assume if it's not in predictions, we show it (or maybe it's not available).
      // But for now, let's just check if count <= threshold
      if (count === undefined) return true; 
      return count <= threshold;
    });
  };

  const displaySlots = getFilteredSlots();

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          Select Your Slot
        </h2>
        <p className="text-gray-600 text-sm">
          Choose your preferred temple, date, and time slot
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Temple
          </label>
          <select
            value={selectedTempleId}
            onChange={(e) => {
              const selectedValue = e.target.value;
              const selectedOption = e.target.options[e.target.selectedIndex];
              const templeName = selectedOption ? selectedOption.text : "";
              // Pass both ID and name to ensure we have the name even if temples array isn't loaded
              onTempleChange(selectedValue, templeName);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 text-gray-900"
          >
            <option value="">Select a temple</option>
            {temples.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            min={today}
            max={maxDateStr}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 text-gray-900"
          />
        </div>

        {/* Node Selection - Only show if nodes are available */}
        {availableNodes.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Location (Gate/Zone)
            </label>
            <select
              value={selectedNodeId}
              onChange={(e) => onNodeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 text-gray-900"
            >
              {availableNodes.map((node) => (
                <option key={node.node_id} value={node.node_id}>
                  {node.node_id}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose a specific entry point to see crowd predictions.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time Slot {predictions && <span className="text-green-600 text-xs ml-2">(Showing Recommended Slots)</span>}
          </label>
          
          {isLoadingPredictions ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displaySlots.map((slot) => {
                const count = predictions?.slots?.[slot];
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onTimeChange(slot)}
                    className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center ${
                      timeSlot === slot
                        ? "border-saffron-600 bg-saffron-50 text-saffron-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <span>{slot}</span>
                    {count !== undefined && (
                      <span className="text-xs text-green-600 font-semibold mt-1">
                        ~{count} visitors
                      </span>
                    )}
                  </button>
                );
              })}
              {displaySlots.length === 0 && predictions && (
                <div className="col-span-2 text-center text-gray-500 py-4">
                  No recommended slots available for this date.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotStep;
