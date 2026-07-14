require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Query 1 — low stock products
  const lowStockProducts = await prisma.products.findMany({
    where: { stock_quantity: { lt: 30 } },
    orderBy: { stock_quantity: 'asc' }
  });
  console.log("--- Low stock products ---");
  console.log(lowStockProducts);

  // Query 2 — delivered orders
  const deliveredOrders = await prisma.orders.findMany({
    where: { status: 'delivered' },
    orderBy: { order_date: 'desc' }
  });
  console.log("--- Delivered orders ---");
  console.log(deliveredOrders);

  // Query 3 — products with category name
  const productsWithCategory = await prisma.products.findMany({
    select: {
      name: true,
      price: true,
      categories: { select: { name: true } }
    }
  });
  console.log("--- Products with category ---");
  console.log(productsWithCategory);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
