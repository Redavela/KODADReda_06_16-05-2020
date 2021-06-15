// VARIABLES -------------------------------------------

let JsonDATA
const lightBox = new LightBox()
let likesTable = []
const existingLikes = []
let modifiedArray = []

fetch('JSON.json')
  .then((response) => response.json())
  .then((JsonData) => {
    photographerProfil(JsonData)
    lightBox.init()
    incrementLikesOnClick()
    JsonDATA = JsonData
  })
  .catch((error) => console.error)

// Profil du photographe afficher avec cette fonction ----------------------

function photographerProfil (JsonData) {
  const id = window.location.search.split('id=')[1]
  const photographers = !id
    ? JsonData.photographers
    : JsonData.photographers.filter((photographer) => photographer.id == id)
  photographers.forEach((element) => {
    const domDiv = document.getElementById('photographer-container')
    const newDiv = document.createElement('div')
    const photographerPrice = element.price
    const profilTemplate = `
        <section aria-label="Photographer Profil" class="profil-container">
          <h2>${element.name}</h2>
          <p>${element.city}, ${element.country}</p>
          <p class="tagline">${element.tagline}</p>
          <p >${element.tags
            .map(
              (tag) =>
                `<a id="cursorAdd" href="accueil.html?id=${tag}" class='tags'>#${tag}</a>`
            )
            .join(' ')}</p>
          <button id="test">Contactez-moi</button>
          <div class="photoBox">
              <img src="${element.portrait}" alt="photo de ${element.name}">
          </div>
        </section>
      `
    newDiv.innerHTML = profilTemplate
    domDiv.appendChild(newDiv)
    showModal(element) // La fonction du formulaire est appelée ici -----
    const sum = photographerWork(JsonData.media) // La fonction est appelée ici --
    likesAndPrice(sum, photographerPrice) // La fonction est appelée ici --
  })
}

// TRAVAIL DU PHOTOGRAPHE --------------------------------

function photographerWork (media) {
  let sum = 0
  homeElt = window.location.search.split('id=')[1]
  media.forEach((element) => {
    if (homeElt == element.photographerId) {
      const domDiv = document.getElementById('photographer-work')
      const newDiv = document.createElement('div')
      sum += element.likes
      const workTemplate = `         
        <div class="photo-box"> 
            <div class="photo" data-id=${element.id}>
                ${videoOrImage(element.image, element.video, element)}
            </div>   
            <div class="text">
                <p> ${element.photoName}<b>${
        element.price
      } €  &nbsp <span class='under-photo-info'>${
        element.likes
      }</span> <i class="fas fa-heart heartIcon"></i></b></p>
            </div>
        </div>
        `
      newDiv.innerHTML = workTemplate
      domDiv.appendChild(newDiv)
      if ('image' in element) {
        lightBox.pushCurrentPic(element.image)
        lightBox.pushPhotoName(element.photoName)
      }
      likesTable.push(element.likes)
    }
  })
  lightBox.handleNextPrevButtons()
  return sum
}
// VERIFICATION DE LA DONNEE POUR SAVOIR SI C'EST UNE IMAGE OU UNE VIDEO AFIN D'AFFICHER LE BON ELEMENT
function videoOrImage (image, video, element) {
  if ('image' in element) {
    return ` <img class="photos" aria-label="photo ${element.photoName}" src="${image}">`
  } else if ('video' in element) {
    return ` <iframe src="${video}" width="285px" height="255px" controls=0></iframe>`
  }
}

// CREATION LIKES ET PRIX ----------------------
function likesAndPrice (sum, photographerPrice) {
  const domDiv = document.getElementById('likes-and-price-box')
  const newDiv = document.createElement('div')
  const likesAndPriceTemplate = `
    <div id='likesBox' class="Likes">${sum} <i class="fas fa-heart"></i></div>
    <div class="Price">${photographerPrice}€ / jour</div>  
    `
  newDiv.classList.add('likesAndPriceContainer')
  newDiv.innerHTML = likesAndPriceTemplate
  domDiv.appendChild(newDiv)
}

// INCREMENTATION DES LIKES AU CLIQUE ------------------------
function incrementLikesOnClick () {
  const heartIcons = Array.from(document.getElementsByClassName('heartIcon')) // multiple heart icons
  heartIcons.forEach((likeIcon, index) =>
    likeIcon.addEventListener('click', () => {
      // if the index of current photo is in the Arrey RETURN the index and stop executin IF NOT run the code block
      if (existingLikes.includes(index)) {
        return
      } else {
        const individualLikeBox =
          document.getElementsByClassName('under-photo-info')
        const totalLikesDivBox = document.getElementById('likesBox')
        likeIcon.classList.add('activeRed')

        const likesAfterAddition = likesTable[index] + 1 // add 1 like to the individual current photo
        likesTable.splice(index, 1, likesAfterAddition) // replace the old value from the Array with the new value

        const globalNumberOfLikes = likesTable.reduce(function (a, b) {
          return a + b
        }) // return the sum of the array

        individualLikeBox[
          index
        ].innerHTML = `<span>${likesAfterAddition} </span>`
        totalLikesDivBox.innerHTML = `<div>${globalNumberOfLikes} <i class="fas fa-heart"></i></div>`
      }
      // add the index of liked item to existingLikes Array everytime we click a photo
      existingLikes.push(index)
    })
  )
}

// PARTIE  DROPDOWN ----------------------------------------

// OUVRIR ET FERMER LE DROPDOWN ------------------------------------
document.getElementById('drop-down-btn').addEventListener('click', () => {
  const hidenPart = document.getElementById('myDropdown')
  const chevronDownIcon = document.getElementById('drop-down-btn')
  if (chevronDownIcon.classList.contains('fa-chevron-down')) {
    hidenPart.classList.add('show')
    chevronDownIcon.classList.remove('fa-chevron-down')
    chevronDownIcon.classList.add('fa-chevron-up')
  } else {
    hidenPart.classList.remove('show')
    chevronDownIcon.classList.remove('fa-chevron-up')
    chevronDownIcon.classList.add('fa-chevron-down')
  }
})

// PARTIE TRIE -----------------------------------
const trierParButtons = Array.from(document.getElementsByClassName('trierBtn'))
trierParButtons.forEach((btn, index) =>
  btn.addEventListener('click', () => {
    if (btn.innerText == 'Popularité') {
      // TRIE PAR POPULARITE ----------------------
      modifiedArray = JsonDATA.media.sort((a, b) => {
        return b.likes - a.likes
      })
      document.getElementById('photographer-work').innerHTML = ''
      likesTable = []
      lightBox.initCurrentPicture()
      photographerWork(modifiedArray)
      lightBox.init()
      incrementLikesOnClick()
    } else if (btn.innerText == 'Date') {
      // TRIE PAR DATE -------------------------------
      modifiedArray = JsonDATA.media.sort((a, b) => {
        return new Date(a.date).valueOf() - new Date(b.date).valueOf()
      })
      document.querySelector('#photographer-work').innerHTML = ''
      likesTable = []
      lightBox.initCurrentPicture()
      photographerWork(modifiedArray)
      lightBox.init()
      incrementLikesOnClick()
    } else if (btn.innerText == 'Titre') {
      // TRIE PAR ORDRE ALPHABETIQUE ------------------------------------
      modifiedArray = JsonDATA.media.sort((a, b) => {
        if (a.photoName.toLowerCase() < b.photoName.toLowerCase()) {
          return -1
        } else if (a.photoName.toLowerCase() > b.photoName.toLowerCase()) {
          return 1
        }
      })
      document.querySelector('#photographer-work').innerHTML = ''
      likesTable = []
      lightBox.initCurrentPicture()
      photographerWork(modifiedArray)
      lightBox.init()
      incrementLikesOnClick()
    }
    switchSelectedDropDown(index)
    document.getElementById('drop-down-btn').click()
  })
)

function switchSelectedDropDown (index) {
  const first = document.querySelectorAll('.trierBtn')[0]
  const selected = document.querySelectorAll('.trierBtn')[index]
  const firstText = first.innerText
  first.innerText = selected.innerText
  selected.innerText = firstText
}
// PARTIE LIGHTBOX -------------------------------------------

// CHANGER LES PHOTOS -----------------------

// FERMER LA LIGHTBOX -----------------------------

lightBox.closeLightBox()

// PARTIE FORMULAIRE -----------------------------

// OUVERTURE DU FORMULAIRE DE CONTACTE -----------
function showModal (element) {
  document.getElementById('test').addEventListener('click', () => {
    const formModal = document.getElementById('form-container')
    formModal.style.display = 'block'
    document.getElementById('test').style.display = 'none'
    const nameOfThePhotographe = document.getElementById(
      'nameOfThePhotopgraphe'
    )
    const nameTemplate = `${element.name}`
    nameOfThePhotographe.innerHTML = nameTemplate
  })
}

const form = document.querySelector('.form-container form')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const prenom = document.getElementById('prenom')
  const nom = document.getElementById('nom')
  const email = document.getElementById('email')
  const message = document.getElementById('message')
  const errorPrenom = document.getElementById('error-prenom')
  const errorNom = document.getElementById('error-nom')
  const errorMail = document.getElementById('error-email')
  const errorMessage = document.getElementById('error-message')
  const prenomOK = validateString(
    prenom,
    prenom.value,
    2,
    errorPrenom,
    'Veuillez entre 2 ou plus de caracteres'
  )
  const nomOk = validateString(
    nom,
    nom.value,
    2,
    errorNom,
    'Veuillez entre 2 ou plus de caracteres'
  )
  const messageOk = validateString(
    message,
    message.value,
    10,
    errorMessage,
    'Veuillez saisir 10 caractères ou plus '
  )
  const emailOk = checkEmail(
    email,
    email.value,
    errorMail,
    'Veuillez entre une adresse mail valide'
  )

  if (prenomOK && nomOk && messageOk && emailOk) {
    const formModal = document.getElementById('form-container')
    formModal.style.display = 'none'
    document.getElementById('test').style.display = 'block'
    form.reset()
  }
})

// FERMER LE MODALE SUR LA CROIX ----------------------
document.getElementById('X-button').addEventListener('click', () => {
  const formModal = document.getElementById('form-container')
  formModal.style.display = 'none'
  document.getElementById('test').style.display = 'block'
})

// VALIDATION DES INPUTS --------------------------------
function validateString (border, entry, size, errorElt, errorMessage) {
  if (entry.length < size) {
    errorElt.innerHTML = errorMessage
    errorElt.style.color = 'white'
    errorElt.style.fontSize = '0.8rem'
    border.style.border = '1px solid red'
    return false
  } else {
    errorElt.innerHTML = ' '
    border.style.border = '1px solid white'
    return true
  }
}

// VALIDATION DU MAIL ------------------
function checkEmail (border, emajll, errorElt, errorMessage) {
  const patern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
  if (!emajll.toLowerCase().match(patern) || emajll == '') {
    errorElt.innerHTML = errorMessage
    errorElt.style.color = 'white'
    errorElt.style.fontSize = '0.8rem'
    border.style.border = '1px solid red'
    return false
  } else {
    errorElt.innerHTML = ''
    border.style.border = '1px solid white'
    return true
  }
}
