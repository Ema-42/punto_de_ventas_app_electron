import { defineStore } from "pinia";
import { ref } from "vue";
import { EstadosMesa } from "../../electron/main/modules/enums";

interface Mesa {
  id: number;
  numero: number;
  estado: string;
  eliminado: boolean;
  fecha_creacion: string;
}

export const useMesaStore = defineStore("mesa", () => {
  const mesas = ref<Mesa[]>([]); // Array de mesas

  const setMesas = (nuevasMesas: Mesa[]) => {
    mesas.value = nuevasMesas;
  };

  return { mesas, setMesas };
});

export const cargarMesasLibresApi = async () =>  {
  return await window.api.getMesasByEstado(EstadosMesa.LIBRE);
};
