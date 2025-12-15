import { trpc } from "@/lib/trpc";

export default function RoutesDebug() {
  const { data, isLoading, error } = trpc.routes.list.useQuery({});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Routes Debug</h1>
      
      <div className="mb-4">
        <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
      </div>
      
      <div className="mb-4">
        <strong>Error:</strong> {error ? error.message : "None"}
      </div>
      
      <div className="mb-4">
        <strong>Data count:</strong> {data ? data.length : "null"}
      </div>
      
      {data && data.length > 0 && (
        <div>
          <strong>First route:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
            {JSON.stringify(data[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
