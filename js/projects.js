const projects = [
    {
        title: "CrewCall",
        description: "Crewcall es una app mobile creada para la comunicación eficiente entre owners de yates grandes con su tripulacion..",
        tags: ["Python", "Tailwind", "JavaScript"],
        longTags: ["HTML", "Tailwind", "JavaScript", "Capacitor", "Sql", "Firebase", "Node"],
        longDescription: "Crewcall es una aplicación móvil creada para facilitar la comunicación eficiente entre los propietarios (owners) de grandes yates y su tripulación. A través de la aplicación, los owners pueden enviar mensajes a la tripulación, solicitar servicios y gestionar distintas tareas. Está desarrollada principalmente con tecnologías web para el frontend y Python para el backend, y posteriormente se empaqueta mediante la librería Capacitor para su despliegue en dispositivos iOS y Android. La aplicación cuenta con un sistema de roles, notificaciones push, creación y envío de tareas (no en tiempo real), gestión de fotos de perfil, recuperación de cuenta, entre otras funcionalidades.",
        video: "https://www.youtube.com/embed/CIEkzt9Oj1s?si=TdGuPiSJWq3Pl3Kb",
        github: "...",
    },
    {
        title: "YoloV8nano",
        description: "Pruebas usando la IA de deccion de objetos en tiempo real YOLOv8nano...",
        tags: ["React", "Expo"],
        longTags: ["React", "Expo", "Tailwind"],
        longDescription: "Se trata de una aplicación sencilla creada para probar la inteligencia artificial de detección de objetos en tiempo real mediante YOLOv8nano. La desarrollé con el objetivo de experimentar con nuevas tecnologías para mí, como React Native y Expo, además de explorar su integración en una aplicación móvil.",
        video: "https://www.youtube.com/embed/KmcpZ8q42ac?si=bBiPWsxW6E1yEkjL",
        github: "...",

    },
    {
        title: "TFG PHP",
        description: "Una aplicacion para una empresa que realizaba todo el proceso de firmas sobre partes (constancias de trabajo) en papel...",
        tags: ["PHP", "Sql", "JavaScript"],
        longTags: ["HTML", "Tailwind", "JavaScript", "Sql"],
        longDescription: "Desarrollé una aplicación para una empresa que digitaliza todo el proceso de firma de partes de trabajo (constancias de trabajo), sustituyendo el flujo tradicional en papel. La aplicación permite tanto a administradores como a trabajadores firmar documentos de forma digital, así como consultar el histórico de partes de manera organizada. Está diseñada para dos departamentos distintos, adaptando pequeños aspectos de la interfaz según el rol del usuario que inicia sesión. La aplicación está desarrollada con HTML, Tailwind CSS, JavaScript y PHP.",
        video: "https://www.youtube.com/embed/5MwztbAbWc8?si=DCxvMHzMqgcttXeY",
        github: "...",

    },
    {
        title: "Corrector de idiomas con IA",
        description: "Te ayuda a detectar errores sobre ejercicios o palabras en ingles.",
        tags: ["React", "Rest API", "Supabase"],
        longTags: ["React", "Rest API", "Gemini", "Tailwind", "Supabase"],
        longDescription: "He desarrollado una aplicación que utiliza la inteligencia artificial de Gemini para ofrecer asistencia en la detección y corrección de errores en texto o imágenes. La aplicación integra el servicio de Supabase para la autenticación mediante Google y la gestión de la base de datos. Su funcionamiento es sencillo: el usuario envía una imagen o texto a través de la API de Google Gemini, y la IA devuelve el contenido con los errores marcados junto con una explicación de por qué se producen. El front-end está construido con React y un poco de Tailwind CSS.",
        video: "https://www.youtube.com/embed/HYpjrLcPPfg?si=YKMFrFYftkCv6q_G",
        github: "...",

    }
];

function renderProjects() {
    const stackContainer = document.getElementById("stack");
    if (!stackContainer) return;

    stackContainer.innerHTML = "";

    projects.forEach((project, index) => {
        const cardHTML = `
            <div class="card absolute inset-0 rounded-3xl
                        bg-white backdrop-blur-xl
                        border border-white/20
                        shadow-xl p-5 flex flex-col justify-between
                        touch-none select-none [will-change:transform]">

                <div>
                    <h3 class="text-lg font-semibold text-black">
                        ${project.title}
                    </h3>

                    <p class="mt-2 text-sm text-black/70 leading-snug">
                        ${project.description}
                    </p>
                </div>

                <div class="flex flex-wrap gap-2 mt-4">
                    ${project.tags.map(tag => `
                        <span class="text-xs px-2 py-1 rounded-full bg-white/10 text-black/80 border border-white/10">
                            ${tag}
                        </span>
                    `).join("")}
                </div>

                <button
                    class="open-modal absolute bottom-5 right-5 z-20 text-blue-500 cursor-pointer transition-all duration-100 active:scale-95 active:opacity-70"
                    data-index="${index}">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                </button>

            </div>
        `;

        stackContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
}

renderProjects();


const stackContainer = document.getElementById("stack");

stackContainer.addEventListener("click", (e) => {

    const btn = e.target.closest(".open-modal");
    if (!btn) return;

    const index = btn.dataset.index;
    const project = projects[index];

    openModal(project);
});

function openModal(project) {

    const modal = document.getElementById("projectModal");

    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalDescription").textContent = project.longDescription;
    document.getElementById("menu-glass").classList.add("hidden");

    document.getElementById("modalTags").innerHTML =
        project.longTags.map(tag => `
            <span class="px-3 py-1 text-xs rounded-full bg-gray-100 border text-gray-700">
                ${tag}
            </span>
        `).join("");

    const iframe = document.getElementById("modalVideo");
    iframe.src = project.video;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
}

document.getElementById("closeModal").addEventListener("click", () => {

    document.getElementById("menu-glass").classList.remove("hidden");

    const modal = document.getElementById("projectModal");
    const iframe = document.getElementById("modalVideo");

    modal.classList.add("hidden");
    modal.classList.remove("flex");

    iframe.src = "";

    document.body.style.overflow = "";
});

document.getElementById("openContactModal").addEventListener("click", () => {
    const modal = document.getElementById("ContactModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
});

document.getElementById("closeContactModal").addEventListener("click", () => {
    const modal = document.getElementById("ContactModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
});