import pg from 'pg';
import mysql from 'mysql2/promise';

const { Client } = pg;

// Supabase connection - using pooler for better connectivity
const supabaseUrl = 'postgresql://postgres.fykchaqksvuwweuzgkxt:hUX347Rcy%25Pu_.q@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

// Current TiDB connection (from environment)
const tidbUrl = process.env.DATABASE_URL;

const PREFIX = 'namibia_na_26_';

async function createSupabaseTables(client) {
  console.log('Creating tables with prefix:', PREFIX);
  
  // Create users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}users (
      id SERIAL PRIMARY KEY,
      open_id VARCHAR(64) NOT NULL UNIQUE,
      name TEXT,
      email VARCHAR(320),
      login_method VARCHAR(64),
      role VARCHAR(10) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      last_signed_in TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created users table');

  // Create categories table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      icon VARCHAR(100),
      display_order INTEGER DEFAULT 0 NOT NULL,
      is_active BOOLEAN DEFAULT TRUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created categories table');

  // Create listings table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}listings (
      id SERIAL PRIMARY KEY,
      category_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      short_description VARCHAR(500),
      location VARCHAR(255),
      region VARCHAR(100),
      contact_email VARCHAR(320),
      contact_phone VARCHAR(50),
      website VARCHAR(500),
      address TEXT,
      latitude VARCHAR(50),
      longitude VARCHAR(50),
      price_range VARCHAR(50),
      features TEXT,
      metadata TEXT,
      ntb_reg_no VARCHAR(50),
      is_verified BOOLEAN DEFAULT FALSE NOT NULL,
      is_active BOOLEAN DEFAULT TRUE NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE NOT NULL,
      view_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created listings table');

  // Create media table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}media (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video', 'vr')),
      file_url VARCHAR(1000) NOT NULL,
      thumbnail_url VARCHAR(1000),
      file_key VARCHAR(500) NOT NULL,
      mime_type VARCHAR(100),
      file_size INTEGER,
      width INTEGER,
      height INTEGER,
      duration INTEGER,
      alt_text VARCHAR(500),
      caption TEXT,
      uploaded_by INTEGER,
      is_active BOOLEAN DEFAULT TRUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created media table');

  // Create listing_media table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}listing_media (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER NOT NULL,
      media_id INTEGER NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created listing_media table');

  // Create chat_conversations table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}chat_conversations (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      user_id INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created chat_conversations table');

  // Create chat_messages table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}chat_messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL,
      role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created chat_messages table');

  // Create trips table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}trips (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      session_id VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      start_date TIMESTAMP WITH TIME ZONE,
      end_date TIMESTAMP WITH TIME ZONE,
      cover_image VARCHAR(1000),
      is_public BOOLEAN DEFAULT FALSE NOT NULL,
      share_code VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created trips table');

  // Create trip_days table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}trip_days (
      id SERIAL PRIMARY KEY,
      trip_id INTEGER NOT NULL,
      day_number INTEGER NOT NULL,
      date TIMESTAMP WITH TIME ZONE,
      title VARCHAR(255),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created trip_days table');

  // Create trip_items table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}trip_items (
      id SERIAL PRIMARY KEY,
      trip_day_id INTEGER NOT NULL,
      listing_id INTEGER NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created trip_items table');

  // Create favorites table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      session_id VARCHAR(255),
      listing_id INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created favorites table');

  // Create routes table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}routes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      short_description VARCHAR(500),
      duration INTEGER NOT NULL,
      difficulty VARCHAR(15) DEFAULT 'moderate' NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
      distance INTEGER,
      highlights TEXT,
      best_time_to_visit VARCHAR(255),
      cover_image VARCHAR(1000),
      video_url VARCHAR(1000),
      seasonal_info TEXT,
      map_data TEXT,
      start_location VARCHAR(255),
      end_location VARCHAR(255),
      regions TEXT,
      is_featured BOOLEAN DEFAULT FALSE NOT NULL,
      is_active BOOLEAN DEFAULT TRUE NOT NULL,
      view_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created routes table');

  // Create route_stops table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${PREFIX}route_stops (
      id SERIAL PRIMARY KEY,
      route_id INTEGER NOT NULL,
      day_number INTEGER NOT NULL,
      stop_order INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      latitude VARCHAR(50),
      longitude VARCHAR(50),
      duration VARCHAR(100),
      activities TEXT,
      tips TEXT,
      image VARCHAR(1000),
      listing_id INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✓ Created route_stops table');

  // Add foreign key constraints
  await client.query(`
    ALTER TABLE ${PREFIX}listings ADD CONSTRAINT fk_listings_category 
    FOREIGN KEY (category_id) REFERENCES ${PREFIX}categories(id) ON DELETE CASCADE;
  `).catch(() => console.log('  (listings FK already exists)'));

  await client.query(`
    ALTER TABLE ${PREFIX}listing_media ADD CONSTRAINT fk_listing_media_listing 
    FOREIGN KEY (listing_id) REFERENCES ${PREFIX}listings(id) ON DELETE CASCADE;
  `).catch(() => console.log('  (listing_media listing FK already exists)'));

  await client.query(`
    ALTER TABLE ${PREFIX}listing_media ADD CONSTRAINT fk_listing_media_media 
    FOREIGN KEY (media_id) REFERENCES ${PREFIX}media(id) ON DELETE CASCADE;
  `).catch(() => console.log('  (listing_media media FK already exists)'));

  await client.query(`
    ALTER TABLE ${PREFIX}route_stops ADD CONSTRAINT fk_route_stops_route 
    FOREIGN KEY (route_id) REFERENCES ${PREFIX}routes(id) ON DELETE CASCADE;
  `).catch(() => console.log('  (route_stops FK already exists)'));

  console.log('✓ Added foreign key constraints');
}

