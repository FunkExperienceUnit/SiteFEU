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
    // encodeURI protège les espaces et accents (ex: "Aufargis 2025 à") sur GitHub
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

  album.photos.forEach(nomFichier => {
    // encodeURI protège les espaces et accents pour le serveur GitHub
    const photoUrl = encodeURI(album.dossier + nomFichier);

    const a = document.createElement('a');
    a.href = photoUrl;
    a.setAttribute('data-lightbox', album.id);
    a.setAttribute('data-title', album.titre);

    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = album.titre;
    img.loading = 'lazy';

    a.appendChild(img);
    grid.appendChild(a);
  });

  galleryContainer.appendChild(grid);
}

if (galleryContainer) {
  afficherAlbums();
}