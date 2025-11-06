import Usuario from '@/models/Usuarios'; // Importa el modelo de Usuario
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { rol = 'Estándar', name, email, password, confirmPassword } = req.body;

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
      correo: email,
      password: hashedPassword,
    });

    console.log({ message: 'Usuario registrado' });

    // Responder con el usuario creado (sin la contraseña)
    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,         // Asegúrate de incluir el ID del nuevo usuario
        rol: newUser.rol,       // Incluir los datos necesarios
        nombre: newUser.nombre, 
        correo: newUser.correo
      }
    });
  } catch (error) {
    console.error('Error registrando al usuario:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}