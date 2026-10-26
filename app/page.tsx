 "use client";
import Link from "next/link";
import { ArrowRight, Bike, Search, ShoppingCart, Flame, ShieldCheck, Truck, Star, Utensils, Clock, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { demoProducts, Product, brl } from "@/lib/data";
import { supabase, supabaseReady } from "@/lib/supabase";

export default function Home() {
  const [products,setProducts] = useState<Product[]>(demoProducts);
  const [cartCount,setCartCount] = useState(0);
  useEffect(()=>{
    const raw = localStorage.getItem("sabor-cart");
    if(raw){try{setCartCount(JSON.parse(raw).reduce((n:any,p:any)=>n+p.qty,0))}catch{}}
    async function load(){
      if(!supabaseReady || !supabase) return;
      const {data,error}=await supabase.from("products").select("*").eq("available",true).order("created_at",{ascending:false});
      if(!error && data?.length) setProducts(data as Product[]);
    }
    load();
  },[]);
  function add(p:Product){
    const raw=localStorage.getItem("sabor-cart"); let cart:any[]=[];
    try{cart=raw?JSON.parse(raw):[]}catch{}
    const found=cart.find(x=>x.id===p.id);
    if(found) found.qty+=1; else cart.push({...p,qty:1});
    localStorage.setItem("sabor-cart",JSON.stringify(cart));
    setCartCount(cart.reduce((n,p)=>n+p.qty,0));
    window.dispatchEvent(new Event("cart-updated"));
  }
  const featured=products.filter(p=>p.available && (p.featured || p.id.startsWith("demo-"))).slice(0,4);
  return <>
    <header className="topbar"><div className="container nav">
      <Link href="/" className="brand"><span className="brand-icon"><Flame size={28}/></span><span><strong>SABOR</strong><small>BRASAS</small></span></Link>
      <nav className="navlinks"><a href="#inicio">Inicio</a><Link href="/menu">Menú</Link><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a></nav>
      <div className="navactions"><Link className="iconbtn" href="/menu" aria-label="Buscar"><Search size={19}/></Link><Link className="iconbtn" href="/carrito" aria-label="Carrito"><ShoppingCart size={19}/><span className="count">{cartCount}</span></Link><Link className="primary" href="/menu">Hacer pedido</Link></div>
    </div></header>
    <main>
      <section className="hero" id="inicio"><div className="container"><div className="hero-inner">
        <div className="eyebrow">Sabores auténticos · Experiencias únicas</div>
        <h1>La verdadera<br/><span>comida brasileña</span><br/>en cada bocado</h1>
        <p>Platos generosos, ingredientes frescos y ese sabor a brasas que convierte cualquier comida en un momento especial.</p>
        <div className="actions"><Link className="primary" href="/menu">Ver menú <ArrowRight size={17}/></Link><Link className="outline" href="/menu">Pedir a domicilio <Bike size={17}/></Link></div>
        <div className="service-row"><span><b>♧</b> Delivery</span><span><b>♙</b> Recogida</span><span><b>♨</b> Mesas con QR</span></div>
      </div></div></section>
      <section className="section"><div className="container">
        <div className="section-head"><div><div className="eyebrow">Platos destacados</div><h2>Nuestros favoritos</h2><p>Preparados al momento, para disfrutar sin prisa.</p></div><Link className="outline" href="/menu">Ver todo el menú <ArrowRight size={15}/></Link></div>
        <div className="dish-grid">{featured.map(p=><article className="dish" key={p.id}><img src={p.image_url} alt={p.name}/><div className="dish-body"><h3>{p.name}</h3><p>{p.description}</p><div className="dish-foot"><span className="price">{brl(p.price)}</span><button className="addbtn" onClick={()=>add(p)}><ShoppingCart size={14}/> Agregar</button></div></div></article>)}</div>
      </div></section>
      <section className="section" style={{paddingTop:8}}><div className="container"><div className="category-grid">
        {[["Entradas","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80"],["Carnes","https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"],["Platos típicos","https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"],["Bebidas","https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=700&q=80"]].map(([name,img])=><Link href="/menu" className="category" key={name} style={{backgroundImage:`url("${img}")`}}><div><h3>{name}</h3><span>Ver más →</span></div></Link>)}
      </div></div></section>
      <section className="strip" id="nosotros"><div className="container benefits"><div className="benefit"><ShieldCheck className="benefit-icon"/><div><b>Pago seguro</b><small>Pix y tarjeta mediante proveedor</small></div></div><div className="benefit"><Truck className="benefit-icon"/><div><b>Entrega organizada</b><small>Delivery, recogida y mesas</small></div></div><div className="benefit"><Star className="benefit-icon"/><div><b>Calidad garantizada</b><small>Siempre fresco y preparado al momento</small></div></div></div></section>
    </main>
    <footer className="footer" id="contacto"><div className="container footer-inner"><span>© {new Date().getFullYear()} Sabor Brasas. Nombre provisional.</span><span>Comida boa, vida melhor! 🔥</span><span><Link href="/admin">Acceso del personal</Link></span></div></footer>
  </>;
}
