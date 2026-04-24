import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Barbell, Plus } from "../../icons/index";
import AddEquipmentModal from "../../components/ui/AddEquipmentModal";

export default function Equipment() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-secondary-100 min-h-dvh p-10">
      {showModal && <AddEquipmentModal onClose={() => setShowModal(false)} />}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-700">Equipment</h2>
        <Button onClick={() => setShowModal(true)} className="h-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm">
          <Plus size={18} />
          Add Equipment
        </Button>
      </div>
      <div className="bg-white rounded-lg p-6 text-center text-secondary-400 text-sm">Equipment list coming soon...</div>
    </div>
  );
}