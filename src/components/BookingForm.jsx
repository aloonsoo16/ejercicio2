"use client";

import { useState, useEffect } from "react";
import { getServices } from "@/actions/services.action";
import { getAllBookings } from "@/actions/reservations.action";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function BookingForm() {
  const [services, setServices] = useState([]);
  const [reservations, setReservations] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoadingReservations(true);

      try {
        const servicesData = await getServices();
        setServices(servicesData);

        const reservationsData = await getAllBookings();
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }

      setLoadingReservations(false);
    }
    fetchData();
  }, [key]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/services/${serviceId}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, startTime }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setKey((prevKey) => prevKey + 1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error al hacer la reserva.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm lg:max-w-lg  bg-white p-6 rounded-lg max-h-[800px] overflow-y-scroll">
      <h2 className="text-lg font-bold  text-black mb-4">Reservar una cita</h2>

      {/* Formulario de reserva */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded border-zinc-200 text-black   placeholder:text-zinc-600"
          required
        />
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded border-zinc-200 placeholder:text-zinc-600  text-black"
          required
        />
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="w-full p-2 border rounded border-zinc-200  placeholder:text-zinc-600 text-black"
          required
        >
          <option value="">Selecciona un servicio</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.id} - {service.name} | {service.duration} minutos
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded  placeholder:text-zinc-600 border-zinc-200 text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center text-white">
              <Loader className="animate-spin" size={20} />
            </div>
          ) : (
            "Reservar cita"
          )}
        </button>
      </form>

      {/* Lista de reservas */}
      <h2 className="text-lg font-bold text-black mt-8 mb-4">
        Reservas realizadas
      </h2>
      {loadingReservations ? (
        <div className="flex justify-center text-black">
          <Loader className="animate-spin" size={20} />
        </div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className="p-4 border border-zinc-400 rounded text-black"
            >
              <p>
                🧑 {reservation.user?.name} ({reservation.user?.email})
              </p>
              <p>
                🛠 {reservation.service?.name} - ⏳{" "}
                {reservation.service?.duration} minutos
              </p>
              <p>
                📅 {new Date(reservation.startTime).toLocaleString()} |{" "}
                {new Date(reservation.endTime).toLocaleString()}{" "}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
