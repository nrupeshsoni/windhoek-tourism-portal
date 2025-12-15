import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { MapPin, Calendar } from "lucide-react";

export default function RoutesSimple() {
  const { data: routes, isLoading, error } = trpc.routes.list.useQuery({});

  if (isLoading) {
    return <div className="p-8">Loading routes...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Travel Routes ({routes?.length || 0})</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes?.map((route) => (
          <Link key={route.id} href={`/routes/${route.slug}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{route.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{route.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {route.duration} {route.duration === 1 ? "Day" : "Days"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {route.startLocation}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
