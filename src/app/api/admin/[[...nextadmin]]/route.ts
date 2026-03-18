import { prisma } from "@/lib/prisma";
import { createHandler } from "@premieroctet/next-admin/appHandler";

const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma: prisma as any,
  options: {
    model: {
      User: {
        list: {
          display: ["name", "email", "role"],
        },
      },
      Product: {
        list: {
          display: ["name", "category", "price", "stock"],
        }
      },
      Sale: {
        list: {
          display: ["createdAt", "total", "user"],
        }
      },
      SaleItem: {
        list: {
          display: ["product", "quantity", "unitPrice"],
        }
      }
    }
  },
});

export const GET = run;
export const POST = run;
export const PUT = run;
export const DELETE = run;
export const PATCH = run;
