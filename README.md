# Sabor Brasas — restaurante digital

Proyecto inicial responsive para desarrollar un restaurante con estilo premium oscuro. Está preparado para **GitHub + Vercel + Supabase**.

## Qué incluye

- Página de inicio y menú con búsqueda/categorías.
- Catálogo de demostración si todavía no configuras Supabase.
- Carrito guardado en el navegador, cantidades y total estimado.
- Formulario de pedido para delivery, recogida o mesa.
- Panel de administración con inicio de sesión de Supabase Auth.
- Gestión básica de productos y disponibilidad.
- Vista de cocina con pedidos agrupados por estado y actualización en tiempo real.
- API server-side inicial para registrar pedidos y recalcular precios con datos de Supabase.
- Esquema SQL inicial con productos, pedidos, mesas, perfiles, gastos y eventos de pago.
- Diseño responsive para móvil y escritorio.

## Importante: estado del proyecto

Esta es una **base funcional inicial**, no un sistema listo para cobrar dinero real en producción. Los pagos Pix y tarjeta todavía no están conectados a una pasarela. Los avisos reales de WhatsApp/Telegram, códigos QR de mesa seguros, cuentas abiertas y divididas, informes completos de ganancias, gestión avanzada de roles y la creación segura de pedidos desde el servidor deben implementarse antes del lanzamiento.

El esquema SQL bloquea intencionalmente la inserción pública directa en `orders`. El endpoint inicial `/api/orders` valida productos y precios en servidor. Antes de producción, añade límites antiabuso, validación más estricta de mesa/QR, idempotencia y reglas de privacidad.

## 1. Crear proyecto Supabase

1. Crea un proyecto en Supabase.
2. Abre **SQL Editor**.
3. Copia y ejecuta todo `supabase/schema.sql`.
4. Ve a **Project Settings → API** y copia la Project URL y la clave publicable/anon.
5. En **Authentication → Users**, crea el usuario del administrador.
6. Después de crear el usuario, asígnale perfil de propietario desde SQL Editor:

```sql
insert into public.profiles (id, display_name, role)
select id, 'Administrador', 'owner'
from auth.users
where email = 'TU_EMAIL_ADMIN'
on conflict (id) do update set role = 'owner';
```

No publiques una clave `service_role` en el navegador ni en GitHub.

## 2. Ejecutar localmente

Requiere Node.js instalado en una computadora o entorno de desarrollo compatible.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICABLE
NEXT_PUBLIC_RESTAURANT_NAME=Sabor Brasas
NEXT_PUBLIC_DELIVERY_FEE=7.00
SUPABASE_SERVICE_ROLE_KEY=TU_CLAVE_SECRETA_DE_SERVIDOR
NEXT_PUBLIC_PIX_KEY=
```

Abre `http://localhost:3000`.

Si estás trabajando desde un teléfono, puedes subir el repositorio a GitHub y conectar Vercel desde el navegador; Vercel instalará las dependencias y construirá la aplicación.

## 3. Publicar con GitHub + Vercel

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos de esta carpeta (no subas `.env.local`).
3. En Vercel, selecciona **Add New → Project** y conecta el repositorio.
4. En **Environment Variables**, añade las variables de `.env.example`.
5. Pulsa Deploy. Cada push al repositorio podrá crear un nuevo despliegue.

## 4. Rutas

- `/` — inicio.
- `/menu` — menú, búsqueda y filtros.
- `/carrito` — carrito y formulario de pedido.
- `/admin` — panel administrativo.
- `/cocina` — pantalla de cocina.
- `/mesa` — demostración de flujo QR.

## 5. Antes de aceptar pedidos reales

- Implementar una ruta segura para crear pedidos y recalcular precios en servidor.
- Restringir las operaciones de personal por rol y aplicar RLS por acción.
- Añadir integración real con un proveedor de Pix/tarjeta y validar webhooks firmados en servidor.
- Implementar confirmaciones de pago, cancelación, reembolsos y conciliación.
- Configurar notificaciones con secretos solo del lado servidor.
- Crear códigos QR por mesa con tokens aleatorios y validación en servidor.
- Configurar almacenamiento de imágenes, copias de seguridad, privacidad y política de datos.
- Probar pedidos simultáneos, stock, pedidos duplicados y fallos de red.
- Revisar los precios, moneda, tarifas de entrega, horarios y textos reales del negocio.

## Notas

- Moneda: reales brasileños (BRL).
- El nombre “Sabor Brasas” es provisional.
- Las fotos usan URLs de Unsplash; reemplázalas por fotos propias o imágenes con permisos adecuados.
- Los productos y precios de demostración son ejemplos, debes revisarlos antes de publicar.
