const showInformation =document.getElementById("affichageinfo")
// const productCode= /* 9002515600530 3497911219121 3017624010701 3017760038331*/  3017624010701
//const productCode= /* 9002515600530 3497911219121 3017624010701 3017760038331 3257971309114 */   3017624010701
const btnStart = document.getElementById("startcamera")
const cameraResultat = document.getElementById("cameraresult")
const displayCamera = document.getElementById('zonecamera')

btnStart.addEventListener('click',()=>{
    displayCamera.style.display='block'
    Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector('#zonecamera') ,
      constraints: {facingMode: "environment"}
    },
    decoder : {
      readers : ["ean_reader","upc_reader","code_128_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  })
  Quagga.onDetected(resultat=>{
    code = resultat.codeResult.code
    cameraResultat.innerText= `le code barre detecte : ${code}`
    Quagga.stop()
    displayCamera.style.display= 'none'

    displayImg(code)
    displayIngredients(code)
    displayGrade(code)
    packaging(code)
    alertAllergens(code)

  })
})


async function getInformation(productCode){
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${productCode}`)
    const data = await response.json()
    return (data)
}
async function displayImg(productCode) {
    const product = await getInformation(productCode)
    console.log(product)
    const img = document.createElement('img')
    img.src = product.product.image_front_small_url
    showInformation.appendChild(img)

}

//displayImg()


async function displayIngredients(productCode) {
    
        const product = await getInformation(productCode)
        const ingredients = document.createElement('p')
        ingredients.innerText = (`Ingredient : \n\n ${product.product.ingredients_text}`)
        showInformation.appendChild(ingredients)

}
//displayIngredients()

async function displayGrade(productCode) {
    const product = await getInformation(productCode)
    const grade = document.createElement('p')
    grade.innerText = (`Grade : \n ${product.product.nutriscore_grade}`)
    showInformation.appendChild(grade)
}

//displayGrade()

async function packaging(productCode) {
    const product = await getInformation(productCode)
    const emballage = document.getElementById('emballage')
    // packaging.innerText = (`Type d'emballage : \n ${product.product.packaging_hierarchy} `)
    console.log(product.product.packaging_tags[1])
    for (let i = 0; i < product.product.packaging_tags.length; i++) {
        const packaging = document.createElement('li')
        if (product.product.packaging_tags[i].startsWith("fr")) {
            packaging.innerHTML = (` \n ${product.product.packaging_tags[i].slice(3)} `)
        }
        emballage.appendChild(packaging)
    }

}

//packaging()


async function alertAllergens(productCode) {
    const product = await getInformation(productCode)
    const allergens = document.createElement('p')
    if(product.product.allergens_from_ingredients === ''){
        allergens.innerText = "produit ne contient pas d'allergènes"
    }else{
        allergens.innerText=` Les ingredient allergènes du produit : \n ${product.product.allergens_from_ingredients}`
    }
    showInformation.appendChild(allergens)
}

// alertAllergens()


  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
//alertAllergens()
