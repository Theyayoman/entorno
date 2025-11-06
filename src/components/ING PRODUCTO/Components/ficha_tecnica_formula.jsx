import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  centeredTitle: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: "#3b4d00",
    marginBottom: 4,
  },
  centeredSubtitle: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    color: "white",
    fontSize: 12,
    backgroundColor: "#4a5a2c",
    padding: 5,
    paddingLeft: 30,
    textAlign: 'left',
    marginHorizontal: -30,
    maxWidth: '50%',
  },
  label: {
    fontFamily: 'Helvetica-Bold',
    color: 'white',
    fontSize: 12,
    backgroundColor: '#4a5a2c',
    padding: 5,
    paddingLeft: 30,
    maxWidth: '50%',
    marginHorizontal: -30,
  },
  value: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: 'black',
    padding: 5,
    paddingLeft: 30,
    maxWidth: '50%',
    marginHorizontal: -30,
  },
  listItem: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: 'black',
    padding: 5,
    paddingLeft: 30,
    paddingBottom: 0,
    maxWidth: '50%',
    marginHorizontal: -30,
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 20,
    marginBottom: 10,
    objectFit: "contain",
  },
  floatingImage: {
    width: 280,
    height: 400,
    position: 'absolute',
    top: 60,
    right: 0,
    objectFit: 'contain',
  },
  waterMark: {
    position: 'absolute',
    top: 170,
    left: 0,
    right: 0,
    fontSize: 40,
    color: '#cccccc',
    opacity: 0.3,
    transform: 'rotate(-20deg)',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  }
});

// Obtener categoría por medio del valor de la BD
const Categoria = ( value ) => {
    switch (value.toString()) {
        case '1':
            return 'Herbal.';
        case '2':
            return '2';
        case '3':
            return '3';
        case '4':
            return '4';
        case '5':
            return '5';
        default:
            return 'Sin datos';
    }
};

// Obtener línea por medio del valor de la BD
const Linea = ( value ) => {
    switch (value.toString()) {
        case '1':
            return 'Económica.';
        case '2':
            return '2';
        case '3':
            return '3';
        case '4':
            return '4';
        case '5':
            return '5';
        default:
            return 'Sin datos';
    }
};

// Obtener formato por medio del valor de la BD
const Formato = ( value ) => {
    switch (value.toString()) {
        case '1':
            return 'Líquido.';
        case '2':
            return '2';
        case '3':
            return '3';
        case '4':
            return '4';
        case '5':
            return '5';
        default:
            return 'Sin datos';
    }
};

const Etiqueta = ({ label, value }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Lista con viñetas
const ListaViñetas = ({ items }) => {
    const oraciones = items
      .split(".")                         // divide por puntos
      .map(o => o.trim())                // elimina espacios alrededor
      .filter(o => o.length > 0);        // evita elementos vacíos
  
    return (
      <View style={{ paddingBottom: 5 }}>
        {oraciones.map((item, i) => (
          <Text key={i} style={styles.listItem}>• {item}.</Text>
        ))}
      </View>
    );
};

// Documento principal
const FichaTecnicaPDFFormula = ({ producto, imagenAdicional }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
            style={{
                position: "absolute",
                top: 0, // o ajusta según necesidad
                left: 0,
                right: 0,
            }}
            wrap={false}
        >
            <View style={{ display: "flex", flexDirection: "column" }} wrap={false}>
                {/* Fila 1: Encabezado (línea superior) */}
                <View
                    style={{
                        height: 20,
                        backgroundColor: "#1aab00",
                        width: "100%",
                    }}
                />

                {/* Fila 2: Contenido (línea inferior) */}
                <View
                    style={{
                        height: 28,
                        backgroundColor: "#001962",
                        width: "100%",
                    }}
                />
            </View>
        </View>

        {/* Título */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, marginTop: 10 }}>
            {/* Título y Código alineados en columna */}
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text style={styles.centeredTitle}>{producto.producto?.nombre.toUpperCase()}</Text>
                <Text style={styles.centeredSubtitle}>CÓDIGO: {producto.producto?.codigo.toUpperCase()}</Text>
            </View>

            {/* Logo a la derecha */}
            <Image src="/pasiLogo.png" style={styles.logo} />
        </View>

        <View>
          {/* Contenido principal con etiquetas */}
          <View style={{ zIndex: 1 }}>
            <Etiqueta label="CATEGORÍA" value={Categoria(producto.identificadoresProductos?.[0]?.registroV)} />
            <Etiqueta label="LÍNEA" value={Linea(producto.identificadoresProductos?.[1]?.registroV)} />
            <Etiqueta label="FORMATO" value={Formato(producto.identificadoresProductos?.[2]?.registroV)} />
            <Etiqueta label="PRESENTACIÓN" value={producto.identificadoresProductos?.[3]?.registroV || "Sin datos"} />
            <Etiqueta label="INGREDIENTES" value={producto.identificadoresProductos?.[5]?.registroV || "Sin datos"} />
            <Etiqueta label="MODO DE EMPLEO" value={producto.identificadoresProductos?.[4]?.registroV || "Sin datos"} />
            <Etiqueta label="FUNCIÓN PRINCIPAL" value={producto.identificadoresProductos?.[6]?.registroV || "Sin datos"} />

            <View>
              <Text style={styles.label}>FUNCIÓN ESPECÍFICA</Text>
              <ListaViñetas items={producto.identificadoresProductos?.[7]?.registroV || "Sin datos"} />
            </View>

            <Etiqueta label="A QUIÉN RECOMENDAR" value={producto.identificadoresProductos?.[8]?.registroV || "Sin datos"} />

            <View>
              <Text style={{...styles.label, maxWidth: '65%'}}>PRODUCTOS COMPLEMENTARIOS</Text>
              <ListaViñetas items={producto.identificadoresProductos?.[9]?.registroV || "Sin datos"} />
            </View>
          </View>

          {/* Imagen sobrepuesta a la derecha */}
          <Image src={imagenAdicional} style={styles.floatingImage} />
        </View>

        <View
            style={{
                position: "absolute",
                bottom: 0, // o ajusta según necesidad
                left: 0,
                right: 0,
            }}
            wrap={false}
        >
            <View style={{ display: "flex", flexDirection: "column" }} wrap={false}>
                {/* Fila 1: Encabezado (línea superior) */}
                <View
                    style={{
                        height: 28,
                        backgroundColor: "#001962",
                        width: "100%",
                    }}
                />

                {/* Fila 2: Contenido (línea inferior) */}
                <View
                    style={{
                        height: 20,
                        backgroundColor: "#1aab00",
                        width: "100%",
                    }}
                />
            </View>
        </View>

        {/* Marca de agua */}
        <View style={styles.waterMark}>
          <Text>
            INFORMACIÓN{'\n'}PARA USO INTERNO
          </Text>
        </View>

        <View style={{...styles.waterMark, top: 370}}>
          <Text>
            INFORMACIÓN{'\n'}PARA USO INTERNO
          </Text>
        </View>

        <View style={{...styles.waterMark, top: 570}}>
          <Text>
            INFORMACIÓN{'\n'}PARA USO INTERNO
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default FichaTecnicaPDFFormula;