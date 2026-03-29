export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Total Members</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">1,234</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Active Subscriptions</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">856</p>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">$45,230</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% from last month</p>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Equipment</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">234</p>
          <p className="text-xs text-blue-600 mt-2">24 items added this month</p>
        </div>
      </div>
    </div>
  )
}
