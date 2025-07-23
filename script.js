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
    ingredients(code)
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
    if(!product.product.packaging_tags){
        const packaging = document.createElement('p')
        packaging.innerHTML= "pas de consigne pour l'emballage, fais le maximum pour le trier"
        emballage.appendChild(packaging)
    }else{
         for (let i = 0; i < product.product.packaging_tags.length; i++) {
        
        if (product.product.packaging_tags[i].startsWith("fr")) {
            const packaging = document.createElement('li')
            packaging.innerHTML = (` \n ${product.product.packaging_tags[i].slice(3)} `)
            emballage.appendChild(packaging)
        }
        
    }
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

// alertAllergens()///////////////////////////////////////
async function ingredients(productCode) {
    const product = await getInformation(productCode)

    const ingredientInfo=product.product.ingredients.map(ingredient => {return {
        nom: ingredient.text,
        percent : ingredient.percent_estimate}
    });
    
   console.log("Tableau des ingrédients :", ingredientInfo);

    const ctx = document.getElementById('myChart');

  new Chart(ctx, {
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
  showInformation.appendChild(ctx)
}



 
//alertAllergens()
