#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime
import json
from pathlib import Path
import re
import unicodedata

EXTENSIONS = {".jpg", ".jpeg", ".png", ".jfif", ".webp"}

YOUTUBE_DEFAUT = """const youtubeVideos = [
  {
    id: "ouwUcJG_Wgc",
    titre: "Concert Live - Morceau 1"
  }
];"""


def slugify_id(nom_dossier: str) -> str:
    """Crée un identifiant propre sans accent ni caractères spéciaux."""
    texte = unicodedata.normalize("NFKD", nom_dossier)
    texte = texte.encode("ascii", "ignore").decode("ascii").lower()
    texte = re.sub(r"[^a-z0-9]+", "-", texte).strip("-")
    return texte or "album"


def titre_depuis_dossier(nom_dossier: str) -> str:
    """Formate un titre lisible à partir du nom du dossier."""
    return re.sub(r"\s+", " ", nom_dossier.replace("-", " ")).strip()


def charger_existant(source_file: Path) -> tuple[dict[str, dict], str]:
    """Récupère les métadonnées d'albums existantes et le bloc youtubeVideos."""
    albums_par_dossier: dict[str, dict] = {}
    youtube_content = YOUTUBE_DEFAUT

    if not source_file.exists():
        return albums_par_dossier, youtube_content

    contenu = source_file.read_text(encoding="utf-8")

    match_albums = re.search(
        r"const\s+galerieAlbums\s*=\s*(\[[\s\S]*?\])\s*;",
        contenu,
    )
    if match_albums:
        try:
            albums_charges = json.loads(match_albums.group(1))
            if isinstance(albums_charges, list):
                for album in albums_charges:
                    if isinstance(album, dict) and album.get("dossier"):
                        albums_par_dossier[album["dossier"]] = album
        except json.JSONDecodeError:
            pass

    match_yt = re.search(
        r"(const\s+youtubeVideos\s*=\s*\[[\s\S]*?\]\s*;)",
        contenu,
    )
    if match_yt:
        youtube_content = match_yt.group(1)

    return albums_par_dossier, youtube_content


def main() -> None:
    base_dir = Path(__file__).resolve().parent
    galerie_dir = base_dir / "img" / "galerie"
    source_file = base_dir / "galerie-data.js"
    output_file = base_dir / "galerie-data-new.js"

    if not galerie_dir.is_dir():
        print(f"Erreur : le dossier {galerie_dir} est introuvable.")
        raise SystemExit(1)

    albums_existants, youtube_content = charger_existant(source_file)
    albums_data = []

    dossiers = sorted(
        (d for d in galerie_dir.iterdir() if d.is_dir()),
        key=lambda d: d.name.lower(),
    )

    for dossier in dossiers:
        dossier_nom = dossier.name
        fichiers = sorted(
            (
                f.name
                for f in dossier.iterdir()
                if f.is_file() and f.suffix.lower() in EXTENSIONS
            ),
            key=lambda n: n.lower(),
        )

        if not fichiers:
            continue

        chemin_web = f"img/galerie/{dossier_nom}/"
        existant = albums_existants.get(chemin_web)

        titre = (
            existant.get("titre")
            if existant and existant.get("titre")
            else titre_depuis_dossier(dossier_nom)
        )
        couverture = (
            existant.get("couverture")
            if existant and existant.get("couverture") in fichiers
            else fichiers[0]
        )

        album_obj: dict[str, object] = {
            "id": slugify_id(dossier_nom),
            "titre": titre,
        }

        if existant and isinstance(existant.get("contexte"), str) and existant["contexte"].strip():
            album_obj["contexte"] = existant["contexte"].strip()

        album_obj["dossier"] = chemin_web
        album_obj["couverture"] = couverture
        album_obj["photos"] = fichiers

        albums_data.append(album_obj)

    albums_json = json.dumps(albums_data, indent=4, ensure_ascii=False)
    horodatage = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    contenu_final = (
        f"// Généré automatiquement par Python le {horodatage}\n"
        f"const galerieAlbums = {albums_json};\n\n\n"
        f"{youtube_content}\n"
    )

    output_file.write_text(contenu_final, encoding="utf-8")
    print(f"Succès ! Le fichier {output_file.name} a été généré en UTF-8 pour relecture.")


if __name__ == "__main__":
    main()