import{r as i,u as F,j as e,N as D,L as N,F as T}from"./index-Dj5xdNci.js";import{M as B}from"./MarkdownRenderer-ByEqXadd.js";import P from"./Breadcrumb-CDHfrYAb.js";const q=({file:o,title:v,fold:c})=>{const[x,h]=i.useState(""),[m,g]=i.useState([]),[u,j]=i.useState(""),p=F(),[r,w]=i.useState(!1),[y,b]=i.useState(""),[C,l]=i.useState([]);i.useEffect(()=>{(async()=>{try{const a=await fetch("/moc-design-docs/data/tutorialStructure.json");if(!a.ok)throw new Error("Error loading document structure");const n=await a.json();g(n),l(n)}catch(s){console.error("Error fetching document structure:",s)}})()},[]),i.useEffect(()=>{(async()=>{try{const a=await fetch(`/moc-design-docs/documents/${c}/${o}.md`);if(a.ok){const n=await a.text();h(n)}else h("Error loading content")}catch{h("Error loading content")}})(),window.scrollTo(0,0)},[o,c]),i.useEffect(()=>{const t=()=>{j(window.location.hash.replace("#",""))};return t(),window.addEventListener("hashchange",t),()=>{window.removeEventListener("hashchange",t)}},[]),i.useEffect(()=>{const t=()=>{const s=Array.from(document.querySelectorAll(".main-page-content h2")),a=window.scrollY+window.innerHeight/2-100;let n="";for(const d of s)if(d.offsetTop<=a)n=d.id;else break;j(n)};return window.addEventListener("scroll",t),()=>{window.removeEventListener("scroll",t)}},[]);const E=`${c}-${o}`;i.useEffect(()=>{(()=>{const s=document.querySelector(`[href="${window.location.hash}"]`);s&&s.scrollIntoView({behavior:"smooth",block:"start"})})()},[p.pathname,u]),i.useEffect(()=>{r?document.getElementsByTagName("body")[0].classList.add("mobile-overlay-active"):document.getElementsByTagName("body")[0].classList.remove("mobile-overlay-active")},[r]);const $=()=>p.pathname.split("/").filter(Boolean).map(t=>decodeURIComponent(t)),L=()=>{w(!r)},f=t=>{const s=decodeURIComponent(p.pathname.split("/").slice(2).join("/")),a=decodeURIComponent(t);return s===a},S=t=>{const s=t.target.value;if(b(s),s.trim()==="")l(m);else{const a=m.filter(n=>n.title.toLowerCase().includes(s.toLowerCase())||n.children&&n.children.some(d=>d.title.toLowerCase().includes(s.toLowerCase())));l(a)}},k=()=>{var t,s;b(""),l(m),(t=document.getElementById("sidebar-filter-input"))==null||t.classList.remove("is-active"),(s=document.getElementById("sidebar-filter-input"))==null||s.classList.add("false")},I=()=>{var t,s;(t=document.getElementById("sidebar-filter-input"))==null||t.classList.add("is-active"),(s=document.getElementById("sidebar-filter-input"))==null||s.classList.remove("false")};return e.jsxs("div",{className:"page-wrapper category-html document-page",children:[e.jsxs("div",{className:"sticky-header-container",children:[e.jsx("header",{className:"top-navigation",children:e.jsx(D,{})}),e.jsx("div",{className:"article-actions-container",children:e.jsxs("div",{className:"container",children:[e.jsx("button",{className:"button action has-icon sidebar-button",type:"button","aria-label":r?"Collapse sidebar":"Open sidebar","aria-expanded":r,"aria-controls":"sidebar-quicklinks",onClick:L,children:e.jsx("span",{className:"button-wrap",children:e.jsx("span",{className:"icon icon-sidebar"})})}),e.jsx(P,{path:$(),title:v})]})})]}),e.jsxs("div",{className:"main-wrapper",children:[e.jsxs("div",{className:"sidebar-container",children:[e.jsx("aside",{className:`sidebar ${r?"is-expanded":""}`,id:"sidebar-quicklinks","data-macro":"LearnSidebar",children:e.jsxs("nav",{className:"sidebar-inner","aria-label":"Related Topics",children:[e.jsx("header",{className:"sidebar-actions",children:e.jsx("section",{className:"sidebar-filter-container",children:e.jsxs("div",{className:"sidebar-filter",children:[e.jsxs("label",{htmlFor:"sidebar-filter-input",id:"sidebar-filter-label",className:"sidebar-filter-label",children:[e.jsx("span",{className:"icon icon-filter"}),e.jsx("span",{className:"visually-hidden",children:"Filter Sidebar"})]}),e.jsx("input",{type:"text",id:"sidebar-filter-input",className:"sidebar-filter-input-field",placeholder:"Filter",value:y,onChange:S,onFocus:I}),e.jsx("button",{type:"button",className:"button action has-icon clear-sidebar-filter-button",onClick:k,children:e.jsxs("span",{className:"button-wrap",children:[e.jsx("span",{className:"icon icon-cancel"}),e.jsx("span",{className:"visually-hidden",children:"Clear filter input"})]})})]})})}),e.jsxs("div",{className:"sidebar-inner-nav",children:[e.jsx("div",{className:"in-nav-toc",children:e.jsx("div",{className:"document-toc-container",children:e.jsxs("section",{className:"document-toc",children:[e.jsx("header",{children:e.jsx("h2",{className:"document-toc-heading",children:"In this Article"})}),e.jsx("ul",{className:"document-toc-list",children:x.split(`
`).filter(t=>t.startsWith("##")).map((t,s)=>{const a=t.replace(/#/g,"").trim(),n=t.startsWith("####")?"visually-hidden":t.startsWith("###")?"h3":t.startsWith("##")?"h2":"";return e.jsx("li",{className:"document-toc-item",children:e.jsx("a",{href:`#${a}`,className:`document-toc-link ${n}`,"aria-current":u===a?"true":void 0,children:a})},s)})})]})})}),e.jsx("div",{className:"sidebar-body",children:e.jsx("ol",{children:C.map(t=>e.jsxs("div",{children:[e.jsx("li",{className:"section",children:e.jsx(N,{to:`/${c}/${t.title}`,"aria-current":f(`${t.title}`)?"page":void 0,children:t.title})}),e.jsx("li",{children:t.children&&e.jsxs("details",{open:!0,children:[e.jsx("summary",{children:t.title}),e.jsx("ol",{children:t.children.map(s=>e.jsx("li",{children:e.jsx(N,{to:`/${c}/${t.title}/${s.title}`,"aria-current":f(`${t.title}/${s.title}`)?"page":void 0,children:s.title})},s.title))})]})})]},t.title))})})]}),e.jsx("section",{className:"place side"})]})}),e.jsxs("div",{className:"toc-container",children:[e.jsx("aside",{className:"toc",children:e.jsx("nav",{children:e.jsx("div",{className:"document-toc-container",children:e.jsxs("section",{className:"document-toc",children:[e.jsx("header",{children:e.jsx("h2",{className:"document-toc-heading",children:"In this Article"})}),e.jsx("ul",{className:"document-toc-list",children:x.split(`
`).filter(t=>t.startsWith("##")).map((t,s)=>{const a=t.replace(/#/g,"").trim(),n=t.startsWith("####")?"visually-hidden":t.startsWith("###")?"h3":t.startsWith("##")?"h2":"";return e.jsx("li",{className:"document-toc-item",children:e.jsx("a",{href:`#${a}`,className:`document-toc-link ${n}`,"aria-current":u===a?"true":void 0,children:a})},s)})})]})})})}),e.jsx("section",{className:"place side"})]})]}),e.jsx("main",{className:"main-content",children:e.jsx("article",{className:"main-page-content",lang:"zh-CN",children:e.jsx(B,{file:o,fold:c},E)})})]}),e.jsx(T,{})]})};export{q as default};
