import { useEffect, useState } from 'react'
import './App.css'
import CasosNuevos from './CasosNuevos.jsx'
import GeneradorSorpresa from './GeneradorSorpresa.jsx'

const lesiones = [
  { id:'MSP-001', nombre:'Hematoma / equimosis', categoria:'Traumáticas', emoji:'🟣', activo:true },
  { id:'MSP-002', nombre:'Laceración', categoria:'Traumáticas', emoji:'🩹', activo:true },
  { id:'MSP-003', nombre:'Quemadura', categoria:'Térmicas', emoji:'🔥', activo:true },
  { id:'MSP-004', nombre:'Pápula', categoria:'Primarias', emoji:'🔬', activo:true },
  { id:'MSP-005', nombre:'Pústula', categoria:'Primarias', emoji:'🧫', activo:true },
  { id:'MSP-006', nombre:'Mácula', categoria:'Primarias', emoji:'🔎', activo:true },
  { id:'MSP-007', nombre:'Vesícula', categoria:'Primarias', emoji:'💧', activo:true },
  { id:'MSP-008', nombre:'Nevo', categoria:'Pigmentadas', emoji:'🧬', activo:true },
]

const entrevista = [
  { pregunta: '¿Qué te trae hoy a consulta?', respuesta: 'Me salió una mancha morada en el antebrazo y me preocupa. También me duele un poquito.' },
  { pregunta: '¿Cómo ocurrió la lesión?', respuesta: 'Ayer, hace unas 24 horas, me golpeé el antebrazo contra una puerta. Después apareció la mancha.' },
  { pregunta: '¿Qué tanto te duele y cómo ha cambiado?', respuesta: 'Es un dolor leve, como 2 de 10. No ha empeorado desde ayer.' },
  { pregunta: '¿Tienes hormigueo, debilidad o dificultad para mover la mano?', respuesta: 'No, puedo mover la mano y los dedos con normalidad. No tengo hormigueo ni adormecimiento.' },
  { pregunta: '¿Tomas anticoagulantes u otros medicamentos?', respuesta: 'No tomo anticoagulantes ni ningún medicamento de forma habitual.' },
  { pregunta: '¿Has tenido fiebre, heridas o moretones sin golpearte?', respuesta: 'No tengo fiebre ni heridas abiertas. Tampoco me suelen aparecer moretones sin razón.' },
]

const zonasExploracion = [
  { id:'lesion', nombre:'Observar la lesión', icono:'🔎', hallazgo:'Equimosis violácea plana de aproximadamente 3 cm. La piel está íntegra, sin vesículas ni secreción.', detalle:'Inspección' },
  { id:'dolor', nombre:'Palpar el antebrazo', icono:'🖐️', hallazgo:'Dolor leve localizado (2/10), sin aumento importante de volumen ni deformidad evidente.', detalle:'Palpación' },
  { id:'movilidad', nombre:'Comprobar movilidad', icono:'💪', hallazgo:'Movilidad activa de muñeca y dedos conservada, sin limitación significativa.', detalle:'Función' },
  { id:'sensibilidad', nombre:'Evaluar sensibilidad', icono:'✋', hallazgo:'Sensibilidad distal conservada. No hay hormigueo ni adormecimiento.', detalle:'Neurológico' },
  { id:'perfusion', nombre:'Revisar perfusión distal', icono:'❤️', hallazgo:'Mano tibia, coloración habitual y relleno capilar menor de 2 segundos.', detalle:'Vascular' },
]

const etapas = ['Entrevista', 'Exploración', 'Diagnóstico', 'Decisiones', 'Resultados']
const preguntas = [
  { etapa:0, titulo:'¿Qué dato conviene investigar primero?', opciones:['Su comida favorita','Cómo ocurrió el golpe y si toma anticoagulantes','Su color favorito'], correcta:1, explicacion:'El mecanismo, la intensidad del traumatismo y el uso de anticoagulantes ayudan a valorar riesgo de sangrado y lesiones asociadas.' },
  { etapa:0, titulo:'¿Qué síntoma sería importante descartar?', opciones:['Dolor creciente, hormigueo o pérdida de fuerza','Tener sueño después de estudiar','Preferencia por bebidas frías'], correcta:0, explicacion:'El dolor desproporcionado y las alteraciones neurológicas o vasculares requieren una valoración cuidadosa.' },
  { etapa:1, titulo:'¿Qué aspecto es más compatible con equimosis?', opciones:['Vesículas agrupadas','Área violácea plana con piel íntegra','Pústula con contenido purulento'], correcta:1, explicacion:'La equimosis corresponde a extravasación de sangre en tejidos, visible como una zona de coloración violácea sin relieve importante.' },
  { etapa:1, titulo:'¿Qué debes valorar en la exploración?', opciones:['Solo el color de la lesión','Solo la temperatura corporal','Dolor, edema, movilidad, sensibilidad y perfusión distal'], correcta:2, explicacion:'Una exploración neurovascular distal y funcional ayuda a detectar lesiones que requieren mayor atención.' },
  { etapa:2, titulo:'¿Cuál es el diagnóstico más probable?', opciones:['Equimosis postraumática','Herpes simple','Impétigo'], correcta:0, explicacion:'El antecedente de golpe, la piel íntegra y la coloración violácea localizada apoyan el diagnóstico de equimosis postraumática.' },
  { etapa:3, titulo:'¿Qué conducta inicial es apropiada si no hay signos de alarma?', opciones:['Masajear vigorosamente la zona','Reposo relativo, frío protegido y vigilancia','Aplicar calor intenso inmediatamente'], correcta:1, explicacion:'En una contusión leve pueden emplearse reposo relativo y compresas frías protegidas durante periodos cortos; se vigila la evolución.' },
  { etapa:3, titulo:'¿Qué hallazgo amerita valoración urgente?', opciones:['Cambio gradual de color durante la resolución','Dolor leve que mejora','Dolor intenso progresivo, adormecimiento o extremidad fría'], correcta:2, explicacion:'El dolor intenso progresivo y los signos neurovasculares pueden indicar una complicación y requieren atención urgente.' },
]


