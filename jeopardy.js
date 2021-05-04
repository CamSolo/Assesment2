// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const response = await axios.get("https://jservice.io/api/categories?count=100")
    const catIds = response.data.map(cat => cat.id)
    return _.sampleSize(catIds, 6)
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const response = await axios.get(`https://jservice.io/api/category?id=${catId}`)
    const data = response.data
    const clue = response.data.clues
    const randomClues = _.sampleSize(clue, 5)
    const clues =randomClues.map(clue =>({
       question: clue.question,
       answer: clue.answer,
       showing: null
   }))
return {title: data.title, clues}
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    $('thead').empty()
    const tr = $('<tr>')
    for (let i = 0; i < 6; i++){
        tr.append($('<th class="bg-primary text-white col-2">').text(categories[i].title))
    }
    $('.gameBox thead').append(tr)
    $('.gameBox tbody').empty()
    for(let clueI = 0; clueI < 5; clueI++){
        let tr = $('<tr>')
        for (let catI = 0; catI < 6; catI++){
            tr.append($('<td class="bg-primary text-white">').attr('id', `${catI}-${clueI}`).html('<i class="fas fa-question-circle"></i>'))
        }
        $('.gameBox tbody').append(tr)
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let id = evt.target.closest('td').id
    let [catI, clueI] = id.split('-')
    let clue = categories[catI].clues[clueI]
    let msg
    if(!clue.showing){
        msg = clue.question
        clue.showing = 'question'
    } else if (clue.showing === 'question'){
        msg = clue.answer
        clue.showing = 'answer'
        evt.target.classList.add('bg-success')
    } else {
        return
    }
    $(`#${catI}-${clueI}`).html(msg)
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $('thead').empty()
    $('tbody').empty()
    $('body').append(
    $('<span class="d-grid justify-content-center"> <i class="fas fa-spinner fa-spin"></i></span>'))
    setTimeout(function(){
    setupAndStart()
    hideLoadingView()
},2000)

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $('span').remove()
    $('#start').attr('class','btn-warning').text('Restart')
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const catIds = await getCategoryIds()
    categories = []
    for (let catId of catIds) {
        categories.push(await getCategory(catId))
    }
    fillTable()
}

$('#start').on('click',showLoadingView)

$(async function (){
   
    $('.gameBox').on('click', 'td', handleClick)
})
/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO