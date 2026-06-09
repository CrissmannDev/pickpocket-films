

const { useState, useEffect } = React;


/* ═══════════════════════════════════════════════════════════
   COMPONENTE 1: ContactForm
   ═══════════════════════════════════════════════════════════ */
function ContactForm() {
  const [fields, setFields] = useState({
    nombre: '', email: '', tipo: '', mensaje: ''
  });
  const [errors, setErrors]   = useState({});
  const [enviado, setEnviado] = useState(false);
  const MAX_CHARS = 300;

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!fields.nombre.trim())
      e.nombre = 'El nombre es obligatorio';
    if (!fields.email.trim())
      e.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = 'Formato de correo inválido';
    if (!fields.mensaje.trim())
      e.mensaje = 'Contanos tu idea';
    else if (fields.mensaje.length > MAX_CHARS)
      e.mensaje = `Máximo ${MAX_CHARS} caracteres`;
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="form-success" id="formSuccess" style={{display:'block'}}>
        <div className="success-icon">✓</div>
        <div className="success-title">MENSAJE ENVIADO</div>
        <p className="success-msg">Gracias, {fields.nombre}. Te contactaremos pronto.</p>
      </div>
    );
  }

  const charsLeft = MAX_CHARS - fields.mensaje.length;

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      name="contacto"
      data-netlify="true"
    >
      <input type="hidden" name="form-name" value="contacto" />

      <div className="form-row">
        <div className="form-field">
          <label>Nombre *</label>
          <input type="text" name="nombre" placeholder="Nombre completo"
            value={fields.nombre} onChange={handleChange} />
          <div className="field-bar"></div>
          {errors.nombre && <p className="field-error">{errors.nombre}</p>}
        </div>
        <div className="form-field">
          <label>Empresa</label>
          <input type="text" name="empresa" placeholder="Nombre de la empresa" />
          <div className="field-bar"></div>
        </div>
      </div>

      <div className="form-field">
        <label>Correo electrónico *</label>
        <input type="text" name="email" placeholder="correo@ejemplo.com"
          value={fields.email} onChange={handleChange} />
        <div className="field-bar"></div>
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>

      <div className="form-field">
        <label>Tipo de proyecto</label>
        <select name="tipo" value={fields.tipo} onChange={handleChange}>
          <option value="" disabled>Selecciona una categoría</option>
          <option value="cortometraje">Cortometraje</option>
          <option value="documental">Documental</option>
          <option value="publicidad">Publicidad / Campaña</option>
          <option value="videoclip">Videoclip</option>
          <option value="otro">Otro</option>
        </select>
        <div className="field-bar"></div>
      </div>

      <div className="form-field">
        <label>Tu idea *</label>
        <textarea name="mensaje" rows="5"
          placeholder="Cuéntanos en qué estás pensando."
          value={fields.mensaje} onChange={handleChange} />
        <div className="field-bar"></div>
        <p style={{
          fontSize:'10px', textAlign:'right', marginTop:'4px',
          fontFamily:'var(--font-body)', letterSpacing:'0.05em',
          color: charsLeft < 50 ? 'var(--gold)' : 'var(--gray)',
          opacity: charsLeft < 50 ? 1 : 0.5
        }}>
          {fields.mensaje.length} / {MAX_CHARS}
        </p>
        {errors.mensaje && <p className="field-error">{errors.mensaje}</p>}
      </div>

      <div className="form-submit-row">
        <p className="form-note">Tu información es confidencial y nunca será compartida.</p>
        <button className="btn-submit" type="submit"
          disabled={fields.mensaje.length > MAX_CHARS}>
          Enviar mensaje <span className="btn-arrow">→</span>
        </button>
      </div>
    </form>
  );
}


/* ═══════════════════════════════════════════════════════════
   COMPONENTE 2: PortfolioFilter
   ═══════════════════════════════════════════════════════════ */
const PROYECTOS = [
  { id:1,  nombre:'UMBRAL',     categoria:'cortometraje', año:2024, ytId:'' },
  { id:2,  nombre:'NORDIC',     categoria:'publicidad',   año:2024, ytId:'' },
  { id:3,  nombre:'TIERRA',     categoria:'documental',   año:2023, ytId:'' },
  { id:4,  nombre:'FIEBRE',     categoria:'videoclip',    año:2024, ytId:'' },
  { id:5,  nombre:'ATLAS CO.',  categoria:'corporativo',  año:2023, ytId:'' },
  { id:6,  nombre:'VERDE',      categoria:'publicidad',   año:2023, ytId:'' },
  { id:7,  nombre:'NOCHE ALTA', categoria:'cortometraje', año:2023, ytId:'' },
  { id:8,  nombre:'AGUA NEGRA', categoria:'documental',   año:2022, ytId:'' },
  { id:9,  nombre:'CALOR',      categoria:'videoclip',    año:2022, ytId:'' },
  { id:10, nombre:'MERIDIAN',   categoria:'corporativo',  año:2022, ytId:'' },
  { id:11, nombre:'MODA X',     categoria:'publicidad',   año:2022, ytId:'' },
  { id:12, nombre:'PUENTE',     categoria:'cortometraje', año:2021, ytId:'' },
];

const CATEGORIAS = [
  { id:'todos',        label:'Todos' },
  { id:'cortometraje', label:'Cortometraje' },
  { id:'publicidad',   label:'Publicidad' },
  { id:'documental',   label:'Documental' },
  { id:'videoclip',    label:'Videoclip' },
  { id:'corporativo',  label:'Corporativo' },
];

// Estado del lightbox compartido entre ProjectCard y PortfolioFilter
function ProjectCard({ proyecto, visible, onOpen }) {
  return (
    <div
      className={`project-card standard`}
      data-cat={proyecto.categoria}
      onClick={() => onOpen(proyecto)}
      style={{
        opacity:  visible ? 1   : 0.15,
        filter:   visible ? 'none' : 'grayscale(1)',
        transition: 'opacity 0.4s, filter 0.4s',
        cursor: 'pointer'
      }}
    >
      <div className="project-bg">
        <img
          src={`Images/portfolio/${proyecto.nombre.toLowerCase().replace(/\s/g,'-').replace(/\./g,'')}.jpg`}
          alt={proyecto.nombre}
          onError={e => e.target.style.display='none'}
        />
        <div className="project-bg-fallback"></div>
      </div>
      <div className="project-overlay">
        <div className="proj-category">{proyecto.categoria}</div>
        <div className="proj-title">{proyecto.nombre}</div>
        <div className="proj-year">{proyecto.año}</div>
      </div>
      <div className="proj-arrow">↗</div>
    </div>
  );
}

