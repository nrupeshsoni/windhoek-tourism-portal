import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { chatConversations, chatMessages, listings, categories } from "../drizzle/schema";
import { eq, like, or, and, desc, sql } from "drizzle-orm";

// Comprehensive Namibia tourism knowledge base
const NAMIBIA_KNOWLEDGE = `
## NAMIBIA TOURISM KNOWLEDGE BASE

### Key Destinations

**Sossusvlei & Namib Desert**
- Home to the world's oldest desert (80 million years)
- Famous red dunes including Big Daddy (325m) and Dune 45
- Deadvlei: iconic white clay pan with 900-year-old dead camelthorn trees
- Best visited at sunrise for photography
- Located in Namib-Naukluft National Park
- Sesriem Canyon nearby (1km long, 30m deep)

**Etosha National Park**
- One of Africa's greatest wildlife sanctuaries
- 22,270 km² of protected land
- Famous salt pan visible from space
- Wildlife: elephants, lions, rhinos (black & white), giraffes, zebras, springbok
- Waterholes for excellent game viewing
- Best wildlife viewing: May-October (dry season)
- Three main rest camps: Okaukuejo, Halali, Namutoni

**Skeleton Coast**
- Treacherous coastline named for shipwrecks and whale bones
- Fog-shrouded beaches and dramatic landscapes
- Cape Cross seal colony (200,000+ seals)
- Shipwreck Lodge for unique accommodation
- Desert-adapted elephants and lions

**Fish River Canyon**
- Second largest canyon in the world (160km long, 27km wide, 550m deep)
- 5-day hiking trail (85km) - one of Africa's toughest
- Best visited May-September (cooler months)
- Ai-Ais hot springs at southern end

**Swakopmund**
- Adventure capital of Namibia
- German colonial architecture
- Activities: sandboarding, quad biking, skydiving, kayaking with seals
- Gateway to Skeleton Coast and Namib Desert
- Cool coastal climate year-round

**Damaraland**
- Desert-adapted elephants and black rhinos
- Twyfelfontein UNESCO World Heritage Site (rock engravings)
- Petrified Forest
- Brandberg Mountain (highest peak, 2,573m)
- Himba cultural experiences

**Caprivi Strip (Zambezi Region)**
- Lush, tropical region in northeast
- Four major rivers: Zambezi, Chobe, Kwando, Linyanti
- Best for birdwatching (400+ species)
- Connects to Victoria Falls
- Hippos, crocodiles, elephants

**Kaokoland**
- Remote wilderness in northwest
- Himba people - traditional semi-nomadic culture
- Epupa Falls on Kunene River
- Rugged 4x4 adventure territory

### Best Time to Visit

**Dry Season (May-October)**
- Best for wildlife viewing (animals gather at waterholes)
- Cooler temperatures, clear skies
- Peak tourist season
- Book accommodations well in advance

**Green Season (November-April)**
- Dramatic thunderstorms and lush landscapes
- Newborn animals
- Migratory birds arrive
- Lower prices, fewer tourists
- Some roads may be impassable

### Travel Logistics

**Getting There**
- Hosea Kutako International Airport (WDH) near Windhoek
- Direct flights from Johannesburg, Cape Town, Frankfurt, Addis Ababa
- No visa required for most nationalities (90 days)

**Getting Around**
- Self-drive is popular (left-hand traffic)
- 4x4 recommended for gravel roads and remote areas
- Distances are vast - plan accordingly
- Fuel stations can be far apart
- Major rental companies at airport

**Currency & Costs**
- Namibian Dollar (NAD), pegged to South African Rand
- South African Rand accepted everywhere
- ATMs in major towns
- Credit cards widely accepted in tourist areas

**Health & Safety**
- Malaria risk in northern regions (Etosha, Caprivi)
- No yellow fever vaccination required
- Tap water safe in major towns
- Very safe country for tourists
- Watch for wildlife on roads at night

### Wildlife

**Big Five**
- Elephant: Etosha, Damaraland (desert-adapted)
- Lion: Etosha, Kaokoland
- Leopard: Rare, Okonjima (AfriCat Foundation)
- Rhino: Etosha (black & white), Damaraland
- Buffalo: Caprivi Strip only

**Unique Species**
- Oryx (gemsbok): National animal, desert-adapted
- Cheetah: Namibia has largest population
- Desert-adapted elephants: Damaraland
- Hartmann's mountain zebra
- Brown hyena: Skeleton Coast

**Marine Life**
- Cape fur seals: Cape Cross, Walvis Bay
- Dolphins: Walvis Bay cruises
- Whales: Seasonal (July-November)
- Flamingos: Walvis Bay lagoon

### Cultural Experiences

**Himba People**
- Semi-nomadic pastoralists in Kaokoland
- Famous for red ochre body paint (otjize)
- Traditional villages can be visited respectfully
- Support community-based tourism

**San (Bushmen)**
- Indigenous hunter-gatherers
- Rock art at Twyfelfontein
- Cultural experiences near Tsumkwe

**Herero Women**
- Distinctive Victorian-era dresses
- Cattle-herding culture
- Seen throughout central Namibia

### Activities by Region

**Sossusvlei Area**
- Dune climbing at sunrise
- Hot air ballooning
- Scenic flights
- Nature walks
- Stargazing

**Swakopmund/Walvis Bay**
- Sandboarding
- Quad biking
- Skydiving
- Kayaking with seals
- Dolphin cruises
- Fishing
- Living desert tours

**Etosha**
- Game drives (self-drive or guided)
- Night drives at camps
- Waterhole watching
- Photography hides

**Fish River Canyon**
- Multi-day hiking (permit required)
- Scenic viewpoints
- Hot springs at Ai-Ais

### Practical Tips

- Book popular lodges 6-12 months ahead for peak season
- Carry cash for smaller establishments
- Respect wildlife - maintain safe distances
- Support community conservancies
- Carry plenty of water when traveling
- Check road conditions before remote travel
- Sunset is around 6-7pm year-round (near equator)
`;

