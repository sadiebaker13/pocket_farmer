import { DatabaseState } from '../types';

export const INITIAL_STATE: DatabaseState = {
  users: [
    { 
      id: "user:elias_thorn", 
      role: 'Farmer',
      email: "elias@valleyorganics.ca",
      dob: "800512",
      name: { first: "Elias", last: "Thorn" }, 
      farmer_id: "PF-1001-ET", 
      satisfaction_score: 4.8,
      photo_url: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?auto=format&fit=crop&q=80&w=150&h=150",
      insurance: { provider: "AgriShield", policy: "BC-9921" },
      subscriptionTier: 'Free'
    },
    { 
      id: "user:sarah_jenkins", 
      role: 'Farmer',
      email: "sarah@maplebay.ca",
      dob: "850822",
      name: { first: "Sarah", last: "Jenkins" }, 
      farmer_id: "PF-1002-SJ", 
      satisfaction_score: 4.5,
      photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
      insurance: { provider: "FarmSafe", policy: "FS-2210" },
      subscriptionTier: 'Free' 
    },
    { 
      id: "user:priya_patel", 
      role: 'Customer',
      secondary_roles: ['Provider'], // Example of dual role
      email: "priya.p@gmail.com",
      dob: "901130",
      name: { first: "Priya", last: "Patel" }, 
      photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
      subscriptionTier: 'Free'
    },
    { 
      id: "user:dr_hudson",
      role: "Provider",
      email: "vet@hudsonmobile.ca",
      name: { first: "James", last: "Hudson" },
      photo_url: "https://images.unsplash.com/photo-1537368910025-bc005ca23784?auto=format&fit=crop&q=80&w=150&h=150",
      subscriptionTier: 'Free'
    },
    {
      id: "user:mike_hand",
      role: "Employee",
      email: "mike@work.ca",
      name: { first: "Mike", last: "Hand" },
      photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
      subscriptionTier: 'Free'
    }
  ],
  farms: [
    {
      id: "farm:cowichan_valley_organics",
      primary_contact_id: "user:elias_thorn",
      name: "Cowichan Valley Organics",
      logo_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200",
      location: [48.7787, -123.7079], // Duncan, BC
      specialties: ["Vegetables", "Berries", "Meat"] 
    },
    {
      id: "farm:maple_bay_vineyards",
      primary_contact_id: "user:sarah_jenkins",
      name: "Maple Bay Vineyards",
      logo_url: "https://images.unsplash.com/photo-1566938064504-a3875264ff97?auto=format&fit=crop&q=80&w=200",
      location: [48.8123, -123.6021], 
      specialties: ["Grapes", "Wine"]
    }
  ],
  listings: [
    {
      id: "listing:organic_carrots",
      farm_id: "farm:cowichan_valley_organics",
      name: "Organic Carrots",
      type: "Veggie",
      season: "Fall",
      price: "$2.50/lb",
      inventory: 500,
      status: "Active"
    },
    {
      id: "listing:pinot_noir_2022",
      farm_id: "farm:maple_bay_vineyards",
      name: "Pinot Noir 2022",
      type: "Other", // Wine could be other or Fruit product
      season: "Year-Round",
      price: "$28.00/btl",
      inventory: 120,
      status: "Active"
    },
    {
      id: "listing:wool_skein",
      farm_id: "farm:cowichan_valley_organics",
      name: "Hand-Spun Wool",
      type: "Textile",
      season: "Year-Round",
      price: "$15.00/skein",
      inventory: 40,
      status: "Active"
    }
  ],
  jobPosts: [
    {
      id: "job:harvest_help",
      farm_id: "farm:cowichan_valley_organics",
      title: "Harvest Helper",
      description: "Help picking berries during peak season.",
      type: "Gig",
      compensation: "$18.50/hr + Berries"
    },
    {
      id: "job:fencing_repair",
      farm_id: "farm:maple_bay_vineyards",
      title: "Fence Repair",
      description: "Need help repairing deer fencing along the north perimeter.",
      type: "Odd Job",
      compensation: "Barter: 6 Bottles of Wine"
    }
  ],
  jobApplications: [],
  serviceRequests: [
    {
      id: "req:vet_horse_1",
      farm_id: "farm:cowichan_valley_organics",
      service_type: "Veterinary",
      description: "Draft horse has a mild limp in left hind leg. Need assessment.",
      status: "Open",
      urgency: "Medium",
      posted_at: "2023-10-01"
    },
    {
      id: "req:pest_aphids",
      farm_id: "farm:maple_bay_vineyards",
      service_type: "Pesticide",
      description: "Aphid infestation on south block vines. Need organic treatment quote.",
      status: "Open",
      urgency: "High",
      posted_at: "2023-10-02"
    }
  ],
  isoRequests: [
    {
      id: "iso:honey_crisp",
      customer_id: "user:priya_patel",
      item_name: "Honey Crisp Apples",
      category: "Fruit",
      description: "Looking for 20lbs of apples for canning.",
      quantity_needed: "20 lbs",
      posted_at: "2023-09-15",
      expires_at: "2023-09-30",
      location: [48.7787, -123.7079],
      urgency: "Medium",
      trade_preference: "Cash or Jam Exchange"
    }
  ],
  services: [
    {
      id: "svc:hudson_vet",
      provider_id: "user:dr_hudson",
      service_type: "Veterinary",
      name: "Hudson Mobile Vet",
      description: "Large animal veterinary services. 24/7 Emergency calls available.",
      contact_info: "250-555-0199",
      verified: true
    }
  ],
  products: [
    {
      id: "prod:seed_tomato",
      name: "Heirloom Brandywine Tomato Seeds",
      category: "Seeds",
      description: "High-yield, organic non-GMO seeds perfect for Zone 8 climates. 50 seeds per pack.",
      price: 4.99,
      image_url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=300",
      affiliate_link: "#",
      retailer: "West Coast Seeds"
    },
    {
      id: "prod:seed_sunflower",
      name: "Giant Mammoth Sunflower Seeds",
      category: "Seeds",
      description: "Grow prize-winning giants. Easy to grow and great for pollinators.",
      price: 3.50,
      image_url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=300",
      affiliate_link: "#",
      retailer: "West Coast Seeds"
    },
    {
      id: "prod:tool_hoe",
      name: "Ergonomic Loop Hoe",
      category: "Tools",
      description: "Tempered steel blade with a long ash wood handle. Reduces back strain.",
      price: 34.50,
      image_url: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80&w=300",
      affiliate_link: "#",
      retailer: "Lee Valley"
    },
    {
      id: "prod:equip_tractor_seat",
      name: "Universal Tractor Suspension Seat",
      category: "Equipment",
      description: "Adjustable suspension for all-day comfort. Fits most Kubota and John Deere models.",
      price: 149.99,
      image_url: "https://images.unsplash.com/photo-1590634937001-d70377881c62?auto=format&fit=crop&q=80&w=300",
      affiliate_link: "#",
      retailer: "Tractor Supply"
    },
    {
      id: "prod:input_fertilizer",
      name: "Organic Fish Fertilizer 5-1-1",
      category: "Inputs",
      description: "OMRI listed liquid fertilizer. Great for leafy greens and starters.",
      price: 18.99,
      image_url: "https://images.unsplash.com/photo-1622383563227-0440114a680a?auto=format&fit=crop&q=80&w=300",
      affiliate_link: "#",
      retailer: "Garden Works"
    }
  ],
  worksAt: [
    {
      id: "rel:1",
      in: "user:elias_thorn",
      out: "farm:cowichan_valley_organics",
      role: "Owner",
      started_at: "2022-03-15"
    },
    {
      id: "rel:2",
      in: "user:sarah_jenkins",
      out: "farm:maple_bay_vineyards",
      role: "Owner",
      started_at: "2023-01-10"
    },
    {
      id: "rel:3",
      in: "user:mike_hand",
      out: "farm:cowichan_valley_organics",
      role: "Employee",
      started_at: "2023-05-01"
    }
  ],
  exchangeOffers: []
};