//Homework: Take these three SQL queries you wrote earlier this week and rewrite them using Prisma.

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/*
-- Query 1
SELECT * FROM products
WHERE stock_quantity < 30
ORDER BY stock_quantity ASC;
*/

async function main() {
  const lowStockProducts = await prisma.product.findMany({
    where: { stock_quantity: { lt: 30 } },
    orderBy: { stock_quantity: "asc" },
  });
  console.log("Low stock:", lowStockProducts);

  /*
-- Query 2
SELECT * FROM orders
WHERE status = 'delivered'
ORDER BY order_date DESC;
*/

  const deliveredOrders = await prisma.order.findMany({
    where: { status: "delivered" },
    orderBy: { order_date: "desc" },
  });
  console.log("Delivered orders:", deliveredOrders);

  /*
-- Query 3 — products with category name
SELECT products.name, categories.name, products.price
FROM products
INNER JOIN categories ON products.category_id = categories.id;
*/

  const productsWithCategory = await prisma.product.findMany({
    select: {
      name: true,
      price: true,
      category: { select: { name: true } },
    },
  });
  console.log("Products with category:", productsWithCategory);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
