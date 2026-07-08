// ----------------------------
// 絞り込み機能
// ----------------------------
const sortWorks = () => {
  const targetWrapper = document.querySelector('.js-sort-works')
  if (!targetWrapper) return

  const sortButtons = targetWrapper.querySelector('[data-sort-works="buttons"]')
  const workCards = targetWrapper.querySelectorAll('[data-sort-works="card"]')

  const sortButtonItem = sortButtons.querySelectorAll('input')
  sortButtons.addEventListener('change', (event) => {
    const selectedValue = event.target.value

    workCards.forEach((card) => {
      const tags = []
      const tagElements = card.querySelectorAll('[data-sort-works="tab"]')
      tagElements.forEach((element) => {
        tags.push(element.textContent.slice(1))
      })

      const sortTags = ['全て', '新規製作', 'リニューアル', '運用']
      if (selectedValue === '全て') {
       card.hidden = false
      } else if (selectedValue === 'その他') {
        card.hidden = tags.some(tag => sortTags.includes(tag))
      } else if (tags.includes(selectedValue)) {
        card.hidden = false
      } else {
        card.hidden = true
      }
    })
  })
}

sortWorks()