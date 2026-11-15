const events = [
    { 
        date: "20-11-2026", 
        lieu: "Paris 20ième – Chez Bistouille", 
        desc: "Soirée Funk",
        lylo: "https://www.lylo.fr/concert/524a05-funk-experience-unit-en-concert-a-paris-20e-lyf-gambetta",       // Mettez le lien Lylo ici (ou supprimez la ligne si aucun)
        infoconcert: "https://www.infoconcert.com/concerts/concert-funk-experience-unit-paris-1975099" // Mettez le lien Info Concert ici (ou supprimez si aucun)
    }
    // Vous pouvez ajouter d'autres événements ici avec leurs propres liens distincts
];

const list = document.getElementById("event-list");
if (list) {
    events.forEach(ev => {
        const li = document.createElement("li");
        
        // Construction du contenu de base de l'événement
        let htmlContent = `<strong>${ev.date}</strong> – ${ev.lieu}<br><em>${ev.desc}</em>`;
        
        // Ajout dynamique des logos partenaires si les liens sont renseignés pour cet événement
        if (ev.lylo || ev.infoconcert) {
            htmlContent += `<div class="event-item-links">`;
            if (ev.lylo) {
                htmlContent += `<a href="${ev.lylo}" target="_blank" rel="noopener noreferrer" aria-label="Lylo"><img src="img/Logo/lylo.png" alt="Lylo" class="event-partner-logo"></a>`;
            }
            if (ev.infoconcert) {
                htmlContent += `<a href="${ev.infoconcert}" target="_blank" rel="noopener noreferrer" aria-label="Info Concert"><img src="img/Logo/infoConcert.png" alt="Info Concert" class="event-partner-logo"></a>`;
            }
            htmlContent += `</div>`;
        }
        
        li.innerHTML = htmlContent;
        list.appendChild(li);
    });
}

/*EVENEMENT CODE ANCIEN

const events = [
    { date: "20-11-2026", lieu: "Paris 20ième – Bistouille", desc: "Soirée Funk" }
];

const list = document.getElementById("event-list");
if (list) {
    events.forEach(ev => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${ev.date}</strong> – ${ev.lieu}<br><em>${ev.desc}</em>`;
        list.appendChild(li);
    });
}
*/
const videoContainer = document.getElementById("dynamic-videos");

function afficherVideos() {
    if (!videoContainer) return;

    videoContainer.innerHTML = '';

    const grid = document.createElement('div');
    grid.classList.add('videos-grid');

    youtubeVideos.forEach(vid => {
        const card = document.createElement('div');
        card.classList.add('video-card');

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${vid.id}?modestbranding=1&rel=0`;
        iframe.title = vid.titre;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        card.appendChild(iframe);

        const title = document.createElement('h3');
        title.textContent = vid.titre;
        title.classList.add('video-title');
        card.appendChild(title);

        grid.appendChild(card);
    });

    videoContainer.appendChild(grid);
}

if (videoContainer) {
    afficherVideos();
}

const galleryContainer = document.getElementById("dynamic-gallery");

function afficherAlbums() {
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '';

    const grid = document.createElement('div');
    grid.classList.add('albums-grid');

    galerieAlbums.forEach(album => {
        const card = document.createElement('div');
        card.classList.add('album-card');

        const img = document.createElement('img');
        img.src = encodeURI(album.dossier + album.couverture);
        img.alt = album.titre;
        img.classList.add('album-cover');
        card.appendChild(img);

        const title = document.createElement('h3');
        title.textContent = album.titre;
        title.classList.add('album-title');
        card.appendChild(title);

        const count = document.createElement('p');
        count.textContent = `${album.photos.length} photo${album.photos.length > 1 ? 's' : ''}`;
        count.classList.add('album-count');
        card.appendChild(count);

        card.addEventListener('click', () => {
            afficherPhotosAlbum(album);
        });

        grid.appendChild(card);
    });

    galleryContainer.appendChild(grid);
}

function afficherPhotosAlbum(album) {
    galleryContainer.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Retour aux dossiers';
    backBtn.classList.add('back-btn');
    backBtn.addEventListener('click', () => {
        afficherAlbums();
    });
    galleryContainer.appendChild(backBtn);

    const albumTitle = document.createElement('h3');
    albumTitle.textContent = album.titre;
    albumTitle.style.cssText = "font-size: 1.8rem; margin-bottom: 20px; color: #ffd166;";
    galleryContainer.appendChild(albumTitle);

    const grid = document.createElement('div');
    grid.classList.add('photos-grid');

    album.photos.forEach((nomFichier, index) => {
        const photoUrl = encodeURI(album.dossier + nomFichier);

        const thumbImg = document.createElement('img');
        thumbImg.src = photoUrl;
        thumbImg.alt = album.titre;
        thumbImg.loading = 'lazy';
        thumbImg.classList.add('photo-thumb'); // Indispensable pour l'association CSS

        // Au clic, ouverture instantanée de la modale
        thumbImg.addEventListener('click', () => {
            ouvrirModal(album.photos, index, album.dossier);
        });

        grid.appendChild(thumbImg);
    });

    galleryContainer.appendChild(grid);
}

// Fonction modale ultra-rapide (sans jQuery, avec boutons suivant/précédent)
function ouvrirModal(photos, currentIndex, dossier) {
    let indexActuel = currentIndex;

    const modal = document.createElement('div');
    modal.className = 'custom-modal';

    modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <button class="modal-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <img class="modal-img" src="${encodeURI(dossier + photos[indexActuel])}" alt="Zoom">
      <button class="modal-next"><i class="fa-solid fa-chevron-right"></i></button>
      <div class="modal-counter">Photo ${indexActuel + 1} sur ${photos.length}</div>
    </div>
  `;

    document.body.appendChild(modal);

    const imgEl = modal.querySelector('.modal-img');
    const counterEl = modal.querySelector('.modal-counter');

    function mettreAJour() {
        imgEl.src = encodeURI(dossier + photos[indexActuel]);
        counterEl.textContent = `Photo ${indexActuel + 1} sur ${photos.length}`;
    }

    modal.querySelector('.modal-next').addEventListener('click', (e) => {
        e.stopPropagation();
        indexActuel = (indexActuel + 1) % photos.length;
        mettreAJour();
    });

    modal.querySelector('.modal-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        indexActuel = (indexActuel - 1 + photos.length) % photos.length;
        mettreAJour();
    });

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());

    // Fermer en cliquant en dehors de l'image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Support des touches du clavier (Échap pour fermer, flèches gauche/droite pour naviguer)
    document.addEventListener('keydown', function gererClavier(e) {
        if (!document.body.contains(modal)) {
            document.removeEventListener('keydown', gererClavier);
            return;
        }
        if (e.key === 'Escape') {
            modal.remove();
        } else if (e.key === 'ArrowRight') {
            indexActuel = (indexActuel + 1) % photos.length;
            mettreAJour();
        } else if (e.key === 'ArrowLeft') {
            indexActuel = (indexActuel - 1 + photos.length) % photos.length;
            mettreAJour();
        }
    });
}

if (galleryContainer) {
    afficherAlbums();
}