import { useState, useEffect } from "react";
import { Button } from "./Button";
import { User, EnvelopeSimple, Phone, X, IdentificationCard, PencilSimple } from "../../icons/index";
import { GenderIntersex, CalendarDots, MoneyWavy, ListNumbers, HourglassSimple, CalendarBlank } from "@phosphor-icons/react";
import { api } from "../../services/api";

const tabs = ["Information", "Subscription"];

export default function AddMemberModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("Information");
  const [isClosing, setIsClosing] = useState(false);
  const [useSavedPlan, setUseSavedPlan] = useState(true);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    gender: "Male", birthDate: "", medicalCertificate: null,
    plan: "", startDate: "", priceOverride: "",
  });

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch plans on mount
  useEffect(() => {
    async function loadPlans() {
      setLoadingPlans(true);
      try {
        const data = await api.listPlans();
        if (Array.isArray(data)) {
          setPlans(data);
          if (data.length > 0) {
            setForm(prev => ({
              ...prev,
              plan: data[0].id || data[0].planId || ""
            }));
          }
        }
      } catch (err) {
        console.error("Error loading plans:", err);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, medicalCertificate: e.target.files[0] });

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!form.firstName || !form.lastName || !form.email) {
      setError("Please fill out all required fields (First Name, Last Name, and Email).");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Member
      const formData = new FormData();
      formData.append("FirstName", form.firstName);
      formData.append("LastName", form.lastName);
      formData.append("Email", form.email);
      formData.append("PhoneNumber", form.phone || "");
      formData.append("Gender", form.gender);
      formData.append("DateOfBirth", form.birthDate ? new Date(form.birthDate).toISOString() : new Date().toISOString());
      formData.append("Objectives", "Lose weight, build muscle");
      formData.append("MedicalRestrictions", "None");
      formData.append("Status", "Active");

      if (form.medicalCertificate) {
        formData.append("ProfilePicture", form.medicalCertificate);
      }

      const memberResponse = await api.createMember(formData);
      const memberId = memberResponse?.memberId || memberResponse?.Data?.memberId || memberResponse?.data?.memberId;

      if (!memberId) {
        throw new Error("Member was created, but no Member ID was returned from backend.");
      }

      // 2. Add Subscription (if requested)
      if (activeTab === "Subscription" && form.plan) {
        const selectedPlanObj = plans.find(p => (p.id || p.planId) === form.plan);
        const planId = selectedPlanObj ? (selectedPlanObj.id || selectedPlanObj.planId) : form.plan;

        const subResponse = await api.createSubscription({
          memberId,
          planId,
          paymentMethod: "Cash",
          notes: "Initial membership subscription created via Admin portal."
        });

        const subscriptionId = subResponse?.subscriptionId || subResponse?.Data?.subscriptionId || subResponse?.data?.subscriptionId;

        // 3. Auto Confirm Payment if Cash Method
        if (subscriptionId) {
          const planPrice = selectedPlanObj ? (selectedPlanObj.price || selectedPlanObj.amount || 0) : 0;
          const finalAmount = parseFloat(form.priceOverride) || planPrice;

          await api.confirmCashPayment({
            subscriptionId,
            amountReceived: finalAmount,
            paymentMethod: "Cash",
            notes: "Cash payment received at counter during member creation."
          });
        }
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (err) {
      console.error("Error adding member:", err);
      setError(err.message || "Failed to save member. Please check your network or backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4">
      <div className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl transition-all duration-300 ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <User size={20} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-semibold text-lg">Add Member</h2>
          </div>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-secondary-200 px-6">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-normal border-b-2 transition-all cursor-pointer ${activeTab === tab ? "border-primary-600 text-primary-600" : "border-transparent text-secondary-400 hover:text-secondary-700"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "Information" && (
            <div className="flex flex-col gap-4">

              {/* Full Name */}
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter member's full name</label>
                <div className="flex gap-3">
                  <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 flex-1 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all h-10">
                    <User size={16} className="text-secondary-300 shrink-0" />
                    <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange}
                      className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                  </div>
                  <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 flex-1 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all h-10">
                    <User size={16} className="text-secondary-300 shrink-0" />
                    <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange}
                      className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter member's Email</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                  <EnvelopeSimple size={16} className="text-secondary-300 shrink-0" />
                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter member's Phone Number</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                  <Phone size={16} className="text-secondary-300 shrink-0" />
                  <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Select member's Gender</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <GenderIntersex size={16} className="text-secondary-300 shrink-0" />
                  <select name="gender" value={form.gender} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Select member's Birth date</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <CalendarBlank size={16} className="text-secondary-300 shrink-0" />
                  <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                </div>
              </div>

              {/* Medical Certificate */}
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Upload member's Medical Certificate</label>
                <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-600 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                      <span className="text-secondary-400 text-lg">☁</span>
                    </div>
                    <p className="text-xs text-secondary-500">choose a file or drag an drop it here.</p>
                    <p className="text-xs text-secondary-300">PDF, JPEG, Max up to 20MB</p>
                    <label className="mt-1 cursor-pointer">
                      <span className="border border-secondary-300 text-secondary-600 text-xs px-4 py-1.5 rounded-lg hover:bg-secondary-100 transition">Browse File</span>
                      <input type="file" accept=".pdf,.jpeg,.jpg" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "Subscription" && (
            <div className="flex flex-col gap-4">

              {/* Plan Type Toggle */}
              <div className="flex gap-2">
                <button onClick={() => setUseSavedPlan(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm transition-all cursor-pointer ${useSavedPlan ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-secondary-200 text-secondary-500'}`}>
                  <IdentificationCard size={16} /> Use Saved Plan
                </button>
                <button onClick={() => setUseSavedPlan(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm transition-all cursor-pointer ${!useSavedPlan ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-secondary-200 text-secondary-500'}`}>
                  <PencilSimple size={16} /> Create Custom Plan
                </button>
              </div>
              {useSavedPlan ? (
                (() => {
                  const selectedPlanObj = plans.find(p => (p.id || p.planId) === form.plan) || plans[0] || { name: "Loading plans...", price: 0, sessionCount: 0, duration: "N/A" };
                  const finalPrice = form.priceOverride || selectedPlanObj.price || 0;
                  return (
                    <>
                      {/* Select Plan */}
                      <div>
                        <label className="text-xs text-secondary-500 font-normal mb-2 block">Select member's Plan</label>
                        <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                          <span className="text-secondary-300 text-base">☆</span>
                          <select name="plan" value={form.plan} onChange={handleChange}
                            className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                            {plans.map(p => (
                              <option key={p.id || p.planId} value={p.id || p.planId}>
                                {p.name} - ${p.price}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Plan Card */}
                      <div className="border border-secondary-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-semibold text-secondary-700">{selectedPlanObj.name}</p>
                            <p className="text-xs text-secondary-400 mt-0.5">All-access gym membership plan.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary-600">${selectedPlanObj.price}</p>
                            <p className="text-xs text-secondary-400">/ {selectedPlanObj.duration || "1 Month"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="flex items-center gap-1 text-xs bg-secondary-100 text-secondary-600 px-2.5 py-1 rounded-full">
                            {selectedPlanObj.sessionCount || selectedPlanObj.sessions || "∞"} Sessions
                          </span>
                          <span className="flex items-center gap-1 text-xs bg-secondary-100 text-secondary-600 px-2.5 py-1 rounded-full">⏰ Peak Hours Included</span>
                        </div>
                      </div>

                      {/* Start Date & Price Override */}
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-secondary-500 font-normal mb-2 block">Start Date</label>
                          <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                            <CalendarDots size={16} className="text-secondary-300 shrink-0" />
                            <input name="startDate" type="date" value={form.startDate} onChange={handleChange}
                              className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-secondary-500 font-normal mb-2 block">Price Override ($)</label>
                          <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                            <MoneyWavy size={16} className="text-secondary-300 shrink-0" />
                            <input name="priceOverride" placeholder={selectedPlanObj.price} value={form.priceOverride} onChange={handleChange}
                              className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                          </div>
                        </div>
                      </div>

                      {/* Subscription Summary */}
                      <div className="border border-secondary-200 rounded-xl p-4 bg-secondary-50">
                        <p className="text-sm font-semibold text-secondary-700 mb-3">Subscription Summary</p>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                            <CalendarDots size={18} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="text-xs text-secondary-400">Expiration Date</p>
                            <p className="text-sm font-semibold text-secondary-700">
                              {form.startDate ? new Date(new Date(form.startDate).setMonth(new Date(form.startDate).getMonth() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '1 Month from Start'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                            <ListNumbers size={18} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="text-xs text-secondary-400">Session Allowance</p>
                            <p className="text-sm font-semibold text-secondary-700">{selectedPlanObj.sessionCount || selectedPlanObj.sessions || "Unlimited"}</p>
                          </div>
                        </div>
                        <div className="border-t border-secondary-200 mt-4 pt-4 flex items-center justify-between">
                          <p className="text-sm text-secondary-600">Due Today</p>
                          <p className="text-3xl font-bold text-secondary-700">${finalPrice}</p>
                        </div>
                        <p className="text-xs text-secondary-400 mt-1">First billing cycle starts on member activation.</p>
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
                  <div>
                    <label className="text-xs text-secondary-500 font-normal mb-2 block">Plan Name</label>
                    <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                      <span className="text-secondary-300 text-sm">eg.</span>
                      <input placeholder="Personal Training Bundle"
                        className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-secondary-500 font-normal mb-2 block">Description</label>
                    <textarea placeholder="Provide details about sessions, inclusions, and benefits." rows={3}
                      className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all" />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-secondary-500 font-normal mb-2 block">Price ($)</label>
                      <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                        <MoneyWavy size={16} className="text-secondary-300 shrink-0" />
                        <input placeholder="4.00" className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-secondary-500 font-normal mb-2 block">Session Count</label>
                      <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                        <ListNumbers size={16} className="text-secondary-300 shrink-0" />
                        <input placeholder="13" className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-secondary-500 font-normal mb-2 block">Plan Name</label>
                    <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                      <span className="text-secondary-300 text-sm">eg.</span>
                      <input placeholder="Personal Training Bundle"
                        className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-secondary-500 font-normal mb-2 block">Start Date</label>
                      <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                        <CalendarDots size={16} className="text-secondary-300 shrink-0" />
                        <input type="date" className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-secondary-500 font-normal mb-2 block">Calculate End Date</label>
                      <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                        <CalendarDots size={16} className="text-secondary-300 shrink-0" />
                        <input type="date" className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-secondary-500 font-normal mb-2 block">Duration Value</label>
                      <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                        <HourglassSimple size={16} className="text-secondary-300 shrink-0" />
                        <input placeholder="1" className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-secondary-500 font-normal mb-2 block">Unit</label>
                      <select className="w-full border border-secondary-200 rounded-lg px-3 h-10 text-sm text-secondary-700 outline-none focus:border-primary-600 transition-all bg-transparent">
                        <option>Month</option>
                        <option>Week</option>
                        <option>Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-xl bg-secondary-50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-secondary-200 flex items-center justify-center">
                        <span className="text-xs">🔒</span>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Access Rule 1</p>
                        <p className="text-xs text-secondary-400">Family access</p>
                      </div>
                    </div>
                    <button className="w-11 h-6 rounded-full bg-primary-600 relative transition-colors cursor-pointer shrink-0">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>

                  <div className="border border-secondary-200 rounded-xl p-4 bg-secondary-50">
                    <p className="text-sm font-semibold text-secondary-700 mb-3">Subscription Summary</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <CalendarDots size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-400">Expiration Date</p>
                        <p className="text-sm font-semibold text-secondary-700">May 20, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <ListNumbers size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-400">Session Allowance</p>
                        <p className="text-sm font-semibold text-secondary-700">Unlimited</p>
                      </div>
                    </div>
                    <div className="border-t border-secondary-200 mt-4 pt-4 flex items-center justify-between">
                      <p className="text-sm text-secondary-600">Due Today</p>
                      <p className="text-3xl font-bold text-secondary-700">$9.99</p>
                    </div>
                    <p className="text-xs text-secondary-400 mt-1">Next billing cycle starts May 20, 2025.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 px-6 py-4 border-t border-secondary-200 bg-white rounded-b-2xl">
          {error && (
            <p className="text-rose-600 text-xs font-semibold text-center bg-rose-50 border border-rose-100 py-2 px-3 rounded-lg">
              ✕ {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-600 text-xs font-semibold text-center bg-emerald-50 border border-emerald-100 py-2 px-3 rounded-lg">
              ✓ Member added successfully! Verification email is being dispatched...
            </p>
          )}
          <div className="flex items-center justify-end gap-3 w-full">
            <Button 
              onClick={handleClose} 
              disabled={loading}
              className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || success}
              className="bg-primary-600 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : success ? (
                "Success"
              ) : (
                activeTab === "Subscription" ? "Add Subscription" : "Add Member"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}