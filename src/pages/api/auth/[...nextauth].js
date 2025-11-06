import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import Usuario from "@/models/Usuarios";

export default NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "text" },
        numero: { label: "Número de empleado", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { correo, numero, password } = credentials;

        if (!numero && !correo) {
          throw new Error("Debes proporcionar correo o número de empleado");
        }

        const field = correo ? "correo" : "numero_empleado";
        const value = correo || numero;

        try {
          // Busca el usuario en la base de datos
          const user = await Usuario.findOne({ where: { [field]: value } });

          if (!user) {
            throw new Error("Usuario no encontrado");
          }

          // Verifica la contraseña
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Contraseña incorrecta");
          }

          return {
            id: user.id,
            numero_empleado: user.numero_empleado,
            name: user.nombre,
            email: user.correo,
            rol: user.rol,
            departamento: user.departamento_id,
            idPermiso: user.id_permiso,
          };
        } catch (error) {
          console.error("Error en la autorización:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/inicio",
    signOut: "/",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7200,
    updateAge: 0,
  },
  jwt: {
    maxAge: 7200,
    updateAge: 0,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.numero_empleado = user.numero_empleado;
        token.id = user.id;
        token.rol = user.rol;
        token.departamento = user.departamento;
        token.idPermiso = user.idPermiso;
        token.exp = Math.floor(Date.now() / 1000) + 7200;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.numero_empleado = token.numero_empleado;
        session.user.id = token.id;
        session.user.rol = token.rol;
        session.user.departamento_id = token.departamento;
        session.user.id_permiso = token.idPermiso;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          // Verifica si el usuario ya existe en la base de datos
          let usuario = await Usuario.findOne({
            where: { correo: user.email },
          });

          if (!usuario) {
            // Si el usuario no existe, lo inserta en la base de datos
            usuario = await Usuario.create({
              rol: "estandar",
              nombre: user.name,
              correo: user.email,
            });
          }
        } catch (error) {
          console.error(
            "Error al verificar o insertar el usuario:",
            error.message
          );
        }
      }
      return true;
    },
  },
});
