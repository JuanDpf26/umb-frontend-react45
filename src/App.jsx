import { useEffect, useState } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const API = "https://umb-web-taller-1.onrender.com";

  // Mostrar mensajes dentro de la pantalla
  const notify = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 3000); // desaparece en 3s
  };

  const cargarTareas = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTareas(data);
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const crearTarea = async () => {
    if (!titulo.trim()) return notify("Ingrese un título válido.");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });

    const data = await res.json();
    notify(data.mensaje);

    setTitulo("");
    cargarTareas();
  };

  const eliminarTarea = async (id) => {
    const res = await fetch(`${API}?id=${id}`, { method: "DELETE" });

    const data = await res.json();
    notify(data.mensaje);

    cargarTareas();
  };

  const editarTarea = async (id) => {
    const nuevoTitulo = prompt("Nuevo título:");
    if (!nuevoTitulo || !nuevoTitulo.trim()) return;

    const res = await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, titulo: nuevoTitulo }),
    });

    const data = await res.json();
    notify(data.mensaje);

    cargarTareas();
  };

  const toggleCompletada = async (tarea) => {
    const res = await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: tarea.id,
        completada: tarea.completada == 1 ? 0 : 1,
      }),
    });

    const data = await res.json();
    notify(data.mensaje);
    cargarTareas();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Gestor de Tareas</h1>

      {/* Mensajes bonitos */}
      {mensaje && <div style={styles.mensaje}>{mensaje}</div>}

      {/* Crear tarea */}
      <div style={styles.form}>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Escribe una tarea"
          style={styles.input}
        />
        <button style={styles.botonCrear} onClick={crearTarea}>
          Crear
        </button>
      </div>

      {/* Lista */}
      <ul style={styles.lista}>
        {tareas.map((tarea) => (
          <li key={tarea.id} style={styles.item}>
            <span
              style={{
                ...styles.textoTarea,
                textDecoration: tarea.completada == 1 ? "line-through" : "none",
                color: tarea.completada == 1 ? "#888" : "black",
              }}
            >
              {tarea.completada == 1 ? "✔ " : "⏳ "}
              {tarea.titulo}
            </span>

            <div style={styles.botones}>
              <button
                style={styles.botonEditar}
                onClick={() => editarTarea(tarea.id)}
              >
                Editar
              </button>

              <button
                style={styles.botonToggle}
                onClick={() => toggleCompletada(tarea)}
              >
                {tarea.completada == 1 ? "Pendiente" : "Completada"}
              </button>

              <button
                style={styles.botonEliminar}
                onClick={() => eliminarTarea(tarea.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 🎨 ESTILOS BONITOS SIN CSS EXTERNO
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial",
  },
  titulo: {
    textAlign: "center",
    color: "#333",
  },
  mensaje: {
    background: "#4caf50",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  botonCrear: {
    padding: "10px 15px",
    background: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  lista: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    background: "#f9f9f9",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
  },
  textoTarea: {
    fontSize: "16px",
  },
  botones: {
    display: "flex",
    gap: "8px",
  },
  botonEditar: {
    background: "#ff9800",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  botonToggle: {
    background: "#673ab7",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  botonEliminar: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default App;
