import basket_icon from './basket_icon.png';
import logo from './logo2.png';
import header_img from './header_img.png'; // must match actual file name!
import search_icon from './search_icon.png';

import category_1 from './wheels.svg';
import category_2 from './engine.svg';
import category_3 from './body.svg';
import category_4 from './light.svg';
import category_5 from './accessories.svg';
import category_6 from './brea.svg';
import category_7 from './exhaust.svg';
import category_8 from './heating and cooing.svg';

// PARTS -- ensure all these files exist and match name + extension exactly!
import parts_1 from './h1bulb.jpg';
import parts_2 from './brakebooster.jpg';
import parts_3 from './coolingfan.jpg';
import parts_4 from './cooleregrengine.jpg';
import parts_5 from './exhausttip.jpg';
import parts_6 from './shockabsorber.jpg';
import parts_7 from './steeringwheel.jpg';
import parts_8 from './typres.jpg';
import parts_9 from './wheelcover.jpg';
import parts_10 from './bodyshekk.jpg';
import parts_11 from './headlight11.jpg';
import parts_12 from './headlight13.jpg';
import parts_13 from './headlight14.jpg';
import parts_14 from './seat14.jpg';
import parts_15 from './seat16.jpg';
import parts_16 from './dashboard18.jpg';
import parts_17 from './meter17.jpg';
import parts_18 from './sidemirror19.jpg';
import parts_19 from './marutitalilight19.jpg';
import parts_20 from './ddisengine21.jpg';
import parts_21 from './cngcylinder22.jpg';
import parts_22 from './rearbumper.jpg';
import parts_23 from './frontbumper.jpg';
import parts_24 from './gearbox25.jpg';
import parts_25 from './gearbox26.jpg';
import parts_26 from './bodyshell26.jpg';
import parts_27 from './bdy28.jpg';
import parts_28 from './body27.jpg';
import parts_29 from './body30.jpg';
import parts_30 from './side29.jpg';

import add_icon_white from './add_icon_white.png';
import add_icon_green from './add_icon_green.png';
import remove_icon_red from './remove_icon_red.png';
import app_store from './app_store.png';
import play_store from './play_store.png';
import linkedin_icon from './linkedin_icon.png';
import facebook_icon from './facebook_icon.png';
import twitter_icon from './twitter_icon.png';
import cross_icon from './cross_icon.png';
import selector_icon from './selector_icon.png';
import rating_starts from './rating_starts.png';
import profile_icon from './profile_icon.png';
import bag_icon from './bag_icon.png';
import logout_icon from './logout_icon.png';
import parcel_icon from './parcel_icon.png';

export const assets = {
    logo,
    basket_icon,
    header_img,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon
};

export const menu_list = [
    { category_name: "Wheels & Body Parts", category_image: category_1 },
    { category_name: "Engine & Internal Parts", category_image: category_2 },
    { category_name: "Body Parts & Exterior", category_image: category_3 },
    { category_name: "Electricals & Lighting", category_image: category_4 },
    { category_name: "Accessories", category_image: category_5 },
    { category_name: "Brakes & Suspension", category_image: category_6 },
    { category_name: "Exhaust & Emission", category_image: category_7 },
    { category_name: "Heating & Cooling", category_image: category_8 }
];


