module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/domain [external] (domain, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("domain", () => require("domain"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:os [external] (node:os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:string_decoder [external] (node:string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:string_decoder", () => require("node:string_decoder"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/admin/[[...nextadmin]]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>AdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$appRouter$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@premieroctet/next-admin/dist/appRouter.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$adapters$2f$next$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@premieroctet/next-admin/dist/adapters/next.mjs [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function AdminPage(props) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const adminProps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$appRouter$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNextAdminProps"])({
        prisma: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"],
        basePath: "/admin",
        apiBasePath: "/api/admin",
        params: params.nextadmin,
        searchParams: searchParams,
        options: {
            title: "Painel Administrativo - Lojinha",
            model: {
                User: {
                    display: [
                        "name",
                        "email",
                        "role"
                    ],
                    fields: {
                        role: {
                            display: "select",
                            options: [
                                {
                                    label: "Usuário",
                                    value: "USER"
                                },
                                {
                                    label: "Administrador",
                                    value: "ADMIN"
                                }
                            ]
                        }
                    }
                },
                Product: {
                    display: [
                        "name",
                        "category",
                        "price",
                        "stock"
                    ],
                    fields: {
                        price: {
                            format: "currency"
                        },
                        image: {
                            display: "image"
                        },
                        category: {
                            display: "select",
                            options: [
                                {
                                    label: "Uniforme",
                                    value: "Uniforme"
                                },
                                {
                                    label: "Vestuário",
                                    value: "Vestuário"
                                },
                                {
                                    label: "Equipamento",
                                    value: "Equipamento"
                                },
                                {
                                    label: "Distintivos",
                                    value: "Distintivos"
                                },
                                {
                                    label: "Geral",
                                    value: "Geral"
                                }
                            ]
                        }
                    }
                },
                Sale: {
                    display: [
                        "id",
                        "total",
                        "createdAt"
                    ],
                    fields: {
                        total: {
                            format: "currency"
                        },
                        createdAt: {
                            format: "date"
                        }
                    }
                },
                SaleItem: {
                    display: [
                        "product",
                        "quantity",
                        "unitPrice"
                    ]
                }
            }
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$adapters$2f$next$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextAdmin"], {
        ...adminProps
    }, void 0, false, {
        fileName: "[project]/src/app/admin/[[...nextadmin]]/page.tsx",
        lineNumber: 74,
        columnNumber: 10
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/admin/[[...nextadmin]]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/[[...nextadmin]]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ce02ebd1._.js.map