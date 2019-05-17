let showBadDogs = true

document.addEventListener('DOMContentLoaded', () => {
    getDogsIndex()
    document.getElementById('good-dog-filter').addEventListener('click', filterGoodDogs)

})

const getDogsIndex = () => {
    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then((dogs) => dogs.forEach(renderDogsIndex))
        .catch((error) => showError(error, 'Dogs will not render.'))
}

const renderDogsIndex = (dog) => {
    const dogBar = document.getElementById('dog-bar')

    const dogButton = document.createElement('span')
    dogButton.id = `dog-button-${dog.id}`
    dogButton.innerText = dog.name
    dogButton.dataset.dogId = dog.id
    dogButton.dataset.isGoodDog = dog.isGoodDog
    dogButton.dataset.dogImage = dog.image
    dogButton.addEventListener('click', showDog)
    dogBar.appendChild(dogButton)
}

const showDog = (e) => {
    const dogInfo = document.getElementById('dog-info')
    dogInfo.innerHTML = ''

    const image = document.createElement('img')
    image.src = e.target.dataset.dogImage
    dogInfo.appendChild(image)

    const name = document.createElement('h2')
    name.innerText = e.target.innerText
    dogInfo.appendChild(name)

    const goodDogButton = document.createElement('button')
    goodDogButton.innerText = `${e.target.dataset.isGoodDog === "true" ? 'Good' : 'Bad'} Dog!`
    goodDogButton.dataset.toggleId = e.target.dataset.dogId
    goodDogButton.addEventListener('click', toggleGoodDog)
    dogInfo.appendChild(goodDogButton)
}

const toggleGoodDog = (e) => {
    const dogId = e.target.dataset.toggleId
    const dog = document.getElementById(`dog-button-${dogId}`)
    const isGoodDog = !(dog.dataset.isGoodDog === 'true')

    dog.dataset.isGoodDog = isGoodDog
    e.target.innerText = `${isGoodDog ? 'Good' : 'Bad'} Dog!`

    toggleDog(dog)
    patchIsGoodDog(dogId, isGoodDog)

}

const patchIsGoodDog = (dogId, isGoodDog) => {
    fetch(`http://localhost:3000/pups/${dogId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            isGoodDog: isGoodDog
        })
    })
        .catch((error) => showError(error, 'Changes will not be saved.'))
}

const showError = (error, message) => {
    const errorElement = document.createElement('div')
    errorElement.innerText = 'Server error: ' + error.message + '. ' + message
    errorElement.style.backgroundColor = 'red'
    errorElement.style.color = 'white'
    errorElement.style.textAlign = 'center'
    document.querySelector('body').insertBefore(errorElement, document.getElementById('filter-div'))
    setTimeout(() => errorElement.remove(), 5000)
}

const filterGoodDogs = (e) => {
    showBadDogs = !showBadDogs
    for (dog of document.getElementById('dog-bar').children) {
        toggleDog(dog)
    }
    e.target.innerText = `Filter good dogs: ${showBadDogs ? 'OFF' : 'ON'}`
}

const toggleDog = (dog) => {
    if (dog.dataset.isGoodDog === "false") {
            dog.style.display = showBadDogs ? 'flex' : 'none'
        } else {
        dog.style.display = 'flex'
    }
}