export const product_list = [
  {
    id: "1",
    name: "H1 Bulb",
    image: parts_1,
    price: 1200,
    description: "Reliable H1 Bulb for vehicles, ensuring long-lasting and bright lighting for safe driving.",
    category: "Electricals & Lighting",
    productType: "New Parts"
  },
  {
    id: "2",
    name: "Brake Booster",
    image: parts_2,
    price: 18500,
    description: "Efficient Brake Booster designed to give enhanced braking power and safety.",
    category: "Brakes & Suspension",
    productType: "New Parts"
  },
  {
    id: "3",
    name: "Cooling Fan",
    image: parts_3,
    price: 5040,
    description: "High-performance Cooling Fan helps regulate engine temperature and prevent overheating.",
    category: "Heating & Cooling",
    productType: "New Parts"
  },
  {
    id: "4",
    name: "Cooler EGR Engine",
    image: parts_4,
    price: 2460,
    description: "Cooler EGR Engine part improves engine efficiency and reduces emissions.",
    category: "Engine & Internal Parts",
    productType: "New Parts"
  },
  {
    id: "5",
    name: "Exhaust Tip",
    image: parts_5,
    price: 1490,
    description: "Stylish Exhaust Tip boosts your car's look and optimizes exhaust flow performance.",
    category: "Exhaust & Emission",
    productType: "New Parts"
  },
  {
    id: "6",
    name: "Shock Absorber",
    image: parts_6,
    price: 6570,
    description: "Durable Shock Absorber for a smoother ride and better suspension handling.",
    category: "Brakes & Suspension",
    productType: "New Parts"
  },
  {
    id: "7",
    name: "Steering Wheel",
    image: parts_7,
    price: 2750,
    description: "Ergonomic Steering Wheel designed for comfort and precise control.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "8",
    name: "Tyres",
    image: parts_8,
    price: 8760,
    description: "Reliable Tyres offering strong grip and extended durability for various road conditions.",
    category: "Wheels & Body Parts",
    productType: "New Parts"
  },
  {
    id: "9",
    name: "Wheel Cover",
    image: parts_9,
    price: 1400,
    description: "Stylish and protective Wheel Cover for enhanced looks and wheel shielding.",
    category: "Wheels & Body Parts",
    productType: "New Parts"
  },
  {
    id: "10",
    name: "Body Shell",
    image: parts_10,
    price: 87000,
    description: "Robust Body Shell offers ultimate safety and structural strength.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "11",
    name: "Maruti Head Light",
    image: parts_11,
    price: 1000,
    description: "Bright Maruti Head Light for clear visibility and road safety.",
    category: "Electricals & Lighting",
    productType: "New Parts"
  },
  {
    id: "12",
    name: "Verna Head Light",
    image: parts_12,
    price: 1200,
    description: "Premium Verna Head Light ensures excellent illumination and reliability.",
    category: "Electricals & Lighting",
    productType: "New Parts"
  },
  {
    id: "13",
    name: "Jeep Head Light",
    image: parts_13,
    price: 1200,
    description: "Durable Jeep Head Light built for off-road adventures.",
    category: "Electricals & Lighting",
    productType: "New Parts"
  },
  {
    id: "14",
    name: "Leather Seat Cover",
    image: parts_14,
    price: 4800,
    description: "Luxury Leather Seat Cover adds comfort and premium style to your car interior.",
    category: "Accessories",
    productType: "New Parts"
  },
  {
    id: "15",
    name: "Seat Cover",
    image: parts_15,
    price: 2600,
    description: "High-quality Seat Cover for enduring protection and a fresh look.",
    category: "Accessories",
    productType: "New Parts"
  },
  {
    id: "16",
    name: "Dashboard",
    image: parts_16,
    price: 24000,
    description: "Sturdy Dashboard with modern design for better control and aesthetics.",
    category: "Engine & Internal Parts",
    productType: "New Parts"
  },
  {
    id: "17",
    name: "Meter Cluster",
    image: parts_17,
    price: 14000,
    description: "Precision Meter Cluster provides real-time vehicle information for drivers.",
    category: "Electricals & Lighting",
    productType: "New Parts"
  },
  {
    id: "18",
    name: "Side Mirror",
    image: parts_18,
    price: 1200,
    description: "Clear Side Mirror for safe lane changes and wider rear-view visibility.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "19",
    name: "Maruti Tail Light",
    image: parts_19,
    price: 2190,
    description: "Reliable Maruti Tail Light ensures safety during braking and turning.",
    category: "Electricals & Lighting",
    productType: "New Parts"
  },
  {
    id: "20",
    name: "DDIS Engine",
    image: parts_20,
    price: 145000,
    description: "Efficient DDIS Engine delivers great fuel economy and strong power.",
    category: "Engine & Internal Parts",
    productType: "New Parts"
  },
  {
    id: "21",
    name: "CNG Cylinder",
    image: parts_21,
    price: 14000,
    description: "Safe CNG Cylinder for eco-friendly fuel and optimal vehicle performance.",
    category: "Engine & Internal Parts",
    productType: "New Parts"
  },
  {
    id: "22",
    name: "Rear Bumper",
    image: parts_22,
    price: 2200,
    description: "Robust Rear Bumper offers protection against minor impacts.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "23",
    name: "Front Bumper",
    image: parts_23,
    price: 4000,
    description: "Durable Front Bumper designed for improved safety and style.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "24",
    name: "Gear Box",
    image: parts_24,
    price: 12600,
    description: "Reliable Gear Box provides smooth shifting and long-lasting performance.",
    category: "Engine & Internal Parts",
    productType: "New Parts"
  },
  {
    id: "25",
    name: "Maruti Gear Box",
    image: parts_25,
    price: 64700,
    description: "Maruti Gear Box ensures efficient transmission for Maruti cars.",
    category: "Engine & Internal Parts",
    productType: "New Parts"
  },
  {
    id: "26",
    name: "K10 Body Shell",
    image: parts_26,
    price: 56000,
    description: "K10 Body Shell offers enhanced safety and robust build for compact cars.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "27",
    name: "DC Body Shell",
    image: parts_27,
    price: 178000,
    description: "DC Body Shell features sturdy materials for long-lasting protection.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "28",
    name: "Bolero Body Shell",
    image: parts_28,
    price: 96000,
    description: "Bolero Body Shell brings rugged durability for SUV enthusiasts.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "29",
    name: "Scorpio Body Shell",
    image: parts_29,
    price: 179000,
    description: "Scorpio Body Shell combines strength and style for lasting vehicle protection.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  },
  {
    id: "30",
    name: "Swift Side Door",
    image: parts_30,
    price: 5600,
    description: "Strong Swift Side Door designed for easy access and superior security.",
    category: "Body Parts & Exterior",
    productType: "New Parts"
  }
];
