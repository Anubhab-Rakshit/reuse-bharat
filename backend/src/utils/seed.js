import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Activity from '../models/Activity.js';

const seedDatabase = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  const users = await User.create([
    {
      name: 'Riya',
      email: 'riya@campus.edu',
      avatar: null,
      role: 'donor',
      ecoScore: 84,
      totalImpact: { meals: 2400, medicine: 590, books: 300 }
    },
    {
      name: 'Kiran',
      email: 'kiran@campus.edu',
      avatar: null,
      role: 'receiver',
      ecoScore: 72,
      totalImpact: { meals: 1500, medicine: 200, books: 150 }
    },
    {
      name: 'Anuj',
      email: 'anuj@campus.edu',
      avatar: null,
      role: 'admin',
      ecoScore: 95,
      totalImpact: { meals: 3200, medicine: 800, books: 450 }
    }
  ]);

  const listings = await Listing.create([
    {
      title: 'Rajma Chawal (40 Plates)',
      description: 'Freshly prepared Rajma Chawal from North Mess',
      module: 'Annapurna',
      category: 'Cooked Meals',
      location: 'North Mess, Block B',
      quantity: '40 kg',
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Pickup by: 6:00 PM',
      isUrgent: true,
      status: 'Active',
      donor: users[0]._id
    },
    {
      title: 'Fresh Sandwiches & Juice',
      description: 'Assorted sandwiches with fresh fruit juice',
      module: 'Annapurna',
      category: 'Packaged',
      location: 'Seminar Hall 3',
      quantity: '15 packs',
      image: 'https://images.unsplash.com/photo-1512152272829-4081b8e84182?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Pickup by: 4:30 PM',
      isUrgent: false,
      status: 'Active',
      donor: users[0]._id
    },
    {
      title: 'Leftover Event Buffet',
      description: 'Mixed buffet from college event',
      module: 'Annapurna',
      category: 'Cooked Meals',
      location: 'Auditorium Backstage',
      quantity: 'Mixed (Big)',
      image: 'https://images.unsplash.com/photo-1504670414369-17ce284ce402?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Exp: 2:00 PM',
      isUrgent: false,
      status: 'Claimed',
      donor: users[0]._id,
      claimedBy: users[1]._id,
      claimedAt: new Date()
    },
    {
      title: 'Packaged Curd & Bread',
      description: 'Sealed curd packets with brown bread',
      module: 'Annapurna',
      category: 'Packaged',
      location: 'East Wing Kitchen',
      quantity: '20 items',
      image: 'https://images.unsplash.com/photo-1484723091702-caa90f9b09de?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Pickup by: 8:00 PM',
      isUrgent: false,
      status: 'Active',
      donor: users[0]._id
    },
    {
      title: 'Vegetable Salad Tubs',
      description: 'Fresh vegetable salads in reusable tubs',
      module: 'Annapurna',
      category: 'Snacks',
      location: 'Cafe Coffee Day Outpost',
      quantity: '8 tubs',
      image: 'https://images.unsplash.com/photo-1511690655006-25f052d43e59?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Pickup by: 3:00 PM',
      isUrgent: true,
      status: 'Active',
      donor: users[0]._id
    },
    {
      title: 'Pizza Slices (Boxed)',
      description: 'Leftover pizza slices from party',
      module: 'Annapurna',
      category: 'Snacks',
      location: 'CS Dept Lounge',
      quantity: '12 slices',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Pickup by: 7:00 PM',
      isUrgent: false,
      status: 'Active',
      donor: users[0]._id
    },
    {
      title: 'Metformin 500mg Strip',
      description: 'Sealed strip of Metformin 500mg tablets',
      module: 'Aushadh',
      category: 'Medicine',
      location: 'Health Center Pharmacy',
      quantity: '1 strip (10 tablets)',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Valid until: 3 months',
      isUrgent: false,
      status: 'Claimed',
      donor: users[1]._id,
      claimedBy: users[0]._id,
      claimedAt: new Date()
    },
    {
      title: 'Cough Syrup (sealed)',
      description: 'New sealed bottle of cough syrup',
      module: 'Aushadh',
      category: 'Medicine',
      location: 'Hostel B Pharmacy',
      quantity: '1 bottle',
      image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=1000&auto=format&fit=crop',
      timeLimit: 'Valid until: 6 months',
      isUrgent: false,
      status: 'Active',
      donor: users[1]._id
    },
    {
      title: 'Engineering Graphics (Bhatt)',
      description: 'Engineering Graphics textbook by Bhatt',
      module: 'Samagri',
      category: 'Books',
      location: 'Library Block',
      quantity: '1 copy',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
      timeLimit: null,
      isUrgent: false,
      status: 'Active',
      donor: users[2]._id
    },
    {
      title: 'Lab Coat (M size)',
      description: 'White lab coat, size M barely used',
      module: 'Samagri',
      category: 'Equipment',
      location: 'Chemistry Lab',
      quantity: '1 piece',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop',
      timeLimit: null,
      isUrgent: false,
      status: 'Active',
      donor: users[2]._id
    }
  ]);

  await Activity.create([
    {
      user: users[1]._id,
      type: 'listing_claimed',
      listing: listings[2]._id,
      description: `${users[1].name} claimed your Engineering Graphics book`,
      module: 'Samagri'
    },
    {
      user: users[0]._id,
      type: 'listing_claimed',
      listing: listings[2]._id,
      description: `Your Rajma donation was picked up by Anuj NGO`,
      module: 'Annapurna'
    },
    {
      user: users[0]._id,
      type: 'impact_updated',
      listing: listings[0]._id,
      description: `New match found for Metformin strip`,
      module: 'Aushadh'
    },
    {
      user: users[2]._id,
      type: 'listing_created',
      listing: listings[9]._id,
      description: `You posted Lab Coat listing`,
      module: 'Samagri'
    }
  ]);

  console.log('Database seeded successfully');
};

export default seedDatabase;