function PortfolioFilter() {
  const [filtro,   setFiltro]   = useState('todos');
  const [lightbox, setLightbox] = useState(null); // proyecto abierto o null

  function openLightbox(proyecto) { setLightbox(proyecto); }
  function closeLightbox()        { setLightbox(null); }

  // Cerrar con ESC
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') closeLightbox(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const visible = (p) => filtro === 'todos' || p.categoria === filtro;
  const count   = PROYECTOS.filter(visible).length;

  return (
    <div>
      {/* Barra de filtros */}
      <div className="filter-bar">
        {CATEGORIAS.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${filtro === cat.id ? 'active' : ''}`}
            onClick={() => setFiltro(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Contador reactivo */}
      <p style={{
        fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase',
        color:'var(--gray)', opacity:0.5, marginBottom:'16px',
        fontFamily:'var(--font-body)'
      }}>
        {count} proyecto{count !== 1 ? 's' : ''}
        {filtro !== 'todos' ? ` · ${filtro}` : ''}
      </p>

      {/* Grilla */}
      <div className="gallery-grid" style={{marginBottom:'4px'}}>
        {PROYECTOS.map(p => (
          <ProjectCard
            key={p.id}
            proyecto={p}
            visible={visible(p)}
            onOpen={openLightbox}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox open"
          onClick={e => { if (e.target.classList.contains('lightbox')) closeLightbox(); }}
        >
          <div className="lightbox-content">
            <button className="lb-close" onClick={closeLightbox}>✕ Cerrar</button>
            <div className="lb-frame" id="lb-frame">
              {lightbox.ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${lightbox.ytId}?autoplay=1&rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="lb-placeholder">Video próximamente</div>
              )}
            </div>
            <div className="lb-cat">{lightbox.categoria} · {lightbox.año}</div>
            <div className="lb-title">{lightbox.nombre}</div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   COMPONENTE 3: CrewShowcase
   ═══════════════════════════════════════════════════════════ */
const CREW_DATA = [
  { id:1, nombre:'SAMUEL BELTRÁN', rol:'Director',          iniciales:'SB', img:'Images/p.jpeg', bio:'Voz creativa detrás de cada proyecto.' },
  { id:2, nombre:'ANNA RICO',       rol:'Fotografía',        iniciales:'AR', img:'Images/p.jpeg', bio:'Ojo detrás de la cámara. Define la estética visual.' },
  { id:3, nombre:'INÉS BELTRÁN',    rol:'Arte & Producción', iniciales:'IB', img:'Images/p.jpeg', bio:'Dirección de arte. Cada escena tiene su sello.' },
  { id:4, nombre:'DAVID BASTIDAS',  rol:'Edición & Color',   iniciales:'DB', img:'Images/p.jpeg', bio:'En postproducción transforma el material bruto.' },
  { id:5, nombre:'LIZ ARIZA',       rol:'Producción',        iniciales:'LA', img:'Images/p.jpeg', bio:'Logística y recursos. Hace que todo suceda.' },
];

function CrewCard({ miembro, expandida, onToggle }) {
  return (
    <div className={`crew-card`} style={{cursor:'pointer'}} onClick={onToggle}>
      {/* Foto */}
      <div className="crew-avatar">
        <img
          src={miembro.img}
          alt={miembro.nombre}
          onError={e => e.target.style.display='none'}
        />
      </div>

      {/* Botón +/− */}
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        style={{
          position:'absolute', top:14, right:14,
          width:30, height:30, borderRadius:'50%',
          border:'1px solid rgba(155,45,70,0.4)',
          background:'transparent', color:'var(--gold)',
          fontSize:18, cursor:'pointer', zIndex:3,
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all 0.3s', fontFamily:'var(--font-body)'
        }}
      >
        {expandida ? '−' : '+'}
      </button>

      {/* Info */}
      <div className="crew-info">
        <div className="crew-role">{miembro.rol}</div>
        <div className="crew-name">{miembro.nombre}</div>
        <p className="crew-bio" style={{
          opacity:    expandida ? 0.85 : 0,
          maxHeight:  expandida ? '80px' : '0',
          marginTop:  expandida ? '8px' : '0',
          overflow:   'hidden',
          transition: 'all 0.4s ease'
        }}>
          {miembro.bio}
        </p>
      </div>
    </div>
  );
}

function CrewShowcase() {
  const [expandida, setExpandida] = useState(null);

  function toggle(id) {
    setExpandida(prev => prev === id ? null : id);
  }

  return (
    <div className="crew-grid-main">
      {CREW_DATA.map(miembro => (
        <CrewCard
          key={miembro.id}
          miembro={miembro}
          expandida={expandida === miembro.id}
          onToggle={() => toggle(miembro.id)}
        />
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MONTAJE
   ═══════════════════════════════════════════════════════════ */
const mountContact   = document.getElementById('react-contact-form');
const mountPortfolio = document.getElementById('react-portfolio-filter');
const mountCrew      = document.getElementById('react-crew-cards');

if (mountContact)   ReactDOM.createRoot(mountContact).render(<ContactForm />);
if (mountPortfolio) ReactDOM.createRoot(mountPortfolio).render(<PortfolioFilter />);
if (mountCrew)      ReactDOM.createRoot(mountCrew).render(<CrewShowcase />);
