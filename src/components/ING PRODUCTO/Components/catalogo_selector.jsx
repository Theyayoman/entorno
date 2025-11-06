import React, { useEffect } from "react";
import ListaCategoria from "./lista_categoria";
import ListaSubCategoria from "./lista_subcategoria";
import ListaProducto from "./lista_producto";
import ListaTipo from "./lista_tipo";

export default function CatalogoSelector(props) {
  const {
    id,
    nombre,
    nivel,
    skip,
    currentStepIndex,
    lastStep,
    sendProductoToCatalogo,
    handlePrevStep,
    handleNextStep,
    goToDetail,
  } = props;
  const [tipo, setTipo] = React.useState([]);
  const [categoria, setCategoria] = React.useState({});
  const [subcategoria, setSubcategoria] = React.useState({});
  const [tieneSubcategorias, setTieneSubcategorias] = React.useState(false);
  const [producto, setProducto] = React.useState({});

  const handleTipo = (data) => {
    if (data.nivel === 1) {
      localStorage.setItem("envase", "");
    }
    setTipo(data);
  };

  const handleCategoria = (data) => {
    setCategoria(data);
    setTieneSubcategorias(data.tiene_subcategorias);
  };

  const handleSubcategoria = (data) => {
    setSubcategoria(data);
  };

  const handleProducto = (data) => {
    if (tipo.nivel === 1) {
      localStorage.setItem("envase", data.codigo);
    }

    // setProducto({ [tipo.nombre]: data });
    sendProductoToCatalogo({ [tipo.nombre]: data });
  };

  const clearTipo = () => {
    setTipo({});
  };

  const clearCategoria = () => {
    setCategoria({});
  };

  const clearSubcategoria = () => {
    setSubcategoria({});
  };

  const goPrevStep = () => {
    handlePrevStep();
  };

  const goNextStep = () => {
    handleNextStep();
  };

  const handleDetail = (data) => {
    goToDetail(data);
  };

  return (
    <>
      {tipo.id ? (
        <div>Tipo Seleccionado: {tipo.nombre}</div>
      ) : (
        <ListaTipo
          id={id}
          nivel={nivel}
          skip={skip}
          sendTipoToSelector={handleTipo}
          goBack={goPrevStep}
          skipStep={goNextStep}
        />
      )}

      {categoria.id ? (
        <div>Categoria Seleccionada: {categoria.nombre}</div>
      ) : (
        <ListaCategoria
          tipoId={tipo.id}
          sendCategoriaToSelector={handleCategoria}
          goBack={clearTipo}
        />
      )}

      {categoria.id && (
        <>
          {subcategoria.id ? (
            <>
              <div>Subcategoria Seleccionada: {subcategoria.nombre}</div>
              <ListaProducto
                tipoId={tipo.id}
                categoriaId={categoria.id}
                tieneSubcategorias={tieneSubcategorias}
                subcategoriaId={subcategoria.id ?? null}
                currentStepIndex={currentStepIndex}
                lastStep={lastStep}
                sendProductoToSelector={handleProducto}
                goBack={subcategoria.id ? clearSubcategoria : clearCategoria}
                goToDetail={handleDetail}
              />
            </>
          ) : (
            <>
              <ListaSubCategoria
                tipoId={tipo.id}
                categoriaId={categoria.id}
                tieneSubcategorias={tieneSubcategorias}
                sendSubcategoriaToSelector={handleSubcategoria}
                goBack={clearCategoria}
              />
              {/* Mostrar productos si no se seleccionó una subcategoría */}
              <ListaProducto
                tipoId={tipo.id}
                categoriaId={categoria.id}
                tieneSubcategorias={tieneSubcategorias}
                subcategoriaId={subcategoria.id ?? null}
                currentStepIndex={currentStepIndex}
                lastStep={lastStep}
                sendProductoToSelector={handleProducto}
                goBack={subcategoria.id ? clearSubcategoria : clearCategoria}
                goToDetail={handleDetail}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
