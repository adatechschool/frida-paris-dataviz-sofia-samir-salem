

export function hideInformations() {
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