const SYSTEM_PROMPT = `You are a knowledgeable and friendly Namibia tourism assistant for the official Namibia tourism portal. Your role is to help visitors discover and plan their trips to Namibia.

${NAMIBIA_KNOWLEDGE}

## YOUR CAPABILITIES

You have access to the platform's database of tourism businesses and can recommend specific listings when relevant. When users ask about accommodations, tours, activities, or services, you can search the database and provide personalized recommendations.

## RESPONSE GUIDELINES

1. **Be Helpful & Informative**: Provide detailed, accurate information about Namibia
2. **Use Database When Relevant**: When users ask about specific services (lodges, tours, restaurants), search the database and recommend listings
3. **Format Recommendations Nicely**: When recommending listings, include:
   - Name and brief description
   - Location/region
   - Key features
   - Encourage them to explore more on the website
4. **Be Conversational**: Keep a friendly, enthusiastic tone about Namibia
5. **Provide Context**: Explain why certain destinations or times are recommended
6. **Safety First**: Include relevant safety tips when appropriate

## RESTRICTIONS

- DO NOT make up business names or details not in the database
- DO NOT provide specific prices (they change frequently)
- DO NOT make bookings - direct users to contact businesses directly
- Focus on helping users discover what Namibia offers

When you receive database search results, incorporate them naturally into your response.`;

// Search listings based on user query
async function searchListings(query: string, limit: number = 5) {
  const database = await getDb();
  if (!database) return [];

  // Extract keywords from query
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  // Build search conditions
  const searchTerms = keywords.map(k => `%${k}%`);
  
  try {
    const results = await database
      .select({
        id: listings.id,
        name: listings.name,
        slug: listings.slug,
        shortDescription: listings.shortDescription,
        location: listings.location,
        region: listings.region,
        priceRange: listings.priceRange,
        features: listings.features,
        categoryId: listings.categoryId,
        isVerified: listings.isVerified,
      })
      .from(listings)
      .where(
        and(
          eq(listings.isActive, true),
          or(
            ...searchTerms.flatMap(term => [
              like(listings.name, term),
              like(listings.description, term),
              like(listings.location, term),
              like(listings.region, term),
            ])
          )
        )
      )
      .orderBy(desc(listings.isFeatured), desc(listings.viewCount))
      .limit(limit);

    // Get category names
    const categoryIds = Array.from(new Set(results.map(r => r.categoryId)));
    const cats = await database
      .select()
      .from(categories)
      .where(sql`${categories.id} IN (${categoryIds.join(',')})`);
    
    const categoryMap = new Map(cats.map(c => [c.id, c.name]));

    return results.map(r => ({
      ...r,
      categoryName: categoryMap.get(r.categoryId) || 'Unknown',
      features: r.features ? JSON.parse(r.features) : [],
    }));
  } catch (error) {
    console.error("Error searching listings:", error);
    return [];
  }
}

// Get featured listings for general recommendations
async function getFeaturedListings(categorySlug?: string, limit: number = 3) {
  const database = await getDb();
  if (!database) return [];

  try {
    let query = database
      .select({
        id: listings.id,
        name: listings.name,
        slug: listings.slug,
        shortDescription: listings.shortDescription,
        location: listings.location,
        region: listings.region,
        priceRange: listings.priceRange,
        categoryId: listings.categoryId,
      })
      .from(listings)
      .where(and(eq(listings.isActive, true), eq(listings.isFeatured, true)))
      .orderBy(desc(listings.viewCount))
      .limit(limit);

    const results = await query;

    // Get category names
    const categoryIds = Array.from(new Set(results.map(r => r.categoryId)));
    if (categoryIds.length === 0) return [];
    
    const cats = await database
      .select()
      .from(categories)
      .where(sql`${categories.id} IN (${categoryIds.join(',')})`);
    
    const categoryMap = new Map(cats.map(c => [c.id, c.name]));

    return results.map(r => ({
      ...r,
      categoryName: categoryMap.get(r.categoryId) || 'Unknown',
    }));
  } catch (error) {
    console.error("Error getting featured listings:", error);
    return [];
  }
}

