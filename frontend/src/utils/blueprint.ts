export const getBlueprintDetails = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("foundations") || t.includes("zero to one") || t.includes("cafe")) {
    return {
      blueprintTitle: "Café Business Launch Blueprint",
      expectedRevenue: "₹4.5 Lakhs / month",
      margin: "35% - 45%",
      investment: "₹5L - ₹8L",
      difficulty: "Medium",
      launchTime: "4 - 6 weeks",
      equipment: ["Commercial Espresso Machine", "Conical Coffee Grinder", "Under-counter Refrigerator", "Ice Cube Maker", "POS Billing System", "Stainless Steel Worktables"],
      licenses: ["FSSAI Registration", "GST Registration", "Shop & Establishment License", "Fire NOC", "Local Municipality Trade License"],
      support: "Direct supplier connections for premium Arabica beans & commercial equipment manufacturers.",
      toolkit: [
        "Espresso Café Excel Financial Model",
        "Equipment Sizing Excel Sheet",
        "Menu Pricing & Costing Workbook",
        "Café Layout PDF Guides",
        "Staff Roles & Checklist SOPs"
      ],
      story: {
        name: "Aditya Roy",
        before: "Software Engineer",
        after: "Café Owner",
        revenue: "₹4.5 Lakhs / month",
        text: "I wanted to exit coding but had zero commercial food experience. YEDC's blueprint walked me through menu creation, layout planning, and machine sourcing. I broke even in month 3.",
        business: "Third Wave Espresso Lounge",
        location: "Pune, Maharashtra",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
      }
    };
  } else if (t.includes("marketing") || t.includes("digital")) {
    return {
      blueprintTitle: "Digital Marketing Agency Blueprint",
      expectedRevenue: "₹3.5 Lakhs / month",
      margin: "60% - 75%",
      investment: "₹50k - ₹1.5L",
      difficulty: "Easy",
      launchTime: "2 weeks",
      equipment: ["High-Performance Laptop", "Stable High-Speed Broadband", "Professional CRM & Tracking Subscriptions", "Graphic Design Suite (Canva/Adobe)"],
      licenses: ["GST Registration", "Proprietorship / LLP Registration", "Professional Tax Registration"],
      support: "Access to private freelance networks and premium SaaS discount codes.",
      toolkit: [
        "Agency Client Onboarding SOPs",
        "Marketing Pitch Presentation Deck",
        "Client Ad Budget Costing Sheets",
        "SEO Audit Checklists",
        "Contract & Retainer Agreement Templates"
      ],
      story: {
        name: "Karan Johar",
        before: "Marketing Executive",
        after: "Agency Founder",
        revenue: "₹3.5 Lakhs / month",
        text: "The client acquisition template and contract files saved me months of trial. I signed my first high-ticket retainer within 20 days of opening.",
        business: "Alpha Growth Labs",
        location: "Mumbai, Maharashtra",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
      }
    };
  } else if (t.includes("modelling") || t.includes("financial")) {
    return {
      blueprintTitle: "Food Processing Unit Blueprint",
      expectedRevenue: "₹8.5 Lakhs / month",
      margin: "30% - 40%",
      investment: "₹8L - ₹12L",
      difficulty: "Hard",
      launchTime: "8 - 12 weeks",
      equipment: ["Industrial Mixer / Blender", "Semi-automatic Packaging Machine", "Hot Air Oven / Dehydrator", "Stainless Steel Mixing Vessels", "Commercial Weighing Scales"],
      licenses: ["FSSAI Central / State License", "GST Registration", "Factory License / NOC", "Pollution Control Board NOC", "MSME Registration"],
      support: "Verified packaging supplier contacts and local raw materials vendor list.",
      toolkit: [
        "Factory Financial Model Excel Sheet",
        "Batch Recipe Costing Workbook",
        "FDA / FSSAI Audit Checklist",
        "Packaging Supplier Agreement PDF",
        "Processing SOP Checklist"
      ],
      story: {
        name: "Priya Sharma",
        before: "Home Chef",
        after: "Food Brand Founder",
        revenue: "₹8.5 Lakhs / month",
        text: "Scaling production from my home kitchen to a factory unit seemed impossible. The layout SOPs and costing spreadsheets kept my margins safe.",
        business: "Shree Spices & Foods",
        location: "Indore, Madhya Pradesh",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
      }
    };
  }
  // Default values
  return {
    blueprintTitle: "Business Launch Blueprint",
    expectedRevenue: "₹4 Lakhs / month",
    margin: "35% - 45%",
    investment: "₹4L - ₹8L",
    difficulty: "Medium",
    launchTime: "4 - 6 weeks",
    equipment: ["Standard workstation setup", "High-speed internet", "Essential operations tools"],
    licenses: ["GST Registration", "Local Trade License"],
    support: "General vendor and supplier lists.",
    toolkit: [
      "Business Costing Excel Calculator",
      "Operations SOP Document",
      "Launch Checklist PDF"
    ],
    story: {
      name: "Aditya Roy",
      before: "Software Engineer",
      after: "Café Owner",
      revenue: "₹4.5 Lakhs / month",
      text: "I wanted to exit coding but had zero commercial food experience. YEDC's blueprint walked me through menu creation, layout planning, and machine sourcing. I broke even in month 3.",
      business: "Third Wave Espresso Lounge",
      location: "Pune, Maharashtra",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    }
  };
};
