const showInformation = document.getElementById("affichageinfo")
const btnStart = document.getElementById("startcamera")
const cameraResultat = document.getElementById("cameraresult")
const displayCamera = document.getElementById('zonecamera')

btnStart.addEventListener('click', () => {
  displayCamera.style.display = 'block'
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
    Quagga.start();
  })
  Quagga.onDetected(resultat => {
    code = resultat.codeResult.code
    cameraResultat.innerText = `le code barre detecte : ${code}`
    Quagga.stop()
    displayCamera.style.display = 'none'

    displayInformations(code)

  })
})

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
    const img = document.createElement('img')
    const ingredients = document.createElement('p')
    const grade = document.createElement('p')
    const emballage = document.getElementById('emballage')
    const allergens = document.createElement('p')
    const infoChart = document.getElementById('myChart')
    const isVegan = document.createElement('p')
    const isVegetarian = document.createElement('p')

    img.src = product.image_front_small_url
    ingredients.innerText = (`Ingredient : \n\n ${product.ingredients_text}`)
    grade.innerText = (`Grade : \n ${product.nutriscore_grade}`)

    showInformation.appendChild(img)
    showInformation.appendChild(ingredients)
    showInformation.appendChild(grade)


    if (!product.packaging_tags) {
      const packaging = document.createElement('p')
      packaging.innerHTML = "pas de consigne pour l'emballage, fais le maximum pour le trier"
      emballage.appendChild(packaging)
    } else {
      for (let i = 0; i < product.packaging_tags.length; i++) {
        if (product.packaging_tags[i]) {
          const packaging = document.createElement('li')
          packaging.innerHTML = (` \n ${product.packaging_tags[i].slice(3)} `)
          emballage.appendChild(packaging)
        }

      }
    }


    if (product.allergens_from_ingredients === '') {
      allergens.innerText = "produit ne contient pas d'allergènes"
    } else {
      allergens.innerText = ` Les ingredient allergènes du produit : \n ${product.allergens_from_ingredients}`
    }
    showInformation.appendChild(allergens)


    const ingredientInfo = product.ingredients.map(ingredient => {
      return {
        nom: ingredient.text,
        percent: ingredient.percent_estimate
      }
    });

    console.log("Tableau des ingrédients :", ingredientInfo);

    new Chart(infoChart, {
      type: 'doughnut',
      data: {
        labels: ingredientInfo.map(row => row.nom),
        datasets: [
          {
            label: 'quantitie de chaque ingredient',
            data: ingredientInfo.map(row => row.percent)
          }
        ]
      }
    });
    showInformation.appendChild(infoChart)

    const tags = product.ingredients_analysis_tags;

    if (tags.includes("en:vegan")) {

      isVegan.innerHTML = " Ce produit est <strong> VEGAN </strong>";
      showInformation.appendChild(isVegan)
    } else if (tags.includes("en:non-vegan")) {

      isVegan.innerHTML = "Ce produit est <strong> NON VEGAN </strong>";
      showInformation.appendChild(isVegan)
    } else {

      isVegan.innerText = ` pas d'information concernat ce produit s'il est vegan ou pas`;
      showInformation.appendChild(isVegan)
    }

    if (tags.includes("en:vegetarian")) {

      isVegetarian.innerHTML = " Ce produit est <strong> VEGETARIEN </strong>";
      showInformation.appendChild(isVegetarian)
    } else if (tags.includes("en:non-vegetarian")) {

      isVegetarian.innerHTML = "Ce produit est <strong> NON VEGETARIEN </strong>";
      showInformation.appendChild(isVegetarian)
    } else {

      isVegetarian.innerText = ` pas d'information concernat ce produit s'il est vegetarien ou pas`;
      showInformation.appendChild(isVegetarian)
    }

  } catch (error) {
    console.log(error)

  }
}










