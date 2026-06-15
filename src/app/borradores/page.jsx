'use client';
 
import Layout from '@/app/components/Layout';
 
export default function BorradoresPage() {
  return (
    <Layout>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Borradores</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Pedidos, clientes y productos sin confirmar</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 border-t border-gray-200" />
      </div>
 
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
 
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            Próximamente
          </div>
 
          <h2 className="text-xl font-bold text-gray-900 mb-3">Los borradores están en pausa</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Esta sección permitirá guardar clientes, pedidos y productos como borradores antes de confirmarlos.
            Mientras tanto, puedes crear todo directamente desde sus respectivas secciones.
          </p>
 
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/agregar-cliente"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Agregar cliente
            </a>
            <a
              href="/agregar-pedido"
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Crear pedido
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}