function dataFromJSON () {
  fetch('JSON.json')
    .then(response => response.json())
    .then(dataJson => {
      displayDefault(dataJson)
      displayPhotographers(dataJson)
      addActiveClass(dataJson)
      filterPhotographs(dataJson)
      redirecting(dataJson)
    })
    .catch(error => console.error)
};

dataFromJSON()

/// ////////////////////////AFFICHAGE DES PHOTOGRAPHES PAR DEFAUTS ///////////////

function displayDefault (dataJson) {
  dataJson.photographers.map(photographe => {
    const photographesDiv = document.getElementById('container')
    const div = document.createElement('div')
    const photographeTemplate =
    `
      <div class="photographerContainer">
        <a href="photographes.html?id=${photographe.id}" aria-label="photo ${photographe.name}">
          <div class="portraitBox">
            <img src="${photographe.portrait}" alt="photo de ${photographe.name}">
          </div>
          <h1 class="name">${photographe.name}</h1>
        </a>
        <p   class="city">${photographe.city}, ${photographe.country}</p>
        <p class="tagline">${photographe.tagline}</p>
        <p class="price">${photographe.price}€/jour</p>
        <ul class="tags">${photographe.tags.map(tag => `<li id=${tag} class="tag individual-tags">#${tag}</li>`).join(' ')}</ul>  
      </div> 
    `
    photographesDiv.appendChild(div)
    div.innerHTML = photographeTemplate
  })
};

/// /////////////////////////////////// filtrage des photos du photographe choisi////////////////

const tagName = window.location.search.split('id=')[1]
function redirecting (dataJson) {
  if (tagName) {
    const photographersDiv = document.getElementById('container')
    photographersDiv.innerHTML = ''
    filterElements(dataJson, tagName)
  }
};

/// /// Boucle lorsqu'on clique sur le photographe  on est rediriger sur une seul page html //////
function filterElements (dataJson, tagName) {
  dataJson.photographers.forEach(photographe => {
    if (tagName == 'all' || photographe.tags.indexOf(tagName.id || tagName) != -1) {
      const photographersDiv = document.getElementById('container')
      const div = document.createElement('div')
      const photographerTemplate =
    `
    <div class="photographerContainer">
        <a href="photographes.html?id=${photographe.id}">
        <div class="portraitBox">
            <img src="${photographe.portrait}" alt="photo de ${photographe.name}">
        </div>
        <h1 class="name">${photographe.name}</h1>
        </a>
        <p class="city">${photographe.city}, ${photographe.country}</p>
        <p class="tagline">${photographe.tagline}</p>
        <p class="price">${photographe.price}€/jour</p>
        <ul class="tags">${photographe.tags.map(tag => `<li id=${tag} class="tag individual-tags">#${tag}</li>`).join(' ')}</ul> 
    </div>
    `
      photographersDiv.appendChild(div)
      div.innerHTML = photographerTemplate
    }
  })
};

/// ////  Le FILTRE !!!!  //////////
function addActiveClass (dataJson) {
  const buttons = document.querySelectorAll('.filters_container li')
  buttons.forEach(btn =>
  {
    btn.addEventListener('click', () => {
      const active = btn.classList.contains('active')
      buttons.forEach(btn => btn.classList.remove('active'))
      if (!active) {
        btn.classList.add('active')
      } else {
        const photographersDiv = document.getElementById('container')
        photographersDiv.innerHTML = ''
        filterElements(dataJson, 'all')
      }
    })
    btn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const active = btn.classList.contains('active')
        buttons.forEach(btn => btn.classList.remove('active'))
        if (!active) {
          btn.classList.add('active')
        } else {
          const photographersDiv = document.getElementById('container')
          photographersDiv.innerHTML = ''
          filterElements(dataJson, 'all')
        }
    }
  })
  })

function displayPhotographers (dataJson) {
  const buttons = document.querySelectorAll('.filters_container li')
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const photographersDiv = document.getElementById('container')
    photographersDiv.innerHTML = ''
    filterElements(dataJson, btn)
  }))
};

function filterPhotographs (dataJson) {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('individual-tags')) {
      const photographersDiv = document.getElementById('container')
      photographersDiv.innerHTML = ''
      filterElements(dataJson, event.target)
    }
  })
};

const reset = document.getElementById('reset')

reset.addEventListener('click', () => {
  window.location.reload()
})

/// /////////////////////// BUTTON passer au contenue /////////////////////////////////
const btnPasserAuContenue = document.getElementById('passer-au-contenue')

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY

  if (scrollPosition < 20) {
    btnPasserAuContenue.style.display = 'none'
  } else {
    btnPasserAuContenue.style.display = 'block'
  }
})
