const LightBox = class {
  constructor () {
    this.currentLigthboxIndex = -1
    this.currentPhotographerPhotos = []
    this.photoName = []
  }

  init () {
    const getPhotos = Array.from(document.getElementsByClassName('photos'))
    getPhotos.forEach((photo, index) =>
      photo.addEventListener('click', () => {
        this.open(index)
      })
    )
  }

  pushPhotoName (photoName) {
    this.photoName.push(photoName)
  }

  initCurrentPicture () {
    this.currentPhotographerPhotos = []
  }

  pushCurrentPic (image) {
    this.currentPhotographerPhotos.push(image)
  }

  closeLightBox () {
    const closeLightBoxBtn = document.querySelector('.closeIcon')
    closeLightBoxBtn.addEventListener('click', () => {
      const lightBoxcontainer = document.getElementById('lightBoxContainer')
      lightBoxcontainer.style.display = 'none'
    })
  }

  open (index) {
    const photoPlaceHolder = document.getElementById('photoPlaceHolder')
    const lightBoxcontainer = document.getElementById('lightBoxContainer')
    const photoNaneDom = document.getElementById('photoName')
    const src = this.currentPhotographerPhotos[index]
    const nameSrc = this.photoName[index]
    lightBoxcontainer.style.display = 'block'
    this.currentLigthboxIndex = index

    photoPlaceHolder.innerHTML = `<img src="${src}"/>`
    photoNaneDom.innerHTML = `${nameSrc}`
  }

  handleNextPrevButtons () {
    const previousBtn = document.querySelector('.leftIcon')
    const nextBtn = document.querySelector('.rightIcon')
    const photoPlaceHolder = document.getElementById('photoPlaceHolder')
    const photoNaneDom = document.getElementById('photoName')

    previousBtn.addEventListener('click', () => {
      this.currentLigthboxIndex -= 1
      if (this.currentLigthboxIndex < 0) {
        this.currentLigthboxIndex = this.currentPhotographerPhotos.length - 1
      }
      const src = this.currentPhotographerPhotos[this.currentLigthboxIndex]
      photoPlaceHolder.innerHTML = `<img src="${src}" />`

      if (this.currentLigthboxIndex < 0) {
        this.currentLigthboxIndex = this.photoName.length - 1
      }
      const nameSrc = this.photoName[this.currentLigthboxIndex]
      photoNaneDom.innerHTML = `${nameSrc}`
    })

    nextBtn.addEventListener('click', () => {
      this.currentLigthboxIndex += 1
      if (
        this.currentLigthboxIndex >
          this.currentPhotographerPhotos.length - 1
      ) {
        this.currentLigthboxIndex = 0
      }
      const src = this.currentPhotographerPhotos[this.currentLigthboxIndex]
      photoPlaceHolder.innerHTML = `<img src="${src}" />`

      if (this.currentLigthboxIndex > this.photoName.length - 1) {
        this.currentLigthboxIndex = 0
      }
      const nameSrc = this.photoName[this.currentLigthboxIndex]
      photoNaneDom.innerHTML = `${nameSrc}`
    })
  }
}
