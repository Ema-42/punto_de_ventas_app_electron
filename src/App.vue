<!-- <script setup lang="ts">
import {
  CategoriaProducto,
  Producto,
  Mesa,
  FileData,
  CrearPedidoConDetalles,
  EditarPedidoConDetalles,
  EstadoPedido,
  CrearIngresoConDetalles,
  EstadoIngreso,
  EditarIngresoConDetalles,
} from "../electron/main/modules/interfaces";
import { onMounted, ref } from "vue";
import Login from "./views/login.vue";
import { EstadosMesa } from "../electron/main/modules/enums";

const productos = ref<Producto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const prod_test = ref();

onMounted(async () => {
  try {
    productos.value = await window.api.getProductos();
  } catch (err) {
    error.value = "Error al cargar los productos";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const crearProducto = async () => {
  try {
    const nuevoProducto: Producto = {
      nombre: "ssdas de dss",
      precio: 1929.99,
      imagen_url: "https://via.placeholder.com/150",
      maneja_stock: true,
      stock: 50,
      categoria_id: 1,
      fecha_creacion: new Date(),
    };
    const result = await window.api.createProducto(nuevoProducto);
    if (result instanceof Error) {
      prod_test.value = result.toString();
      throw result;
    }
    prod_test.value = result;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};
const obtenerProductoPorId = async (id: number) => {
  try {
    const result = await window.api.getOneProductoById(id);
    if (result instanceof Error) {
      prod_test.value = result.toString();
      throw result;
    }
    prod_test.value = result;
    return prod_test.value;
  } catch (err) {
    //alert(err);
    console.error(err);
    return null;
  }
};

const editarProducto = async (id: number, newData: Partial<Producto>) => {
  try {
    const result = await window.api.editProductoById(id, newData);
    if (result instanceof Error) {
      prod_test.value = result.toString();
      throw result;
    }
    prod_test.value = result;

    return prod_test.value;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

const deleteProductoById = async (id: number) => {
  try {
    prod_test.value = await window.api.deleteProductoById(id);
    console.log(`Producto con ID ${id} eliminado`);
  } catch (err) {
    error.value = "Error al eliminar el producto";
    console.error(err);
  }
};

//categorias
const categorias = ref();

const getAllCategorias = async () => {
  try {
    categorias.value = await window.api.getCategorias();
    return categorias.value;
  } catch (err) {
    error.value = "Error al obtener las categorías";
    console.error(err);
  }
};

const createCategoria = async (data: CategoriaProducto) => {
  try {
    const result = await window.api.createCategoria(data);
    if (result instanceof Error) {
      categorias.value = result.toString();
      throw result;
    }
    categorias.value = result;
    return categorias.value;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

const getOneCategoriaById = async (id: number) => {
  try {
    const result = await window.api.getOneCategoriaById(id);
    if (result instanceof Error) {
      categorias.value = result.toString();
      throw result;
    }
    categorias.value = result;
    return categorias.value;
  } catch (err) {
    //alert(err);
    console.error(err);
    return null;
  }
};

const editCategoriaById = async (
  id: number,
  newData: Partial<CategoriaProducto>
) => {
  try {
    const result = (categorias.value = await window.api.editCategoriaById(
      id,
      newData
    ));
    if (result instanceof Error) {
      categorias.value = result.toString();
      throw result;
    }
    categorias.value = result;
    return categorias.value;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

const deleteCategoriaById = async (id: number) => {
  try {
    categorias.value = await window.api.deleteCategoriaById(id);
    console.log(`Categoría con ID ${id} eliminada`);
  } catch (err) {
    error.value = "Error al eliminar la categoría";
    console.error(err);
  }
};

//MESAS

const mesas = ref();
const getAllMesas = async () => {
  try {
    mesas.value = await window.api.getMesas();
    return mesas.value;
  } catch (err) {
    error.value = "Error al obtener las mesas";
    console.error(err);
  }
};

const getMesasPorEstado = async (estado: EstadosMesa) => {
  try {
    mesas.value = await window.api.getMesasByEstado(estado);
    return mesas.value;
  } catch (err) {
    error.value = "Error al obtener las mesas";
    console.error(err);
  }
};
const createMesa = async (data: Mesa) => {
  try {
    const result = await window.api.createMesa(data);
    if (result instanceof Error) {
      mesas.value = result.toString();
      throw result;
    }
    mesas.value = result;
    return mesas.value;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

const getOneMesaById = async (id: number) => {
  try {
    const result = await window.api.getOneMesaById(id);
    if (result instanceof Error) {
      mesas.value = result.toString();
      throw result;
    }
    mesas.value = result;
    return mesas.value;
  } catch (err) {
    //alert(err);
    console.error(err);
    return null;
  }
};

const editMesaById = async (id: number, newData: Partial<Mesa>) => {
  try {
    const result = await window.api.editMesaById(id, newData);
    if (result instanceof Error) {
      mesas.value = result.toString();
      throw result;
    }
    mesas.value = result;
    return mesas.value;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

const deleteMesaById = async (id: number) => {
  try {
    mesas.value = await window.api.deleteMesaById(id);
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

//USUARIOS

const usuarios = ref();

const getAllUsuarios = async () => {
  try {
    usuarios.value = await window.api.getUsuarios();
    return usuarios.value;
  } catch (err) {
    error.value = "Error al obtener los usuarios";
    console.error(err);
  }
};

const createUsuario = async (data: any) => {
  try {
    const result = await window.api.createUsuario(data);
    if (result instanceof Error) {
      usuarios.value = result.toString();
      throw result;
    }
    usuarios.value = result;
    return usuarios.value;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

const getOneUsuarioById = async (id: number) => {
  try {
    const result = await window.api.getOneUsuarioById(id);
    if (result instanceof Error) {
      usuarios.value = result.toString();
      throw result;
    }
    usuarios.value = result;
    return usuarios.value;
  } catch (err) {
    //alert(err);
    console.error(err);
    return null;
  }
};

const editUsuarioById = async (id: number, newData: any) => {
  try {
    const result = await window.api.editUsuarioById(id, newData);
    if (result instanceof Error) {
      usuarios.value = result.toString();
      throw result;
    }
    usuarios.value = result;
    return usuarios.value;
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

const deleteUsuarioById = async (id: number) => {
  try {
    usuarios.value = await window.api.deleteUsuarioById(id);
  } catch (err) {
    //alert(err);
    console.error(err);
  }
};

//metodos para almacenar la imagen
//maneja la accion de cargar la imagen
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    //aqui se llama a la funcion que guarda la imagen y se le pasa el archivo
    //nose devuelve la url de la imagen guardada
    const imagenGuardada = await saveFile(file);
    console.log(imagenGuardada.path);
    console.log(imagenGuardada.name);
  }
};

const saveFile = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer(); // Convertir a ArrayBuffer
    const fileData: FileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      buffer: Array.from(new Uint8Array(arrayBuffer)), // Convertir a array de bytes
    };

    const dataImage = await window.api.uploadFile(fileData);

    if (dataImage instanceof Error) {
      throw dataImage;
    }
    //AQUI SE DEVUELVE LOS DATOS DE LA IMAGEN GUARDAD EN UPLOADS
    return dataImage;
  } catch (err) {
    console.error("Error uploading file", err);
  }
};

//ROLES
const roles = ref();

const getRoles = async () => {
  try {
    roles.value = await window.api.getRoles();
    return roles.value;
  } catch (err) {
    error.value = "Error al obtener los roles";
    console.error(err);
  }
};

const getOneRoleById = async (id: number) => {
  try {
    const result = await window.api.getOneRoleById(id);
    if (result instanceof Error) {
      roles.value = result.toString();
      throw result;
    }
    roles.value = result;
    return roles.value;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//PEDIDOS
const pedidos = ref();

const getAllPedidos = async () => {
  try {
    pedidos.value = await window.api.getPedidos();
    console.log(pedidos.value);

    return pedidos.value;
  } catch (err) {
    error.value = "Error al obtener los pedidos";
    console.error(err);
  }
};

const getOnePedidoById = async (id: number) => {
  try {
    const result = await window.api.getOnePedidoById(id);
    if (result instanceof Error) {
      pedidos.value = result.toString();
      throw result;
    }
    pedidos.value = result;
    return pedidos.value;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const editEstadoPedidoById = async (id: number, nuevoEstado: EstadoPedido) => {
  try {
    const result = await window.api.cambiarEstadoPedido(id, nuevoEstado);
    if (result instanceof Error) {
      pedidos.value = result.toString();
      throw result;
    }
    pedidos.value = result;
    return pedidos.value;
  } catch (err) {
    console.error(err);
  }
};

const deletePedidoById = async (id: number) => {
  try {
    pedidos.value = await window.api.deletePedidoById(id);
    console.log(`Pedido con ID ${id} eliminado`);
  } catch (err) {
    error.value = "Error al eliminar el pedido";
    console.error(err);
  }
};

//USAR ESTOS METODOS PARA CREAR Y EDITAR PEDIDOS - los de arriba seran para otra cosa, hola judith
const crearPedidoConDetalles = async (data: CrearPedidoConDetalles) => {
  try {
    const result = await window.api.crearPedidoConDetalles(data);
    if (result instanceof Error) {
      pedidos.value = result.message.toString();
      throw result;
    }
    pedidos.value = result;
    return pedidos.value;
  } catch (err) {
    console.error(err);
  }
};

const editarPedidoConDetalles = async (data: EditarPedidoConDetalles) => {
  try {
    const result = await window.api.editarPedidoConDetalles(data);
    if (result instanceof Error) {
      pedidos.value = result.message.toString();
      throw result;
    }
    pedidos.value = result;
    return pedidos.value;
  } catch (err) {
    console.error(err);
  }
};

//INGRESOS
const ingresos = ref();

const getAllIngresos = async () => {
  try {
    ingresos.value = await window.api.getIngresos();
    console.log(ingresos.value);

    return ingresos.value;
  } catch (err) {
    error.value = "Error al obtener los ingresos";
    console.error(err);
  }
};

const getOneIngresosById = async (id: number) => {
  try {
    const result = await window.api.getOneIngresoById(id);
    if (result instanceof Error) {
      ingresos.value = result.toString();
      throw result;
    }
    ingresos.value = result;
    return ingresos.value;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const crearIngresoConDetalles = async (data: CrearIngresoConDetalles) => {
  try {
    const result = await window.api.crearIngresoConDetalles(data);
    if (result instanceof Error) {
      ingresos.value = result.message.toString();
      throw result;
    }
    ingresos.value = result;
    return ingresos.value;
  } catch (err) {
    console.error(err);
  }
};

const editarIngresoConDetalles = async (data: EditarIngresoConDetalles) => {
  try {
    const result = await window.api.editarIngresoConDetalles(data);
    if (result instanceof Error) {
      ingresos.value = result.message.toString();
      throw result;
    }
    ingresos.value = result;
    return ingresos.value;
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div v-if="loading" class="text-gray-500">Cargando productos...</div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="!loading && !error">
      <div class="">
        <h2>Productos</h2>
        <div>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="crearProducto"
          >
            crear
          </button>

          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="obtenerProductoPorId(1)"
          >
            get one
          </button>

          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="
              editarProducto(1, {
                nombre: 'Producto 22d',
                precio: 299.99,
                categoria_id: 1,
                imagen_url: 'https://hola',
                maneja_stock: true,
                stock: 100,
              })
            "
          >
            Editar
          </button>

          <button
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="deleteProductoById(1)"
          >
            Delete
          </button>
          <pre id="count" class="text-sm font-semibold block">{{
            JSON.stringify(prod_test, null, 2)
          }}</pre>
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @change="handleFileUpload"
        />
        <h2>Categorias</h2>
        <div>
          <button
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="getAllCategorias"
          >
            get all categoria
          </button>

          <button
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="createCategoria({ nombre: 'Handcrafts' })"
          >
            crear categoria
          </button>

          <button
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="getOneCategoriaById(121)"
          >
            get one categoria
          </button>

          <button
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="editCategoriaById(1, { nombre: 'Toys & Games' })"
          >
            editar categoria
          </button>

          <button
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="deleteCategoriaById(1)"
          >
            eliminar categoria
          </button>
          <pre id="count" class="text-sm font-semibold block">{{
            JSON.stringify(categorias, null, 2)
          }}</pre>
        </div>

        <h2>Mesas</h2>
        <div>
          <button
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="getAllMesas"
          >
            get all mesa
          </button>
          <button
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="getMesasPorEstado(EstadosMesa.LIBRE)"
          >
            get mesas por estado
          </button>
          <button
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="getOneMesaById(211)"
          >
            get one mesa
          </button>

          <button
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="createMesa({ numero: 8 })"
          >
            crear mesa
          </button>

          <button
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="editMesaById(1, { numero: 8 })"
          >
            editar mesa
          </button>

          <button
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            @click="deleteMesaById(1)"
          >
            eliminar mesa
          </button>
          <pre id="count" class="text-sm font-semibold block">{{
            JSON.stringify(mesas, null, 2)
          }}</pre>
        </div>

        <h2>USUARIOS</h2>
        <div>
          <button
            class="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="getAllUsuarios"
          >
            get all usuarios
          </button>
          <button
            class="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="getOneUsuarioById(1111)"
          >
            get one usuarios
          </button>

          <button
            class="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="
              createUsuario({ nombre: 'ema', rol_id: 1, password: '123' })
            "
          >
            crear usuarios
          </button>

          <button
            class="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="editUsuarioById(4, { nombre: 'ema', password: 'admin' })"
          >
            editar usuarios
          </button>

          <button
            class="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="deleteUsuarioById(1)"
          >
            eliminar usuarios
          </button>
          <pre id="count" class="text-sm font-semibold block">{{
            JSON.stringify(usuarios, null, 2)
          }}</pre>
        </div>

        <h2>ROLES</h2>
        <div>
          <button
            class="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="getRoles"
          >
            get all roles
          </button>
          <button
            class="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="getOneRoleById(2)"
          >
            get one rol
          </button>
          <pre id="count" class="text-sm font-semibold block">{{
            JSON.stringify(roles, null, 2)
          }}</pre>
        </div>

        <h2>PEDIDOS</h2>
        <div>
          <button
            class="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="getAllPedidos"
          >
            get all pedidos
          </button>
          <button
            class="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="getOnePedidoById(1)"
          >
            get one pedido
          </button>
          <button
            class="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="deletePedidoById(1)"
          >
            Eliminar pedido
          </button>
          <button
            class="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="
              crearPedidoConDetalles({
                mesa_id: 3,
                mesera_id: 2,
                cajero_id: 1,
                detalles: [
                  {
                    producto_id: 3,
                    cantidad: 1,
                    precio_unitario: 10,
                  },
                  {
                    producto_id: 1,
                    cantidad: 1,
                    precio_unitario: 20,
                  },
                ],
              })
            "
          >
            Crear pedido con detalles
          </button>
          <button
            class="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="editEstadoPedidoById(1, EstadoPedido.COMPLETADO)"
          >
            Cambiar Estado del Pedido
          </button>
          <button
            class="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition duration-300"
            @click="
              editarPedidoConDetalles({
                id: 1,
                mesa_id: 1,
                mesera_id: 1,
                cajero_id: 2,
                estado: 'CONCLUIDO',
                detalles: [
                  {
                    id: 40,
                    producto_id: 1,
                    cantidad: 10,
                    precio_unitario: 5,
                  }, // Se actualiza
                  {
                    id: 52,
                    producto_id: 1,
                    cantidad: 222,
                    precio_unitario: 10,
                    //eliminado: true,
                  }, // Se elimina
                  //{ producto_id: 3, cantidad: 2, precio_unitario: 10 }, // Se crea
                ],
              })
            "
          >
            Editar pedido con detalles
          </button>
          <pre id="count" class="text-sm font-semibold block">{{
            JSON.stringify(pedidos, null, 2)
          }}</pre>
        </div>
        <h2>INGRESOS</h2>
        <div>
          <button
            class="bg-pink-800 text-white px-4 py-2 rounded-lg hover:bg-pink-300 transition duration-300"
            @click="getAllIngresos"
          >
            get all ingresos
          </button>
          <button
            class="bg-pink-800 text-white px-4 py-2 rounded-lg hover:bg-pink-300 transition duration-300"
            @click="getOneIngresosById(1)"
          >
            get one Ingreso
          </button>
          <button
            class="bg-pink-800 text-white px-4 py-2 rounded-lg hover:bg-pink-300 transition duration-300"
            @click="
              crearIngresoConDetalles({
                usuario_id: 1,
                estado: EstadoIngreso.CONSOLIDADO,
                detalles: [
                  {
                    producto_id: 3,
                    cantidad: 5,
                    precio_unitario: 10.5,
                  },
                  {
                    producto_id: 4,
                    cantidad: 3,
                    precio_unitario: 15.75,
                  },
                ],
              })
            "
          >
            Crear ingresos con Detalles
          </button>
          <button
            class="bg-pink-800 text-white px-4 py-2 rounded-lg hover:bg-pink-300 transition duration-300"
            @click="
              editarIngresoConDetalles({
                id: 4,
                usuario_id: 2,
                detalles: [
                  {
                    producto_id: 4,
                    cantidad: 10,
                    precio_unitario: 10,
                  },
                  {
                    id: 6,
                    producto_id: 3,
                    cantidad: 10,
                    precio_unitario: 10,
                  },
                  {
                    id: 6,
                    producto_id: 3,
                    cantidad: 10,
                    precio_unitario: 10,
                    eliminado: true,
                  },
                ],
              })
            "
          >
            Editar ingresos con Detalles
          </button>
          <pre id="count" class="text-sm font-semibold block">{{
            JSON.stringify(ingresos, null, 2)
          }}</pre>
        </div>
      </div>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Productos</h2>
      <table id="productos-table" class="w-full text-left">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-3">ID</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">Precio</th>
            <th class="p-3">Maneja Stock</th>
            <th class="p-3">Stock</th>
            <th class="p-3">Imagen</th>
            <th class="p-3">Categoría</th>
            <th class="p-3">Fecha creacion</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="producto in productos" :key="producto.id">
            <td class="p-3">{{ producto.id }}</td>
            <td class="p-3">{{ producto.nombre }}</td>
            <td class="p-3">{{ producto.precio }}</td>
            <td class="p-3">{{ producto.maneja_stock }}</td>
            <td class="p-3">{{ producto.stock }}</td>
            <td class="p-3">
              <img
                :src="'local://' + producto.imagen_url"
                alt="Producto Imagen"
                class="w-28 h-28 rounded-sm transition-transform duration-300 hover:scale-150"
              />
            </td>
            <td class="p-3">{{ producto.categoria?.nombre }}</td>
            <td class="p-3">{{ producto.fecha_creacion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> -->

<template>
  <div>
    <template v-if="authStore.user">
      <div class="flex h-screen overflow-hidden">
        <Sidebar />
        <div class="flex flex-col w-full transition-all duration-300">
          <Navbar />
          <main class="flex-1 overflow-auto p-6">
            <router-view />
          </main>
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
const authStore = useAuthStore();
</script>
