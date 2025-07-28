const showInformation = document.getElementById("affichageinfo")
const btnStart = document.getElementById("startcamera")
const cameraResultat = document.getElementById("cameraresult")
const displayCamera = document.getElementById('zonecamera')
const restartScan = document.getElementById('restartscan')
const img = document.createElement('img')
const ingredients = document.createElement('p')
const grade = document.createElement('p')
const emballage = document.getElementById('emballage')
const allergens = document.createElement('p')
const displayChart= document.getElementById("myChart")
const isVegan = document.createElement('p')
const isVegetarian = document.createElement('p')
const packagingList = document.createElement('li')
const packaging = document.createElement('p')
const nameProduct = document.createElement('h1')

let myChart = null

function initialization() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#zonecamera'),
      constraints: { facingMode: "environment" }
    },
    decoder: {
      readers: ["ean_reader", "upc_reader", "code_128_reader"]
    }
  }, function (err) {
    if (err) {
      console.log(err);
      return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start()
      ;
  })

}

restartScan.style.display = 'none'

function handler(resultat) {
  code = resultat.codeResult.code
  cameraResultat.innerText = `le code barre detecte : ${code}`
  Quagga.stop()
  displayCamera.style.display = 'none'

  displayInformations(code)
}

btnStart.addEventListener('click', () => {
  restartScan.style.display = 'block'
  btnStart.style.display = 'none'
  displayCamera.style.display = 'block'
  initialization()
  Quagga.onDetected(handler)
})

restartScan.addEventListener('click', () => {
  showInformation.innerHTML = ''
  // cameraResultat.innerText = ''
  hideInformations()
  displayCamera.style.display = 'block'
  initialization()
  Quagga.onDetected(handler)

})

async function fetchWithErrorHandling(url) {
    try {
        const response = await fetch(url);

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

        const data = await response.json();
        return data.product;

    } catch (err) {
        console.error("Erreur lors de la requête :", err.message);
        return null;
    }
}



async function getInformation(productCode) {
    const response = await fetchWithErrorHandling(`https://world.openfoodfacts.net/api/v2/product/${productCode}`)
    //console.log(response.status)
    return response
    
}

async function getInformation(productCode) {
  try {
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${productCode}`)
    const data = await response.json()
    return (data.product)

  } catch (error) {
    console.log(error)
  }

}


async function displayInformations(barCode) {

  try {
    const product = await getInformation(barCode)
    console.log(product)
    

    nameProduct.innerText = (`\n ${product.product_name}`)
    img.src = product.image_front_small_url
    ingredients.innerHTML = (`<strong> Ingrédients : </strong> \n\n ${product.ingredients_text}`)
    grade.innerHTML = (`<strong> Indice nutri-score : </strong> \n ${product.nutriscore_grade}`)
    

    showInformation.appendChild(nameProduct)
    showInformation.appendChild(img)
    showInformation.appendChild(ingredients)
    showInformation.appendChild(grade)
   
    emballage.innerHTML=''
    emballage.innerHTML = `<strong> Type d'emballage : </strong>`
    emballage.style.display='block'
    if (!product.packaging_tags || product.packaging_tags.length === 0) {
      // const packaging = document.createElement('p')
      packaging.innerHTML = "Pas de consigne pour l'emballage, fais le maximum pour le trier"
      emballage.appendChild(packaging)
    } else {
      for (let i = 0; i < product.packaging_tags.length; i++) {
        if (product.packaging_tags[i]) {
          // const packagingList = document.createElement('li')
          packagingList.innerHTML = (` \n ${product.packaging_tags[i].slice(3)} `)
          emballage.appendChild(packagingList)
        }

      }
    }


    if (product.allergens_from_ingredients === '') {
      allergens.innerText = "produit ne contient pas d'allergènes"
    } else {
      allergens.innerHTML = `<strong> Les ingrédients allergènes du produit : </strong> \n ${product.allergens_from_ingredients}`
    }
    showInformation.appendChild(allergens)


    const ingredientInfo = product.ingredients.map(ingredient => {
      return {
        nom: ingredient.text,
        percent: ingredient.percent_estimate
      }
    });

    console.log("Tableau des ingrédients :", ingredientInfo);

    const infoChart = document.getElementById('myChart')
   

// Supprimer le graphe précédent s’il existe

if (myChart !== null) {
  myChart.destroy()
  myChart = null
}

myChart = new Chart(infoChart, {
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
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
})

displayChart.innerHTML=myChart

   

showInformation.appendChild(displayChart)

    const tags = product.ingredients_analysis_tags;

    if (tags.includes("en:vegan")) {

      isVegan.innerHTML = " Ce produit est <strong> VEGAN </strong>";
      showInformation.appendChild(isVegan)
    } else if (tags.includes("en:non-vegan")) {

      isVegan.innerHTML = "Ce produit est <strong> NON VEGAN </strong>";
      showInformation.appendChild(isVegan)
    } else {

      isVegan.innerText = ` Pas d'informations concernant ce produit s'il est vegan ou pas`;
      showInformation.appendChild(isVegan)
    }

    if (tags.includes("en:vegetarian")) {

      isVegetarian.innerHTML = " Ce produit est <strong> VEGETARIEN </strong>";
      showInformation.appendChild(isVegetarian)
    } else if (tags.includes("en:non-vegetarian")) {

      isVegetarian.innerHTML = "Ce produit est <strong> NON VEGETARIEN </strong>";
      showInformation.appendChild(isVegetarian)
    } else {

      isVegetarian.innerText = ` Pas d'informations concernant ce produit s'il est vegetarien ou pas`;
      showInformation.appendChild(isVegetarian)
    }

  } catch (error) {
    console.log(error)

  }
}

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
  cameraResultat.innerHTML=''
  if (myChart !== null) {
  myChart.destroy()
  myChart = null
}
displayChart.innerHTML=''
}








