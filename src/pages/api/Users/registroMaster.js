import Usuario from '@/models/Usuarios'; // Importa el modelo de Usuario
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, lastName, email, employeeNumber, position, selectedDepartamento, password, confirmPassword, role, phoneNumber, entryDate, directBoss, company, workPlant, selectedPlatforms } = req.body;

  const correo = email || null;
  const puesto = position || null;
  const telefono = phoneNumber || null;
  const fecha_ingreso = entryDate || null;
  const jefe_directo = directBoss || null;
  const rol = role || "Estándar";
  const plataformas = selectedPlatforms || null;

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    // Verificar si el usuario ya existe con Sequelize
    const userExists = await Usuario.findOne({ where: { correo: email } });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario en la base de datos con Sequelize
    const newUser = await Usuario.create({
      rol,
      nombre: name,
      numero_empleado: employeeNumber,
      departamento_id: selectedDepartamento,
      correo: correo,
      password: hashedPassword,
      apellidos: lastName,
      puesto: puesto,
      telefono: telefono,
      fecha_ingreso: fecha_ingreso,
      jefe_directo: jefe_directo,
      empresa_id: company,
      planta: workPlant,
      plataformas: plataformas,
    });

    console.log({ message: 'Usuario registrado' });

    res.status(201).json({ success: true, user: { ...newUser.toJSON(), password: undefined } }); // Omitir la contraseña al retornar el usuario
  } catch (error) {
    console.error('Error registrando al usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}