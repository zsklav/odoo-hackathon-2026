export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join TransitOps today</p>
        </div>
        
        {/* Skeleton Form */}
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="admin@transitops.com" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Role</label>
            <select id="role" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors">
              <option value="FleetManager">Fleet Manager</option>
              <option value="SafetyOfficer">Safety Officer</option>
              <option value="FinancialAnalyst">Financial Analyst</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drivers are registered by Fleet Managers directly.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" id="password" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" placeholder="••••••••" />
          </div>
          
          <button type="button" className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Register
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
        </p>
      </div>
    </div>
  );
}
