'use client';
 
import Layout from '@/app/components/Layout';
 
export default function PuntoFisicoPage() {
  return (
    <Layout>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Punto Físico</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Gestión de tu local o punto de venta presencial</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 border-t border-gray-200" />
      </div>
 
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
 
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            Próximamente
          </div>
 
          <h2 className="text-xl font-bold text-gray-900 mb-3">Aún no se ha establecido un punto físico</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Cuando tengas un local, bodega o punto de venta presencial, esta sección te permitirá
            registrar su dirección, horarios de atención, información de contacto y gestionar
            el inventario de cada sucursal de forma independiente.
          </p>
 
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: '📍', label: 'Dirección y mapa' },
              { icon: '🕐', label: 'Horarios de atención' },
              { icon: '📦', label: 'Inventario por local' },
              { icon: '📞', label: 'Contacto directo' },
            ].map((f) => (
              <div key={f.label} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
                <span className="text-lg">{f.icon}</span>
                <p className="text-xs text-gray-500 text-left">{f.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Funciones planificadas</p>
        </div>
      </div>
    </Layout>
  );
}
 