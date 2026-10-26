export type Product = {
  id: string; name: string; description: string; price: number; category: string;
  image_url: string; available: boolean; featured: boolean;
};

export const demoProducts: Product[] = [
  {id:"demo-1",name:"Picanha Especial",description:"Picanha a la parrilla con arroz, farofa y vinagreta.",price:59.90,category:"Carnes",image_url:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",available:true,featured:true},
  {id:"demo-2",name:"Frango Cremoso",description:"Pollo jugoso en salsa cremosa, arroz y papas.",price:42.90,category:"Pollo",image_url:"https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80",available:true,featured:true},
  {id:"demo-3",name:"Moqueca de Camarão",description:"Camarones, leche de coco y especias tradicionales.",price:68.90,category:"Platos típicos",image_url:"https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80",available:true,featured:true},
  {id:"demo-4",name:"Costela Barbecue",description:"Costillas con salsa barbecue y papas rústicas.",price:54.90,category:"Carnes",image_url:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",available:true,featured:true},
  {id:"demo-5",name:"Poque-macho da Casa",description:"Carne, linguiça, batata, ovo e molho da casa.",price:49.90,category:"Platos típicos",image_url:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",available:true,featured:false},
  {id:"demo-6",name:"Frango Assado",description:"Pollo al horno con guarnición de la casa.",price:39.90,category:"Pollo",image_url:"https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80",available:true,featured:false},
  {id:"demo-7",name:"Frango Broaster",description:"Pollo crujiente, dorado y recién preparado.",price:34.90,category:"Pollo",image_url:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=80",available:true,featured:false},
  {id:"demo-8",name:"Coca-Cola 2L",description:"Bebida bien fría para compartir.",price:12.00,category:"Bebidas",image_url:"https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=80",available:true,featured:false},
  {id:"demo-9",name:"Fanta Laranja 2L",description:"Refrescante sabor naranja.",price:11.00,category:"Bebidas",image_url:"https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=900&q=80",available:true,featured:false},
  {id:"demo-10",name:"Sprite 2L",description:"Refresco cítrico y refrescante.",price:11.00,category:"Bebidas",image_url:"https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=80",available:true,featured:false},
  {id:"demo-11",name:"Dolly Guaraná 2L",description:"Refresco clásico para acompañar.",price:9.50,category:"Bebidas",image_url:"https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=80",available:true,featured:false}
];
export const brl = (value:number) => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
