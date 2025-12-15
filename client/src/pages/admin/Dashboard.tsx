import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { FolderTree, FileText, Image as ImageIcon, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: categories } = trpc.admin.categories.list.useQuery();
  const { data: listings } = trpc.admin.listings.list.useQuery({});
  const { data: media } = trpc.admin.media.list.useQuery();

  const stats = [
    {
      title: "Categories",
      value: categories?.length || 0,
      icon: FolderTree,
      description: "Tourism categories",
    },
    {
      title: "Listings",
      value: listings?.length || 0,
      icon: FileText,
      description: "Active listings",
    },
    {
      title: "Media Assets",
      value: media?.length || 0,
      icon: ImageIcon,
      description: "Photos, videos & VR",
    },
    {
      title: "Total Views",
      value: listings?.reduce((sum, l) => sum + (l.viewCount || 0), 0) || 0,
      icon: TrendingUp,
      description: "Listing views",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the Namibia Tourism Portal admin dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates to the portal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings?.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{listing.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {listing.viewCount} views
                      </p>
                    </div>
                  </div>
                ))}
                {(!listings || listings.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No listings yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="/admin/listings"
                  className="block p-3 rounded-md border hover:bg-accent transition-colors"
                >
                  <div className="font-medium">Add New Listing</div>
                  <div className="text-sm text-muted-foreground">
                    Create a new tourism service listing
                  </div>
                </a>
                <a
                  href="/admin/media"
                  className="block p-3 rounded-md border hover:bg-accent transition-colors"
                >
                  <div className="font-medium">Upload Media</div>
                  <div className="text-sm text-muted-foreground">
                    Add photos, videos or VR content
                  </div>
                </a>
                <a
                  href="/admin/categories"
                  className="block p-3 rounded-md border hover:bg-accent transition-colors"
                >
                  <div className="font-medium">Manage Categories</div>
                  <div className="text-sm text-muted-foreground">
                    Edit tourism categories
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