// Detect if query is asking for recommendations
function needsListingSearch(message: string): boolean {
  const searchTriggers = [
    'recommend', 'suggestion', 'where can i', 'where should i',
    'best place', 'good place', 'looking for', 'find me',
    'lodge', 'hotel', 'campsite', 'camp', 'accommodation', 'stay',
    'tour', 'safari', 'guide', 'operator',
    'restaurant', 'eat', 'dining', 'food',
    'activity', 'adventure', 'things to do',
    'shuttle', 'transport', 'transfer', 'rental',
    'book', 'booking',
  ];
  
  const lowerMessage = message.toLowerCase();
  return searchTriggers.some(trigger => lowerMessage.includes(trigger));
}

// Extract search context from message
function extractSearchContext(message: string): { query: string; category?: string } {
  const lowerMessage = message.toLowerCase();
  
  // Detect category
  let category: string | undefined;
  if (lowerMessage.includes('lodge') || lowerMessage.includes('hotel')) {
    category = 'lodges-hotels';
  } else if (lowerMessage.includes('camp')) {
    category = 'campsites';
  } else if (lowerMessage.includes('tour') || lowerMessage.includes('safari')) {
    category = 'tour-operators';
  } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('eat') || lowerMessage.includes('food')) {
    category = 'restaurants-dining';
  } else if (lowerMessage.includes('adventure') || lowerMessage.includes('activity')) {
    category = 'adventure-activities';
  }
  
  return { query: message, category };
}

export const chatbotRouter = router({
  sendMessage: publicProcedure
    .input(z.object({
      message: z.string(),
      sessionId: z.string(),
      conversationId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const database = await getDb();
      if (!database) {
        throw new Error("Database not available");
      }

      let conversationId = input.conversationId;

      // Create or get conversation
      if (!conversationId) {
        const result = await database.insert(chatConversations).values({
          sessionId: input.sessionId,
        });
        conversationId = Number((result as any).insertId);
      }

      // Save user message
      await database.insert(chatMessages).values({
        conversationId: conversationId!,
        role: "user" as const,
        content: input.message as string,
      });

      // Get conversation history
      const history = await database
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, conversationId))
        .orderBy(chatMessages.createdAt);

      // Check if we need to search listings
      let listingContext = "";
      if (needsListingSearch(input.message)) {
        const { query, category } = extractSearchContext(input.message);
        const searchResults = await searchListings(query, 5);
        
        if (searchResults.length > 0) {
          listingContext = `\n\n## RELEVANT LISTINGS FROM DATABASE\n\nBased on the user's query, here are matching listings you can recommend:\n\n`;
          searchResults.forEach((listing, i) => {
            listingContext += `${i + 1}. **${listing.name}** (${listing.categoryName})\n`;
            listingContext += `   - Location: ${listing.location || listing.region || 'Namibia'}\n`;
            listingContext += `   - ${listing.shortDescription || 'No description available'}\n`;
            if (listing.features && listing.features.length > 0) {
              listingContext += `   - Features: ${listing.features.slice(0, 4).join(', ')}\n`;
            }
            if (listing.isVerified) {
              listingContext += `   - ✓ NTB Verified\n`;
            }
            listingContext += `\n`;
          });
          listingContext += `\nIncorporate these recommendations naturally in your response. Encourage users to explore the Explore page for more options.`;
        } else {
          // Get featured listings as fallback
          const featured = await getFeaturedListings(category, 3);
          if (featured.length > 0) {
            listingContext = `\n\n## FEATURED LISTINGS\n\nNo exact matches found, but here are some featured options:\n\n`;
            featured.forEach((listing, i) => {
              listingContext += `${i + 1}. **${listing.name}** (${listing.categoryName}) - ${listing.location || listing.region}\n`;
            });
            listingContext += `\nSuggest these or encourage users to browse the Explore page.`;
          }
        }
      }

      // Build messages for LLM
      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: SYSTEM_PROMPT + listingContext },
      ];

      // Add conversation history (limit to last 10 messages to avoid token limits)
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      }

      // Get AI response
      const response = await invokeLLM({ messages });
      const rawContent = response.choices[0]?.message?.content;
      const assistantMessage = typeof rawContent === 'string' 
        ? rawContent 
        : "I apologize, but I couldn't generate a response. Please try again.";

      // Save assistant message
      await database.insert(chatMessages).values({
        conversationId: conversationId!,
        role: "assistant" as const,
        content: assistantMessage as string,
      });

      return {
        conversationId,
        message: assistantMessage,
      };
    }),

  getConversation: publicProcedure
    .input(z.object({
      conversationId: z.number(),
    }))
    .query(async ({ input }) => {
      const database = await getDb();
      if (!database) {
        return [];
      }

      const messages = await database
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, input.conversationId))
        .orderBy(chatMessages.createdAt);

      return messages;
    }),

  // New endpoint to get quick suggestions
  getSuggestions: publicProcedure
    .query(async () => {
      return [
        "What are the must-see destinations in Namibia?",
        "When is the best time to visit Etosha?",
        "Can you recommend lodges near Sossusvlei?",
        "What adventure activities are available in Swakopmund?",
        "Tell me about the Himba people",
        "How do I get around Namibia?",
      ];
    }),
});
