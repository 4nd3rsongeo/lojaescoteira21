(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/@premieroctet/next-admin/dist/components/ColorSchemeSwitch.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>components_ColorSchemeSwitch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$context$2f$ColorSchemeContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@premieroctet/next-admin/dist/context/ColorSchemeContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$context$2f$I18nContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@premieroctet/next-admin/dist/context/I18nContext.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
const ColorSchemeSwitch = ()=>{
    const { colorScheme, colorSchemeIcon, toggleColorScheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$context$2f$ColorSchemeContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColorScheme"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$premieroctet$2f$next$2d$admin$2f$dist$2f$context$2f$I18nContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColorSchemeSwitch.useEffect": ()=>{
            setIsClient(true);
        }
    }["ColorSchemeSwitch.useEffect"], []);
    if (!isClient) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        onClick: toggleColorScheme,
        role: "button",
        className: "text-nextadmin-menu-color dark:text-dark-nextadmin-menu-color hover:text-nextadmin-menu-emphasis dark:hover:text-dark-nextadmin-menu-emphasis hover:bg-nextadmin-menu-muted dark:hover:bg-dark-nextadmin-menu-muted flex cursor-pointer select-none flex-row items-center gap-5 rounded-lg p-3 text-sm font-medium transition-colors",
        suppressHydrationWarning: true,
        children: [
            colorSchemeIcon,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                className: "min-w-[3.5rem]",
                children: t(`theme.${colorScheme}`)
            })
        ]
    });
};
const components_ColorSchemeSwitch = ColorSchemeSwitch;
;
}),
]);

//# sourceMappingURL=d4b1c_modules_%40premieroctet_next-admin_dist_components_ColorSchemeSwitch_mjs_ce9146ce._.js.map