const decisionesClinicas = [
  {
    titulo:'Primera decisión · Manejo inicial',
    contexto:'Alex presenta una contusión leve, con piel íntegra y sin signos de alarma.',
    opciones:[
      {texto:'Reposo relativo, frío protegido por periodos cortos y vigilancia',segura:true,resultado:'Alex comprende las indicaciones. Se espera una mejoría gradual del dolor y la coloración durante los días siguientes.',explicacion:'El manejo conservador es razonable para una contusión leve sin datos de alarma.'},
      {texto:'Masajear vigorosamente la zona para dispersar el hematoma',segura:false,resultado:'Alex refiere mayor molestia tras el masaje. Es necesario corregir la indicación.',explicacion:'El masaje vigoroso puede aumentar el dolor y la irritación local; no se recomienda.'},
      {texto:'Aplicar calor intenso inmediatamente sobre la lesión',segura:false,resultado:'Alex refiere incomodidad con el calor. Se suspende esa indicación.',explicacion:'El calor intenso no es el manejo inicial apropiado de una contusión reciente.'}
    ]
  },
  {
    titulo:'Segunda decisión · Orientación al paciente',
    contexto:'Alex pregunta qué hacer en casa y cómo reconocer una complicación.',
    opciones:[
      {texto:'Explicar cuidados, evolución esperada y signos de alarma',segura:true,resultado:'Alex puede repetir las indicaciones y sabe cuándo solicitar una nueva valoración.',explicacion:'Una explicación clara y las indicaciones de retorno mejoran la seguridad del paciente.'},
      {texto:'Decirle que cualquier moretón es inofensivo y no necesita vigilancia',segura:false,resultado:'Alex se queda sin información para reconocer complicaciones.',explicacion:'Aunque el cuadro sea leve, deben explicarse signos de alarma y seguimiento según la evolución.'},
      {texto:'Recomendar medicamentos anticoagulantes para eliminar la mancha',segura:false,resultado:'La recomendación se detiene antes de administrarse.',explicacion:'Los anticoagulantes no tratan una equimosis traumática y pueden aumentar el riesgo de sangrado.'}
    ]
  },
  {
    titulo:'Tercera decisión · Cambio inesperado',
    contexto:'Escenario hipotético: al día siguiente Alex comunica dolor intenso progresivo, adormecimiento y mano fría.',
    opciones:[
      {texto:'Indicar valoración médica urgente por posibles signos neurovasculares',segura:true,resultado:'Alex es enviado a valoración urgente para descartar una complicación.',explicacion:'El dolor progresivo y los cambios de sensibilidad o perfusión son signos de alarma.'},
      {texto:'Esperar varios días sin revisión porque todos los hematomas son iguales',segura:false,resultado:'Se retrasa la atención ante signos de alarma.',explicacion:'Los signos neurovasculares nuevos requieren evaluación urgente.'},
      {texto:'Masajear más fuerte y continuar las actividades normales',segura:false,resultado:'La recomendación no atiende la posible complicación.',explicacion:'Ante signos de alarma, la prioridad es la valoración urgente, no el masaje.'}
    ]
  }
]

