# Supabase: notas de seguridad

- No publiques nunca `service_role` o secretos de pasarelas.
- Las claves públicas solo son seguras con RLS correctamente configurado.
- El schema inicial no permite crear pedidos desde el rol anónimo: es deliberado.
- El formulario del carrito necesita una API server-side/RPC segura para pasar de prototipo a producción.
- Los pedidos deben calcularse con precios consultados en base de datos, no con los precios enviados por el navegador.
- Confirma Pix/tarjeta mediante webhooks firmados y consulta al proveedor; no aceptes capturas como confirmación.
- Añade políticas de acceso específicas para roles y limita las consultas de datos personales.
