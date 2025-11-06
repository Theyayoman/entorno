"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button as Button2 } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import styles from '../../../../public/CSS/spinner.css';
import { Label } from "@/components/ui/label";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function IngProducto() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(null); // Estado para controlar qué producto tiene el modal abierto

  const openModal = (productId) => setIsModalOpen(productId); // Abre el modal para el producto específico
  const closeModal = () => setIsModalOpen(null); // Cierra el modal

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/ProductEngineering/getProductosImagenes');
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error('Error al obtener los productos:', response.data.message);
        }
      } catch (error) {
        console.error('Error al hacer fetch de los productos:', error);
      }
    };
    
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };

  const PrevArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
  
  // Componente para la flecha derecha
  const NextArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );

  const filteredProducts = products
    .filter(product => 
      Object.values(product)
        .filter(value => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())) // Filtro por término de búsqueda
    );
  
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status=="loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center items-center text-center mb-4">
        <CardTitle className="text-3xl font-bold">
          Catálogo de productos
        </CardTitle>
      </div><br />
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">Buscar</Label>
          <SearchIcon style={{marginTop:"10px", marginLeft:"15px"}} className="absolute h-5 w-5 text-gray-400" />
          <Input
            id="search"
            placeholder="Buscar por todas las características..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    <div>
      {/* Verifica si la lista de productos está vacía */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mt-[25vh]">No hay productos disponibles.</p>
        </div> 
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <Card className="w-full max-h-[70vh] flex flex-col shadow-md">
                <div className="w-full max-h-[50vh] overflow-hidden rounded-t-lg">
                  <img
                    src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(product.imagenes[0])}`}
                    alt={product.nombre}
                    className="w-full max-h-[20vh] rounded-lg"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm md:text-base lg:text-lg font-bold mb-2 truncate">{product.nombre}</h3>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-2 flex-grow truncate">{product.descripcion}</p>
                  <p className="text-sm md:text-base lg:text-lg mb-2">Costo: ${product.costo}</p>
                  <Button2
                    className="w-full mt-auto"
                    onClick={() => openModal(product.id)}
                  >
                    Ver más
                  </Button2>
                </CardContent>
              </Card>
              {/* Modal para ver más información del producto */}
              {isModalOpen === product.id && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 shadow-lg ml-[20vh] md:ml-[25vh] lg:ml-[30vh] mt-[10vh] md:mt-[15vh] lg:mt-[20vh]">
                  <div 
                    style={{backgroundColor: "white"}}
                    className="relative bg-white rounded-lg shadow-md max-w-[60vh] max-h-[70vh] overflow-y-auto p-6"
                  >
                    {/* Carrusel de imágenes */}
                    <Slider {...settings} className="rounded-t-lg overflow-hidden" nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
                      {product.imagenes.map((ruta, index) => (
                        <div key={index} className="flex justify-center items-center">
                          <img
                            src={`/api/ProductEngineering/obtenerImagenes?rutaImagen=${encodeURIComponent(ruta)}`}
                            alt={`Imagen ${index + 1}`}
                            className="w-full max-h-[25vh] rounded-lg"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      ))}
                    </Slider>

                    {/* Contenido del modal */}
                    <div className="p-4">
                      <h3 className="text-sm md:text-base lg:text-lg font-bold mb-2 flex items-center justify-center">{product.nombre}</h3>
                      <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-2 flex items-center justify-center">{product.descripcion}</p>
                      <p className="text-sm md:text-base lg:text-lg mb-2">Tipo: {product.nombre_categoria}</p>
                      <p className="text-sm md:text-base lg:text-lg mb-2">Subcategoría: {product.nombre_subcategoria}</p>
                      <p className="text-sm md:text-base lg:text-lg mb-2">Especificación: {product.nombre_especificacion || "Sin datos"}</p>
                      <p className="text-sm md:text-base lg:text-lg mb-2">Código: {product.codigo}</p>
                      <p className="text-sm md:text-base lg:text-lg mb-2">Cantidad: {product.cMinima} {product.medicion}</p>
                      <p className="text-sm md:text-base lg:text-lg mb-2">Costo: ${product.costo}</p>
                      <Button2 onClick={closeModal} className="w-full">
                        Cerrar
                      </Button2>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

function SearchIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}