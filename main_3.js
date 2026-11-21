const events = [
    {
        date: "20-11-2026",
        lieu: "Paris 20ième – Chez Bistouille",
        desc: "Soirée Funk",
        lylo: "https://www.lylo.fr/concert/524a05-funk-experience-unit-en-concert-a-paris-20e-lyf-gambetta",
        infoconcert: "https://www.infoconcert.com/concerts/concert-funk-experience-unit-paris-1975099"
    }
];

const list = document.getElementById("event-list");
if (list) {
    events.forEach(ev => {
        const li = document.createElement("li");

        let htmlContent = `<strong>${ev.date}</strong> – ${ev.lieu}<br><em>${ev.desc}</em>`;

        if (ev.lylo || ev.infoconcert) {
            htmlContent += `<div class="event-item-links">`;
            if (ev.lylo) {
                htmlContent += `<a href="${ev.lylo}" target="_blank" rel="noopener noreferrer" aria-label="Lylo"><img src="img/Logo/lylo.png" alt="Lylo" class="event-partner-logo" loading="lazy" decoding="async"></a>`;
            }
            if (ev.infoconcert) {
                htmlContent += `<a href="${ev.infoconcert}" target="_blank" rel="noopener noreferrer" aria-label="Info Concert"><img src="img/Logo/infoConcert.png" alt="Info Concert" class="event-partner-logo" loading="lazy" decoding="async"></a>`;
            }
            htmlContent += `</div>`;
        }

        li.innerHTML = htmlContent;
        list.appendChild(li);
    });
}

const videoContainer = document.getElementById("dynamic-videos");

function fermerToutesLesVideos() {
    if (!videoContainer) return;
    videoContainer.querySelectorAll('.video-card').forEach(card => {
        const wrapper = card.querySelector('.video-active-wrapper');
        const idVideo = card.dataset.videoId;
        const titreVideo = card.dataset.videoTitle;
        if (wrapper && idVideo) {
            wrapper.replaceWith(creerFacade({ id: idVideo, titre: titreVideo }));
        }
    });
}

function creerFacade(vid) {
    const facade = document.createElement('div');
    facade.classList.add('video-facade');
    facade.setAttribute('role', 'button');
    facade.setAttribute('tabindex', '0');
    facade.setAttribute('aria-label', `Lire la vidéo : ${vid.titre}`);

    const thumb = document.createElement('img');
    thumb.src = `https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`;
    thumb.alt = vid.titre;
    thumb.loading = 'lazy';
    thumb.decoding = 'async';

    thumb.addEventListener('error', () => {
        if (!thumb.dataset.fallback) {
            thumb.dataset.fallback = '1';
            thumb.src = `https://i.ytimg.com/vi/${vid.id}/0.jpg`;
        }
    });

    const playBtn = document.createElement('span');
    playBtn.classList.add('video-play-btn');
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';

    facade.appendChild(thumb);
    facade.appendChild(playBtn);

    const chargerIframe = () => {
        fermerToutesLesVideos();

        const wrapper = document.createElement('div');
        wrapper.classList.add('video-active-wrapper');

        const stopBtn = document.createElement('button');
        stopBtn.type = 'button';
        stopBtn.classList.add('video-stop-btn');
        stopBtn.setAttribute('aria-label', 'Arrêter et fermer la vidéo');
        stopBtn.innerHTML = '&times;';
        stopBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.replaceWith(creerFacade(vid));
        });

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${vid.id}?autoplay=1&modestbranding=1&rel=0`;
        iframe.title = vid.titre;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        wrapper.appendChild(stopBtn);
        wrapper.appendChild(iframe);
        facade.replaceWith(wrapper);
    };

    facade.addEventListener('click', chargerIframe);
    facade.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            chargerIframe();
        }
    });

    return facade;
}

// Coupe la vidéo active si l'utilisateur clique sur un lien du menu de navigation
document.querySelectorAll('.sticky-nav a').forEach(lien => {
    lien.addEventListener('click', () => {
        fermerToutesLesVideos();
    });
});

function afficherVideos() {
    if (!videoContainer) return;

    videoContainer.innerHTML = '';

    const grid = document.createElement('div');
    grid.classList.add('videos-grid');

    youtubeVideos.forEach(vid => {
        const card = document.createElement('div');
        card.classList.add('video-card');
        card.dataset.videoId = vid.id;
        card.dataset.videoTitle = vid.titre;

        card.appendChild(creerFacade(vid));

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
        img.loading = 'lazy';
        img.decoding = 'async';
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
    galleryContainer.appendChild(grid);

    const lotInitial = 8;
    const tailleLotSuivant = 6;
    let curseur = 0;

    function ajouterLot(quantite) {
        const fin = Math.min(curseur + quantite, album.photos.length);
        for (let index = curseur; index < fin; index++) {
            const nomFichier = album.photos[index];
            const photoUrl = encodeURI(album.dossier + nomFichier);

            const thumbImg = document.createElement('img');
            thumbImg.src = photoUrl;
            thumbImg.alt = album.titre;
            thumbImg.loading = index < lotInitial ? 'eager' : 'lazy';
            thumbImg.decoding = 'async';
            thumbImg.classList.add('photo-thumb');

            thumbImg.addEventListener('click', () => {
                ouvrirModal(album.photos, index, album.dossier);
            });

            grid.appendChild(thumbImg);
        }
        curseur = fin;

        if (curseur < album.photos.length) {
            setTimeout(() => ajouterLot(tailleLotSuivant), 250);
        }
    }

    ajouterLot(lotInitial);
}

function prechargerPhoto(photos, index, dossier) {
    if (!photos || photos.length <= 1) return;
    const targetIndex = (index + 1 + photos.length) % photos.length;
    const preImg = new Image();
    preImg.decoding = 'async';
    preImg.src = encodeURI(dossier + photos[targetIndex]);
}

function ouvrirModal(photos, currentIndex, dossier) {
    let indexActuel = currentIndex;

    const modal = document.createElement('div');
    modal.className = 'custom-modal';

    modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <button class="modal-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <img class="modal-img" decoding="async" src="${encodeURI(dossier + photos[indexActuel])}" alt="Zoom">
      <button class="modal-next"><i class="fa-solid fa-chevron-right"></i></button>
      <div class="modal-counter">Photo ${indexActuel + 1} sur ${photos.length}</div>
    </div>
  `;

    document.body.appendChild(modal);

    const imgEl = modal.querySelector('.modal-img');
    const counterEl = modal.querySelector('.modal-counter');

    prechargerPhoto(photos, indexActuel + 1, dossier);
    prechargerPhoto(photos, indexActuel - 1, dossier);

    function mettreAJour() {
        imgEl.src = encodeURI(dossier + photos[indexActuel]);
        counterEl.textContent = `Photo ${indexActuel + 1} sur ${photos.length}`;
        prechargerPhoto(photos, indexActuel + 1, dossier);
        prechargerPhoto(photos, indexActuel - 1, dossier);
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

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

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