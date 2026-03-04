/**
 * PLAN DE ESTUDIOS COMPLETO: TS EN DESARROLLO WEB Y APLICACIONES DIGITALES
 * Basado en las correlatividades de las imágenes proporcionadas.
 */
const planEstudio = [
    {
        anio: "Primer Año",
        secciones: [
            { 
                nombre: "Anual", 
                materias: [
                    { id: 1, nombre: "Inglés I", correlativas: [] },
                    { id: 2, nombre: "Proyecto Integrador I", correlativas: [] }
                ] 
            },
            { 
                nombre: "1er Cuatrimestre", 
                materias: [
                    { id: 3, nombre: "Introducción a la Programación", correlativas: [] },
                    { id: 4, nombre: "Ética y Deontología Profesional", correlativas: [] },
                    { id: 5, nombre: "Bases de Datos", correlativas: [] },
                    { id: 6, nombre: "Ejercicio Profesional", correlativas: [] }
                ] 
            },
            { 
                nombre: "2do Cuatrimestre", 
                materias: [
                    { id: 7, nombre: "Programación Web I", correlativas: [3] },
                    { id: 8, nombre: "Programación I", correlativas: [3, 5] },
                    { id: 9, nombre: "Sistemas de Gestión de Contenidos", correlativas: [3] }
                ] 
            }
        ]
    },
    {
        anio: "Segundo Año",
        secciones: [
            { 
                nombre: "Anual", 
                materias: [
                    { id: 10, nombre: "Inglés II", correlativas: [1] },
                    { id: 11, nombre: "Proyecto Integrador II", correlativas: [1, 2, 6, 7, 8, 9] }
                ] 
            },
            { 
                nombre: "1er Cuatrimestre", 
                materias: [
                    { id: 12, nombre: "Programación Web II", correlativas: [1, 7, 8] },
                    { id: 13, nombre: "Desarrollo de Software", correlativas: [6, 8] },
                    { id: 14, nombre: "Programación II", correlativas: [1, 8] }
                ] 
            },
            { 
                nombre: "2do Cuatrimestre", 
                materias: [
                    { id: 15, nombre: "Aplicaciones para Móviles", correlativas: [12, 14] },
                    { id: 16, nombre: "Ciberseguridad", correlativas: [12, 14] },
                    { id: 17, nombre: "Testeador de Software", correlativas: [12, 13, 14] }
                ] 
            }
        ]
    },
    {
        anio: "Tercer Año",
        secciones: [
            { 
                nombre: "1er Cuatrimestre", 
                materias: [
                    { id: 18, nombre: "Emprendedurismo", correlativas: [] },
                    { id: 19, nombre: "Tecnología y Desarrollo", correlativas: [4, 6, 12, 13, 14] },
                    { id: 20, nombre: "Práctica Profesionalizante", correlativas: [10, 11, 12, 13, 14, 15, 16, 17] }
                ] 
            }
        ]
    }
];

// Gestión de Persistencia: Carga las materias guardadas en el navegador
let aprobadas = new Set(JSON.parse(localStorage.getItem('materiasAprobadas')) || []);

/**
 * Función auxiliar para encontrar la data de una materia por su ID
 */
function buscarMateriaPorId(id) {
    for (const anio of planEstudio) {
        for (const seccion of anio.secciones) {
            const m = seccion.materias.find(mat => mat.id === id);
            if (m) return m;
        }
    }
    return null;
}

/**
 * Dibuja la interfaz en el HTML
 */
