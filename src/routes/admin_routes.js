// src/routes/admin_routes.js
const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("../database/db");

const router = express.Router();

router.get('/loginAdminG', (req, res) => {
    res.render('login_adminG');
})

// src/routes/admin_routes.js

router.post('/loginAdminG', (req, res) => {
    const { correo, contraseña } = req.body;

    // Consulta la base de datos para encontrar el administrador general con el correo electrónico proporcionado
    const query = 'SELECT * FROM adminGeneral WHERE correo_electronico = ?';
    connection.query(query, [correo], (error, results) => {
        if (error) {
            console.error('Error al buscar el administrador general:', error);
            return res.status(500).send('Error al iniciar sesión');
        }

        if (results.length === 0) {
            return res.status(401).send('Correo electrónico no registrado');
        }

        const adminGeneral = results[0];

        // Verifica la contraseña ingresada con la contraseña almacenada en la base de datos
        if (contraseña.trim() !== adminGeneral.contraseña.trim()) {
            return res.status(401).send('Contraseña incorrecta');
        }

        // Si las credenciales son válidas, asigna el ID del administrador general a la sesión
        req.session.adminGeneralId = adminGeneral.id;

        // Redirige al usuario al panel de administrador general
        res.redirect('/admin/adminG');
    });
});

router.get('/logout', function(req, res) {
  req.session.destroy((err) =>{
    if (err) {
      console.log('Error al cerrar sesion ', err);
    }
    res.redirect('/admin//loginAdminG');
  });
});

router.get("/adminG", (req, res) => {
  res.render("adminGeneral");
});

router.post("/crear-admin-vendedor", async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const adminGeneralId = req.session.adminGeneralId; // Suponiendo que el ID del admin general está almacenado en la sesión

  const query =
    "INSERT INTO adminVendedor (nombre_usuario, contraseña, admin_general_id) VALUES (?, ?, ?)";
  connection.query(
    query,
    [nombre_usuario, hashedPassword, adminGeneralId],
    (error, results) => {
      if (error) {
        console.error("Error al crear el admin vendedor:", error);
        return res.status(500).send("Error al crear el admin vendedor");
      }
      res.redirect("/adminG");
    }
  );
});

router.get("/adminV", (req, res) => {
  res.render("adminVendedor");
});

router.post("/adminV", (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  const query = "SELECT * FROM adminVendedor WHERE nombre_usuario = ?";

  connection.query(query, [nombre_usuario], async (error, results) => {
    if (error) {
      console.error("Error al buscar el admin vendedor:", error);
      return res.status(500).send("Error al iniciar sesión");
    }

    if (results.length === 0) {
      return res.status(401).send("Usuario no encontrado");
    }

    const adminVendedor = results[0];

    const isPasswordValid = await bcrypt.compare(
      contraseña,
      adminVendedor.contraseña
    );
    if (!isPasswordValid) {
      return res.status(401).send("Contraseña incorrecta");
    }

    req.session.adminVendedorId = adminVendedor.id;
    res.redirect("/adminV");
  });
});

router.get("/test-session", (req, res) => {
  // Comprueba si hay un ID de administrador general almacenado en la sesión
  const adminGeneralId = req.session.adminGeneralId;

  // Comprueba si hay un ID de administrador vendedor almacenado en la sesión
  const adminVendedorId = req.session.adminVendedorId;

  // Devuelve los IDs de los administradores almacenados en la sesión
  res.send(
    `ID del admin general: ${adminGeneralId}, ID del admin vendedor: ${adminVendedorId}`
  );
});

module.exports = router;