function App() {
  const params = new URLSearchParams(window.location.search)
  const [seleccionada, setSeleccionada] = useState(params.get('caso') === 'MSP-001' ? lesiones[0] : null)
  const [busqueda, setBusqueda] = useState('')
  const [modoSorpresa, setModoSorpresa] = useState(false)
  const [preguntasPaciente, setPreguntasPaciente] = useState([])
  const [zonasRevisadas, setZonasRevisadas] = useState([])
  const [zonaActiva, setZonaActiva] = useState(null)
  const [evidencias, setEvidencias] = useState([])
  const [hipotesis, setHipotesis] = useState(null)
  const [justificacion, setJustificacion] = useState(null)
  const [etapa, setEtapa] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [reveladas, setReveladas] = useState({})
  const [pistas, setPistas] = useState({})
  const [segundos, setSegundos] = useState(300)
  const [relojActivo, setRelojActivo] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const [decisiones, setDecisiones] = useState({})
  const [record, setRecord] = useState(() => {
    try { return Number(window.localStorage.getItem('medsimpatch-record-MSP-001') || 0) } catch { return 0 }
  })
  const [fotoAlexError, setFotoAlexError] = useState(false)
  const [casoNuevo, setCasoNuevo] = useState(() => { const id = params.get('caso'); return id && id !== 'MSP-001' && lesiones.some(l=>l.id===id) ? id : null })

  useEffect(() => {
    if (!relojActivo || terminado || !seleccionada) return
    const timer = setInterval(() => setSegundos(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [relojActivo, terminado, seleccionada])

  function abrir(lesion) {
    if (!lesion.activo) return
    if (lesion.id !== 'MSP-001') { setCasoNuevo(lesion.id); window.history.replaceState({}, '', `?caso=${lesion.id}`); window.scrollTo({top:0,behavior:'smooth'}); return }
    setSeleccionada(lesion); setFotoAlexError(false); setPreguntasPaciente([]); setZonasRevisadas([]); setZonaActiva(null); setEvidencias([]); setHipotesis(null); setJustificacion(null); setDecisiones({}); setEtapa(0); setRespuestas({}); setReveladas({}); setPistas({}); setSegundos(300); setRelojActivo(false); setTerminado(false)
    window.history.replaceState({}, '', `?caso=${lesion.id}`)
    window.scrollTo({top:0, behavior:'smooth'})
  }
  function cerrar() { setModoSorpresa(false); setCasoNuevo(null); setSeleccionada(null); window.history.replaceState({}, '', window.location.pathname); window.scrollTo({top:0,behavior:'smooth'}) }
  const entrevistaCompleta = preguntasPaciente.length >= 3
  const exploracionCompleta = zonasRevisadas.length >= 3
  const diagnosticoCompleto = evidencias.length >= 2 && hipotesis !== null && justificacion !== null
  const decisionesCompletas = decisionesClinicas.every((_,i) => decisiones[i] !== undefined)
  const decisionesSeguras = decisionesClinicas.filter((d,i) => decisiones[i] !== undefined && d.opciones[decisiones[i]].segura).length
  const seguridadPaciente = Math.round(decisionesSeguras / decisionesClinicas.length * 100)
  const pistasDiagnosticas = [
    {titulo:'Golpe hace 24 horas', detalle:'Antecedente traumático claro', clave:true},
    {titulo:'Lesión plana y violácea', detalle:'Piel íntegra, sin vesículas ni pus', clave:true},
    {titulo:'Sin alteración neurovascular', detalle:'Movilidad, sensibilidad y perfusión conservadas', clave:true},
    {titulo:'Color favorito del paciente', detalle:'No aporta al diagnóstico', clave:false}
  ]
  const diferenciales = [
    {nombre:'Equimosis postraumática', texto:'Sangre extravasada tras un golpe; piel íntegra y color violáceo', correcta:true},
    {nombre:'Herpes simple', texto:'Suele causar vesículas agrupadas sobre una base eritematosa', correcta:false},
    {nombre:'Impétigo', texto:'Infección superficial con costras o lesiones pustulosas', correcta:false}
  ]
  function explorar(id) { setZonaActiva(id); setZonasRevisadas(prev => prev.includes(id) ? prev : [...prev, id]) }
  const acertadas = preguntas.filter((p,i) => respuestas[i] === p.correcta).length
  const puntos = Math.max(0, acertadas * 100 - Object.values(pistas).filter(Boolean).length * 20 + decisionesSeguras * 50)
  const contestadasEtapa = preguntas.every((p,i) => p.etapa !== etapa || respuestas[i] !== undefined)
  const tiempo = `${String(Math.floor(segundos/60)).padStart(2,'0')}:${String(segundos%60).padStart(2,'0')}`
  const insignia = acertadas === preguntas.length && decisionesSeguras === 3 ? 'Excelencia clínica' : acertadas >= 5 && decisionesSeguras >= 2 ? 'Exploración destacada' : 'Práctica completada'
  const maxPuntos = preguntas.length * 100 + decisionesClinicas.length * 50
  const desempeno = Math.round(puntos / maxPuntos * 100)
  const evaluacion = [
    { titulo: 'Entrevista clínica', valor: `${preguntasPaciente.length}/6 preguntas`, descripcion: preguntasPaciente.length === 6 ? 'Historia clínica completa.' : 'Puedes interrogar más aspectos en tu próximo intento.' },
    { titulo: 'Exploración física', valor: `${zonasRevisadas.length}/5 zonas`, descripcion: zonasRevisadas.length === 5 ? 'Exploración completa.' : 'Revisar todas las zonas ayuda a obtener más información.' },
    { titulo: 'Razonamiento diagnóstico', valor: hipotesis === 0 && justificacion === 0 ? 'Hipótesis sustentada' : 'Requiere repaso', descripcion: hipotesis === 0 && justificacion === 0 ? 'Relacionaste traumatismo, coloración y piel íntegra.' : 'Revisa las pistas y los diagnósticos diferenciales.' },
    { titulo: 'Seguridad del paciente', valor: `${decisionesSeguras}/3 seguras`, descripcion: decisionesSeguras === 3 ? 'Identificaste el manejo y los signos de alarma.' : 'Revisa las consecuencias de cada decisión.' }
  ]
  useEffect(() => {
    if (!terminado || !seleccionada || puntos <= record) return
    setRecord(puntos)
    try { window.localStorage.setItem('medsimpatch-record-MSP-001', String(puntos)) } catch { /* El juego sigue funcionando si el navegador bloquea el almacenamiento. */ }
  }, [terminado, seleccionada, puntos, record])

  return <div className={`app ${(seleccionada || casoNuevo || modoSorpresa) ? "jugando" : ""}`}>
    <header className="barra"><div className="marca">MEDSIM<span>PATCH</span> <small>CLINICAL CHALLENGE</small></div><div className="version">SIMULACIÓN CLÍNICA INTERACTIVA</div></header>
    <main className="contenedor">
      {!seleccionada && !modoSorpresa && <section className="hero"><div className="msp-mascota" aria-label="Mascota MedSimPatch saludando"><img className="msp-mascota-imagen" src="/medsimpatch-mascota-hd.png" alt="Mascota de MedSimPatch" /><span className="msp-saludo">¡Hola, futuro doctor! <span aria-hidden="true">✦</span></span></div><div className="eyebrow">MEDSIMPATCH / LABORATORIO CLÍNICO</div><h1>Aprende a observar. Practica cómo decidir.</h1><p>Una experiencia clínica interactiva para estudiantes de medicina. Explora lesiones, entrevista pacientes y fortalece tu razonamiento con casos que evolucionan según tus decisiones.</p><div className="hero-pills"><span>CASOS INTERACTIVOS</span><span>PUNTUACIÓN</span><span>RECONOCIMIENTOS</span></div></section>}
      {!seleccionada && !modoSorpresa && <section className="biblioteca"><div className="seccion-titulo"><h2>Biblioteca de lesiones</h2><span>8 expedientes · 8 misiones disponibles</span></div><input aria-label="Buscar lesiones" placeholder="Buscar una lesión..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} /><div className="catalogo">{lesiones.filter(l=>l.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(l=><button key={l.id} className={'tarjeta '+(l.activo?'disponible':'')} onClick={()=>abrir(l)} disabled={!l.activo}><div className="emoji" aria-hidden="true">{l.id.slice(-2)}</div><strong>{l.nombre}</strong><small>{l.categoria}</small><span>{l.activo?'Abrir expediente →':'Próximamente'}</span></button>)}</div></section>}
      {!seleccionada && !casoNuevo && !modoSorpresa && <section className="sorpresa-banner"><div><div className="eyebrow">NUEVO · RETO DINÁMICO</div><h2>¿Te atreves con un caso sorpresa?</h2><p>Pacientes ficticios distintos, 12 escenarios clínicos y tres niveles de dificultad.</p></div><button onClick={()=>{setModoSorpresa(true);window.scrollTo({top:0,behavior:"smooth"})}}>✦ Generar caso sorpresa →</button></section>}
      {modoSorpresa && <GeneradorSorpresa volver={cerrar} />}
      {casoNuevo && <CasosNuevos key={casoNuevo} id={casoNuevo} volver={cerrar} />}
      {seleccionada && <section className="simulador" id="caso"><div className="sim-top"><div className="sim-identidad"><img className="sim-foto-alex" src="/alex-retrato.jpg" alt="Alex, paciente del caso clínico" onError={e=>{e.currentTarget.style.display="none"}} /><div><div className="eyebrow">EXPEDIENTE MSP-001 · NIVEL 01</div><h2>El misterio de la mancha violeta</h2><p>Alex, 22 años · Contusión en antebrazo</p></div></div><button className="cerrar" onClick={cerrar}>Cerrar caso ×</button></div>
        <div className="alex-dashboard">
          <div className="alex-perfil"><img src="/alex-retrato.jpg" alt="Retrato ilustrativo de Alex, paciente simulado"/><div className="alex-perfil-info"><span className="eyebrow">PACIENTE SIMULADO · MSP-001</span><h3>Conoce a Alex</h3><p className="alex-cita">“Me salió una mancha morada en el antebrazo y me preocupa. También me duele un poquito.”</p><div className="alex-datos"><span>22 años</span><span>Golpe hace 24 h</span><span>Dolor 2/10</span><span>Sin anticoagulantes</span></div></div></div>
          <div className="alex-evidencia"><div className="eyebrow">EVIDENCIA CLÍNICA · 01</div><img src="/equimosis-referencia.jpg" alt="Imagen ilustrativa generada de una equimosis violácea en un antebrazo"/><p>Imagen ilustrativa generada para simulación educativa; no corresponde a una fotografía clínica real.</p></div>
        </div>
        <div className="marcadores"><div><span className="metrica-nombre">PUNTOS</span> <b>{puntos}</b></div><div><span className="metrica-nombre">TIEMPO</span> <b>{tiempo}</b> {relojActivo?'restantes':'disponibles'}</div><div><span className="metrica-nombre">ACIERTOS</span> <b>{acertadas}/{preguntas.length}</b></div></div>
        {!relojActivo && !terminado && <div className="aviso">El cronómetro es opcional: puedes practicar sin presión. <button onClick={()=>setRelojActivo(true)}>Activar reto de 5 minutos</button></div>}
        {segundos === 0 && relojActivo && <div className="aviso">¡Tiempo agotado! Puedes continuar para aprender, pero el reloj ya terminó.</div>}
        <div className="mision-progreso" aria-label={`Progreso de la misión: etapa ${etapa+1} de 5`}><div style={{width:`${(etapa+1)*20}%`}} /></div><div className="etapas">{etapas.map((e,i)=><button key={e} className={i===etapa?'activa':''} onClick={()=>setEtapa(i)} disabled={(i>etapa && !terminado) || (i===1 && !entrevistaCompleta)}>{i<etapa ? "✓" : i+1}. {e}</button>)}</div>
        {etapa === 0 && <div className="entrevista-panel">
          <div className="entrevista-encabezado"><div className="avatar-paciente" aria-hidden="true">{!fotoAlexError ? <img src="/alex-retrato.jpg" alt="" onError={()=>setFotoAlexError(true)} /> : "A"}</div><div><div className="eyebrow">PACIENTE / CONSULTORIO 01</div><h3>Alex, 22 años</h3><p>Motivo de consulta: lesión violácea en el antebrazo. Elige preguntas para obtener la historia clínica.</p></div></div>
          <div className="progreso-entrevista">Preguntas realizadas: {preguntasPaciente.length} de {entrevista.length} · {entrevistaCompleta ? 'Ya puedes resolver los desafíos' : 'Realiza al menos 3 para continuar'}</div>
          <div className="dialogo-clinico" aria-live="polite">
            <div className="mensaje-paciente"><strong>Paciente</strong><p>Hola. Me preocupa esta mancha que me salió en el brazo. ¿Podría ayudarme?</p></div>
            {preguntasPaciente.map(i => <div className="intercambio" key={i}><div className="mensaje-medico"><strong>Tú</strong><p>{entrevista[i].pregunta}</p></div><div className="mensaje-paciente"><strong>Paciente</strong><p>{entrevista[i].respuesta}</p></div></div>)}
          </div>
          <h4>Elige tu siguiente pregunta</h4>
          <div className="preguntas-entrevista">{entrevista.map((item,i)=><button key={i} disabled={preguntasPaciente.includes(i)} onClick={()=>setPreguntasPaciente(prev=>[...prev,i])}>{preguntasPaciente.includes(i) ? '✓ Pregunta realizada' : item.pregunta}</button>)}</div>
          {!entrevistaCompleta && <p className="ayuda-entrevista">Investiga el mecanismo del golpe, el dolor y posibles signos de alarma. Después aparecerán los desafíos.</p>}
        </div>}
        {etapa === 1 && <div className="exploracion-panel">
          <div className="exploracion-heading"><div><div className="eyebrow">CONSULTORIO 01 · EXPLORACIÓN</div><h3>Examina el antebrazo de Alex</h3><p>Selecciona los puntos del brazo o utiliza los botones de exploración. Cada maniobra revelará un hallazgo clínico.</p></div><span className="exploracion-contador">{zonasRevisadas.length}/{zonasExploracion.length} exploradas</span></div>
          <div className="exploracion-grid">
            <div className="brazo-interactivo" role="group" aria-label="Mapa interactivo de exploración del antebrazo">
              <svg viewBox="0 0 520 280" role="img" aria-label="Ilustración esquemática de antebrazo y mano con cinco puntos de exploración" className="brazo-svg">
                <defs><linearGradient id="piel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd6c1"/><stop offset="1" stopColor="#eeb69f"/></linearGradient><radialGradient id="equimosis"><stop offset="0" stopColor="#6c308f"/><stop offset="0.7" stopColor="#a35baf"/><stop offset="1" stopColor="#cda1cf" stopOpacity=".35"/></radialGradient></defs>
                <path d="M32 82 Q85 74 136 85 Q207 94 285 105 Q330 110 354 97 L379 74 Q395 59 406 74 L394 110 L430 74 Q449 57 457 74 L424 125 L466 95 Q483 84 492 101 L447 149 L479 131 Q495 125 502 143 Q501 153 480 166 L426 207 Q398 227 358 212 L286 185 Q210 176 134 184 Q75 190 32 194 Z" fill="url(#piel)" stroke="#c58e7f" strokeWidth="3"/>
                <ellipse cx="224" cy="138" rx="40" ry="25" fill="url(#equimosis)" transform="rotate(-9 224 138)"/>
                <path d="M44 111 Q125 103 174 117" fill="none" stroke="#fff" strokeOpacity=".32" strokeWidth="8" strokeLinecap="round"/>
                {zonasExploracion.map((z,i) => {const coords=[[224,138],[156,154],[366,174],[425,110],[465,156]]; const [cx,cy]=coords[i];return <g key={z.id} className={'punto-svg '+(zonaActiva===z.id?'punto-activo':'')} onClick={()=>explorar(z.id)} role="button" tabIndex="0" onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();explorar(z.id)}}} aria-label={z.nombre}>
                  <circle cx={cx} cy={cy} r="19" fill={zonasRevisadas.includes(z.id)?'#43ae89':'#ef6486'} stroke="white" strokeWidth="4"/><text x={cx} y={cy+6} textAnchor="middle" fontSize="17" fontWeight="bold" fill="white">{zonasRevisadas.includes(z.id)?'✓':i+1}</text>
                </g>})}
              </svg>
              <p>Ilustración educativa esquemática · Pulsa un punto para explorar</p>
            </div>
            <div className="exploracion-opciones"><h4>Maniobras disponibles</h4>{zonasExploracion.map(z=><button key={z.id} className={'maniobra '+(zonaActiva===z.id?'seleccionada':'')} onClick={()=>explorar(z.id)}><span>{z.nombre}</span><small>{zonasRevisadas.includes(z.id)?'✓ Revisada':'Explorar →'}</small></button>)}</div>
          </div>
          <div className="hallazgo-box" aria-live="polite">{zonaActiva ? <><div className="eyebrow">HALLAZGO · {zonasExploracion.find(z=>z.id===zonaActiva).detalle}</div><h4>{zonasExploracion.find(z=>z.id===zonaActiva).nombre}</h4><p>{zonasExploracion.find(z=>z.id===zonaActiva).hallazgo}</p></> : <><h4>Comienza la exploración</h4><p>Selecciona una zona del brazo para descubrir qué encuentras en la valoración física.</p></>}</div>
          <p className="progreso-exploracion">{exploracionCompleta ? 'Ya tienes suficientes hallazgos para resolver los desafíos.' : `Explora al menos 3 zonas diferentes para continuar (${zonasRevisadas.length}/3).`}</p>
        </div>}
        {etapa === 2 && <div className="diagnostico-panel">
          <div className="diagnostico-cabecera"><span className="eyebrow">ETAPA 03 · RAZONAMIENTO CLÍNICO</span><h3>Descifra el diagnóstico</h3><p>Selecciona al menos dos pistas relevantes, compara tres diagnósticos y justifica tu decisión. Después podrás resolver el desafío de esta etapa.</p></div>
          <div className="barra-progreso"><div style={{width:`${(Number(evidencias.length>=2)+Number(hipotesis!==null)+Number(justificacion!==null))/3*100}%`}} /></div>
          <div className="diagnostico-paso"><h4>1. Selecciona las pistas que apoyan tu hipótesis <small>({evidencias.length} seleccionadas)</small></h4><div className="evidencias-grid">{pistasDiagnosticas.map((p,i)=><button key={i} className={'evidencia '+(evidencias.includes(i)?'elegida':'')} onClick={()=>setEvidencias(prev=>prev.includes(i)?prev.filter(x=>x!==i):[...prev,i])}><strong>{evidencias.includes(i)?'✓ ':'○ '}{p.titulo}</strong><span>{p.detalle}</span></button>)}</div></div>
          {evidencias.length>=2 && <div className="diagnostico-paso"><h4>2. Elige el diagnóstico más probable</h4><div className="diferenciales-grid">{diferenciales.map((d,i)=><button key={i} className={'diferencial '+(hipotesis===i?'elegida':'')} onClick={()=>{setHipotesis(i);setJustificacion(null)}}><strong>{d.nombre}</strong><span>{d.texto}</span></button>)}</div></div>}
          {hipotesis!==null && <div className="diagnostico-paso"><h4>3. ¿Qué razonamiento sostiene tu elección?</h4><div className="razones-grid">{['Antecedente de traumatismo, mancha violácea plana y piel íntegra','La presencia de vesículas agrupadas','Una infección purulenta de la piel'].map((r,i)=><button key={i} className={'razon '+(justificacion===i?'elegida':'')} onClick={()=>setJustificacion(i)}>{String.fromCharCode(65+i)}. {r}</button>)}</div></div>}
          {diagnosticoCompleto && <div className={'dictamen '+(hipotesis===0&&justificacion===0?'dictamen-correcto':'dictamen-revisar')}><strong>{hipotesis===0&&justificacion===0?'Razonamiento clínico correcto':'Revisa tus hipótesis'}</strong><p>{hipotesis===0&&justificacion===0?'El golpe reciente, la lesión plana violácea y la piel íntegra son compatibles con equimosis postraumática. La exploración neurovascular conservada es tranquilizadora, aunque siempre deben vigilarse signos de alarma.':'Compara los hallazgos: no se describen vesículas ni costras purulentas. Puedes cambiar tu selección antes de contestar el desafío.'}</p><p><strong>Pistas relevantes:</strong> {evidencias.filter(i=>pistasDiagnosticas[i].clave).length} de {evidencias.length} seleccionadas.</p></div>}
          {!diagnosticoCompleto && <p className="progreso-diagnostico">Completa los tres pasos para desbloquear el desafío diagnóstico.</p>}
        </div>}
        {etapa === 3 && <div className="decisiones-panel">
          <div className="eyebrow">ETAPA 04 · SEGURIDAD DEL PACIENTE</div>
          <h3>Tus decisiones importan</h3>
          <p className="decisiones-intro">Resuelve tres situaciones clínicas. Cada decisión segura suma 50 puntos adicionales. Las consecuencias son simuladas con fines educativos.</p>
          <div className="seguridad-medidor"><div><strong>Seguridad del paciente</strong><span>{Object.keys(decisiones).length}/3 decisiones · {decisionesSeguras} seguras</span></div><div className="seguridad-barra"><div style={{width:`${seguridadPaciente}%`}} /></div></div>
          {decisionesClinicas.map((caso,i) => {
            const bloqueada = i > 0 && decisiones[i-1] === undefined
            const eleccion = decisiones[i]
            const opcion = eleccion === undefined ? null : caso.opciones[eleccion]
            return <div className={'decision-escena '+(bloqueada?'decision-bloqueada':'')} key={i}>
              <div className="decision-titulo"><span>ESCENA {i+1} DE 3</span><h4>{caso.titulo}</h4></div>
              <p className="decision-contexto">{caso.contexto}</p>
              {bloqueada ? <p className="decision-candado">Completa la escena anterior para desbloquear esta decisión.</p> : <>
                <div className="decision-opciones">{caso.opciones.map((op,j)=><button key={j} disabled={eleccion !== undefined} className={eleccion===j?'decision-elegida':''} onClick={()=>setDecisiones(prev=>({...prev,[i]:j}))}><span>{String.fromCharCode(65+j)}.</span>{op.texto}</button>)}</div>
                {opcion && <div className={'evolucion '+(opcion.segura?'evolucion-segura':'evolucion-alerta')} aria-live="polite"><strong>{opcion.segura?'Decisión segura · +50 puntos':'Decisión que requiere corregirse'}</strong><p><b>¿Qué sucede con Alex?</b> {opcion.resultado}</p><p><b>Explicación clínica:</b> {opcion.explicacion}</p></div>}
              </>}
            </div>
          })}
          {decisionesCompletas && <div className="decision-resumen"><strong>Simulación completada: {decisionesSeguras}/3 decisiones seguras.</strong><p>Ahora responde los dos desafíos de manejo para desbloquear tus resultados.</p></div>}
        </div>}
        {(etapa === 0 ? entrevistaCompleta : etapa === 1 ? exploracionCompleta : etapa === 2 ? diagnosticoCompleto : etapa === 3 ? decisionesCompletas : true) && etapa < 4 && <div className="preguntas">{preguntas.map((p,i)=>p.etapa!==etapa?null:<div className="pregunta" key={i}><div className="pregunta-head"><span>DESAFÍO {i+1}</span><button onClick={()=>setPistas(x=>({...x,[i]:true}))} disabled={pistas[i] || respuestas[i]!==undefined}>{pistas[i]?'Pista utilizada':'Solicitar pista (−20 puntos)'}</button></div><h3>{p.titulo}</h3>{pistas[i] && <p className="pista">Pista: analiza la historia, los hallazgos y los posibles signos de alarma.</p>}<div className="opciones">{p.opciones.map((op,j)=><button key={j} disabled={respuestas[i]!==undefined} className={respuestas[i]===j?(j===p.correcta?'correcta':'incorrecta'):''} onClick={()=>{setRespuestas(x=>({...x,[i]:j}));setReveladas(x=>({...x,[i]:true}))}}>{String.fromCharCode(65+j)}. {op}</button>)}</div>{reveladas[i] && <div className="explicacion"><strong>{respuestas[i]===p.correcta?'¡Correcto! +100 puntos':'Sigue aprendiendo'}</strong><p>{p.explicacion}</p></div>}</div>)}</div>}
        {etapa<4 && <div className="acciones"><button className="secundario" onClick={()=>setEtapa(x=>Math.max(0,x-1))} disabled={etapa===0}>← Anterior</button><button className="principal" disabled={!contestadasEtapa || (etapa===0 && !entrevistaCompleta) || (etapa===1 && !exploracionCompleta) || (etapa===2 && !diagnosticoCompleto) || (etapa===3 && !decisionesCompletas)} onClick={()=>{setEtapa(x=>Math.min(4,x+1)); window.scrollTo({top:0,behavior:"smooth"}); if(etapa===3){setTerminado(true);setRelojActivo(false)}}}>{etapa===3?'Ver mi resultado':'Siguiente etapa →'}</button></div>}
        {etapa===4 && <div className="resultados resultados-premium">
          <div className="resultado-hero">
            <span className="resultado-etiqueta">MEDSIMPATCH / MISIÓN 01 COMPLETADA</span>
            <div className="msp-celebracion"><img src="/medsimpatch-mascota-hd.png" alt="Mascota celebrando tu caso resuelto" /></div>
            <h2>¡Caso resuelto!</h2>
            <p className="resultado-subtitulo">Tu primera aventura clínica ha terminado. Así fue tu desempeño.</p>
            <div className="insignia-final"><span>INSIGNIA DESBLOQUEADA</span><strong>{insignia}</strong></div>
            <div className="puntos-final">{puntos.toLocaleString('es-MX')} <span>puntos</span></div>
            <p className="record-personal">Récord personal: {Math.max(record,puntos).toLocaleString('es-MX')} puntos {puntos >= record && puntos > 0 ? '· ¡Tu mejor marca!' : ''}</p>
          </div>
          <div className="resultado-metricas">
            <div><span>Respuestas correctas</span><strong>{acertadas}/{preguntas.length}</strong></div>
            <div><span>Decisiones seguras</span><strong>{decisionesSeguras}/3</strong></div>
            <div><span>Rendimiento en puntos</span><strong>{desempeno}%</strong></div>
          </div>
          <div className="resultado-progreso" role="progressbar" aria-label="Rendimiento de la misión" aria-valuenow={desempeno} aria-valuemin="0" aria-valuemax="100"><div style={{width:`${desempeno}%`}} /></div>
          <div className="expediente-final">
            <div className="expediente-encabezado"><span className="eyebrow">EXPEDIENTE CLÍNICO · MSP-001</span><h3>El caso de Alex</h3></div>
            <div className="expediente-cuerpo">
 <div className="retrato-alex">
  <img
    src="/alex-retrato.jpg"
    alt="Alex, paciente de 22 años"
  />
</div>
              <div className="expediente-datos"><h4>Alex · 22 años</h4><p><b>Motivo de consulta:</b> lesión violácea en antebrazo tras golpe hace 24 horas.</p><p><b>Diagnóstico del caso:</b> equimosis postraumática.</p><p><b>Conducta educativa:</b> reposo relativo, frío protegido por periodos cortos y vigilancia en ausencia de signos de alarma.</p><p><b>Signos de alarma:</b> dolor intenso progresivo, alteración de sensibilidad o mano fría requieren valoración urgente.</p></div>
            </div>
            <p className="expediente-aclaracion">La evolución que observaste es una simulación y depende de tus decisiones; no representa un desenlace clínico real.</p>
          </div>
          <div className="evaluacion-final"><div className="eyebrow">TU REPORTE DE APRENDIZAJE</div><h3>Tu expediente de desempeño</h3><div className="evaluacion-grid">{evaluacion.map(item=><div className="evaluacion-item" key={item.titulo}><h4>{item.titulo}</h4><strong>{item.valor}</strong><p>{item.descripcion}</p></div>)}</div></div>
          <div className="resultado-acciones"><button className="principal" onClick={()=>abrir(lesiones[0])}>Volver a jugar</button><button className="secundario" onClick={cerrar}>Volver a la biblioteca</button></div>
          <p className="nota">MedSimPatch es una simulación educativa. No sustituye la valoración médica ni la supervisión clínica.</p>
        </div>}
      </section>}
    </main><footer>MEDSIM PATCH · Aprende con cada lesión · Contenido educativo</footer>
  </div>
}
export default App