function render() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Limpia el contenedor

    planEstudio.forEach(anioData => {
        // Crea la sección semántica para cada año
        const section = document.createElement('section');
        section.className = 'seccion-anio';

        let html = `<h2 class="titulo-anio">${anioData.anio}</h2>`;

        anioData.secciones.forEach(sec => {
            html += `<h3 class="titulo-cuatrimestre">${sec.nombre}</h3>`;
            html += `<div class="materias-grid">`;

            sec.materias.forEach(m => {
                // Revisa si TODAS las correlativas están en el Set de aprobadas
                const esHabilitada = m.correlativas.every(id => aprobadas.has(id));
                const estaAprobada = aprobadas.has(m.id);
                
                let claseEstado = estaAprobada ? 'aprobada' : (esHabilitada ? 'habilitada' : 'bloqueada');

                html += `
                    <div class="materia-card ${claseEstado}">
                        <input type="checkbox" ${estaAprobada ? 'checked' : ''} onchange="toggleMateria(${m.id})">
                        <div class="materia-info">
                            <span class="materia-nombre">${m.nombre}</span>
                            <span class="materia-meta">ID: ${m.id} ${m.correlativas.length ? '| Req: ' + m.correlativas.join(',') : ''}</span>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        });

        section.innerHTML = html;
        app.appendChild(section);
    });
}

/**
 * Lógica de selección con bloqueo de seguridad
 */
function toggleMateria(id) {
    const materia = buscarMateriaPorId(id);
    const yaEstabaAprobada = aprobadas.has(id);

    if (!yaEstabaAprobada) {
        // VALIDACIÓN: ¿Puede cursarla?
        const puedeAprobar = materia.correlativas.every(cId => aprobadas.has(cId));
        
        if (!puedeAprobar) {
            alert(`BLOQUEADO: No puedes marcar "${materia.nombre}" porque te faltan correlativas (${materia.correlativas.join(', ')}).`);
            render(); // Refresca para desmarcar el checkbox en la vista
            return;
        }
        aprobadas.add(id);
    } else {
        // Si el usuario desmarca una materia, se elimina del Set
        aprobadas.delete(id);
    }

    // Guarda en memoria local y vuelve a dibujar para actualizar colores
    localStorage.setItem('materiasAprobadas', JSON.stringify([...aprobadas]));
    render();
}

// Inicialización
render();

// script.js (añadir al final del archivo anterior)

async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración del título del PDF
    doc.setFontSize(18);
    doc.text("Reporte de Situación Académica", 20, 20);
    doc.setFontSize(12);
    doc.text("Carrera: TS en Desarrollo Web y Aplicaciones Digitales", 20, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 37);
    
    doc.line(20, 42, 190, 42); // Línea divisoria

    let y = 50;
    doc.setFontSize(14);
    doc.text("Materias Aprobadas:", 20, y);
    y += 10;
    
    doc.setFontSize(10);
    
    if (aprobadas.size === 0) {
        doc.text("- No hay materias registradas como aprobadas.", 25, y);
    } else {
        // Recorremos el plan para listar los nombres de las aprobadas
        planEstudio.forEach(anio => {
            anio.secciones.forEach(sec => {
                sec.materias.forEach(m => {
                    if (aprobadas.has(m.id)) {
                        doc.text(`[OK] ${m.nombre} (${anio.anio})`, 25, y);
                        y += 7;
                        
                        // Control de salto de página simple
                        if (y > 270) {
                            doc.addPage();
                            y = 20;
                        }
                    }
                });
            });
        });
    }

    // Pie de página
    doc.setFontSize(8);
    doc.text("Generado por el Sistema de Control de Correlatividades.", 20, 285);

    // Descargar el archivo
    doc.save("Mi_Progreso_Academico.pdf");
}

/**
 * Genera un reporte PDF profesional detallando el estado actual del alumno.
 * Incluye tanto lo aprobado como lo que el sistema habilita automáticamente.
 */
async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // --- ENCABEZADO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 54, 93); // Azul oscuro profesional
    doc.text("SITUACIÓN ACADÉMICA", 20, 20);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Carrera: Técnico Superior en Desarrollo Web y Aplicaciones Digitales", 20, 28);
    doc.text(`Fecha de emisión: ${new Date().toLocaleString()}`, 20, 34);
    
    doc.setDrawColor(200);
    doc.line(20, 40, 190, 40); // Línea divisoria

    let y = 50;

    // --- SECCIÓN 1: MATERIAS APROBADAS ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. MATERIAS APROBADAS", 20, y);
    y += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    let countAprobadas = 0;
    
    planEstudio.forEach(anio => {
        anio.secciones.forEach(sec => {
            sec.materias.forEach(m => {
                if (aprobadas.has(m.id)) {
                    doc.setTextColor(40, 167, 69); // Verde para aprobadas
                    doc.text(`[X] ${m.nombre}`, 25, y);
                    doc.setTextColor(150);
                    doc.text(`(${anio.anio})`, 140, y);
                    y += 7;
                    countAprobadas++;
                    if (y > 275) { doc.addPage(); y = 20; }
                }
            });
        });
    });

    if (countAprobadas === 0) {
        doc.text("No se registran materias aprobadas aún.", 25, y);
        y += 10;
    }

    y += 10; // Espaciado entre secciones

    // --- SECCIÓN 2: MATERIAS HABILITADAS PARA CURSAR ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("2. MATERIAS HABILITADAS PARA CURSAR", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);

    let countHabilitadas = 0;

    planEstudio.forEach(anio => {
        anio.secciones.forEach(sec => {
            sec.materias.forEach(m => {
                // Es habilitada si NO está aprobada PERO sus correlativas SÍ lo están
                const esHabilitada = m.correlativas.every(id => aprobadas.has(id));
                if (esHabilitada && !aprobadas.has(m.id)) {
                    doc.setTextColor(0, 123, 255); // Azul para habilitadas
                    doc.text(`[ ] ${m.nombre}`, 25, y);
                    doc.setTextColor(150);
                    doc.text(`(${anio.anio} - Requiere: ${m.correlativas.length ? m.correlativas.join(',') : 'Ninguna'})`, 140, y);
                    y += 7;
                    countHabilitadas++;
                    if (y > 275) { doc.addPage(); y = 20; }
                }
            });
        });
    });

    if (countHabilitadas === 0 && countAprobadas < 20) {
        doc.text("No hay nuevas materias habilitadas. Revisa tus correlativas pendientes.", 25, y);
    } else if (countAprobadas >= 20) {
        doc.setFont("helvetica", "bold");
        doc.text("¡Felicidades! Has completado todas las materias del plan.", 25, y);
    }

    // --- PIE DE PÁGINA ---
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Este documento es un reporte generado automáticamente y no tiene validez oficial legal.", 20, 285);

    // Guardar el PDF con nombre dinámico
    doc.save(`Reporte_Academico_${new Date().toISOString().slice(0,10)}.pdf`);
}