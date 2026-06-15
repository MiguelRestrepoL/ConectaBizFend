'use client';
 
import Layout from '@/app/components/Layout';
 
export default function TiendaOnlinePage() {
  return (
    <Layout>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Tienda Online</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Tu canal de ventas digital</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 border-t border-gray-200" />
      </div>
 
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
 
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            Próximamente
          </div>
 
          <h2 className="text-xl font-bold text-gray-900 mb-3">Aún no tienes una tienda online configurada</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tu tienda online te permitirá publicar productos, recibir pedidos directamente de tus clientes
            y gestionar tu catálogo de forma pública — sin necesidad de una plataforma externa.
            Estamos construyendo esto para ti.
          </p>
 
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5 text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lo que viene</p>
            <ul className="flex flex-col gap-2.5">
              {[
                'Catálogo público con URL personalizada',
                'Carrito de compras para tus clientes',
                'Integración directa con tus pedidos actuales',
                'Pasarela de pago (PSE, tarjeta, efectivo)',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-500">
                  <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}