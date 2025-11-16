"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // npm install jspdf jspdf-autotable
import { FileDown } from "lucide-react";
import Button from "./Button";

export default function GuiaSeguimientoPDF({ order }) {

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Guía de Seguimiento de Pedido", 14, 20);
        doc.setFontSize(12);
        doc.text(`Pedido ID: ${order.id}`, 14, 30);
        doc.text(`Título: ${order.titulo}`, 14, 38);
        doc.text(`Estado: ${order.estado}`, 14, 46);
        doc.text(`Fecha de Entrega: ${new Date(order.fecha_entrega).toLocaleDateString()}`, 14, 54);

        doc.text("Información del Cliente", 14, 70);
        doc.setFontSize(11);
        const cliente = order.cliente || {};

        const persona = cliente.persona_juridica || cliente.persona_natural || {};

        const clientData = [
            ["Tipo Cliente", cliente.tipo_cliente || "—"],
            ["Nombre / Razón Social", persona.razon_social || persona.nombre || "—"],
            ["NIT / Documento", persona.nit || persona.documento || "—"],
            ["Correo", cliente.correo_electronico || "—"],
            ["Teléfono", `${cliente.codigo_pais_telefono || ""} ${cliente.numero_telefono || "—"}`],
            ["Dirección", cliente.direccion || "—"],
            ["Ciudad", cliente.ciudad || "—"],
            ["Departamento", cliente.departamento_estado || "—"],
            ["País", cliente.pais_residencia || "—"],
        ];

        autoTable(doc, {
            startY: 75,
            head: [["Campo", "Valor"]],
            body: clientData,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 150, 50] },
        });

        doc.text("Detalles del Pedido", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [["Campo", "Valor"]],
            body: [
                ["Descripción", order.descripcion || "—"],
                ["Monto sin IVA", `$${order.monto_recibido_sin_iva}`],
                ["Monto total pagado", `$${order.monto_total_pagado}`],
                ["Creado el", new Date(order.created_at).toLocaleString()],
            ],
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 150, 50] },
        });

        doc.text("Gracias por confiar en nosotros.", 14, doc.lastAutoTable.finalY + 20);
        doc.save(`Guia_Pedido_${order.id}.pdf`);
    };

    return (
        <Button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 rounded-lg px-5 py-2.5 
                     shadow-sm hover:shadow-md transition-all duration-200 font-medium
                     border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
            <FileDown size={18} className="text-white" />
            <span>Descargar Guía PDF</span>
        </Button>
    );

}


