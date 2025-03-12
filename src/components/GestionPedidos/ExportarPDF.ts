import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
}

interface Mesa {
  id: number;
  numero: number;
}

interface Producto {
  id: number;
  nombre: string;
  imagen_url?: string;
  maneja_stock?: boolean;
  categoria_id?: number;
}

interface DetallePedido {
  id: number;
  pedido_id: number;
  producto: Producto;
  cantidad: number;
  precio_unitario: string;
}

interface Pedido {
  id: number;
  num_pedido_dia: number;
  pedido_padre_id?: number;
  mesa?: Mesa;
  mesera: Usuario;
  cajero: Usuario;
  estado: string;
  fecha_creacion: string;
  fecha_concluido?: string;
  tipo_pago?: string;
  total: string;
  detalles: DetallePedido[];
}

interface ProductoRanking {
  id: number;
  nombre: string;
  cantidad: number;
  categoria_id?: number;
  categoria_nombre?: string;
}

// Extender jsPDF para incluir autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => { previous: { finalY: number } };
}

// Función para formatear fecha
const formatearFecha = (fechaStr: string): string => {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para generar el ranking de productos
const generarRankingProductos = (pedidos: Pedido[]): ProductoRanking[] => {
  // Obtener todos los detalles de los pedidos
  const detalles: DetallePedido[] = pedidos.flatMap(pedido => pedido.detalles || []);
  
  // Contar la cantidad de cada producto
  const productosMap = new Map<number, ProductoRanking>();
  
  detalles.forEach(detalle => {
    const productoId = detalle.producto.id;
    const productoActual = productosMap.get(productoId);
    
    if (productoActual) {
      productoActual.cantidad += detalle.cantidad;
    } else {
      productosMap.set(productoId, {
        id: productoId,
        nombre: detalle.producto.nombre,
        cantidad: detalle.cantidad,
        categoria_id: detalle.producto.categoria_id
      });
    }
  });
  
  // Convertir a array y ordenar por cantidad (descendente)
  return Array.from(productosMap.values()).sort((a, b) => b.cantidad - a.cantidad);
};

// Función para agrupar productos por categoría
const agruparPorCategoria = async (productos: ProductoRanking[]): Promise<{ [key: string]: ProductoRanking[] }> => {
  try {
    // Obtener categorías
    const categorias = await window.api.getCategorias();
    
    // Asignar nombre de categoría a cada producto
    productos.forEach(producto => {
      if (producto.categoria_id) {
        const categoria = categorias.find((c: any) => c.id === producto.categoria_id);
        if (categoria) {
          producto.categoria_nombre = categoria.nombre;
        }
      }
    });
    
    // Agrupar por categoría
    const grupos: { [key: string]: ProductoRanking[] } = {};
    
    productos.forEach(producto => {
      const categoriaNombre = producto.categoria_nombre || 'Sin categoría';
      
      if (!grupos[categoriaNombre]) {
        grupos[categoriaNombre] = [];
      }
      
      grupos[categoriaNombre].push(producto);
    });
    
    return grupos;
  } catch (error) {
    console.error('Error al agrupar por categoría:', error);
    return {};
  }
};

// Función principal para exportar a PDF
export const generarPDF = async (pedidos: Pedido[], incluirDetalles: boolean = false, incluirRanking: boolean = false): Promise<void> => {
  // Crear documento PDF
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Título
  doc.setFontSize(18);
  doc.text('Reporte de Pedidos', 14, 20);
  
  // Fecha de generación
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })}`, 14, 30);
  
  // Tabla de resumen
  const dataPrincipal = pedidos.map(pedido => [
    pedido.num_pedido_dia.toString(),
    formatearFecha(pedido.fecha_creacion),
    pedido.mesa ? `Mesa ${pedido.mesa.numero}` : '-',
    pedido.mesera.nombre,
    pedido.cajero.nombre,
    pedido.tipo_pago || '-',
    `$${parseFloat(pedido.total).toFixed(2)}`
  ]);
  
  // Agregar fila de total
  const totalGeneral = pedidos.reduce((sum, pedido) => sum + parseFloat(pedido.total), 0);
  dataPrincipal.push(['', '', '', '', '', 'TOTAL', `$${totalGeneral.toFixed(2)}`]);
  
  // Agregar tabla de resumen
  doc.autoTable({
    head: [['#', 'Fecha', 'Mesa', 'Mesero', 'Cajero', 'Tipo Pago', 'Total']],
    body: dataPrincipal,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] }
  });
  //@ts-ignore
  let y = doc.autoTable.previous.finalY + 20;
  
  // Si se incluyen detalles, agregar detalles de cada pedido
  if (incluirDetalles) {
    for (const pedido of pedidos) {
      // Verificar si necesitamos una nueva página
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      // Título del pedido
      doc.setFontSize(14);
      doc.text(`Pedido #${pedido.num_pedido_dia} - ${formatearFecha(pedido.fecha_creacion)}`, 14, y);
      y += 10;
      
      // Detalles del pedido
      if (pedido.detalles && pedido.detalles.length > 0) {
        const detallesData = pedido.detalles.map(detalle => [
          detalle.producto.nombre,
          detalle.cantidad.toString(),
          `$${parseFloat(detalle.precio_unitario).toFixed(2)}`,
          `$${(detalle.cantidad * parseFloat(detalle.precio_unitario)).toFixed(2)}`
        ]);
        
        doc.autoTable({
          head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
          body: detallesData,
          startY: y,
          theme: 'grid',
          headStyles: { fillColor: [100, 100, 100] }
        });
        //@ts-ignore
        y = doc.autoTable.previous.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.text('No hay detalles disponibles', 14, y);
        y += 15;
      }
    }
  }
    
  // Agregar ranking de productos si está habilitado
  if (incluirRanking && pedidos.length > 0) {
    // Verificar si necesitamos una nueva página
    if (y > 200) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Ranking de Productos por Categoría', 14, y);
    y += 10;
    
    // Generar ranking
    const productosRanking = generarRankingProductos(pedidos);
    const productosPorCategoria = await agruparPorCategoria(productosRanking);
    
    // Mostrar ranking por categoría
    for (const [categoria, productos] of Object.entries(productosPorCategoria)) {
      // Verificar si necesitamos una nueva página
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`Categoría: ${categoria}`, 14, y);
      y += 10;
      
      // Mostrar los 5 productos más vendidos de la categoría
      const top5 = productos.slice(0, 5);
      const dataCategorias = top5.map(producto => [
        producto.nombre,
        producto.cantidad.toString(),
        `${((producto.cantidad / productosRanking.reduce((sum, p) => sum + p.cantidad, 0)) * 100).toFixed(1)}%`
      ]);
      
      doc.autoTable({
        head: [['Producto', 'Cantidad', '% del Total']],
        body: dataCategorias,
        startY: y,
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] }
      });
      //@ts-ignore
      y = doc.autoTable.previous.finalY + 15;
    }
  }
  
  // Guardar PDF
  doc.save(`pedidos_${new Date().toISOString().split('T')[0]}.pdf`);
};