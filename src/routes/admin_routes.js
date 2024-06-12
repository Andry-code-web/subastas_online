const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("../database/db");

const router = express.Router();

router.get('/loginAdminG', (req, res) => {
  res.render('login_adminG');
})

router.post('/loginAdminG', (req, res) => {
  const { correo, contraseña } = req.body;

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

    if (contraseña.trim() !== adminGeneral.contraseña.trim()) {
      return res.status(401).send('Contraseña incorrecta');
    }

    req.session.adminGeneralId = adminGeneral.id;
    req.session.adminGeneralNombreUsuario = adminGeneral.nombre_usuario;

    // Redirige al usuario después de que la sesión se haya actualizado
    req.session.save((err) => {
      if (err) {
        console.error('Error al guardar la sesión:', err);
        return res.status(500).send('Error al iniciar sesión');
      }
      res.redirect('/admin/adminG');
    });
  });
});



router.get('/logout', function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error al cerrar sesion ', err);
    }
    res.redirect('/admin/loginAdminG');
  });
});

router.get("/adminG", (req, res) => {
  // Middleware para asegurarse de que la sesión se haya actualizado
  if (!req.session.adminGeneralNombreUsuario) {
    return res.redirect('/admin/loginAdminG');
  }
  
  const nombreUsuario = req.session.adminGeneralNombreUsuario;
  res.render('adminGeneral', { nombreUsuario });
});

router.post("/crear-admin-vendedor", async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const adminGeneralId = req.session.adminGeneralId;

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
  const adminGeneralId = req.session.adminGeneralId;
  const adminVendedorId = req.session.adminVendedorId;

  res.send(
    `ID del admin general: ${adminGeneralId}, ID del admin vendedor: ${adminVendedorId}`
  );
});

module.exports = router;