async function migrateData(supabase, tidb) {
  console.log('\nMigrating data...');

  // Migrate categories
  const [categories] = await tidb.query('SELECT * FROM cnrtp_categories');
  console.log(`Found ${categories.length} categories`);
  for (const cat of categories) {
    await supabase.query(`
      INSERT INTO ${PREFIX}categories (id, name, slug, description, icon, display_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `, [cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.displayOrder, cat.isActive, cat.createdAt, cat.updatedAt]);
  }
  console.log('✓ Migrated categories');

  // Migrate listings
  const [listings] = await tidb.query('SELECT * FROM cnrtp_listings');
  console.log(`Found ${listings.length} listings`);
  for (const l of listings) {
    await supabase.query(`
      INSERT INTO ${PREFIX}listings (id, category_id, name, slug, description, short_description, location, region, 
        contact_email, contact_phone, website, address, latitude, longitude, price_range, features, metadata,
        ntb_reg_no, is_verified, is_active, is_featured, view_count, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      ON CONFLICT (id) DO NOTHING
    `, [l.id, l.categoryId, l.name, l.slug, l.description, l.shortDescription, l.location, l.region,
        l.contactEmail, l.contactPhone, l.website, l.address, l.latitude, l.longitude, l.priceRange, 
        l.features, l.metadata, l.ntbRegNo, l.isVerified, l.isActive, l.isFeatured, l.viewCount, l.createdAt, l.updatedAt]);
  }
  console.log('✓ Migrated listings');

  // Migrate media
  const [media] = await tidb.query('SELECT * FROM cnrtp_media');
  console.log(`Found ${media.length} media items`);
  for (const m of media) {
    await supabase.query(`
      INSERT INTO ${PREFIX}media (id, title, description, media_type, file_url, thumbnail_url, file_key, 
        mime_type, file_size, width, height, duration, alt_text, caption, uploaded_by, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (id) DO NOTHING
    `, [m.id, m.title, m.description, m.mediaType, m.fileUrl, m.thumbnailUrl, m.fileKey,
        m.mimeType, m.fileSize, m.width, m.height, m.duration, m.altText, m.caption, m.uploadedBy, m.isActive, m.createdAt, m.updatedAt]);
  }
  console.log('✓ Migrated media');

  // Migrate listing_media
  const [listingMedia] = await tidb.query('SELECT * FROM cnrtp_listing_media');
  console.log(`Found ${listingMedia.length} listing_media associations`);
  for (const lm of listingMedia) {
    await supabase.query(`
      INSERT INTO ${PREFIX}listing_media (id, listing_id, media_id, display_order, is_primary, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `, [lm.id, lm.listingId, lm.mediaId, lm.displayOrder, lm.isPrimary, lm.createdAt]);
  }
  console.log('✓ Migrated listing_media');

  // Migrate routes
  const [routes] = await tidb.query('SELECT * FROM cnrtp_routes');
  console.log(`Found ${routes.length} routes`);
  for (const r of routes) {
    await supabase.query(`
      INSERT INTO ${PREFIX}routes (id, name, slug, description, short_description, duration, difficulty, distance,
        highlights, best_time_to_visit, cover_image, video_url, seasonal_info, map_data, start_location, end_location,
        regions, is_featured, is_active, view_count, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      ON CONFLICT (id) DO NOTHING
    `, [r.id, r.name, r.slug, r.description, r.shortDescription, r.duration, r.difficulty, r.distance,
        r.highlights, r.bestTimeToVisit, r.coverImage, r.videoUrl, r.seasonalInfo, r.mapData, r.startLocation, r.endLocation,
        r.regions, r.isFeatured, r.isActive, r.viewCount, r.createdAt, r.updatedAt]);
  }
  console.log('✓ Migrated routes');

  // Migrate route_stops
  const [routeStops] = await tidb.query('SELECT * FROM cnrtp_route_stops');
  console.log(`Found ${routeStops.length} route stops`);
  for (const rs of routeStops) {
    await supabase.query(`
      INSERT INTO ${PREFIX}route_stops (id, route_id, day_number, stop_order, name, description, latitude, longitude,
        duration, activities, tips, image, listing_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING
    `, [rs.id, rs.routeId, rs.dayNumber, rs.stopOrder, rs.name, rs.description, rs.latitude, rs.longitude,
        rs.duration, rs.activities, rs.tips, rs.image, rs.listingId, rs.createdAt]);
  }
  console.log('✓ Migrated route_stops');

  // Migrate users
  const [users] = await tidb.query('SELECT * FROM cnrtp_users');
  console.log(`Found ${users.length} users`);
  for (const u of users) {
    await supabase.query(`
      INSERT INTO ${PREFIX}users (id, open_id, name, email, login_method, role, created_at, updated_at, last_signed_in)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `, [u.id, u.openId, u.name, u.email, u.loginMethod, u.role, u.createdAt, u.updatedAt, u.lastSignedIn]);
  }
  console.log('✓ Migrated users');

  // Reset sequences to max id + 1
  const tables = ['users', 'categories', 'listings', 'media', 'listing_media', 'routes', 'route_stops'];
  for (const table of tables) {
    const result = await supabase.query(`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM ${PREFIX}${table}`);
    const nextId = result.rows[0].next_id;
    await supabase.query(`ALTER SEQUENCE ${PREFIX}${table}_id_seq RESTART WITH ${nextId}`);
  }
  console.log('✓ Reset sequences');
}

async function main() {
  console.log('=== Supabase Migration Script ===\n');
  
  // Connect to Supabase
  const supabase = new Client({ connectionString: supabaseUrl });
  await supabase.connect();
  console.log('Connected to Supabase PostgreSQL');

  // Connect to TiDB
  const tidb = await mysql.createConnection(tidbUrl);
  console.log('Connected to TiDB MySQL');

  try {
    // Create tables
    await createSupabaseTables(supabase);
    
    // Migrate data
    await migrateData(supabase, tidb);
    
    console.log('\n=== Migration Complete! ===');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await supabase.end();
    await tidb.end();
  }
}

main().catch(console.error);
