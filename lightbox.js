const LightBox = class {
  constructor () { // création des tableaux vides
    this.currentLigthboxIndex = -1
    this.currentPhotographerPhotos = []
    this.photoName = []
  }

  init () { // création d'un tableau qui s'active au clique sur l'image
    const getPhotos = Array.from(document.getElementsByClassName('photos'))
    getPhotos.forEach((photo, index) =>
      photo.addEventListener('click', () => {
        this.open(index) 
      })
    )
  }

  pushPhotoName (photoName) { // ajout des titres dans le tableau vide photoName
    this.photoName.push(photoName)
  }

  initCurrentPicture () { // fonction qui appelle le tableaux vide(dans lequel on vas ajouter les images)
    this.currentPhotographerPhotos = []
  }

  pushCurrentPic (image) { // Ajout des photos dans le tableau vide
    this.currentPhotographerPhotos.push(image)
  }

  closeLightBox () { // fonction pour fermer la lightbox au clique sur la croix
    const closeLightBoxBtn = document.querySelector('.closeIcon')
    closeLightBoxBtn.addEventListener('click', () => {
      const lightBoxcontainer = document.getElementById('lightBoxContainer')
      lightBoxcontainer.style.display = 'none'
    })
  }

  open (index) { // La fonction qui fait fonctionner au clique sur l'image la lightBox
    const photoPlaceHolder = document.getElementById('photoPlaceHolder')
    const lightBoxcontainer = document.getElementById('lightBoxContainer')
    const photoNaneDom = document.getElementById('photoName')
    const src = this.currentPhotographerPhotos[index]
    const nameSrc = this.photoName[index]
    lightBoxcontainer.style.display = 'block'
    this.currentLigthboxIndex = index

    photoPlaceHolder.innerHTML = this.generateHtml(src)
    photoNaneDom.innerHTML = `${nameSrc}`
  }

  handleNextPrevButtons () { // fonction pour utiliser les flèches de la lightBox
    const previousBtn = document.querySelector('.leftIcon')
    const nextBtn = document.querySelector('.rightIcon')
    const photoPlaceHolder = document.getElementById('photoPlaceHolder')
    const photoNaneDom = document.getElementById('photoName')

    previousBtn.addEventListener('click', () => { // flèche pour revenir
      this.currentLigthboxIndex -= 1
      if (this.currentLigthboxIndex < 0) {
        this.currentLigthboxIndex = this.currentPhotographerPhotos.length - 1
      }
      const src = this.currentPhotographerPhotos[this.currentLigthboxIndex]
      photoPlaceHolder.innerHTML = this.generateHtml(src)

      if (this.currentLigthboxIndex < 0) {
        this.currentLigthboxIndex = this.photoName.length - 1
      }
      const nameSrc = this.photoName[this.currentLigthboxIndex]
      photoNaneDom.innerHTML = `${nameSrc}`
    })

    nextBtn.addEventListener('click', () => { // flèche pour avancer
      this.currentLigthboxIndex += 1
      if (
        this.currentLigthboxIndex >
          this.currentPhotographerPhotos.length - 1
      ) {
        this.currentLigthboxIndex = 0
      }
      const src = this.currentPhotographerPhotos[this.currentLigthboxIndex]
      photoPlaceHolder.innerHTML = this.generateHtml(src)
      if (this.currentLigthboxIndex > this.photoName.length - 1) {
        this.currentLigthboxIndex = 0
      }
      const nameSrc = this.photoName[this.currentLigthboxIndex]
      photoNaneDom.innerHTML = `${nameSrc}`
    })
  }

  generateHtml (src) { // fonction pour reconnaitre si c'est une image ou une vidéo a afficher
    let tag = 'img'
    if (src.endsWith('.mp4')) {
      tag = 'video'
    } return `<${tag} src="${src}" object-fit = 'cover' height = '100%'width = '90%' controls=0/>`
  }
}
