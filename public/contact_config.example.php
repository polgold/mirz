<?php
/**
 * Configuración SMTP para contact.php (contraseña del correo).
 *
 * En el servidor (Hostinger) - IMPORTANTE para que no se borre en cada deploy:
 * 1. Subí este archivo a la carpeta PADRE de public_html (no dentro de public_html).
 *    Ejemplo: si tu sitio está en .../public_html/, poné contact_config.php en .../
 * 2. Renombralo a contact_config.php
 * 3. Reemplazá TU_CONTRASEÑA por la contraseña del correo hola@mirtazaliauskas.com
 *
 * contact.php busca la config en su carpeta y en la carpeta padre.
 */
define('SMTP_PASS', 'TU_CONTRASEÑA');
