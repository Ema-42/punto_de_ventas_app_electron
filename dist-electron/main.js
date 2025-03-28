import { app, ipcMain, protocol, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path$1, { join } from "path";
import pkg from "@prisma/client";
import { mkdir, writeFile } from "fs/promises";
import nodeCrypto from "crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
const { PrismaClient: PrismaClient$6 } = pkg;
const prisma$6 = new PrismaClient$6();
const obtenerProductos = async () => {
  try {
    const productos = await prisma$6.producto.findMany({
      where: { eliminado: false },
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen_url: true,
        categoria: true,
        stock: true,
        fecha_creacion: true,
        maneja_stock: true
      },
      orderBy: {
        fecha_creacion: "desc"
      }
    });
    return productos.map((p) => ({
      ...p,
      precio: p.precio.toFixed(2)
      // Convierte Decimal a string con 2 decimales
    }));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return error;
  }
};
const crearProducto = async (data) => {
  try {
    const existingProducto = await prisma$6.producto.findFirst({
      where: { nombre: data.nombre, eliminado: false }
    });
    if (existingProducto) {
      throw new Error("Ya existe un producto con ese nombre");
    }
    const nuevoProducto = await prisma$6.producto.create({
      data: {
        nombre: data.nombre,
        precio: data.precio,
        imagen_url: data.imagen_url,
        categoria_id: data.categoria_id,
        maneja_stock: data.maneja_stock ?? false,
        stock: data.maneja_stock ? data.stock ?? 0 : void 0
      }
    });
    return JSON.parse(JSON.stringify(nuevoProducto));
  } catch (error) {
    console.error("Error al crear producto:", error);
    return error;
  }
};
const editarProducto = async (id, productoData) => {
  console.log("back id", id, "data", productoData);
  try {
    const existing = await prisma$6.producto.findMany({
      where: { nombre: productoData.nombre, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe un producto con ese nombre");
    }
    const productoActualizado = await prisma$6.producto.update({
      where: { id },
      data: {
        nombre: productoData.nombre,
        precio: productoData.precio,
        imagen_url: productoData.imagen_url,
        categoria_id: productoData.categoria_id,
        maneja_stock: productoData.maneja_stock ?? false,
        stock: productoData.maneja_stock ? productoData.stock ?? 0 : void 0
      }
    });
    return JSON.parse(JSON.stringify(productoActualizado));
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return error;
  }
};
const obtenerOneProducto = async (id) => {
  try {
    const producto = await prisma$6.producto.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen_url: true,
        categoria: true,
        stock: true,
        fecha_creacion: true,
        maneja_stock: true
      }
    });
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return producto ? { ...producto, precio: producto.precio.toFixed(2) } : null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return error;
  }
};
const eliminarProducto = async (id) => {
  try {
    const productoEliminado = await prisma$6.producto.update({
      where: { id },
      data: { eliminado: true }
    });
    console.log("Producto eliminado:", productoEliminado);
    return JSON.parse(JSON.stringify(productoEliminado));
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return error;
  }
};
const uploadFile = async (fileData) => {
  const { name, size, buffer } = fileData;
  const fileBuffer = Buffer.from(buffer);
  const uploadsDir = join(app.getPath("userData"), "uploads");
  const ext = name.substring(name.lastIndexOf("."));
  const uniqueName = `${Date.now()}-producto${ext}`;
  const filePath = join(uploadsDir, uniqueName);
  try {
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filePath, fileBuffer);
    console.log("Imagen guardada en:", filePath);
    return {
      message: "File received successfully",
      path: filePath,
      name: uniqueName,
      // Retorna el nuevo nombre del archivo
      size
    };
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    throw new Error("Error al guardar la imagen");
  }
};
const { PrismaClient: PrismaClient$5 } = pkg;
const prisma$5 = new PrismaClient$5();
const getCategoriasProductos = async () => {
  console.log("getCategoriasProductos");
  try {
    const categorias = await prisma$5.categoriaProducto.findMany({
      where: { eliminado: false },
      select: { id: true, fecha_creacion: true, nombre: true, eliminado: true },
      orderBy: {
        fecha_creacion: "desc"
      }
    });
    return categorias;
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    return error;
  }
};
const getCategoriaProductoById = async (id) => {
  try {
    const categoria = await prisma$5.categoriaProducto.findUnique({
      where: { id }
    });
    console.log("Categoria encontrada:", categoria);
    if (!categoria) {
      throw new Error("Categoria no encontrada");
    }
    return categoria;
  } catch (error) {
    console.error("Error al obtener una categoria:", error);
    return error;
  }
};
const createCategoriaProducto = async (data) => {
  try {
    const existingCategoria = await prisma$5.categoriaProducto.findFirst({
      where: { nombre: data.nombre, eliminado: false }
    });
    if (existingCategoria) {
      throw new Error("Ya existe una categoria con ese nombre");
    }
    const newCategoria = await prisma$5.categoriaProducto.create({
      data
    });
    return newCategoria;
  } catch (error) {
    console.error("Error al crear una categoria:", error);
    return error;
  }
};
const updateCategoriaProducto = async (id, categoriaData) => {
  try {
    const existing = await prisma$5.categoriaProducto.findMany({
      where: { nombre: categoriaData.nombre, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe un producto con ese nombre");
    }
    const updatedCategoria = await prisma$5.categoriaProducto.update({
      where: { id },
      data: categoriaData
    });
    return updatedCategoria;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return error;
  }
};
const deleteCategoriaProducto = async (id) => {
  try {
    const deletedCategoria = await prisma$5.categoriaProducto.update({
      where: { id },
      data: { eliminado: true }
    });
    return deletedCategoria;
  } catch (error) {
    console.error("Error al eliminar una ategoria:", error);
    return error;
  }
};
const { PrismaClient: PrismaClient$4 } = pkg;
const prisma$4 = new PrismaClient$4();
const getMesas = async () => {
  try {
    const mesas = await prisma$4.mesa.findMany({
      where: { eliminado: false },
      select: {
        id: true,
        numero: true,
        estado: true,
        eliminado: true,
        fecha_creacion: true
      },
      orderBy: {
        fecha_creacion: "desc"
      }
    });
    return mesas;
  } catch (error) {
    console.error("Error al obtener mesas:", error);
    return error;
  }
};
const getMesasByEstado = async (estado) => {
  try {
    const mesas = await prisma$4.mesa.findMany({
      where: {
        eliminado: false,
        estado
      },
      select: {
        id: true,
        numero: true,
        estado: true,
        eliminado: true,
        fecha_creacion: true
      },
      orderBy: {
        fecha_creacion: "desc"
      }
    });
    return mesas;
  } catch (error) {
    console.error("Error al obtener mesas por estado:", error);
    return error;
  }
};
const getMesaById = async (id) => {
  try {
    const mesa = await prisma$4.mesa.findUnique({
      where: { id }
    });
    if (!mesa) {
      throw new Error("Mesa no encontrada");
    }
    return mesa;
  } catch (error) {
    console.error("Error al obtener una mesa:", error);
    return error;
  }
};
const createMesa = async (data) => {
  try {
    const existingMesa = await prisma$4.mesa.findFirst({
      where: { numero: data.numero }
    });
    if (existingMesa) {
      throw new Error("Ya existe una mesa con ese numero");
    }
    const newMesa = await prisma$4.mesa.create({
      data
    });
    return newMesa;
  } catch (error) {
    console.error("Error al crear una mesa:", error);
    return error;
  }
};
const updateMesa = async (id, mesaData) => {
  try {
    const existing = await prisma$4.mesa.findMany({
      where: { numero: mesaData.numero, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe una mesa con ese numero");
    }
    const updatedMesa = await prisma$4.mesa.update({
      where: { id },
      data: mesaData
    });
    return updatedMesa;
  } catch (error) {
    console.error("Error al actualizar una mesa:", error);
    return error;
  }
};
const cambiarEstadoMesa = async (id, nuevoEstado) => {
  try {
    const mesa = await prisma$4.mesa.findUnique({ where: { id } });
    if (!mesa) {
      throw new Error("Mesa no encontrada");
    }
    await prisma$4.mesa.update({
      where: { id },
      data: { estado: nuevoEstado }
    });
  } catch (error) {
    console.error("Error al cambiar el estado de la mesa:", error);
    throw error;
  }
};
const deleteMesa = async (id) => {
  try {
    const deletedMesa = await prisma$4.mesa.update({
      where: { id },
      data: { eliminado: true }
    });
    return deletedMesa;
  } catch (error) {
    console.error("Error al eliminar una mesa:", error);
    return error;
  }
};
var EstadoPedido = /* @__PURE__ */ ((EstadoPedido2) => {
  EstadoPedido2["EN_PREPARACION"] = "EN PREPARACION";
  EstadoPedido2["COMPLETADO"] = "COMPLETADO";
  EstadoPedido2["CANCELADO"] = "CANCELADO";
  return EstadoPedido2;
})(EstadoPedido || {});
var EstadoIngreso = /* @__PURE__ */ ((EstadoIngreso2) => {
  EstadoIngreso2["CONSOLIDADO"] = "CONSOLIDAD";
  EstadoIngreso2["ELIMINADO"] = "ELIMINADO";
  return EstadoIngreso2;
})(EstadoIngreso || {});
var randomFallback = null;
function randomBytes(len) {
  try {
    return crypto.getRandomValues(new Uint8Array(len));
  } catch {
  }
  try {
    return nodeCrypto.randomBytes(len);
  } catch {
  }
  if (!randomFallback) {
    throw Error(
      "Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative"
    );
  }
  return randomFallback(len);
}
function setRandomFallback(random) {
  randomFallback = random;
}
function genSaltSync(rounds, seed_length) {
  rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof rounds !== "number")
    throw Error(
      "Illegal arguments: " + typeof rounds + ", " + typeof seed_length
    );
  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;
  var salt = [];
  salt.push("$2b$");
  if (rounds < 10) salt.push("0");
  salt.push(rounds.toString());
  salt.push("$");
  salt.push(base64_encode(randomBytes(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
  return salt.join("");
}
function genSalt(rounds, seed_length, callback) {
  if (typeof seed_length === "function")
    callback = seed_length, seed_length = void 0;
  if (typeof rounds === "function") callback = rounds, rounds = void 0;
  if (typeof rounds === "undefined") rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
  else if (typeof rounds !== "number")
    throw Error("illegal arguments: " + typeof rounds);
  function _async(callback2) {
    nextTick(function() {
      try {
        callback2(null, genSaltSync(rounds));
      } catch (err) {
        callback2(err);
      }
    });
  }
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
function hashSync(password, salt) {
  if (typeof salt === "undefined") salt = GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof salt === "number") salt = genSaltSync(salt);
  if (typeof password !== "string" || typeof salt !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof salt);
  return _hash(password, salt);
}
function hash(password, salt, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password === "string" && typeof salt === "number")
      genSalt(salt, function(err, salt2) {
        _hash(password, salt2, callback2, progressCallback);
      });
    else if (typeof password === "string" && typeof salt === "string")
      _hash(password, salt, callback2, progressCallback);
    else
      nextTick(
        callback2.bind(
          this,
          Error("Illegal arguments: " + typeof password + ", " + typeof salt)
        )
      );
  }
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
function safeStringCompare(known, unknown) {
  var diff = known.length ^ unknown.length;
  for (var i = 0; i < known.length; ++i) {
    diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
  }
  return diff === 0;
}
function compareSync(password, hash2) {
  if (typeof password !== "string" || typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof hash2);
  if (hash2.length !== 60) return false;
  return safeStringCompare(
    hashSync(password, hash2.substring(0, hash2.length - 31)),
    hash2
  );
}
function compare(password, hashValue, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password !== "string" || typeof hashValue !== "string") {
      nextTick(
        callback2.bind(
          this,
          Error(
            "Illegal arguments: " + typeof password + ", " + typeof hashValue
          )
        )
      );
      return;
    }
    if (hashValue.length !== 60) {
      nextTick(callback2.bind(this, null, false));
      return;
    }
    hash(
      password,
      hashValue.substring(0, 29),
      function(err, comp) {
        if (err) callback2(err);
        else callback2(null, safeStringCompare(comp, hashValue));
      },
      progressCallback
    );
  }
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
function getRounds(hash2) {
  if (typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof hash2);
  return parseInt(hash2.split("$")[2], 10);
}
function getSalt(hash2) {
  if (typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof hash2);
  if (hash2.length !== 60)
    throw Error("Illegal hash length: " + hash2.length + " != 60");
  return hash2.substring(0, 29);
}
function truncates(password) {
  if (typeof password !== "string")
    throw Error("Illegal arguments: " + typeof password);
  return utf8Length(password) > 72;
}
var nextTick = typeof process !== "undefined" && process && typeof process.nextTick === "function" ? typeof setImmediate === "function" ? setImmediate : process.nextTick : setTimeout;
function utf8Length(string) {
  var len = 0, c = 0;
  for (var i = 0; i < string.length; ++i) {
    c = string.charCodeAt(i);
    if (c < 128) len += 1;
    else if (c < 2048) len += 2;
    else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else len += 3;
  }
  return len;
}
function utf8Array(string) {
  var offset = 0, c1, c2;
  var buffer = new Array(utf8Length(string));
  for (var i = 0, k = string.length; i < k; ++i) {
    c1 = string.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer[offset++] = c1 >> 18 | 240;
      buffer[offset++] = c1 >> 12 & 63 | 128;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    } else {
      buffer[offset++] = c1 >> 12 | 224;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    }
  }
  return buffer;
}
var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var BASE64_INDEX = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  -1,
  -1,
  -1,
  -1,
  -1
];
function base64_encode(b, len) {
  var off = 0, rs = [], c1, c2;
  if (len <= 0 || len > b.length) throw Error("Illegal len: " + len);
  while (off < len) {
    c1 = b[off++] & 255;
    rs.push(BASE64_CODE[c1 >> 2 & 63]);
    c1 = (c1 & 3) << 4;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 4 & 15;
    rs.push(BASE64_CODE[c1 & 63]);
    c1 = (c2 & 15) << 2;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 6 & 3;
    rs.push(BASE64_CODE[c1 & 63]);
    rs.push(BASE64_CODE[c2 & 63]);
  }
  return rs.join("");
}
function base64_decode(s, len) {
  var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
  if (len <= 0) throw Error("Illegal len: " + len);
  while (off < slen - 1 && olen < len) {
    code = s.charCodeAt(off++);
    c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    code = s.charCodeAt(off++);
    c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c1 == -1 || c2 == -1) break;
    o = c1 << 2 >>> 0;
    o |= (c2 & 48) >> 4;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c3 == -1) break;
    o = (c2 & 15) << 4 >>> 0;
    o |= (c3 & 60) >> 2;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    o = (c3 & 3) << 6 >>> 0;
    o |= c4;
    rs.push(String.fromCharCode(o));
    ++olen;
  }
  var res = [];
  for (off = 0; off < olen; off++) res.push(rs[off].charCodeAt(0));
  return res;
}
var BCRYPT_SALT_LEN = 16;
var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
var BLOWFISH_NUM_ROUNDS = 16;
var MAX_EXECUTION_TIME = 100;
var P_ORIG = [
  608135816,
  2242054355,
  320440878,
  57701188,
  2752067618,
  698298832,
  137296536,
  3964562569,
  1160258022,
  953160567,
  3193202383,
  887688300,
  3232508343,
  3380367581,
  1065670069,
  3041331479,
  2450970073,
  2306472731
];
var S_ORIG = [
  3509652390,
  2564797868,
  805139163,
  3491422135,
  3101798381,
  1780907670,
  3128725573,
  4046225305,
  614570311,
  3012652279,
  134345442,
  2240740374,
  1667834072,
  1901547113,
  2757295779,
  4103290238,
  227898511,
  1921955416,
  1904987480,
  2182433518,
  2069144605,
  3260701109,
  2620446009,
  720527379,
  3318853667,
  677414384,
  3393288472,
  3101374703,
  2390351024,
  1614419982,
  1822297739,
  2954791486,
  3608508353,
  3174124327,
  2024746970,
  1432378464,
  3864339955,
  2857741204,
  1464375394,
  1676153920,
  1439316330,
  715854006,
  3033291828,
  289532110,
  2706671279,
  2087905683,
  3018724369,
  1668267050,
  732546397,
  1947742710,
  3462151702,
  2609353502,
  2950085171,
  1814351708,
  2050118529,
  680887927,
  999245976,
  1800124847,
  3300911131,
  1713906067,
  1641548236,
  4213287313,
  1216130144,
  1575780402,
  4018429277,
  3917837745,
  3693486850,
  3949271944,
  596196993,
  3549867205,
  258830323,
  2213823033,
  772490370,
  2760122372,
  1774776394,
  2652871518,
  566650946,
  4142492826,
  1728879713,
  2882767088,
  1783734482,
  3629395816,
  2517608232,
  2874225571,
  1861159788,
  326777828,
  3124490320,
  2130389656,
  2716951837,
  967770486,
  1724537150,
  2185432712,
  2364442137,
  1164943284,
  2105845187,
  998989502,
  3765401048,
  2244026483,
  1075463327,
  1455516326,
  1322494562,
  910128902,
  469688178,
  1117454909,
  936433444,
  3490320968,
  3675253459,
  1240580251,
  122909385,
  2157517691,
  634681816,
  4142456567,
  3825094682,
  3061402683,
  2540495037,
  79693498,
  3249098678,
  1084186820,
  1583128258,
  426386531,
  1761308591,
  1047286709,
  322548459,
  995290223,
  1845252383,
  2603652396,
  3431023940,
  2942221577,
  3202600964,
  3727903485,
  1712269319,
  422464435,
  3234572375,
  1170764815,
  3523960633,
  3117677531,
  1434042557,
  442511882,
  3600875718,
  1076654713,
  1738483198,
  4213154764,
  2393238008,
  3677496056,
  1014306527,
  4251020053,
  793779912,
  2902807211,
  842905082,
  4246964064,
  1395751752,
  1040244610,
  2656851899,
  3396308128,
  445077038,
  3742853595,
  3577915638,
  679411651,
  2892444358,
  2354009459,
  1767581616,
  3150600392,
  3791627101,
  3102740896,
  284835224,
  4246832056,
  1258075500,
  768725851,
  2589189241,
  3069724005,
  3532540348,
  1274779536,
  3789419226,
  2764799539,
  1660621633,
  3471099624,
  4011903706,
  913787905,
  3497959166,
  737222580,
  2514213453,
  2928710040,
  3937242737,
  1804850592,
  3499020752,
  2949064160,
  2386320175,
  2390070455,
  2415321851,
  4061277028,
  2290661394,
  2416832540,
  1336762016,
  1754252060,
  3520065937,
  3014181293,
  791618072,
  3188594551,
  3933548030,
  2332172193,
  3852520463,
  3043980520,
  413987798,
  3465142937,
  3030929376,
  4245938359,
  2093235073,
  3534596313,
  375366246,
  2157278981,
  2479649556,
  555357303,
  3870105701,
  2008414854,
  3344188149,
  4221384143,
  3956125452,
  2067696032,
  3594591187,
  2921233993,
  2428461,
  544322398,
  577241275,
  1471733935,
  610547355,
  4027169054,
  1432588573,
  1507829418,
  2025931657,
  3646575487,
  545086370,
  48609733,
  2200306550,
  1653985193,
  298326376,
  1316178497,
  3007786442,
  2064951626,
  458293330,
  2589141269,
  3591329599,
  3164325604,
  727753846,
  2179363840,
  146436021,
  1461446943,
  4069977195,
  705550613,
  3059967265,
  3887724982,
  4281599278,
  3313849956,
  1404054877,
  2845806497,
  146425753,
  1854211946,
  1266315497,
  3048417604,
  3681880366,
  3289982499,
  290971e4,
  1235738493,
  2632868024,
  2414719590,
  3970600049,
  1771706367,
  1449415276,
  3266420449,
  422970021,
  1963543593,
  2690192192,
  3826793022,
  1062508698,
  1531092325,
  1804592342,
  2583117782,
  2714934279,
  4024971509,
  1294809318,
  4028980673,
  1289560198,
  2221992742,
  1669523910,
  35572830,
  157838143,
  1052438473,
  1016535060,
  1802137761,
  1753167236,
  1386275462,
  3080475397,
  2857371447,
  1040679964,
  2145300060,
  2390574316,
  1461121720,
  2956646967,
  4031777805,
  4028374788,
  33600511,
  2920084762,
  1018524850,
  629373528,
  3691585981,
  3515945977,
  2091462646,
  2486323059,
  586499841,
  988145025,
  935516892,
  3367335476,
  2599673255,
  2839830854,
  265290510,
  3972581182,
  2759138881,
  3795373465,
  1005194799,
  847297441,
  406762289,
  1314163512,
  1332590856,
  1866599683,
  4127851711,
  750260880,
  613907577,
  1450815602,
  3165620655,
  3734664991,
  3650291728,
  3012275730,
  3704569646,
  1427272223,
  778793252,
  1343938022,
  2676280711,
  2052605720,
  1946737175,
  3164576444,
  3914038668,
  3967478842,
  3682934266,
  1661551462,
  3294938066,
  4011595847,
  840292616,
  3712170807,
  616741398,
  312560963,
  711312465,
  1351876610,
  322626781,
  1910503582,
  271666773,
  2175563734,
  1594956187,
  70604529,
  3617834859,
  1007753275,
  1495573769,
  4069517037,
  2549218298,
  2663038764,
  504708206,
  2263041392,
  3941167025,
  2249088522,
  1514023603,
  1998579484,
  1312622330,
  694541497,
  2582060303,
  2151582166,
  1382467621,
  776784248,
  2618340202,
  3323268794,
  2497899128,
  2784771155,
  503983604,
  4076293799,
  907881277,
  423175695,
  432175456,
  1378068232,
  4145222326,
  3954048622,
  3938656102,
  3820766613,
  2793130115,
  2977904593,
  26017576,
  3274890735,
  3194772133,
  1700274565,
  1756076034,
  4006520079,
  3677328699,
  720338349,
  1533947780,
  354530856,
  688349552,
  3973924725,
  1637815568,
  332179504,
  3949051286,
  53804574,
  2852348879,
  3044236432,
  1282449977,
  3583942155,
  3416972820,
  4006381244,
  1617046695,
  2628476075,
  3002303598,
  1686838959,
  431878346,
  2686675385,
  1700445008,
  1080580658,
  1009431731,
  832498133,
  3223435511,
  2605976345,
  2271191193,
  2516031870,
  1648197032,
  4164389018,
  2548247927,
  300782431,
  375919233,
  238389289,
  3353747414,
  2531188641,
  2019080857,
  1475708069,
  455242339,
  2609103871,
  448939670,
  3451063019,
  1395535956,
  2413381860,
  1841049896,
  1491858159,
  885456874,
  4264095073,
  4001119347,
  1565136089,
  3898914787,
  1108368660,
  540939232,
  1173283510,
  2745871338,
  3681308437,
  4207628240,
  3343053890,
  4016749493,
  1699691293,
  1103962373,
  3625875870,
  2256883143,
  3830138730,
  1031889488,
  3479347698,
  1535977030,
  4236805024,
  3251091107,
  2132092099,
  1774941330,
  1199868427,
  1452454533,
  157007616,
  2904115357,
  342012276,
  595725824,
  1480756522,
  206960106,
  497939518,
  591360097,
  863170706,
  2375253569,
  3596610801,
  1814182875,
  2094937945,
  3421402208,
  1082520231,
  3463918190,
  2785509508,
  435703966,
  3908032597,
  1641649973,
  2842273706,
  3305899714,
  1510255612,
  2148256476,
  2655287854,
  3276092548,
  4258621189,
  236887753,
  3681803219,
  274041037,
  1734335097,
  3815195456,
  3317970021,
  1899903192,
  1026095262,
  4050517792,
  356393447,
  2410691914,
  3873677099,
  3682840055,
  3913112168,
  2491498743,
  4132185628,
  2489919796,
  1091903735,
  1979897079,
  3170134830,
  3567386728,
  3557303409,
  857797738,
  1136121015,
  1342202287,
  507115054,
  2535736646,
  337727348,
  3213592640,
  1301675037,
  2528481711,
  1895095763,
  1721773893,
  3216771564,
  62756741,
  2142006736,
  835421444,
  2531993523,
  1442658625,
  3659876326,
  2882144922,
  676362277,
  1392781812,
  170690266,
  3921047035,
  1759253602,
  3611846912,
  1745797284,
  664899054,
  1329594018,
  3901205900,
  3045908486,
  2062866102,
  2865634940,
  3543621612,
  3464012697,
  1080764994,
  553557557,
  3656615353,
  3996768171,
  991055499,
  499776247,
  1265440854,
  648242737,
  3940784050,
  980351604,
  3713745714,
  1749149687,
  3396870395,
  4211799374,
  3640570775,
  1161844396,
  3125318951,
  1431517754,
  545492359,
  4268468663,
  3499529547,
  1437099964,
  2702547544,
  3433638243,
  2581715763,
  2787789398,
  1060185593,
  1593081372,
  2418618748,
  4260947970,
  69676912,
  2159744348,
  86519011,
  2512459080,
  3838209314,
  1220612927,
  3339683548,
  133810670,
  1090789135,
  1078426020,
  1569222167,
  845107691,
  3583754449,
  4072456591,
  1091646820,
  628848692,
  1613405280,
  3757631651,
  526609435,
  236106946,
  48312990,
  2942717905,
  3402727701,
  1797494240,
  859738849,
  992217954,
  4005476642,
  2243076622,
  3870952857,
  3732016268,
  765654824,
  3490871365,
  2511836413,
  1685915746,
  3888969200,
  1414112111,
  2273134842,
  3281911079,
  4080962846,
  172450625,
  2569994100,
  980381355,
  4109958455,
  2819808352,
  2716589560,
  2568741196,
  3681446669,
  3329971472,
  1835478071,
  660984891,
  3704678404,
  4045999559,
  3422617507,
  3040415634,
  1762651403,
  1719377915,
  3470491036,
  2693910283,
  3642056355,
  3138596744,
  1364962596,
  2073328063,
  1983633131,
  926494387,
  3423689081,
  2150032023,
  4096667949,
  1749200295,
  3328846651,
  309677260,
  2016342300,
  1779581495,
  3079819751,
  111262694,
  1274766160,
  443224088,
  298511866,
  1025883608,
  3806446537,
  1145181785,
  168956806,
  3641502830,
  3584813610,
  1689216846,
  3666258015,
  3200248200,
  1692713982,
  2646376535,
  4042768518,
  1618508792,
  1610833997,
  3523052358,
  4130873264,
  2001055236,
  3610705100,
  2202168115,
  4028541809,
  2961195399,
  1006657119,
  2006996926,
  3186142756,
  1430667929,
  3210227297,
  1314452623,
  4074634658,
  4101304120,
  2273951170,
  1399257539,
  3367210612,
  3027628629,
  1190975929,
  2062231137,
  2333990788,
  2221543033,
  2438960610,
  1181637006,
  548689776,
  2362791313,
  3372408396,
  3104550113,
  3145860560,
  296247880,
  1970579870,
  3078560182,
  3769228297,
  1714227617,
  3291629107,
  3898220290,
  166772364,
  1251581989,
  493813264,
  448347421,
  195405023,
  2709975567,
  677966185,
  3703036547,
  1463355134,
  2715995803,
  1338867538,
  1343315457,
  2802222074,
  2684532164,
  233230375,
  2599980071,
  2000651841,
  3277868038,
  1638401717,
  4028070440,
  3237316320,
  6314154,
  819756386,
  300326615,
  590932579,
  1405279636,
  3267499572,
  3150704214,
  2428286686,
  3959192993,
  3461946742,
  1862657033,
  1266418056,
  963775037,
  2089974820,
  2263052895,
  1917689273,
  448879540,
  3550394620,
  3981727096,
  150775221,
  3627908307,
  1303187396,
  508620638,
  2975983352,
  2726630617,
  1817252668,
  1876281319,
  1457606340,
  908771278,
  3720792119,
  3617206836,
  2455994898,
  1729034894,
  1080033504,
  976866871,
  3556439503,
  2881648439,
  1522871579,
  1555064734,
  1336096578,
  3548522304,
  2579274686,
  3574697629,
  3205460757,
  3593280638,
  3338716283,
  3079412587,
  564236357,
  2993598910,
  1781952180,
  1464380207,
  3163844217,
  3332601554,
  1699332808,
  1393555694,
  1183702653,
  3581086237,
  1288719814,
  691649499,
  2847557200,
  2895455976,
  3193889540,
  2717570544,
  1781354906,
  1676643554,
  2592534050,
  3230253752,
  1126444790,
  2770207658,
  2633158820,
  2210423226,
  2615765581,
  2414155088,
  3127139286,
  673620729,
  2805611233,
  1269405062,
  4015350505,
  3341807571,
  4149409754,
  1057255273,
  2012875353,
  2162469141,
  2276492801,
  2601117357,
  993977747,
  3918593370,
  2654263191,
  753973209,
  36408145,
  2530585658,
  25011837,
  3520020182,
  2088578344,
  530523599,
  2918365339,
  1524020338,
  1518925132,
  3760827505,
  3759777254,
  1202760957,
  3985898139,
  3906192525,
  674977740,
  4174734889,
  2031300136,
  2019492241,
  3983892565,
  4153806404,
  3822280332,
  352677332,
  2297720250,
  60907813,
  90501309,
  3286998549,
  1016092578,
  2535922412,
  2839152426,
  457141659,
  509813237,
  4120667899,
  652014361,
  1966332200,
  2975202805,
  55981186,
  2327461051,
  676427537,
  3255491064,
  2882294119,
  3433927263,
  1307055953,
  942726286,
  933058658,
  2468411793,
  3933900994,
  4215176142,
  1361170020,
  2001714738,
  2830558078,
  3274259782,
  1222529897,
  1679025792,
  2729314320,
  3714953764,
  1770335741,
  151462246,
  3013232138,
  1682292957,
  1483529935,
  471910574,
  1539241949,
  458788160,
  3436315007,
  1807016891,
  3718408830,
  978976581,
  1043663428,
  3165965781,
  1927990952,
  4200891579,
  2372276910,
  3208408903,
  3533431907,
  1412390302,
  2931980059,
  4132332400,
  1947078029,
  3881505623,
  4168226417,
  2941484381,
  1077988104,
  1320477388,
  886195818,
  18198404,
  3786409e3,
  2509781533,
  112762804,
  3463356488,
  1866414978,
  891333506,
  18488651,
  661792760,
  1628790961,
  3885187036,
  3141171499,
  876946877,
  2693282273,
  1372485963,
  791857591,
  2686433993,
  3759982718,
  3167212022,
  3472953795,
  2716379847,
  445679433,
  3561995674,
  3504004811,
  3574258232,
  54117162,
  3331405415,
  2381918588,
  3769707343,
  4154350007,
  1140177722,
  4074052095,
  668550556,
  3214352940,
  367459370,
  261225585,
  2610173221,
  4209349473,
  3468074219,
  3265815641,
  314222801,
  3066103646,
  3808782860,
  282218597,
  3406013506,
  3773591054,
  379116347,
  1285071038,
  846784868,
  2669647154,
  3771962079,
  3550491691,
  2305946142,
  453669953,
  1268987020,
  3317592352,
  3279303384,
  3744833421,
  2610507566,
  3859509063,
  266596637,
  3847019092,
  517658769,
  3462560207,
  3443424879,
  370717030,
  4247526661,
  2224018117,
  4143653529,
  4112773975,
  2788324899,
  2477274417,
  1456262402,
  2901442914,
  1517677493,
  1846949527,
  2295493580,
  3734397586,
  2176403920,
  1280348187,
  1908823572,
  3871786941,
  846861322,
  1172426758,
  3287448474,
  3383383037,
  1655181056,
  3139813346,
  901632758,
  1897031941,
  2986607138,
  3066810236,
  3447102507,
  1393639104,
  373351379,
  950779232,
  625454576,
  3124240540,
  4148612726,
  2007998917,
  544563296,
  2244738638,
  2330496472,
  2058025392,
  1291430526,
  424198748,
  50039436,
  29584100,
  3605783033,
  2429876329,
  2791104160,
  1057563949,
  3255363231,
  3075367218,
  3463963227,
  1469046755,
  985887462
];
var C_ORIG = [
  1332899944,
  1700884034,
  1701343084,
  1684370003,
  1668446532,
  1869963892
];
function _encipher(lr, off, P, S) {
  var n, l = lr[off], r = lr[off + 1];
  l ^= P[0];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[1];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[2];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[3];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[4];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[5];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[6];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[7];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[8];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[9];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[10];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[11];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[12];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[13];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[14];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[15];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[16];
  lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
  lr[off + 1] = l;
  return lr;
}
function _streamtoword(data, offp) {
  for (var i = 0, word = 0; i < 4; ++i)
    word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
  return { key: word, offp };
}
function _key(key, P, S) {
  var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
  for (i = 0; i < plen; i += 2)
    lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
function _ekskey(data, key, P, S) {
  var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
  offp = 0;
  for (i = 0; i < plen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
function _crypt(b, salt, rounds, callback, progressCallback) {
  var cdata = C_ORIG.slice(), clen = cdata.length, err;
  if (rounds < 4 || rounds > 31) {
    err = Error("Illegal number of rounds (4-31): " + rounds);
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.length !== BCRYPT_SALT_LEN) {
    err = Error(
      "Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN
    );
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  rounds = 1 << rounds >>> 0;
  var P, S, i = 0, j;
  if (typeof Int32Array === "function") {
    P = new Int32Array(P_ORIG);
    S = new Int32Array(S_ORIG);
  } else {
    P = P_ORIG.slice();
    S = S_ORIG.slice();
  }
  _ekskey(salt, b, P, S);
  function next() {
    if (progressCallback) progressCallback(i / rounds);
    if (i < rounds) {
      var start = Date.now();
      for (; i < rounds; ) {
        i = i + 1;
        _key(b, P, S);
        _key(salt, P, S);
        if (Date.now() - start > MAX_EXECUTION_TIME) break;
      }
    } else {
      for (i = 0; i < 64; i++)
        for (j = 0; j < clen >> 1; j++) _encipher(cdata, j << 1, P, S);
      var ret = [];
      for (i = 0; i < clen; i++)
        ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
      if (callback) {
        callback(null, ret);
        return;
      } else return ret;
    }
    if (callback) nextTick(next);
  }
  if (typeof callback !== "undefined") {
    next();
  } else {
    var res;
    while (true) if (typeof (res = next()) !== "undefined") return res || [];
  }
}
function _hash(password, salt, callback, progressCallback) {
  var err;
  if (typeof password !== "string" || typeof salt !== "string") {
    err = Error("Invalid string / salt: Not a string");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var minor, offset;
  if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
    err = Error("Invalid salt version: " + salt.substring(0, 2));
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.charAt(2) === "$") minor = String.fromCharCode(0), offset = 3;
  else {
    minor = salt.charAt(2);
    if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
      err = Error("Invalid salt revision: " + salt.substring(2, 4));
      if (callback) {
        nextTick(callback.bind(this, err));
        return;
      } else throw err;
    }
    offset = 4;
  }
  if (salt.charAt(offset + 2) > "$") {
    err = Error("Missing salt rounds");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
  password += minor >= "a" ? "\0" : "";
  var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
  function finish(bytes) {
    var res = [];
    res.push("$2");
    if (minor >= "a") res.push(minor);
    res.push("$");
    if (rounds < 10) res.push("0");
    res.push(rounds.toString());
    res.push("$");
    res.push(base64_encode(saltb, saltb.length));
    res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
    return res.join("");
  }
  if (typeof callback == "undefined")
    return finish(_crypt(passwordb, saltb, rounds));
  else {
    _crypt(
      passwordb,
      saltb,
      rounds,
      function(err2, bytes) {
        if (err2) callback(err2, null);
        else callback(null, finish(bytes));
      },
      progressCallback
    );
  }
}
function encodeBase64(bytes, length) {
  return base64_encode(bytes, length);
}
function decodeBase64(string, length) {
  return base64_decode(string, length);
}
const bcrypt = {
  setRandomFallback,
  genSaltSync,
  genSalt,
  hashSync,
  hash,
  compareSync,
  compare,
  getRounds,
  getSalt,
  truncates,
  encodeBase64,
  decodeBase64
};
var EstadosMesa = /* @__PURE__ */ ((EstadosMesa2) => {
  EstadosMesa2["LIBRE"] = "LIBRE";
  EstadosMesa2["OCUPADA"] = "OCUPADA";
  EstadosMesa2["RESERVADA"] = "RESERVADA";
  EstadosMesa2["MANTENIMIENTO"] = "MANTENIMIENTO";
  return EstadosMesa2;
})(EstadosMesa || {});
var Roles = /* @__PURE__ */ ((Roles2) => {
  Roles2["ADMIN"] = "ADMIN";
  Roles2["CAJERO"] = "CAJERO";
  Roles2["MESERO"] = "MESERO";
  return Roles2;
})(Roles || {});
Object.entries(EstadosMesa).map(
  ([valor, etiqueta]) => ({
    valor,
    etiqueta
  })
);
const { PrismaClient: PrismaClient$3 } = pkg;
const prisma$3 = new PrismaClient$3();
const getUsuarios = async () => {
  try {
    const usuarios = await prisma$3.usuario.findMany({
      where: { eliminado: false },
      select: { id: true, nombre: true, rol: true, fecha_creacion: true }
    });
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return error;
  }
};
const getUsuarioById = async (id) => {
  try {
    const usuario = await prisma$3.usuario.findUnique({
      where: { id, eliminado: false },
      select: { id: true, nombre: true, rol: true, fecha_creacion: true }
    });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  } catch (error) {
    console.error("Error al obtener un usuario:", error);
    return error;
  }
};
const createUsuario = async (data) => {
  try {
    const existingUsuario = await prisma$3.usuario.findFirst({
      where: { nombre: data.nombre }
    });
    if (existingUsuario) {
      throw new Error("Ya existe un usuario con ese nombre");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const newUsuario = await prisma$3.usuario.create({
      data
    });
    return newUsuario;
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return error;
  }
};
const updateUsuario = async (id, usuarioData) => {
  try {
    if (usuarioData.password) {
      usuarioData.password = await bcrypt.hash(usuarioData.password, 10);
    }
    const existing = await prisma$3.usuario.findMany({
      where: { nombre: usuarioData.nombre, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe un usuario con ese nombre");
    }
    const updatedUsuario = await prisma$3.usuario.update({
      where: { id },
      data: usuarioData
    });
    return updatedUsuario;
  } catch (error) {
    console.error("Error al actualizar un usuario:", error);
    return error;
  }
};
const deleteUsuario = async (id) => {
  try {
    const deletedUsuario = await prisma$3.usuario.update({
      where: { id },
      data: { eliminado: true }
    });
    return deletedUsuario;
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return error;
  }
};
const getMeseroMasLibre = async () => {
  try {
    const hoy = /* @__PURE__ */ new Date();
    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
    const finDia = new Date(hoy.setHours(23, 59, 59, 999));
    const meseros = await prisma$3.usuario.findMany({
      where: { rol: { nombre: Roles.MESERO }, eliminado: false },
      select: { id: true, nombre: true }
    });
    if (!meseros.length) return [];
    const pedidos = await prisma$3.pedido.groupBy({
      by: ["mesera_id", "estado"],
      _count: { _all: true },
      where: {
        mesera_id: { in: meseros.map((m) => m.id) },
        eliminado: false,
        pedido_padre: null,
        para_llevar: false,
        fecha_creacion: { gte: inicioDia, lte: finDia }
      }
    });
    const resultado = meseros.map((mesero) => {
      var _a, _b;
      const asignados = ((_a = pedidos.find(
        (p) => p.mesera_id === mesero.id && p.estado === EstadoPedido.EN_PREPARACION
      )) == null ? void 0 : _a._count._all) || 0;
      const atendidos = ((_b = pedidos.find(
        (p) => p.mesera_id === mesero.id && p.estado === EstadoPedido.COMPLETADO
      )) == null ? void 0 : _b._count._all) || 0;
      return {
        id: mesero.id,
        nombre: mesero.nombre,
        mesasAsignadas: asignados,
        mesasAtendidas: atendidos
      };
    });
    resultado.sort((a, b) => {
      const totalA = a.mesasAsignadas + a.mesasAtendidas;
      const totalB = b.mesasAsignadas + b.mesasAtendidas;
      if (totalA !== totalB) {
        return totalA - totalB;
      }
      return a.mesasAsignadas - b.mesasAsignadas;
    });
    return resultado;
  } catch (error) {
    console.error("Error al obtener meseros disponibles:", error);
    throw error;
  }
};
const authenticateUsuario = async (usuario, password) => {
  try {
    const usuarioEncontrado = await prisma$3.usuario.findFirst({
      where: { nombre: usuario, eliminado: false },
      select: { nombre: true, rol: true, id: true, password: true }
    });
    if (!usuarioEncontrado) {
      throw new Error("Usuario no encontrado");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      usuarioEncontrado.password
    );
    if (!isPasswordValid) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    return {
      message: "Acceso correcto",
      data: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol.nombre
      }
    };
  } catch (error) {
    console.error("Error en la autenticación del usuario:", error);
    return error;
  }
};
const { PrismaClient: PrismaClient$2 } = pkg;
const prisma$2 = new PrismaClient$2();
const getRoles = async () => {
  try {
    const roles = await prisma$2.rol.findMany({
      where: { eliminado: false },
      select: { id: true, nombre: true }
    });
    return roles;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return error;
  }
};
const getRolById = async (id) => {
  try {
    const rol = await prisma$2.rol.findUnique({
      where: { id, eliminado: false },
      select: { id: true, nombre: true }
    });
    if (!rol) {
      throw new Error("Rol no encontrado");
    }
    return rol;
  } catch (error) {
    console.error("Error al obtener un rol:", error);
    return error;
  }
};
const { PrismaClient: PrismaClient$1 } = pkg;
const prisma$1 = new PrismaClient$1();
const getPedidos = async () => {
  try {
    const pedidos = await prisma$1.pedido.findMany({
      where: { eliminado: false },
      select: {
        id: true,
        num_pedido_dia: true,
        pedido_padre_id: true,
        mesa: {
          select: {
            id: true,
            numero: true
          }
        },
        mesera: {
          select: {
            id: true,
            nombre: true
          }
        },
        cajero: {
          select: {
            id: true,
            nombre: true
          }
        },
        estado: true,
        fecha_creacion: true,
        fecha_concluido: true,
        tipo_pago: true,
        para_llevar: true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            pedido_id: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
                maneja_stock: true,
                categoria_id: true
              }
            },
            cantidad: true,
            precio_unitario: true
          }
        }
      },
      orderBy: { fecha_creacion: "desc" }
    });
    return pedidos.map((p) => {
      var _a;
      return {
        ...p,
        total: (_a = p.total) == null ? void 0 : _a.toFixed(2),
        // Convierte Decimal a string con 2 decimales
        detalles: p.detalles.map((d) => {
          var _a2;
          return {
            ...d,
            precio_unitario: (_a2 = d.precio_unitario) == null ? void 0 : _a2.toFixed(2)
            // Convierte Decimal a string con 2 decimales
          };
        })
      };
    });
  } catch (error) {
    console.error("Error en pedidos:", error);
    return error;
  }
};
const getPedidosHoy = async () => {
  try {
    const hoy = /* @__PURE__ */ new Date();
    const inicioDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      0,
      0,
      0
    );
    const finDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      23,
      59,
      59
    );
    const pedidos = await prisma$1.pedido.findMany({
      where: {
        eliminado: false,
        fecha_creacion: {
          gte: inicioDia,
          lte: finDia
        }
      },
      select: {
        id: true,
        num_pedido_dia: true,
        pedido_padre_id: true,
        mesa: {
          select: {
            id: true,
            numero: true
          }
        },
        mesera: {
          select: {
            id: true,
            nombre: true
          }
        },
        cajero: {
          select: {
            id: true,
            nombre: true
          }
        },
        estado: true,
        fecha_creacion: true,
        fecha_concluido: true,
        tipo_pago: true,
        para_llevar: true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            pedido_id: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
                maneja_stock: true,
                categoria: true
              }
            },
            cantidad: true,
            precio_unitario: true
          }
        }
      },
      orderBy: { fecha_creacion: "desc" }
    });
    return pedidos.map((p) => {
      var _a;
      return {
        ...p,
        total: (_a = p.total) == null ? void 0 : _a.toFixed(2),
        // Convierte Decimal a string con 2 decimales
        detalles: p.detalles.map((d) => {
          var _a2;
          return {
            ...d,
            precio_unitario: (_a2 = d.precio_unitario) == null ? void 0 : _a2.toFixed(2)
            // Convierte Decimal a string con 2 decimales
          };
        })
      };
    });
  } catch (error) {
    console.error("Error en pedidos:", error);
    return error;
  }
};
const gePedidoById = async (id) => {
  var _a;
  try {
    const pedido = await prisma$1.pedido.findUnique({
      where: { id, eliminado: false },
      select: {
        id: true,
        num_pedido_dia: true,
        pedido_padre_id: true,
        mesa: {
          select: {
            id: true,
            numero: true
          }
        },
        mesera: {
          select: {
            id: true,
            nombre: true
          }
        },
        cajero: {
          select: {
            id: true,
            nombre: true
          }
        },
        estado: true,
        fecha_creacion: true,
        fecha_concluido: true,
        tipo_pago: true,
        para_llevar: true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            pedido_id: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
                maneja_stock: true
              }
            },
            cantidad: true,
            precio_unitario: true
          }
        }
      }
    });
    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }
    return {
      ...pedido,
      total: (_a = pedido.total) == null ? void 0 : _a.toFixed(2),
      // Convierte Decimal a string con 2 decimales
      detalles: pedido.detalles.map((d) => {
        var _a2;
        return {
          ...d,
          precio_unitario: (_a2 = d.precio_unitario) == null ? void 0 : _a2.toFixed(2)
          // Convierte Decimal a string con 2 decimales
        };
      })
    };
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    return error;
  }
};
const getNumeroPedidoDia = async () => {
  try {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const count = await prisma$1.pedido.count({
      where: {
        fecha_creacion: {
          gte: today
        },
        eliminado: false
      }
    });
    return count + 1;
  } catch (error) {
    console.error("Error al obtener número de pedido del día:", error);
    return 0;
  }
};
const cambiarEstadoPedido = async (id, estado) => {
  try {
    const data = { estado };
    if (estado === EstadoPedido.COMPLETADO) {
      data.fecha_concluido = /* @__PURE__ */ new Date();
    }
    const pedido = await prisma$1.pedido.update({
      where: { id },
      data
    });
    await prisma$1.pedido.updateMany({
      where: {
        pedido_padre_id: id,
        fecha_concluido: null
        // Solo actualizar aquellos que no tienen valor en fecha_concluido
      },
      data
    });
    estado === EstadoPedido.COMPLETADO && pedido.mesa_id ? cambiarEstadoMesa(pedido.mesa_id, EstadosMesa.LIBRE) : "";
    return {
      success: true,
      message: `Pedido con ID ${id} ha sido actualizado al estado ${estado}`
    };
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    return {
      success: false,
      message: "Error al actualizar el estado del pedido"
    };
  }
};
function validarDetallesUnicos$1(detalles) {
  const productoIds = detalles.map((detalle) => detalle.producto_id);
  const tieneDuplicados = new Set(productoIds).size !== productoIds.length;
  if (tieneDuplicados) {
    throw new Error(
      "No se puede crear un pedido con detalles duplicados (mismo producto)."
    );
  }
}
const crearPedidoConDetalles = async (data) => {
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede crear un pedido sin detalles.");
    }
    validarDetallesUnicos$1(data.detalles);
    return await prisma$1.$transaction(async (tx) => {
      const num_pedido_dia = await getNumeroPedidoDia();
      const nuevoPedido = await tx.pedido.create({
        data: {
          pedido_padre_id: data.pedido_padre_id,
          mesa_id: data.mesa_id,
          mesera_id: data.mesera_id,
          cajero_id: data.cajero_id,
          estado: data.estado ?? EstadoPedido.EN_PREPARACION,
          fecha_concluido: data.fecha_concluido,
          num_pedido_dia,
          total: 0,
          // Inicialmente 0, se actualizará después
          tipo_pago: data.tipo_pago,
          para_llevar: data.para_llevar || false
        }
      });
      const productoIds = data.detalles.map((detalle) => detalle.producto_id);
      const productos = await tx.producto.findMany({
        where: { id: { in: productoIds } },
        select: { id: true, maneja_stock: true, stock: true, nombre: true }
      });
      const detalles = [];
      for (const detalle of data.detalles) {
        const producto = productos.find((p) => p.id === detalle.producto_id);
        if (!producto) {
          throw new Error(
            `Producto con ID ${detalle.producto_id} no encontrado.`
          );
        }
        if (producto.maneja_stock) {
          if (producto.stock < detalle.cantidad) {
            throw new Error(
              `Stock insuficiente para el producto ID ${producto.id} , ${producto.nombre}.`
            );
          }
          await tx.producto.update({
            where: { id: producto.id },
            data: { stock: { decrement: detalle.cantidad } }
          });
        }
        detalles.push({
          pedido_id: nuevoPedido.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario
        });
      }
      await tx.detallePedido.createMany({ data: detalles });
      const totalPedido = detalles.reduce(
        (total, detalle) => total + detalle.cantidad * detalle.precio_unitario,
        0
      );
      await tx.pedido.update({
        where: { id: nuevoPedido.id },
        data: { total: totalPedido }
      });
      !data.para_llevar && cambiarEstadoMesa(data.mesa_id, EstadosMesa.OCUPADA);
      return {
        success: true,
        message: "Pedido creado correctamente"
      };
    });
  } catch (error) {
    return error;
  }
};
const editarPedidoConDetalles = async (data) => {
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede guardar un pedido sin detalles.");
    }
    validarDetallesUnicos$1(data.detalles);
    console.log(data.detalles);
    return await prisma$1.$transaction(async (tx) => {
      const pedidoExistente = await tx.pedido.findUnique({
        where: { id: data.id },
        include: {
          detalles: {
            include: {
              producto: {
                select: {
                  id: true,
                  maneja_stock: true,
                  stock: true,
                  nombre: true
                }
              }
            }
          }
        }
      });
      if (!pedidoExistente) {
        throw new Error("Pedido no encontrado.");
      }
      await tx.pedido.update({
        where: { id: data.id },
        data: {
          pedido_padre_id: data.pedido_padre_id,
          mesa_id: data.mesa_id,
          mesera_id: data.mesera_id,
          cajero_id: data.cajero_id,
          estado: data.estado ?? EstadoPedido.EN_PREPARACION,
          fecha_concluido: data.fecha_concluido
        }
      });
      for (const detalle of data.detalles) {
        if (detalle.eliminado && detalle.id) {
          const detalleExistente = pedidoExistente.detalles.find(
            (d) => d.id === detalle.id
          );
          if (detalleExistente == null ? void 0 : detalleExistente.producto.maneja_stock) {
            await tx.producto.update({
              where: { id: detalleExistente.producto.id },
              data: { stock: { increment: detalleExistente.cantidad } }
            });
          }
          await tx.detallePedido.delete({ where: { id: detalle.id } });
        } else if (detalle.id) {
          const detalleExistente = pedidoExistente.detalles.find(
            (d) => d.id === detalle.id
          );
          if (!detalleExistente) {
            throw new Error(`Detalle con ID ${detalle.id} no encontrado`);
          }
          if (detalleExistente.producto.id !== detalle.producto_id) {
            throw new Error(
              "No se puede modificar el producto en un detalle existente"
            );
          }
          const diferencia = detalle.cantidad - detalleExistente.cantidad;
          if (detalleExistente.producto.maneja_stock) {
            if (detalleExistente.producto.stock < diferencia) {
              throw new Error(
                `Stock insuficiente para ${detalleExistente.producto.nombre}`
              );
            }
            await tx.producto.update({
              where: { id: detalleExistente.producto.id },
              data: { stock: { decrement: diferencia } }
            });
          }
          await tx.detallePedido.update({
            where: { id: detalle.id },
            data: {
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario
            }
          });
        } else {
          const producto = await tx.producto.findUnique({
            where: { id: detalle.producto_id },
            select: { maneja_stock: true, stock: true, nombre: true }
          });
          if (!producto) {
            throw new Error(
              `Producto con ID ${detalle.producto_id} no encontrado`
            );
          }
          if (producto.maneja_stock && producto.stock < detalle.cantidad) {
            throw new Error(`Stock insuficiente para ${producto.nombre}`);
          }
          if (producto.maneja_stock) {
            await tx.producto.update({
              where: { id: detalle.producto_id },
              data: { stock: { decrement: detalle.cantidad } }
            });
          }
          await tx.detallePedido.create({
            data: {
              pedido_id: data.id,
              producto_id: detalle.producto_id,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario
            }
          });
        }
      }
      const detallesActualizados = await tx.detallePedido.findMany({
        where: { pedido_id: data.id },
        include: { producto: true }
      });
      const totalPedido = detallesActualizados.reduce(
        (total, detalle) => total + detalle.cantidad * Number(detalle.precio_unitario),
        0
      );
      await tx.pedido.update({
        where: { id: data.id },
        data: { total: totalPedido }
      });
      return {
        success: true,
        message: "Pedido actualizado correctamente"
      };
    });
  } catch (error) {
    return error;
  }
};
const eliminarPedido = async (id) => {
  try {
    const pedidoEliminado = await prisma$1.pedido.update({
      where: { id },
      data: { eliminado: true }
    });
    console.log("Pedido eliminado:", pedidoEliminado);
    return JSON.parse(JSON.stringify(pedidoEliminado));
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    return error;
  }
};
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
function validarDetallesUnicos(detalles) {
  const productoIds = detalles.map((detalle) => detalle.producto_id);
  const tieneDuplicados = new Set(productoIds).size !== productoIds.length;
  if (tieneDuplicados) {
    throw new Error(
      "No se puede crear un ingreso con detalles duplicados (mismo producto)."
    );
  }
}
const crearIngresoConDetalles = async (data) => {
  console.log("DATA", data);
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede crear un ingreso sin detalles.");
    }
    validarDetallesUnicos(data.detalles);
    return await prisma.$transaction(async (tx) => {
      const nuevoIngreso = await tx.ingreso.create({
        data: {
          usuario_id: data.usuario_id,
          estado: data.estado ?? EstadoIngreso.CONSOLIDADO,
          total: 0
          // Se actualizará después
        }
      });
      const productoIds = data.detalles.map((detalle) => detalle.producto_id);
      const productos = await tx.producto.findMany({
        where: { id: { in: productoIds } },
        select: { id: true, stock: true, nombre: true }
      });
      const detalles = [];
      for (const detalle of data.detalles) {
        const producto = productos.find((p) => p.id === detalle.producto_id);
        if (!producto) {
          throw new Error(
            `Producto con ID ${detalle.producto_id} no encontrado.`
          );
        }
        await tx.producto.update({
          where: { id: producto.id },
          data: { stock: { increment: detalle.cantidad } }
        });
        detalles.push({
          ingreso_id: nuevoIngreso.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario
        });
      }
      await tx.detalleIngreso.createMany({ data: detalles });
      const totalIngreso = detalles.reduce(
        (total, detalle) => total + detalle.cantidad * detalle.precio_unitario,
        0
      );
      await tx.ingreso.update({
        where: { id: nuevoIngreso.id },
        data: { total: totalIngreso }
      });
      return {
        success: true,
        message: "Ingreso creado correctamente"
      };
    });
  } catch (error) {
    return error;
  }
};
const editarIngresoConDetalles = async (data) => {
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede guardar un ingreso sin detalles.");
    }
    return await prisma.$transaction(async (tx) => {
      const ingresoExistente = await tx.ingreso.findUnique({
        where: { id: data.id },
        include: {
          detalles: true
        }
      });
      if (!ingresoExistente) {
        throw new Error("Ingreso no encontrado.");
      }
      await tx.ingreso.update({
        where: { id: data.id },
        data: {
          usuario_id: data.usuario_id,
          estado: data.estado
        }
      });
      for (const detalle of data.detalles) {
        if (detalle.eliminado && detalle.id) {
          const detalleExistente = ingresoExistente.detalles.find(
            (d) => d.id === detalle.id
          );
          if (detalleExistente) {
            await tx.producto.update({
              where: { id: detalleExistente.producto_id },
              data: { stock: { decrement: detalleExistente.cantidad } }
            });
            await tx.detalleIngreso.delete({ where: { id: detalle.id } });
          }
        } else if (detalle.id) {
          const detalleExistente = ingresoExistente.detalles.find(
            (d) => d.id === detalle.id
          );
          if (!detalleExistente) {
            throw new Error(`Detalle con ID ${detalle.id} no encontrado`);
          }
          if (detalleExistente.producto_id !== detalle.producto_id) {
            throw new Error(
              "No se puede modificar el producto en un detalle existente"
            );
          }
          const diferencia = detalle.cantidad - detalleExistente.cantidad;
          await tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock: { increment: diferencia } }
          });
          await tx.detalleIngreso.update({
            where: { id: detalle.id },
            data: {
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario
            }
          });
        } else {
          await tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock: { increment: detalle.cantidad } }
          });
          await tx.detalleIngreso.create({
            data: {
              ingreso_id: data.id,
              producto_id: detalle.producto_id,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario
            }
          });
        }
      }
      const detallesActualizados = await tx.detalleIngreso.findMany({
        where: { ingreso_id: data.id }
      });
      const totalIngreso = detallesActualizados.reduce(
        (total, detalle) => total + detalle.cantidad * Number(detalle.precio_unitario),
        0
      );
      await tx.ingreso.update({
        where: { id: data.id },
        data: { total: totalIngreso }
      });
      return {
        success: true,
        message: "Ingreso actualizado correctamente"
      };
    });
  } catch (error) {
    return error;
  }
};
const getIngresos = async () => {
  try {
    const ingresos = await prisma.ingreso.findMany({
      where: { eliminado: false },
      orderBy: { fecha_ingreso: "desc" },
      select: {
        id: true,
        usuario: {
          select: {
            id: true,
            nombre: true
          }
        },
        estado: true,
        fecha_ingreso: true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            ingreso_id: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
                maneja_stock: true
              }
            },
            cantidad: true,
            precio_unitario: true
          }
        }
      }
    });
    return ingresos.map((i) => {
      var _a;
      return {
        ...i,
        total: (_a = i.total) == null ? void 0 : _a.toFixed(2),
        // Convertir a string con 2 decimales
        detalles: i.detalles.map((d) => {
          var _a2;
          return {
            ...d,
            precio_unitario: (_a2 = d.precio_unitario) == null ? void 0 : _a2.toFixed(2)
            // Convertir a string con 2 decimales
          };
        })
      };
    });
  } catch (error) {
    console.error("Error en ingresos:", error);
    return error;
  }
};
const getIngresoById = async (id) => {
  var _a;
  try {
    const ingreso = await prisma.ingreso.findUnique({
      where: { id, eliminado: false },
      select: {
        id: true,
        usuario: {
          select: {
            id: true,
            nombre: true
          }
        },
        estado: true,
        fecha_ingreso: true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            ingreso_id: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
                maneja_stock: true
              }
            },
            cantidad: true,
            precio_unitario: true
          }
        }
      }
    });
    if (!ingreso) {
      throw new Error("Ingreso no encontrado");
    }
    return {
      ...ingreso,
      total: (_a = ingreso.total) == null ? void 0 : _a.toFixed(2),
      // Convertir a string con 2 decimales
      detalles: ingreso.detalles.map((d) => {
        var _a2;
        return {
          ...d,
          precio_unitario: (_a2 = d.precio_unitario) == null ? void 0 : _a2.toFixed(2)
          // Convertir a string con 2 decimales
        };
      })
    };
  } catch (error) {
    console.error("Error al obtener ingreso:", error);
    return error;
  }
};
const ipcMainModules = () => {
  ipcMain.handle("get-productos", async () => {
    return await obtenerProductos();
  });
  ipcMain.handle("create-producto", async (_, producto) => {
    return await crearProducto(producto);
  });
  ipcMain.handle("edit-producto", async (_, { id, productoData }) => {
    return await editarProducto(id, productoData);
  });
  ipcMain.handle("get-one-producto", async (_, id) => {
    return await obtenerOneProducto(id);
  });
  ipcMain.handle("delete-producto", async (_, id) => {
    return await eliminarProducto(id);
  });
  ipcMain.handle("get-categorias", async () => {
    return await getCategoriasProductos();
  });
  ipcMain.handle("create-categoria", async (_, producto) => {
    return await createCategoriaProducto(producto);
  });
  ipcMain.handle("edit-categoria", async (_, { id, categoriaData }) => {
    return await updateCategoriaProducto(id, categoriaData);
  });
  ipcMain.handle("get-one-categoria", async (_, id) => {
    return await getCategoriaProductoById(id);
  });
  ipcMain.handle("delete-categoria", async (_, id) => {
    return await deleteCategoriaProducto(id);
  });
  ipcMain.handle("get-mesas", async () => {
    return await getMesas();
  });
  ipcMain.handle("get-mesas-by-estado", async (_, estado) => {
    return await getMesasByEstado(estado);
  });
  ipcMain.handle("create-mesa", async (_, mesa) => {
    return await createMesa(mesa);
  });
  ipcMain.handle("edit-mesa", async (_, { id, mesaData }) => {
    return await updateMesa(id, mesaData);
  });
  ipcMain.handle("get-one-mesa", async (_, id) => {
    return await getMesaById(id);
  });
  ipcMain.handle("delete-mesa", async (_, id) => {
    return await deleteMesa(id);
  });
  ipcMain.handle("get-usuarios", async () => {
    return await getUsuarios();
  });
  ipcMain.handle("get-mesero-libre", async () => {
    return await getMeseroMasLibre();
  });
  ipcMain.handle("create-usuario", async (_, usuario) => {
    return await createUsuario(usuario);
  });
  ipcMain.handle("edit-usuario", async (_, { id, usuarioData }) => {
    return await updateUsuario(id, usuarioData);
  });
  ipcMain.handle("get-one-usuario", async (_, id) => {
    return await getUsuarioById(id);
  });
  ipcMain.handle("delete-usuario", async (_, id) => {
    return await deleteUsuario(id);
  });
  ipcMain.handle("authenticate-usuario", async (_, { usuario, password }) => {
    return await authenticateUsuario(usuario, password);
  });
  ipcMain.handle("upload-file", async (_, fileData) => {
    return await uploadFile(fileData);
  });
  ipcMain.handle("get-roles", async () => {
    return await getRoles();
  });
  ipcMain.handle("get-one-role", async (_, id) => {
    return await getRolById(id);
  });
  ipcMain.handle("get-pedidos", async () => {
    return await getPedidos();
  });
  ipcMain.handle("get-pedidos-hoy", async () => {
    return await getPedidosHoy();
  });
  ipcMain.handle("get-numero-pedido-dia", async () => {
    return await getNumeroPedidoDia();
  });
  ipcMain.handle("get-one-pedido", async (_, id) => {
    return await gePedidoById(id);
  });
  ipcMain.handle("cambiar-estado-pedido", async (_, { id, estado }) => {
    return await cambiarEstadoPedido(id, estado);
  });
  ipcMain.handle("delete-pedido", async (_, id) => {
    return await eliminarPedido(id);
  });
  ipcMain.handle("crear-pedido-con-detalles", async (_, data) => {
    return await crearPedidoConDetalles(data);
  });
  ipcMain.handle("editar-pedido-con-detalles", async (_, data) => {
    return await editarPedidoConDetalles(data);
  });
  ipcMain.handle("crear-ingreso-con-detalles", async (_, data) => {
    return await crearIngresoConDetalles(data);
  });
  ipcMain.handle("editar-ingreso-con-detalles", async (_, data) => {
    return await editarIngresoConDetalles(data);
  });
  ipcMain.handle("get-ingresos", async () => {
    return await getIngresos();
  });
  ipcMain.handle("get-one-ingreso", async (_, id) => {
    return await getIngresoById(id);
  });
  if (process.platform === "win32") {
    protocol.registerFileProtocol("local", (request, callback) => {
      const url = request.url.replace(/^local:\//, "");
      const filePath = path.normalize(decodeURIComponent(url));
      callback({ path: filePath });
    });
  } else {
    protocol.handle("local", async (request) => {
      const url = new URL(request.url);
      const filePath = url.pathname;
      try {
        const fileBuffer = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".png") {
          contentType = "image/png";
        } else if (ext === ".jpeg" || ext === ".jpg") {
          contentType = "image/jpeg";
        }
        return new Response(fileBuffer, {
          headers: { "Content-Type": contentType }
        });
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
        return new Response("Archivo no encontrado", { status: 404 });
      }
    });
  }
};
const __dirname = path$1.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path$1.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname, "preload.mjs")
    }
  });
  win.setIcon(path$1.join(process.env.VITE_PUBLIC, "icono-logo.png"));
  win.maximize();
  const dbPath = join(app.getPath("home"), "database", "dev.db");
  console.log("Ruta de la base de datos:", dbPath);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.whenReady().then(() => {
  createWindow();
  ipcMainModules();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
