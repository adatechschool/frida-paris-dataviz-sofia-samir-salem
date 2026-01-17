// 🎬 Gestion de transition
const scanView = document.getElementById('scanView')
const ficheView = document.getElementById('ficheView')

// 🔄 Animation de transition fondue
function switchView(hideEl, showEl) {
  hideEl.classList.remove('show')
  hideEl.classList.add('fade')

  setTimeout(() => {
    hideEl.style.display = 'none'
    showEl.style.display = 'flex'
    showEl.classList.add('show')
    showEl.classList.remove('fade')
  }, 400)
}

// 🔧 Éléments HTML
const showInformation = document.getElementById("affichageinfo")
const btnStart = document.getElementById("startcamera")
const cameraResultat = document.getElementById("cameraresult")
const displayCamera = document.getElementById('zonecamera')
const restartScan = document.getElementById('restartscan')
const emballage = document.getElementById('emballage')
const displayChart = document.getElementById("myChart")
const message = document.getElementById("messageaccueil")

// Création éléments HTMl
const img = document.createElement('img')
const ingredients = document.createElement('p')
const grade = document.createElement('p')
const allergens = document.createElement('p')
const isVegan = document.createElement('p')
const isVegetarian = document.createElement('p')
const packagingList = document.createElement('li')
const packaging = document.createElement('p')
const nameProduct = document.createElement('h1')
const nutriscoreImg = document.createElement('img')

nutriscoreImg.id = 'nutriscoreimg'

let myChart = null

// 📷 Démarrage du scanner
function initialization() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#zonecamera'),
      constraints: {
        facingMode: "environment",
        width: { min: 640 },
        height: { min: 480 }
      }
    },
    decoder: {
      readers: ["ean_reader"]
    }
  }, function (err) {
    if (err) {
      console.log(err)
      return
    }
    Quagga.start()
  })
}

restartScan.style.display = 'none'
displayCamera.style.display = 'none'

// 📌 Quand un code est détecté
function handler(resultat) {
  const code = resultat.codeResult.code
  cameraResultat.innerText = `le code barre détecté : ${code}`
  showInformation.appendChild(cameraResultat)
  Quagga.stop()

  switchView(scanView, ficheView)
  displayInformations(code)
}

// ▶️ Lancement scan
btnStart.addEventListener('click', () => {
  message.style.display = 'none'
  displayCamera.style.display = 'block'
  restartScan.style.display = 'block'
  btnStart.style.display = 'none'
  initialization()
  Quagga.onDetected(handler)
})

// 🔁 Réinitialiser scan
restartScan.addEventListener('click', () => {
  showInformation.innerHTML = ''
  displayCamera.style.display = 'block'
  hideInformations()
  switchView(ficheView, scanView)
  initialization()
  Quagga.onDetected(handler)
})


// 🌐 API Open Food Facts
async function getInformation(productCode) {
  try {
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${productCode}`)
    if (!response.ok) {
      // Personnalisation selon le code
      switch (response.status) {
        case 400:
          throw new Error("Requête incorrecte (400)");
        case 401:
          throw new Error("Non autorisé (401)");
        case 403:
          throw new Error("Accès interdit (403)");
        case 404:
          throw new Error("Ressource non trouvée (404)");
        case 500:
          throw new Error("Erreur serveur (500)");
        default:
          throw new Error(`Erreur HTTP (${response.status})`);
      }
    }

    const data = await response.json()
    return data.product
  } catch (err) {
    console.error("Erreur lors de la requête :", err.message);
    return null;
  }
}

// 📊 Affichage des infos produit
async function displayInformations(barCode) {
  try {
    const product = await getInformation(barCode)
    console.log(product)
    nameProduct.innerText = `${product.product_name_fr}`
    img.src = product.image_front_small_url
    console.log(img.src)

    ingredients.innerHTML = `<strong>Ingrédients :</strong> ${product.ingredients_text}`
    grade.innerHTML = `<strong>Indice nutri-score :</strong> ${product.nutriscore_grade.toUpperCase()}`

    if (product.nutriscore_grade) {
      const gradeValue = product.nutriscore_grade.toLowerCase()
      nutriscoreImg.src = `/images/nutriscore-${gradeValue}.png`
      nutriscoreImg.style.display = 'block'
    }

    emballage.innerHTML = `<strong> Type d'emballage : </strong>`
    emballage.style.display = 'block'

    if (!product.packaging_tags || product.packaging_tags.length === 0) {
      packaging.innerHTML = "pas de consigne pour l'emballage, fais le maximum pour le trier"
      emballage.appendChild(packaging)
    } else {
      for (let tag of product.packaging_tags) {
        if (tag) {
          packagingList.innerHTML = `\n ${tag.slice(3)} `
          emballage.appendChild(packagingList)
        }
      }
    }

    allergens.innerHTML = product.allergens_from_ingredients === ''
      ? "produit ne contient pas d'allergènes"
      : `<strong> Les ingrédients allergènes du produit :</strong> \n ${product.allergens_from_ingredients}`

    const ingredientInfo = product.ingredients.map(ingredient => ({
      nom: ingredient.text,
      percent: ingredient.percent_estimate
    }))

    if (myChart !== null) {
      myChart.destroy()
      myChart = null

    }

    myChart = new Chart(displayChart, {
      type: 'doughnut',
      data: {
        labels: ingredientInfo.map(row => row.nom),
        datasets: [{
          label: 'Quantité de chaque ingrédient (%)',
          data: ingredientInfo.map(row => row.percent),
        }]
      },
      options: {
        responsive: true,
      }
    })

    showInformation.appendChild(nameProduct)
    showInformation.appendChild(img)
    showInformation.appendChild(ingredients)
    showInformation.appendChild(grade)
    showInformation.appendChild(nutriscoreImg)
    showInformation.appendChild(allergens)
    showInformation.appendChild(displayChart)

    const tags = product.ingredients_analysis_tags

    if (tags.includes("en:vegan")) {
      isVegan.innerHTML = " Ce produit est <strong> VEGAN </strong>"
    } else if (tags.includes("en:non-vegan")) {
      isVegan.innerHTML = "Ce produit est <strong> NON VEGAN </strong>"
    } else {
      isVegan.innerText = "Pas d'informations concernant le caractère vegan"
    }

    if (tags.includes("en:vegetarian")) {
      isVegetarian.innerHTML = " Ce produit est <strong> VEGETARIEN </strong>"
    } else if (tags.includes("en:non-vegetarian")) {
      isVegetarian.innerHTML = "Ce produit est <strong> NON VEGETARIEN </strong>"
    } else {
      isVegetarian.innerText = "Pas d'informations concernant le caractère végétarien"
    }

    showInformation.appendChild(isVegan)
    showInformation.appendChild(isVegetarian)


  } catch (error) {
    console.log(error)
  }
}

// Réinitialisation des éléments produits et charte
function hideInformations() {
  img.innerHTML = ''
  ingredients.innerHTML = ''
  grade.innerHTML = ''
  emballage.style.display = 'none'
  allergens.innerHTML = ''
  isVegan.innerHTML = ''
  isVegetarian.innerHTML = ''
  packagingList.innerHTML = ''
  packaging.innerHTML = ''
  cameraResultat.innerHTML = ''
  nutriscoreImg.style.display = 'none'
  nutriscoreImg.innerHTML = ''
  if (myChart !== null) {
    myChart.destroy()
    myChart = null
  }
  displayChart.innerHTML = ''
}



