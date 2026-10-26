import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json({ error: "Falta configurar Supabase en el servidor." }, { status: 503 });
    }

    const body = await request.json();
    const { customer_name, customer_phone, delivery_address, fulfillment_type, payment_method, notes, items } = body || {};

    if (!customer_name?.trim() || !customer_phone?.trim()) {
      return NextResponse.json({ error: "Nombre y WhatsApp son obligatorios." }, { status: 400 });
    }
    if (!["delivery", "pickup", "dine_in"].includes(fulfillment_type)) {
      return NextResponse.json({ error: "Modalidad de pedido no válida." }, { status: 400 });
    }
    if (!["pix", "card", "cash", "in_person"].includes(payment_method)) {
      return NextResponse.json({ error: "Método de pago no válido." }, { status: 400 });
    }
    if (fulfillment_type === "delivery" && !delivery_address?.trim()) {
      return NextResponse.json({ error: "La dirección es obligatoria para delivery." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length < 1 || items.length > 40) {
      return NextResponse.json({ error: "El carrito no es válido." }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      if (typeof item.id !== "string" || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 50) {
        return NextResponse.json({ error: "Hay un producto o cantidad no válida." }, { status: 400 });
      }
      quantities.set(item.id, (quantities.get(item.id) || 0) + item.qty);
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const ids = [...quantities.keys()];
    // UUID ids only; demo ids are intentionally not accepted for real orders.
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!ids.every(id => uuid.test(id))) {
      return NextResponse.json({ error: "El menú de demostración no permite guardar pedidos reales. Carga productos en Supabase." }, { status: 400 });
    }
    const { data: products, error: productError } = await supabase
      .from("products").select("id,name,price,available").in("id", ids);
    if (productError || !products || products.length !== ids.length) {
      return NextResponse.json({ error: "No se pudieron validar los productos del pedido." }, { status: 400 });
    }
    if (products.some(p => !p.available)) {
      return NextResponse.json({ error: "Uno de los productos ya no está disponible. Actualiza el menú." }, { status: 409 });
    }

    const orderItems = products.map(p => {
      const quantity = quantities.get(p.id)!;
      const unitPrice = Number(p.price);
      return { product_id: p.id, name: p.name, unit_price: unitPrice, quantity, line_total: Math.round(unitPrice * quantity * 100) / 100 };
    });
    const subtotal = Math.round(orderItems.reduce((sum, item) => sum + item.line_total, 0) * 100) / 100;
    const deliveryFee = Number(process.env.NEXT_PUBLIC_DELIVERY_FEE || 7);
    const total = Math.round((subtotal + (fulfillment_type === "delivery" ? deliveryFee : 0)) * 100) / 100;

    const { data, error } = await supabase.from("orders").insert({
      customer_name: customer_name.trim().slice(0, 120),
      customer_phone: customer_phone.trim().slice(0, 40),
      delivery_address: delivery_address?.trim().slice(0, 500) || null,
      fulfillment_type, payment_method, payment_status: "pending", status: "new",
      subtotal, total, notes: notes?.trim().slice(0, 1000) || null, items: orderItems
    }).select("id,order_number,total,payment_status").single();

    if (error) {
      return NextResponse.json({ error: "No se pudo registrar el pedido. Comprueba la configuración de la base de datos." }, { status: 500 });
    }
    return NextResponse.json({ order: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }
}
