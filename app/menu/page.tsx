 "use client";
import Link from "next/link";
import { useEffect,useMemo,useState } from "react";
import { Search,ShoppingCart,ArrowLeft } from "lucide-react";
import { demoProducts,Product,brl } from "@/lib/data";
import { supabase,supabaseReady } from "@/lib/supabase";

export default function MenuPage(){
 const [products,setProducts]=useState<Product[]>(demoProducts);const [query,setQuery]=useState("");const [category,setCategory]=useState("Todos");const [cartCount,setCartCount]=useState(0);const [toast,setToast]=useState("");
 useEffect(()=>{const update=()=>{try{setCartCount(JSON.parse(localStorage.getItem("sabor-cart")||"[]").reduce((n:number,p:any)=>n+p.qty,0))}catch{}};update();window.addEventListener("cart-updated",update);async function load(){if(!supabaseReady||!supabase)return;const {data,error}=await supabase.from("products").select("*").eq("available",true).order("name");if(!error&&data?.length)setProducts(data as Product[])}load();return()=>window.removeEventListener("cart-updated",update)},[]);
 const categories=["Todos",...Array.from(new Set(products.map(p=>p.category)))];
 const filtered=useMemo(()=>products.filter(p=>p.available&&(category==="Todos"||p.category===category)&&(p.name.toLowerCase().includes(query.toLowerCase())||p.description.toLowerCase().includes(query.toLowerCase()))),[products,category,query]);
 function add(p:Product){let cart:any[]=[];try{cart=JSON.parse(localStorage.getItem("sabor-cart")||"[]")}catch{}const item=cart.find(x=>x.id===p.id);if(item)item.qty++;else cart.push({...p,qty:1});localStorage.setItem("sabor-cart",JSON.stringify(cart));setCartCount(cart.reduce((n,p)=>n+p.qty,0));window.dispatchEvent(new Event("cart-updated"));setToast(`${p.name} agregado al carrito`);setTimeout(()=>setToast(""),1800)}
 return <><header className="topbar"><div className="container nav"><Link href="/" className="brand"><span className="brand-icon">🔥</span><span><strong>SABOR</strong><small>BRASAS</small></span></Link><nav className="navlinks"><Link href="/">Inicio</Link><Link href="/menu">Menú</Link><Link href="/#nosotros">Nosotros</Link></nav><div className="navactions"><Link className="iconbtn" href="/carrito"><ShoppingCart size={18}/><span className="count">{cartCount}</span></Link><Link className="primary" href="/carrito">Ver carrito</Link></div></div></header>
 <main className="container"><div className="page-title"><Link href="/" className="muted"><ArrowLeft size={14} style={{display:"inline"}}/> Volver al inicio</Link><div className="eyebrow" style={{marginTop:20}}>Hecho con sabor</div><h1>Nuestro menú</h1><p className="muted">Elige tus favoritos y arma tu pedido.</p></div>
 <div className="searchbar"><input placeholder="Buscar platos o bebidas..." value={query} onChange={e=>setQuery(e.target.value)}/><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></div>
 <div className="dish-grid">{filtered.map(p=><article className="dish" key={p.id}><img src={p.image_url} alt={p.name}/><div className="dish-body"><h3>{p.name}</h3><p>{p.description}</p><div className="dish-foot"><span className="price">{brl(p.price)}</span><button className="addbtn" onClick={()=>add(p)}><ShoppingCart size={14}/> Agregar</button></div></div></article>)}</div>{filtered.length===0&&<div className="empty">No encontramos productos con esa búsqueda.</div>}
 </main><footer className="footer"><div className="container footer-inner"><span>© Sabor Brasas</span><Link href="/admin">Acceso del personal</Link></div></footer>{toast&&<div className="toast">{toast}</div>}</>;
}
