(this.webpackJsonpinvestment_accounting=this.webpackJsonpinvestment_accounting||[]).push([[0],{53:function(e,t,a){e.exports=a(71)},70:function(e,t,a){},71:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),c=a(50),r=a.n(c),s=a(4),m=a(37);const i={Transactions:{path:"/transactions"},Import:{path:"/transactions/import"},Bonds:{path:"/bonds"}};var o=()=>{const{pathname:e}=Object(s.n)();return l.a.createElement(l.a.Fragment,null,l.a.createElement("ul",{className:"nav nav-tabs"},Object.keys(i).map(t=>l.a.createElement("li",{className:"nav-item",type:"submit"},l.a.createElement(m.b,{className:"nav-link ".concat(e===i[t].path?"active":""),to:i[t].path},t)))),l.a.createElement(s.a,null))},u=a(78),d=a(77);var p=()=>{const[e,t]=Object(n.useState)({show:!1,data:{quantityAdd:0,quantityMissing:0}}),[a,c]=Object(n.useState)(!1);return console.log(e),l.a.createElement(l.a.Fragment,null,l.a.createElement("form",{className:"mb-3",onChange:e=>{e.preventDefault();const a=e.target.files[0];if(!a)return;const n=/xls(x)?$/,l=new FileReader;l.onload=()=>{const{name:e}=a;if(n.test(e)){const e=l.result.split(",")[1];(async()=>await u.a.post("https://d5dpil1j3vqslj3529om.apigw.yandexcloud.net/api/v1/transactions/import",{file:e}).then(e=>{let{data:a}=e;return(e=>{t({show:!0,data:e})})(a)}))()}},l.readAsDataURL(a)}},l.a.createElement("label",{htmlFor:"formFile",className:"form-label"},"\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043c\u044b\u0435 \u0431\u0440\u043e\u043a\u0435\u0440\u0441\u043a\u0438\u0435 \u043e\u0442\u0447\u0435\u0442\u044b: \u0422\u0438\u043d\u044c\u043a\u043e\u0444\u0444, \u0412\u0422\u0411"),l.a.createElement("input",{className:"form-control",type:"file",id:"formFile"})),l.a.createElement(d.a,{show:e.show,onHide:()=>{t({...e,show:!1})}},l.a.createElement(d.a.Body,null,"\u0414\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u043e \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u0439: ",e.data.quantityAdd),l.a.createElement(d.a.Body,null,"\u041d\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u043e \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u0439 (\u0434\u0443\u0431\u043b\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435): ",e.data.quantityMissing)))},E=a(19),g=a.n(E),h=a(79);var v=e=>{let{reqData:t,setReqData:a}=e;const{page:n,count:c}=t,r=((e,t)=>{let a=null,n=null;t<=7?(a=1,n=t):e<=3?(a=1,n=7):e+3>=t?(a=t-6,n=t):(a=e-3,n=e+3);const l=Object(E.range)(a,n+1);return l[1]>2&&(l[1]=null),l[l.length-2]<t-1&&(l[l.length-2]=null),l[0]=1,l[l.length-1]=t,l})(n,c);return l.a.createElement(h.a,null,l.a.createElement(h.a.Prev,{onClick:()=>{n>1&&a({...t,page:n-1})}}),r.map(e=>null===e?l.a.createElement(h.a.Ellipsis,null):l.a.createElement(h.a.Item,{active:n===e||null,onClick:()=>{return n=e,a({...t,page:n});var n}},e)),l.a.createElement(h.a.Next,{onClick:()=>{n!==c&&a({...t,page:n+1})}}))},b=a(75),y=a(76),f=a(51);var j=e=>{let{reqData:t,setReqData:a}=e;const{limit:n}=t;return l.a.createElement(l.a.Fragment,null,l.a.createElement(b.a,{className:"pagination",as:y.a,key:n,id:"button-customs",variant:"white",title:n},[10,25,50].map(e=>l.a.createElement(f.a.Item,{eventKey:e,onClick:()=>{return n=e,a({...t,limit:n});var n},active:e===n},e))))};var q=e=>{const{data:t}=e,a=(t[0],["yield_last","yield_avg"]);t.forEach(e=>{a.forEach(t=>{e[t]&&(e[t]=(100*e[t]).toFixed(2))}),e.trade_date=(e=>{const t=e.slice(0,4),a=e.slice(4,6),n=e.slice(6,8);return"".concat(t,":").concat(a,":").concat(n)})(e.trade_date)});const n={isin:"ISIN",trade_date:"Trade Date",count:"Quantity",price:"Price",summa:"Total amount"},l=Object.keys(n),c=t.map(e=>g.a.pick(e,l)).reduce((e,t)=>{const a={};return Object.keys(t).map(e=>{a[n[e]]=t[e]}),e.push(a),e},[]);return{...e,data:c}};const k=e=>{switch(e.toLowerCase()){case"quantity":case"price":case"total amount":return"rigthContent";default:return"leftContent"}},w=e=>{let{tags:t}=e;return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"tags"},Object.keys(t).map(e=>l.a.createElement("div",{className:k(e),key:Object(E.uniqueId)()},e))))},N=e=>{let{body:t}=e;return l.a.createElement(l.a.Fragment,null,t.map(e=>l.a.createElement("div",{className:"body",key:Object(E.uniqueId)()},Object.entries(e).map(e=>{let[t,a]=e;return l.a.createElement("div",{className:k(t),key:Object(E.uniqueId)()},a)}))))};var O=()=>{const[e,t]=Object(n.useState)({page:1,limit:25});return Object(n.useEffect)(()=>{const{page:a,limit:n}=e;(async()=>{await u.a.get("https://d5dpil1j3vqslj3529om.apigw.yandexcloud.net/api/v1/transactions?page=".concat(a,"&limit=").concat(n)).then(e=>{let{data:a}=e;return!!a.data&&t(q(a))})})()},[e.page,e.limit]),l.a.createElement(l.a.Fragment,null,e.data&&l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"table"},l.a.createElement(w,{tags:e.data[0]}),l.a.createElement(N,{body:e.data})),l.a.createElement("div",{className:"pagination-limit"},0!==e.data.length&&l.a.createElement("tr",null,l.a.createElement("th",null,l.a.createElement(j,{reqData:e,setReqData:t})),l.a.createElement("th",null,l.a.createElement(v,{reqData:e,setReqData:t})))))||l.a.createElement("div",null,"Loaded"))};var F=()=>l.a.createElement(m.a,null,l.a.createElement(s.d,null,l.a.createElement(s.b,{path:"/",element:l.a.createElement(o,null)},l.a.createElement(s.b,{path:"transactions",element:l.a.createElement(O,null)}),l.a.createElement(s.b,{path:"transactions/import",element:l.a.createElement(p,null)}),l.a.createElement(s.b,{path:"*",element:l.a.createElement("div",null,"Bonds")}))));a(69),a(70);r.a.createRoot(document.getElementById("root")).render(l.a.createElement(F,null))}},[[53,1,2]]]);
//# sourceMappingURL=main.cd601d7b.chunk.js.map