import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MapPin, ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";

export default function CategoryDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: category, isLoading: categoryLoading } = trpc.categories.getBySlug.useQuery({ slug });
  const { data: listings, isLoading: listingsLoading } = trpc.listings.list.useQuery({
    categoryId: category?.id,
  }, {
    enabled: !!category,
  });

  if (categoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-green-500/10 py-12 px-4">
        <div className="container">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{category.icon}</div>
            <div>
              <h1 className="text-4xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground text-lg mt-2">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 px-4 container">
        {listingsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading listings...</p>
          </div>
        ) : listings && listings.length > 0 ? (
          <>
            <div className="mb-6 text-muted-foreground">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} in this category
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.slug}`}>
                  <Card className="hover:shadow-xl transition-all cursor-pointer h-full">
                    <div className="aspect-video bg-gradient-to-br from-orange-200 via-blue-200 to-green-200" />
                    <CardHeader>
                      <CardTitle>{listing.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {listing.shortDescription || listing.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {listing.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{listing.location}</span>
                          </div>
                        )}
                        {listing.priceRange && (
                          <div className="text-sm font-semibold text-primary">
                            {listing.priceRange}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No listings available in this category yet
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
