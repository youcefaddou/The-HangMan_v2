let motAffiche;
let erreursRestantes;
let lettresUtilisees;

const bgMusic = new Audio('./assets/audio/hangmanbg.mp3');
bgMusic.loop = true;

const penduParties = document.querySelectorAll('.pendu-partie');
const motAfficheDiv = document.querySelector('#mot-affiche');
const clavierDiv = document.querySelector('#clavier');
const messageDiv = document.querySelector('#message');
const errorsLeft = document.querySelector('#erreurs-restantes');

// Fonction pour récupérer un mot aléatoire depuis l'API
async function choisirMot() {
    const response = await fetch('https://trouve-mot.fr/api/random');
    const data = await response.json();
    return data[0].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Convertir en minuscules et enlève tout accent du mot
}

// Initialisation du jeu
async function init() {
    motADeviner = await choisirMot(); // Récupérer un mot aléatoire depuis l'API
    motAffiche = '';
    lettresUtilisees = [];
    for (let i = 0; i < motADeviner.length; i++) { // boucle pour initialiser le mot a afficher
        motAffiche += '_';
    }
    erreursRestantes = 6;
    motAfficheDiv.textContent = motAffiche;
    errorsLeft.textContent = `Erreurs restantes : ${erreursRestantes}`;
    messageDiv.textContent = '';
    penduParties.forEach(partie => partie.classList.add('cache'));
    afficherClavier();
}

// Démarrer le jeu
async function demarrer() {
    document.querySelector("#demarrer").style.display = "none";
    document.querySelector("#jeu").style.display = "block";
    bgMusic.play();
    await init(); // Attendre que l'initialisation soit terminée
}

// Afficher le clavier
function afficherClavier() {
    clavierDiv.innerHTML = ''; // On vide le clavier avant de réafficher les boutons
    const lettres = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < lettres.length; i++) {
        const bouton = document.createElement('div');
        bouton.className = 'lettre';
        bouton.textContent = lettres[i];
        bouton.addEventListener('click', () => devinerLettre(lettres[i]));
        clavierDiv.appendChild(bouton);
    }
}

// Fonction pour deviner une lettre
function devinerLettre(lettre) {
    // Si le jeu est déjà terminé (victoire ou défaite) on ne fait rien
    if (erreursRestantes === 0 || !motAffiche.includes('_')) {
        return;
    }
    // Si la lettre est déjà utilisée, on ne fait rien
    if (lettresUtilisees.includes(lettre)) {
        return;
    }

    lettresUtilisees.push(lettre); // On l'ajoute à la liste des lettres utilisées

    if (motADeviner.includes(lettre)) {
        let nouveauMotAffiche = ''; // Mise à jour de l'affichage du mot
        for (let i = 0; i < motADeviner.length; i++) {
            if (motADeviner[i] === lettre) {
                nouveauMotAffiche += lettre;
            } else {
                nouveauMotAffiche += motAffiche[i]; // On garde '_' ou la lettre déjà découverte
            }
        }
        motAffiche = nouveauMotAffiche;
        motAfficheDiv.textContent = motAffiche;

        if (!motAffiche.includes('_')) {
            messageDiv.textContent = 'Félicitations, vous avez gagné!';
            desactiverClavier();
        }
    } else {
        erreursRestantes--;
        errorsLeft.textContent = `Erreurs restantes : ${erreursRestantes}`;
        afficherPendu();

        if (erreursRestantes === 0) {
            messageDiv.textContent = `Perdu! Le mot était "${motADeviner}".`;
            desactiverClavier();
        }
    }

    // Mise à jour des boutons du clavier pour indiquer si la lettre était correcte ou pas
    const boutons = document.querySelectorAll('.lettre');
    boutons.forEach(bouton => {
        if (bouton.textContent === lettre) {
            if (motADeviner.includes(lettre)) {
                bouton.classList.add('correcte');
            } else {
                bouton.classList.add('incorrecte');
            }
        }
    });
}

// Afficher la partie suivante du pendu en fonction du nombre d'erreurs restantes
function afficherPendu() {
    if (erreursRestantes < 6) {
        penduParties[6 - erreursRestantes - 1].classList.remove('cache');
    }
}

// Désactiver le clavier
function desactiverClavier() {
    const boutons = document.querySelectorAll('.lettre');
    boutons.forEach(bouton => {
        bouton.style.pointerEvents = 'none'; // Désactive les clics sur le bouton
    });
}
function rejouer() {
    // Réactiver le clavier
    const boutons = document.querySelectorAll('.lettre')
    boutons.forEach(bouton => {
        bouton.style.pointerEvents = 'auto'; // reactive les clics sur le bouton
        bouton.classList.remove('correcte', 'incorrecte')
    })
    init()
}
// Contrôle du volume
function updateVolume() {
    const volume = document.querySelector("#volume").value / 100;
    bgMusic.volume = volume;
}

document.querySelector("#volume").addEventListener('input', updateVolume);
updateVolume();

document.querySelector("#demarrer").style.display = "block";