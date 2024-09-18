const __vite__fileDeps=["assets/MarkdownRenderer-BChZS7E5.js","assets/index-Dolhs0-b.js","assets/index-bbLIuqaR.css","assets/MarkdownRenderer-CJLpLfv2.css","assets/Breadcrumb-C9dhJ8Ji.js","assets/Breadcrumb-C9-TwzxV.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{r as n,_ as w,u as F,j as e,a as v,L as g}from"./index-Dolhs0-b.js";import{N as P,F as T}from"./Footer-B4GZibuM.js";/* empty css                 */const R=n.lazy(()=>w(()=>import("./MarkdownRenderer-BChZS7E5.js").then(c=>c.M),__vite__mapDeps([0,1,2,3]))),B=n.lazy(()=>w(()=>import("./Breadcrumb-C9dhJ8Ji.js"),__vite__mapDeps([4,1,2,5]))),q=({file:c,title:y,fold:r})=>{const[x,h]=n.useState(""),[m,E]=n.useState([]),[u,j]=n.useState(""),p=F(),[o,C]=n.useState(!1),[L,b]=n.useState(""),[k,l]=n.useState([]);n.useEffect(()=>{(async()=>{try{const a=await fetch("/moc-design-docs/data/tutorialStructure.json");if(!a.ok)throw new Error("Error loading document structure");const i=await a.json();E(i),l(i)}catch(s){console.error("Error fetching document structure:",s)}})()},[]),n.useEffect(()=>{(async()=>{try{const a=await fetch(`/moc-design-docs/documents/${r}/${c}.md`);if(a.ok){const i=await a.text();h(i)}else h("Error loading content")}catch{h("Error loading content")}})(),window.scrollTo(0,0)},[c,r]),n.useEffect(()=>{const t=()=>{j(window.location.hash.replace("#",""))};return t(),window.addEventListener("hashchange",t),()=>{window.removeEventListener("hashchange",t)}},[]),n.useEffect(()=>{const t=()=>{const s=Array.from(document.querySelectorAll(".main-page-content h2")),a=window.scrollY+window.innerHeight/2-100;let i="";for(const d of s)if(d.offsetTop<=a)i=d.id;else break;j(i)};return window.addEventListener("scroll",t),()=>{window.removeEventListener("scroll",t)}},[]);const S=`${r}-${c}`;n.useEffect(()=>{(()=>{const s=document.querySelector(`[href="${window.location.hash}"]`);s&&s.scrollIntoView({behavior:"smooth",block:"start"})})()},[p.pathname,u]),n.useEffect(()=>{o?document.getElementsByTagName("body")[0].classList.add("mobile-overlay-active"):document.getElementsByTagName("body")[0].classList.remove("mobile-overlay-active")},[o]);const $=()=>p.pathname.split("/").filter(Boolean).map(t=>decodeURIComponent(t)),f=()=>{C(!o)},N=t=>{const s=decodeURIComponent(p.pathname.split("/").slice(2).join("/")),a=decodeURIComponent(t);return s===a},I=t=>{const s=t.target.value;if(b(s),s.trim()==="")l(m);else{const a=m.filter(i=>i.title.toLowerCase().includes(s.toLowerCase())||i.children&&i.children.some(d=>d.title.toLowerCase().includes(s.toLowerCase())));l(a)}},_=()=>{var t,s;b(""),l(m),(t=document.getElementById("sidebar-filter-input"))==null||t.classList.remove("is-active"),(s=document.getElementById("sidebar-filter-input"))==null||s.classList.add("false")},D=()=>{var t,s;(t=document.getElementById("sidebar-filter-input"))==null||t.classList.add("is-active"),(s=document.getElementById("sidebar-filter-input"))==null||s.classList.remove("false")};return e.jsxs("div",{className:"page-wrapper category-html document-page",children:[e.jsxs("div",{className:"sticky-header-container",children:[e.jsx("header",{className:"top-navigation",children:e.jsx(P,{})}),e.jsx("div",{className:"article-actions-container",children:e.jsxs("div",{className:"container",children:[e.jsx("button",{className:"button action has-icon sidebar-button",type:"button","aria-label":o?"Collapse sidebar":"Open sidebar","aria-expanded":o,"aria-controls":"sidebar-quicklinks",onClick:f,children:e.jsx("span",{className:"button-wrap",children:e.jsx("span",{className:"icon icon-sidebar"})})}),e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsx(B,{path:$(),title:y})})]})})]}),e.jsxs("div",{className:"main-wrapper",children:[e.jsxs("div",{className:"sidebar-container",children:[e.jsxs("aside",{className:`sidebar ${o?"is-expanded":""}`,id:"sidebar-quicklinks","data-macro":"LearnSidebar",children:[e.jsx("button",{type:"button",className:"button action backdrop","aria-label":"Collapse sidebar",onClick:f,children:e.jsx("span",{className:"button-wrap"})}),e.jsxs("nav",{className:"sidebar-inner","aria-label":"Related Topics",children:[e.jsx("header",{className:"sidebar-actions",children:e.jsx("section",{className:"sidebar-filter-container",children:e.jsxs("div",{className:"sidebar-filter",children:[e.jsxs("label",{htmlFor:"sidebar-filter-input",id:"sidebar-filter-label",className:"sidebar-filter-label",children:[e.jsx("span",{className:"icon icon-filter"}),e.jsx("span",{className:"visually-hidden",children:"Filter Sidebar"})]}),e.jsx("input",{type:"text",id:"sidebar-filter-input",className:"sidebar-filter-input-field",placeholder:"Filter",value:L,onChange:I,onFocus:D}),e.jsx("button",{type:"button",className:"button action has-icon clear-sidebar-filter-button",onClick:_,children:e.jsxs("span",{className:"button-wrap",children:[e.jsx("span",{className:"icon icon-cancel"}),e.jsx("span",{className:"visually-hidden",children:"Clear filter input"})]})})]})})}),e.jsxs("div",{className:"sidebar-inner-nav",children:[e.jsx("div",{className:"in-nav-toc",children:e.jsx("div",{className:"document-toc-container",children:e.jsxs("section",{className:"document-toc",children:[e.jsx("header",{children:e.jsx("h2",{className:"document-toc-heading",children:"In this Article"})}),e.jsx("ul",{className:"document-toc-list",children:x.split(`
`).filter(t=>t.startsWith("##")).map((t,s)=>{const a=t.replace(/#/g,"").trim(),i=t.startsWith("####")?"visually-hidden":t.startsWith("###")?"h3":t.startsWith("##")?"h2":"";return e.jsx("li",{className:"document-toc-item",children:e.jsx("a",{href:`#${a}`,className:`document-toc-link ${i}`,"aria-current":u===a?"true":void 0,children:a})},s)})})]})})}),e.jsx("div",{className:"sidebar-body",children:e.jsx("ol",{children:k.map(t=>e.jsxs("div",{children:[e.jsx("li",{className:"section",children:e.jsx(g,{to:`/${r}/${t.title}`,"aria-current":N(`${t.title}`)?"page":void 0,children:t.title})}),e.jsx("li",{children:t.children&&e.jsxs("details",{open:!0,children:[e.jsx("summary",{children:t.title}),e.jsx("ol",{children:t.children.map(s=>e.jsx("li",{children:e.jsx(g,{to:`/${r}/${t.title}/${s.title}`,"aria-current":N(`${t.title}/${s.title}`)?"page":void 0,children:s.title})},s.title))})]})})]},t.title))})})]}),e.jsx("section",{className:"place side"})]})]}),e.jsxs("div",{className:"toc-container",children:[e.jsx("aside",{className:"toc",children:e.jsx("nav",{children:e.jsx("div",{className:"document-toc-container",children:e.jsxs("section",{className:"document-toc",children:[e.jsx("header",{children:e.jsx("h2",{className:"document-toc-heading",children:"In this Article"})}),e.jsx("ul",{className:"document-toc-list",children:x.split(`
`).filter(t=>t.startsWith("##")).map((t,s)=>{const a=t.replace(/#/g,"").trim(),i=t.startsWith("####")?"visually-hidden":t.startsWith("###")?"h3":t.startsWith("##")?"h2":"";return e.jsx("li",{className:"document-toc-item",children:e.jsx("a",{href:`#${a}`,className:`document-toc-link ${i}`,"aria-current":u===a?"true":void 0,children:a})},s)})})]})})})}),e.jsx("section",{className:"place side"})]})]}),e.jsx("main",{className:"main-content",children:e.jsx("article",{className:"main-page-content",lang:"zh-CN",children:e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsx(R,{file:c,fold:r},S)})})})]}),e.jsx(T,{})]})};export{q as default};
