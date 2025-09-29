
import React from "react";

export default function NewPassword() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f5f5]">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
				<h2 className="text-2xl font-extrabold text-[#9083D5] mb-4">Restablecer contraseña</h2>
				<p className="text-sm text-gray-600 mb-4">Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
				<input type="email" placeholder="tu@correo.com" className="w-full border rounded-lg px-3 py-2 mb-3" />
				<button className="w-full bg-violet-600 text-white rounded-lg px-4 py-2">Enviar enlace</button>
			</div>
		</div>
	);
}

