import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const vehicles = [
  {
    name: "VinFast Klara S",
    type: "MOTORBIKE" as const,
    description:
      "Xe máy điện phổ biến nhất, vận hành êm ái, cốp rộng, phù hợp di chuyển trong phố.",
    pricePerDay: 180000,
    rangeKm: 120,
    maxSpeed: 60,
  },
  {
    name: "Dat Bike Weaver 200",
    type: "PREMIUM" as const,
    description:
      "Xe máy điện hiệu năng cao của Việt Nam, quãng đường 200km, tăng tốc mạnh mẽ.",
    pricePerDay: 250000,
    rangeKm: 200,
    maxSpeed: 80,
  },
  {
    name: "VinFast Feliz S",
    type: "SCOOTER" as const,
    description:
      "Xe ga điện nhỏ gọn, tiết kiệm, dễ điều khiển, lý tưởng cho người mới.",
    pricePerDay: 150000,
    rangeKm: 90,
    maxSpeed: 49,
  },
  {
    name: "Yadea G5",
    type: "SCOOTER" as const,
    description:
      "Xe ga điện kinh tế, thiết kế trẻ trung, pin bền, vận hành ổn định.",
    pricePerDay: 150000,
    rangeKm: 100,
    maxSpeed: 55,
  },
  {
    name: "VinFast Theon S",
    type: "PREMIUM" as const,
    description:
      "Xe máy điện cao cấp, tốc độ tối đa 90km/h, trang bị nhiều công nghệ thông minh.",
    pricePerDay: 280000,
    rangeKm: 100,
    maxSpeed: 90,
  },
  {
    name: "Pega NewTech",
    type: "SCOOTER" as const,
    description:
      "Xe ga điện giá rẻ, nhẹ nhàng, phù hợp di chuyển ngắn trong nội thành.",
    pricePerDay: 120000,
    rangeKm: 80,
    maxSpeed: 50,
  },
];

async function main() {
  const existing = await prisma.vehicle.count();
  if (existing > 0) {
    console.log(`Vehicles already seeded (${existing}). Skipping.`);
    return;
  }
  await prisma.vehicle.createMany({ data: vehicles });
  console.log(`Seeded ${vehicles.length} vehicles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
