import { prisma } from "@/lib/prisma";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import "@premieroctet/next-admin/theme";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage(props: {
  params: Promise<{ nextadmin: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  // Busca usuários recentes para o dashboard
  const latestUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const adminProps = await getNextAdminProps({
    prisma: prisma as any,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    params: params.nextadmin,
    searchParams: searchParams,
    options: {
      title: "Administração Lojinha",
      externalLinks: [
        {
          label: "Voltar para Loja",
          url: "/",
        },
      ],
      model: {
        User: {
          title: "Controle de Usuários",
          list: {
            display: ["name", "email", "role"],
            search: ["name", "email"],
          },
          aliases: {
            name: "Nome",
            email: "E-mail",
            role: "Cargo",
            password: "Senha",
          },
          edit: {
            fields: {
              password: { format: "password" },
            }
          }
        },
        Product: {
          title: "Catálogo de Produtos",
          list: {
            display: ["name", "category", "price", "stock"],
            search: ["name", "category"],
          },
          aliases: {
            name: "Nome do Produto",
            category: "Categoria",
            price: "Preço",
            stock: "Estoque",
            description: "Descrição Técnica",
            image: "Foto",
          },
          edit: {
            fields: {
              image: { format: "uri" },
            }
          }
        },
        Sale: {
          title: "Histórico de Vendas",
          list: {
            display: ["createdAt", "total", "user"],
          },
          aliases: {
            id: "Cód. Venda",
            total: "Faturamento",
            createdAt: "Data/Hora",
            user: "Operador",
            items: "Itens",
          },
        },
        SaleItem: {
          title: "Itens de Venda",
          list: {
            display: ["product", "quantity", "unitPrice"],
          },
          aliases: {
            product: "Produto",
            quantity: "Qtd",
            unitPrice: "Vlr Unit.",
          }
        }
      }
    },
  });

  return (
    <NextAdmin 
      {...adminProps} 
      dashboard={<AdminDashboard latestUsers={latestUsers} />} 
    />
  );
}
