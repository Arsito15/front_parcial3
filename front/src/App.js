import React, { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState({ nombre: '', email: '', telefono: '' });
  const [tasks, setTasks] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Nuevo estado para el mensaje de éxito

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const createUser = async () => {
    try {
      const response = await fetch('https://prueba-oxte.onrender.com/api/usuarios/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Usuario creado exitosamente:', result);
        alert('Usuario creado exitosamente');
      } else {
        console.error('Error al crear el usuario:', response.statusText);
        alert('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    }
  };

  const addTask = () => {
    setTasks([...tasks, {
      titulo: '',
      descripcion: '',
      fecha_vencimiento: '',
      prioridad: 'media',
      asignado_a: '',
      categoria: '',
      costo_proyecto: 0.0
    }]);
  };

  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];
    newTasks[index][name] = value;
    setTasks(newTasks);
  };

  const createTask = async (index) => {
    const task = tasks[index];
    try {
      const response = await fetch('https://prueba-oxte.onrender.com/api/tareas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: task.titulo,
          descripcion: task.descripcion,
          fecha_vencimiento: task.fecha_vencimiento,
          prioridad: task.prioridad,
          asignado_a: task.asignado_a,
          categoria: task.categoria,
          costo_proyecto: parseFloat(task.costo_proyecto)
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Tarea creada exitosamente:', result);
        alert('Tarea creada exitosamente');
      } else {
        console.error('Error al crear la tarea:', response.statusText);
        alert('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const submitPayment = (index) => {
    console.log("Procesando pago para la tarea:", tasks[index]);
    console.log("Información de pago:", paymentInfo);

    // Mostrar mensaje de éxito
    setPaymentSuccess(true);
    
    // Limpiar el formulario de pago y ocultarlo
    setPaymentInfo({ cardNumber: '', expiry: '', cvv: '', cardHolder: '' });
    setShowPaymentForm(null);

    // Ocultar el mensaje de éxito después de 3 segundos
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="user-info">
          <h2>Ingresar Datos de Usuario</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={user.nombre}
            onChange={handleUserChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleUserChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={user.telefono}
            onChange={handleUserChange}
          />
          <button onClick={createUser} className="add-user-button">Crear Usuario</button>
        </div>

        <button onClick={addTask} className="add-task-button">Crear Tarea</button>

        {tasks.map((task, index) => (
          <div key={index} className="task-form">
            <h3>Tarea {index + 1}</h3>
            <input
              type="text"
              name="titulo"
              placeholder="Título de la Tarea"
              value={task.titulo}
              onChange={(e) => handleTaskChange(index, e)}
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={task.descripcion}
              onChange={(e) => handleTaskChange(index, e)}
            ></textarea>
            <input
              type="date"
              name="fecha_vencimiento"
              placeholder="Fecha de Vencimiento"
              value={task.fecha_vencimiento}
              onChange={(e) => handleTaskChange(index, e)}
            />
            <select
              name="prioridad"
              value={task.prioridad}
              onChange={(e) => handleTaskChange(index, e)}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
            <input
              type="text"
              name="asignado_a"
              placeholder="Asignado a:"
              value={task.asignado_a}
              onChange={(e) => handleTaskChange(index, e)}
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={task.categoria}
              onChange={(e) => handleTaskChange(index, e)}
            />
            <input
              type="number"
              step="0.01"
              name="costo_proyecto"
              placeholder="Costo del Proyecto"
              value={task.costo_proyecto}
              onChange={(e) => handleTaskChange(index, e)}
            />

            <button onClick={() => createTask(index)} className="create-task-button">
              Guardar Tarea
            </button>
            <button onClick={() => setShowPaymentForm(index)} className="pay-button">
              Pagar
            </button>

            {showPaymentForm === index && (
              <div className="payment-form">
                <h4>Información de Pago</h4>
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Nombre del Titular"
                  value={paymentInfo.cardHolder}
                  onChange={handlePaymentChange}
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Número de Tarjeta"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                />
                <input
                  type="text"
                  name="expiry"
                  placeholder="Fecha de Vencimiento (MM/AA)"
                  value={paymentInfo.expiry}
                  onChange={handlePaymentChange}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentChange}
                />
                <button onClick={() => submitPayment(index)}>Procesar Pago</button>
              </div>
            )}
          </div>
        ))}

        {/* Mostrar mensaje de éxito de pago */}
        {paymentSuccess && (
          <div className="payment-success">
            <p>¡Pago realizado con éxito!</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
