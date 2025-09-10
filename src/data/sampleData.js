// Sample data for Coffee Chat Matching App

export const suggestedMatches = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Product Manager at Microsoft",
    dormantPeriod: "8 months",
    relationshipScore: 85,
    mutualConnections: 12,
    location: "Seattle, WA",
    lastInteraction: "Congratulated on promotion",
    sharedBackground: "Both worked at tech startups, mutual connection: David Park",
    commonInterests: ["Product Strategy", "AI/ML", "Team Leadership"],
    availability: "Weekday mornings",
    preferredMeetingStyle: "Coffee shop",
    bio: "Love discussing product innovation and mentoring junior PMs. Always up for learning about new technologies and sharing experiences.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b739?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Marcus Rodriguez", 
    title: "VP of Sales at Salesforce",
    dormantPeriod: "6 months",
    relationshipScore: 92,
    mutualConnections: 8,
    location: "San Francisco, CA", 
    lastInteraction: "Connected after industry conference",
    sharedBackground: "Met at SaaS Summit 2023, both in enterprise sales",
    commonInterests: ["Enterprise Sales", "Sales Enablement", "B2B Strategy"],
    availability: "Lunch hours",
    preferredMeetingStyle: "Business lunch",
    bio: "Passionate about building high-performing sales teams. Always interested in sharing strategies and learning from other sales leaders.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Lisa Park",
    title: "Engineering Manager at Google",
    dormantPeriod: "1 year",
    relationshipScore: 78,
    mutualConnections: 15,
    location: "Mountain View, CA",
    lastInteraction: "Shared article about tech leadership",
    sharedBackground: "Both from coding bootcamp background, now in leadership",
    commonInterests: ["Engineering Management", "Diversity in Tech", "Career Growth"],
    availability: "Early mornings",
    preferredMeetingStyle: "Walking meeting",
    bio: "Former bootcamp grad turned engineering leader. Love mentoring and discussing the future of tech education.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export const pendingMatches = [
  {
    id: 1,
    name: "David Rodriguez",
    title: "Software Engineer at Amazon", 
    action: "Mutual match - ready to schedule",
    time: "2 hours ago",
    status: "matched",
    matchDate: new Date().toISOString(),
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Emma Thompson",
    title: "UX Designer at Airbnb",
    action: "You liked them - waiting for response", 
    time: "1 day ago",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export const scheduledMeetings = [
  {
    id: 1,
    name: "Michael Park",
    title: "VP of Sales at Salesforce",
    meetingDate: "Tomorrow at 10:00 AM",
    location: "Blue Bottle Coffee, SOMA",
    status: "confirmed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Lisa Wang", 
    title: "Marketing Director at Shopify",
    meetingDate: "Friday at 2:00 PM",
    location: "Starbucks, Mission District",
    status: "confirmed",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export const pastMeetings = [
  {
    id: 1,
    name: "Alex Chen",
    title: "Product Designer at Figma",
    meetingDate: "Last week",
    rating: 5,
    note: "Great conversation about design systems and career growth!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b739?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "James Wilson", 
    title: "Marketing Director at Shopify",
    meetingDate: "2 weeks ago",
    rating: 4,
    note: "Shared insights on e-commerce trends and growth strategies",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  }
];

export const userStats = {
  monthlyMatches: 8,
  scheduledMeetings: 3,
  completedMeetings: 12,
  matchRate: 73
};
