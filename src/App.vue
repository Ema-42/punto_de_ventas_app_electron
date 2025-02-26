<script setup lang="ts">
import {
  CategoriaProducto,
  Producto,
  Mesa,
  FileData,
} from "../electron/main/modules/interfaces";
import { onMounted, ref } from "vue";

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
</script>

<template>
  <!-- <Login /> -->
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
                :src="'local://'+producto.imagen_url" 
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
</template>

<!--  <template>
  <div class="flex h-screen ">
 
    <Sidebar />

   
    <div class="flex flex-col w-full transition-all duration-300">
     
      <Navbar />

      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
</script> -->
