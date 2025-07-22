
const showInformation =document.getElementById("affichageinfo")
const productCode= /* 9002515600530 3497911219121 3017624010701 3017760038331*/  3017760038331
async function getInformation(){
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${productCode}`)
    const data = await response.json()
    return (data)
}
async function displayImg() {
    const product=await getInformation()
    console.log(product)
    const img= document.createElement('img')
    img.src=product.product.image_front_small_url
    showInformation.appendChild(img)
     
}




displayImg()


async function displayIngredients() {
    
        const product = await getInformation()
        const ingredients = document.createElement('p')
        ingredients.innerText = (`Ingredient : \n\n ${product.product.ingredients_text}`)
        showInformation.appendChild(ingredients)

}
displayIngredients()

async function displayGrade() {
    const product = await getInformation()
    const grade = document.createElement('p')
    grade.innerText = (`Grade : \n ${product.product.nutriscore_grade}`)
    showInformation.appendChild(grade)
}

displayGrade()


async function alertAllergens() {
    const product = await getInformation()
    const allergens = document.createElement('p')
    if(product.product.allergens_from_ingredients === ''){
        allergens.innerText = "produit ne contient pas d'allergens"
    }else{
        allergens.innerText=` Les ingredient allegens du produit : \n ${product.product.allergens_from_ingredients}`
    }
    showInformation.appendChild(allergens)
}

alertAllergens()