import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CNmY1PAd.mjs';
import { manifest } from './manifest_CwnWqVgb.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/admin/leads.astro.mjs');
const _page2 = () => import('./pages/api/admin/login.astro.mjs');
const _page3 = () => import('./pages/api/admin/logout.astro.mjs');
const _page4 = () => import('./pages/api/admin/pagos.astro.mjs');
const _page5 = () => import('./pages/api/consulta-nutricionista.astro.mjs');
const _page6 = () => import('./pages/api/cron/check-lead-form.astro.mjs');
const _page7 = () => import('./pages/api/health/leads.astro.mjs');
const _page8 = () => import('./pages/birth-plan.astro.mjs');
const _page9 = () => import('./pages/consulta-nutricionista.astro.mjs');
const _page10 = () => import('./pages/dashboard.astro.mjs');
const _page11 = () => import('./pages/fuentes.astro.mjs');
const _page12 = () => import('./pages/fuentes-diabetes-gestacional.astro.mjs');
const _page13 = () => import('./pages/fuentes-parto-posparto.astro.mjs');
const _page14 = () => import('./pages/plan-de-parto.astro.mjs');
const _page15 = () => import('./pages/plan-de-parto-en.astro.mjs');
const _page16 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/admin/leads.ts", _page1],
    ["src/pages/api/admin/login.ts", _page2],
    ["src/pages/api/admin/logout.ts", _page3],
    ["src/pages/api/admin/pagos.ts", _page4],
    ["src/pages/api/consulta-nutricionista.ts", _page5],
    ["src/pages/api/cron/check-lead-form.ts", _page6],
    ["src/pages/api/health/leads.ts", _page7],
    ["src/pages/birth-plan.astro", _page8],
    ["src/pages/consulta-nutricionista.astro", _page9],
    ["src/pages/dashboard.astro", _page10],
    ["src/pages/fuentes.astro", _page11],
    ["src/pages/fuentes-diabetes-gestacional.astro", _page12],
    ["src/pages/fuentes-parto-posparto.astro", _page13],
    ["src/pages/plan-de-parto.astro", _page14],
    ["src/pages/plan-de-parto-en.astro", _page15],
    ["src/pages/index.astro", _page16]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "fa76984b-3b95-484a-90a1-ae79ff87ce7b",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
