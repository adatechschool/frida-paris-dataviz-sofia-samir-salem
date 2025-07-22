
const showInformation = document.getElementById("affichageinfo")
const productCode = 3257971309114
async function getInformation() {
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${productCode}`)
    const data = await response.json()
    return (data)
}
async function displayImg() {
    const product = await getInformation()
    console.log(product)
    const img = document.createElement('img')
    img.src = product.product.image_front_small_url
    showInformation.appendChild(img)

}

displayImg()


async function displayIngredients() {

    const product = await getInformation()
    const ingredients = document.createElement('p')
    ingredients.innerText = (`Ingrédients du ${product.product.product_name} : \n\n ${product.product.ingredients_text}`)
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

async function packaging() {
    const product = await getInformation()
    const emballage = document.getElementById('emballage')
    // packaging.innerText = (`Type d'emballage : \n ${product.product.packaging_hierarchy} `)
    console.log(product.product.packaging_tags[1])
    for (let i = 0; i < product.product.packaging_tags.length; i++) {
        const packaging = document.createElement('li')
        if (product.product.packaging_tags[i].startsWith("fr")) {
            packaging.innerHTML = (` \n ${product.product.packaging_tags[i].slice(5)} `)
        }
        emballage.appendChild(packaging)
    }

}

packaging()


