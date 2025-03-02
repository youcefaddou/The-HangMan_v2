const mots = ["javascript", "developpeur", "constitution", "parole", "coloration"]
let motADeviner
let motAffiche
let erreursRestantes
let lettresUtilisees

const bgMusic = new Audio('./assets/audio/hangmanbg.mp3')
bgMusic.loop = true

const penduParties = document.querySelectorAll('.pendu-partie') // il faut selectionner cette classe (et non l'id) pour pouvoir afficher les parties cachées
const motAfficheDiv = document.querySelector('#mot-affiche')
const clavierDiv = document.querySelector('#clavier')
const messageDiv = document.querySelector('#message')
const errorsLeft = document.querySelector('#erreurs-restantes')

// initialisation du clavier
function afficherClavier() {
    clavierDiv.innerHTML = '' // On vide le clavier avant de réafficher les boutons
    const lettres = 'abcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < lettres.length; i++) {
        const bouton = document.createElement('div')
        bouton.className = 'lettre'
        bouton.textContent = lettres[i]
        bouton.addEventListener('click', () => devinerLettre(lettres[i]))
        clavierDiv.appendChild(bouton)
    }
}

function init() {
    motADeviner = mots[Math.floor(Math.random() * mots.length)]
    motAffiche = ''
    lettresUtilisees = []
    for (let i = 0; i < motADeviner.length; i++) { // boucle pour initialiser le mot a afficher
        motAffiche += '_'
    }
    erreursRestantes = 6
    motAfficheDiv.textContent = motAffiche
    errorsLeft.textContent = `Erreurs restantes : ${erreursRestantes}`
    messageDiv.textContent = ''
    penduParties.forEach(partie => partie.classList.add('cache'))
    afficherClavier()
}

function demarrer() {
    document.querySelector("#demarrer").style.display = "none"
    document.querySelector("#jeu").style.display = "block"
    bgMusic.play()
    init()
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

function devinerLettre(lettre) {
    // Si le jeu est déjà terminé (victoire ou défaite) on ne fait rien
    if (erreursRestantes === 0 || !motAffiche.includes('_')) {
        return
    }
    //si la lettre est deja utilisée on ne fait rien
    if (lettresUtilisees.includes(lettre)) {
        return
    }

    lettresUtilisees.push(lettre)   //on l'ajoute a la lettre utilisée 

    if (motADeviner.includes(lettre)) {

        let nouveauMotAffiche = ''  //MAJ affichage du mot
        for (let i = 0; i < motADeviner.length; i++) {
            if (motADeviner[i] === lettre) {
                nouveauMotAffiche += lettre
            } else {
                nouveauMotAffiche += motAffiche[i] // on garde '_' ou la lettre deja decouverte
            }
        }
        motAffiche = nouveauMotAffiche
        motAfficheDiv.textContent = motAffiche

        if (!motAffiche.includes('_')) {
            messageDiv.textContent = 'Félicitations, vous avez gagné!'
            desactiverClavier()
        }
    } else {
        erreursRestantes--
        errorsLeft.textContent = `Erreurs restantes : ${erreursRestantes}`
        afficherPendu()

        if (erreursRestantes === 0) {
            messageDiv.textContent = `Perdu! Le mot était "${motADeviner}".`
            desactiverClavier()
        }
    }
    //MAj des boutons du clavier pour indiquer si la lettre etait correcte ou pas
    const boutons = document.querySelectorAll('.lettre')
    boutons.forEach(bouton => {
        if (bouton.textContent === lettre) {
            if (motADeviner.includes(lettre)) {
                bouton.classList.add('correcte')
            } else {
                bouton.classList.add('incorrecte')
            }
        }
    })
}
//on affiche la partie suivante du pendu en fonction du nombre d'erreurs restantes
function afficherPendu() {
    if (erreursRestantes < 6) {
        penduParties[6 - erreursRestantes - 1].classList.remove('cache')
    }
}

function desactiverClavier() {
    const boutons = document.querySelectorAll('.lettre')
    boutons.forEach(bouton => {
        bouton.style.pointerEvents = 'none' // désactive les clics sur le bouton
    })
}

function updateVolume() {
    const volume = document.querySelector("#volume").value / 100
    bgMusic.volume = volume
}

document.querySelector("#volume").addEventListener('input', updateVolume)
updateVolume()

document.querySelector("#demarrer").style.display = "block"