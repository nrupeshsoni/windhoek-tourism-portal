import { trpc } from "@/lib/trpc";

export default function RoutesTest() {
  const { data: routes, isLoading, error, status, fetchStatus } = trpc.routes.list.useQuery({});

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Routes Debug</h1>
      <div className="space-y-2 mb-8">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Fetch Status:</strong> {fetchStatus}</p>
        <p><strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}</p>
        <p><strong>Error:</strong> {error ? error.message : "None"}</p>
        <p><strong>Routes Count:</strong> {routes?.length ?? "N/A"}</p>
      </div>
      
      {routes && routes.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">First 5 Routes:</h2>
          {routes.slice(0, 5).map((route) => (
            <div key={route.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{route.name}</h3>
              <p className="text-gray-600">{route.duration} days - {route.difficulty}</p>
              <p className="text-sm text-gray-500">{route.startLocation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
