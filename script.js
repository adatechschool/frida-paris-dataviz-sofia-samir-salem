
const showInformation =document.getElementById("affichageinfo")
const productCode= 9002515600530
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

//`${produit.product.image_front_small_url}`
displayImg()
